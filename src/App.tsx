import { useEffect, useState } from 'react';
import { getScenario, isUnlocked, nextScenarioId, SCENARIO_ORDER, SCENARIOS } from './data';
import { sound } from './lib/audio';
import { loadProgress, loadSettings, markIntroSeen, recordResult, resetProgress, saveSettings, setUnlockAll, type Settings } from './lib/storage';
import type { CaseResult, Progress } from './types';
import { EducationScreen } from './components/EducationScreen';
import { EducatorPanel } from './components/EducatorPanel';
import { FinalScreen } from './components/FinalScreen';
import { IntroScreen } from './components/IntroScreen';
import { ReportScreen } from './components/ReportScreen';
import { SimulationScreen } from './components/SimulationScreen';
import { StartScreen } from './components/StartScreen';
import { TrainingMap } from './components/TrainingMap';

type Screen = 'start' | 'intro' | 'map' | 'education' | 'sim' | 'report' | 'final';

export function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [returnTo, setReturnTo] = useState<Screen>('start');
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  const [currentId, setCurrentId] = useState<string>(SCENARIO_ORDER[0]);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<CaseResult | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);
  const [educator, setEducator] = useState(false);

  useEffect(() => {
    sound.enabled = settings.sound;
  }, [settings.sound]);

  // 교육자용 바로가기: http://.../#case=case-3  또는 #map
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '');
    const m = hash.match(/^case=([\w-]+)$/);
    if (m && getScenario(m[1])) {
      setCurrentId(m[1]);
      setAttempt((a) => a + 1);
      setScreen('sim');
    } else if (hash === 'map') {
      setScreen('map');
    }
  }, []);

  const scenario = getScenario(currentId) ?? SCENARIOS[0];

  const go = (s: Screen) => {
    sound.click();
    setScreen(s);
  };

  const startCase = (id: string) => {
    sound.click();
    setCurrentId(id);
    setAttempt((a) => a + 1);
    setScreen('sim');
  };

  const handleStart = () => {
    sound.click();
    setScreen('intro');
  };

  const handleMeetFirst = () => {
    setProgress((p) => markIntroSeen(p));
    startCase(nextScenarioId(progress.completed, progress.unlockedAll));
  };

  const handleComplete = (r: CaseResult) => {
    const prevBest = progress.bestScores[r.scenarioId];
    setIsNewBest(prevBest === undefined || r.totalScore > prevBest);
    setResult(r);
    setProgress((p) => recordResult(p, r));
    setScreen('report');
  };

  const handleNext = () => {
    if (scenario.isFinal) {
      go('final');
      return;
    }
    const idx = SCENARIO_ORDER.indexOf(currentId);
    const nextId = SCENARIO_ORDER[idx + 1];
    if (nextId && isUnlocked(nextId, progress.completed, progress.unlockedAll)) startCase(nextId);
    else go('map');
  };

  const hasNext = (() => {
    const idx = SCENARIO_ORDER.indexOf(currentId);
    const nextId = SCENARIO_ORDER[idx + 1];
    return !!nextId && isUnlocked(nextId, progress.completed, progress.unlockedAll);
  })();

  const handleReset = () => {
    sound.click();
    setProgress(resetProgress());
    setResult(null);
    setScreen('start');
  };

  const toggleSound = () => {
    const next = { ...settings, sound: !settings.sound };
    setSettings(saveSettings(next));
    sound.enabled = next.sound;
    if (next.sound) sound.click();
  };

  const openEducation = (from: Screen) => {
    setReturnTo(from);
    go('education');
  };

  return (
    <>
      {screen === 'start' && (
        <StartScreen
          storeName={settings.storeName}
          soundOn={settings.sound}
          onToggleSound={toggleSound}
          onStart={handleStart}
          onEducation={() => openEducation('start')}
          onMissions={() => go('map')}
          onEducator={() => setEducator(true)}
          completedCount={SCENARIOS.filter((s) => progress.completed.includes(s.id)).length}
          totalCount={SCENARIOS.length}
        />
      )}
      {screen === 'intro' && <IntroScreen storeName={settings.storeName} onMeet={handleMeetFirst} onBack={() => go('start')} />}
      {screen === 'map' && (
        <TrainingMap
          storeName={settings.storeName}
          progress={progress}
          onSelect={startCase}
          onBack={() => go('start')}
          onEducator={() => setEducator(true)}
          onReset={() => {
            if (window.confirm('모든 진행 기록을 지우고 처음부터 다시 시작할까요?')) handleReset();
          }}
          onFinalSummary={() => go('final')}
        />
      )}
      {screen === 'education' && <EducationScreen storeName={settings.storeName} onBack={() => go(returnTo)} />}
      {screen === 'sim' && (
        <SimulationScreen
          key={`${currentId}-${attempt}`}
          scenario={scenario}
          storeName={settings.storeName}
          soundOn={settings.sound}
          onToggleSound={toggleSound}
          onComplete={handleComplete}
          onExit={() => {
            if (window.confirm('상담을 중단하고 목록으로 돌아갈까요? 진행 중인 상담은 저장되지 않습니다.')) go('map');
          }}
          onEducator={() => setEducator(true)}
          onEducation={() => openEducation('sim')}
        />
      )}
      {screen === 'report' && result && (
        <ReportScreen
          storeName={settings.storeName}
          scenario={scenario}
          result={result}
          isNewBest={isNewBest}
          hasNext={hasNext}
          onRetry={() => startCase(currentId)}
          onNext={handleNext}
          onMap={() => go('map')}
        />
      )}
      {screen === 'final' && <FinalScreen storeName={settings.storeName} progress={progress} onReplay={() => go('map')} onReset={handleReset} />}

      {educator && (
        <EducatorPanel
          progress={progress}
          storeName={settings.storeName}
          onClose={() => setEducator(false)}
          onJump={(id) => {
            setEducator(false);
            startCase(id);
          }}
          onToggleUnlockAll={(v) => setProgress((p) => setUnlockAll(p, v))}
          onReset={() => {
            setEducator(false);
            handleReset();
          }}
          onStoreName={(name) => setSettings(saveSettings({ ...settings, storeName: name }))}
        />
      )}
    </>
  );
}
