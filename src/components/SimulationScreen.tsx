import { useEffect, useMemo, useRef, useState } from 'react';
import { clampTrust, computeResult, emotionFromTrust, EMOTION_META, hashString, shuffle, type Decision } from '../engine/scoring';
import { sound } from '../lib/audio';
import { STEP_LABEL, type CaseResult, type Choice, type Emotion, type LogEntry, type Scenario, type Step } from '../types';
import { CustomerFigure } from './CustomerFigure';
import { DialogueLog, MemoList } from './MemoList';
import { Button, GameShell, IconButton, Modal, Panel } from './ui';

interface Props {
  scenario: Scenario;
  storeName: string;
  soundOn: boolean;
  onToggleSound: () => void;
  onComplete: (result: CaseResult) => void;
  onExit: () => void;
  onEducator: () => void;
  onEducation: () => void;
}

type Phase = 'enter' | 'ask' | 'react' | 'farewell' | 'leaving';

const STEPS: Step[] = [1, 2, 3, 4, 5, 6];

export function SimulationScreen({ scenario, storeName, soundOn, onToggleSound, onComplete, onExit, onEducator, onEducation }: Props) {
  const [phase, setPhase] = useState<Phase>('enter');
  const [nodeId, setNodeId] = useState(scenario.startNode);
  const [trust, setTrust] = useState(scenario.customer.initialTrust);
  const [trustHistory, setTrustHistory] = useState<number[]>([scenario.customer.initialTrust]);
  const [memo, setMemo] = useState<Record<string, string>>({});
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [drawer, setDrawer] = useState<null | 'memo' | 'log'>(null);
  const [reaction, setReaction] = useState<string | null>(null);
  const [studentLine, setStudentLine] = useState<string | null>(null);
  const [pendingNext, setPendingNext] = useState<string | null>(null);
  const [overrideEmotion, setOverrideEmotion] = useState<Emotion | null>(null);
  const [toast, setToast] = useState<{ title: string; body?: string } | null>(null);
  const [memoNew, setMemoNew] = useState(false);
  const [lastDelta, setLastDelta] = useState<number | null>(null);
  const [visitCount, setVisitCount] = useState(0);
  const logId = useRef(0);
  const timer = useRef<number | null>(null);

  const node = scenario.nodes[nodeId];
  const isFinal = !!scenario.isFinal;

  const emotion: Emotion = overrideEmotion ?? (decisions.length === 0 && scenario.customer.initialEmotion ? scenario.customer.initialEmotion : emotionFromTrust(trust));
  const emo = EMOTION_META[emotion];

  const pushLog = (entries: Omit<LogEntry, 'id'>[]) => {
    setLog((prev) => [...prev, ...entries.map((e) => ({ ...e, id: ++logId.current }))]);
  };

  // 입장 연출
  useEffect(() => {
    sound.doorBell();
    const t = window.setTimeout(() => {
      setPhase('ask');
      const first = scenario.nodes[scenario.startNode];
      pushLog([
        ...(first.narration ? [{ who: 'narration' as const, text: first.narration }] : []),
        { who: 'customer' as const, text: first.customer },
      ]);
    }, 1000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario.id]);

  // 토스트 자동 닫기
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (lastDelta === null) return;
    const t = window.setTimeout(() => setLastDelta(null), 1600);
    return () => window.clearTimeout(t);
  }, [lastDelta]);

  const choices = useMemo(() => shuffle(node.choices, hashString(scenario.id + nodeId) + visitCount), [node, scenario.id, nodeId, visitCount]);

  const endingText = () => {
    if (trust >= 70) return scenario.endings.high;
    if (trust >= 45) return scenario.endings.mid;
    return scenario.endings.low;
  };

  const advance = () => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    if (!pendingNext) return;
    setOverrideEmotion(null);
    if (pendingNext === 'END') {
      const text = endingText();
      pushLog([{ who: 'customer', text }]);
      setReaction(null);
      setStudentLine(null);
      setPhase('farewell');
      return;
    }
    const next = scenario.nodes[pendingNext];
    setNodeId(pendingNext);
    setVisitCount((v) => v + 1);
    pushLog([
      ...(next.narration ? [{ who: 'narration' as const, text: next.narration }] : []),
      { who: 'customer' as const, text: next.customer },
    ]);
    setReaction(null);
    setStudentLine(null);
    setPendingNext(null);
    setPhase('ask');
  };

  // 반응 단계 자동 진행
  useEffect(() => {
    if (phase !== 'react') return;
    const len = (reaction ?? '').length;
    const delay = reaction ? Math.min(3400, 1300 + len * 28) : 500;
    timer.current = window.setTimeout(advance, delay);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, reaction]);

  const choose = (choice: Choice) => {
    if (phase !== 'ask') return;
    sound.click();
    const newTrust = clampTrust(trust + choice.trust);
    setTrust(newTrust);
    setTrustHistory((h) => [...h, newTrust]);
    setLastDelta(choice.trust);
    setDecisions((d) => [...d, { node, choice }]);
    setStudentLine(choice.text);
    pushLog([
      { who: 'student', text: choice.text, quality: choice.quality },
      ...(choice.reaction ? [{ who: 'customer' as const, text: choice.reaction }] : []),
    ]);
    if (choice.emotion) setOverrideEmotion(choice.emotion);
    if (choice.quality >= 2) sound.soft();
    else sound.low();

    if (choice.info) {
      const entries = Object.entries(choice.info);
      setMemo((m) => ({ ...m, ...choice.info }));
      setMemoNew(true);
      const labels = entries
        .map(([k, v]) => {
          const f = scenario.memoFields.find((x) => x.key === k);
          return `${f?.label ?? k}: ${v}`;
        })
        .join(' · ');
      window.setTimeout(() => {
        sound.info();
        setToast({ title: '고객의 중요한 정보를 확인했습니다.', body: `📌 ${labels}` });
      }, 350);
    }

    setReaction(choice.reaction ?? null);
    setPendingNext(choice.next);
    setPhase('react');
  };

  const finish = () => {
    sound.complete();
    setPhase('leaving');
    const result = computeResult(scenario, decisions, trustHistory, hintsUsed);
    window.setTimeout(() => onComplete(result), 950);
  };

  const openHint = () => {
    if (isFinal) return;
    sound.click();
    setHintsUsed((h) => h + 1);
    setShowHint(true);
  };

  const openDrawer = (tab: 'memo' | 'log') => {
    sound.click();
    setDrawer(tab);
    if (tab === 'memo') setMemoNew(false);
  };

  const stepNow = node.step;
  const foundCount = scenario.memoFields.filter((f) => memo[f.key]).length;

  return (
    <GameShell
      storeName={storeName}
      header={
        <>
          <Button size="sm" onClick={onExit} title="목록으로 (진행 중인 상담은 저장되지 않습니다)">
            ← 목록
          </Button>
          <span className="hidden rounded-full border border-ink-300/60 bg-white/80 px-3 py-1 text-xs font-extrabold text-ink-900 backdrop-blur sm:inline-flex">
            <span className={`mr-1 ${isFinal ? 'text-amber-600' : 'text-brand-700'}`}>{scenario.code}</span>
            {scenario.title}
          </span>
          <div className="hidden items-center gap-1 lg:flex">
            {STEPS.map((s) => (
              <span
                key={s}
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  s === stepNow
                    ? 'bg-brand-700 text-white'
                    : s < stepNow || phase === 'farewell' || phase === 'leaving'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-white/60 text-ink-500'
                }`}
              >
                {s}. {STEP_LABEL[s]}
              </span>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <IconButton title={isFinal ? '최종 미션에서는 힌트를 사용할 수 없습니다' : '응대 힌트'} onClick={openHint} className={isFinal ? 'opacity-50' : ''}>
              💡 <span className="hidden md:inline">힌트</span>
              {hintsUsed > 0 && <span className="ml-0.5 rounded-full bg-amber-200 px-1.5 text-[10px] text-amber-900">{hintsUsed}</span>}
            </IconButton>
            <IconButton title="교육내용 보기" onClick={onEducation}>
              📘 <span className="hidden md:inline">교육 원칙</span>
            </IconButton>
            <IconButton title={soundOn ? '효과음 끄기' : '효과음 켜기'} onClick={onToggleSound} active={soundOn}>
              {soundOn ? '🔊' : '🔇'}
            </IconButton>
            <IconButton title="교육자 모드" onClick={onEducator}>
              🎓
            </IconButton>
          </div>
        </>
      }
    >
      {/* 토스트 */}
      {toast && (
        <div className="anim-pop fixed left-1/2 top-16 z-40 w-[min(92vw,520px)] -translate-x-1/2 rounded-2xl border border-amber-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur">
          <p className="text-xs font-bold text-amber-700">{toast.title}</p>
          {toast.body && <p className="mt-0.5 text-sm font-semibold text-ink-900">{toast.body}</p>}
        </div>
      )}

      <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-3 px-3 pb-3 md:flex-row md:items-end md:px-5">
        {/* 왼쪽: 고객 캐릭터 + 상태 */}
        <div className="relative flex shrink-0 items-end justify-center md:h-full md:w-[30%] md:min-w-[230px] md:flex-col md:justify-end">
          <div className="absolute left-0 top-0 z-10 md:static md:mb-2 md:w-full">
            <Panel className="flex items-center gap-3 px-3 py-2">
              <span className="text-2xl" aria-hidden>
                {emo.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-ink-500">
                  <span>고객 상태</span>
                  <span className="rounded-full px-2 py-0.5 text-[11px] font-extrabold" style={{ background: emo.bg, color: emo.color }}>
                    {emo.label}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${trust}%`, background: emo.color }} />
                  </div>
                  <span className="w-8 text-right text-[11px] font-bold text-ink-700">{trust}</span>
                  {lastDelta !== null && lastDelta !== 0 && (
                    <span className={`anim-pop text-[11px] font-black ${lastDelta > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {lastDelta > 0 ? `▲${lastDelta}` : `▼${-lastDelta}`}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[10px] text-ink-500">신뢰도</p>
              </div>
            </Panel>
          </div>
          <div className={`mt-10 w-[46%] max-w-[260px] md:mt-0 md:w-full md:max-w-[420px] ${phase === 'enter' ? 'anim-enter' : phase === 'leaving' ? 'anim-leave' : ''}`}>
            <CustomerFigure look={scenario.customer.look} gender={scenario.customer.gender} emotion={emotion} className="h-auto w-full drop-shadow-[0_18px_30px_rgba(0,0,0,0.25)]" />
          </div>
          <div className="pointer-events-none absolute bottom-0 left-1/2 hidden h-6 w-[70%] -translate-x-1/2 rounded-[100%] bg-black/15 blur-md md:block" />
        </div>

        {/* 오른쪽: 대화 + 선택지 */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 md:max-h-full md:overflow-y-auto md:py-2 md:pr-1">
          {/* 대화 박스 */}
          <div className="relative mt-4" onClick={phase === 'react' ? advance : undefined} role={phase === 'react' ? 'button' : undefined}>
            <span className="absolute -top-3 left-4 z-10 rounded-full bg-brand-700 px-3 py-1 text-xs font-extrabold text-white shadow">
              {scenario.customer.name} <span className="font-semibold text-brand-100">({scenario.customer.age})</span>
            </span>
            {node.surprise && phase === 'ask' && (
              <span className="absolute -top-3 right-4 z-10 rounded-full bg-rose-500 px-3 py-1 text-xs font-extrabold text-white shadow">⚡ 돌발 상황</span>
            )}
            <Panel className="px-5 pb-4 pt-5 md:px-6">
              {phase === 'enter' && (
                <p className="text-ink-500">
                  <span className="typing-dot">●</span> <span className="typing-dot">●</span> <span className="typing-dot">●</span>
                  <span className="ml-2 text-sm font-semibold">고객이 매장으로 들어옵니다…</span>
                </p>
              )}
              {phase === 'ask' && (
                <div key={nodeId} className="anim-pop">
                  {node.narration && <p className="mb-2 text-xs font-medium italic text-ink-500">{node.narration}</p>}
                  <p className="text-base font-semibold leading-relaxed text-ink-900 md:text-xl">“{node.customer}”</p>
                </div>
              )}
              {phase === 'react' && (
                <div key={`r-${decisions.length}`} className="anim-pop">
                  {reaction ? (
                    <p className="text-base font-semibold leading-relaxed text-ink-900 md:text-xl">“{reaction}”</p>
                  ) : (
                    <p className="text-ink-500">
                      <span className="typing-dot">●</span> <span className="typing-dot">●</span> <span className="typing-dot">●</span>
                    </p>
                  )}
                  <p className="mt-2 text-right text-[11px] font-semibold text-ink-500">클릭하면 바로 이어집니다 ▸</p>
                </div>
              )}
              {(phase === 'farewell' || phase === 'leaving') && (
                <div className="anim-pop">
                  <p className="text-base font-semibold leading-relaxed text-ink-900 md:text-xl">“{endingText()}”</p>
                  <p className="mt-2 text-xs font-medium italic text-ink-500">{phase === 'leaving' ? '고객이 매장을 나갑니다.' : '상담이 끝났습니다.'}</p>
                </div>
              )}
            </Panel>
          </div>

          {/* 내가 한 말 */}
          {studentLine && phase === 'react' && (
            <div className="flex justify-end">
              <div className="anim-fade-up max-w-[88%] rounded-2xl rounded-br-sm bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow">
                <p className="mb-0.5 text-[10px] font-bold text-brand-100">나 (코디네이터)</p>
                {studentLine}
              </div>
            </div>
          )}

          {/* 선택지 */}
          {phase === 'ask' && (
            <Panel className="px-4 py-4 md:px-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-ink-900">💬 무엇을 말씀하시겠습니까?</h2>
                <span className="text-[11px] font-semibold text-ink-500">STEP {node.step}. {STEP_LABEL[node.step]}</span>
              </div>
              <div className="stagger flex flex-col gap-2">
                {choices.map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => choose(c)}
                    className="group flex w-full items-start gap-3 rounded-2xl border border-ink-300/70 bg-white px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-brand-500 hover:bg-brand-50 hover:shadow-md active:translate-y-0"
                  >
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-100 text-xs font-black text-ink-700 group-hover:bg-brand-700 group-hover:text-white">
                      {i + 1}
                    </span>
                    <span className="text-sm font-semibold leading-relaxed text-ink-900 md:text-[15px]">{c.text}</span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-ink-500">정답을 맞히는 것이 아니라, 더 좋은 응대를 고민해 보세요. 고객의 반응으로 결과를 알 수 있습니다.</p>
            </Panel>
          )}

          {phase === 'farewell' && (
            <Panel className="flex flex-col items-center gap-3 px-5 py-5 text-center">
              <p className="text-sm font-semibold text-ink-700">{scenario.customer.name} 고객 응대가 끝났습니다. 결과 리포트를 확인해 보세요.</p>
              <Button tone="primary" size="lg" onClick={finish}>
                📋 실습 결과 보기
              </Button>
            </Panel>
          )}
        </div>

        {/* 넓은 화면: 고객 메모 사이드 패널 */}
        <aside className="hidden w-[270px] shrink-0 self-start xl:block md:py-2">
          <Panel className="bg-amber-50/95 px-4 py-4">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-amber-900">📝 고객 메모</h2>
              <button type="button" onClick={() => openDrawer('log')} className="text-[11px] font-bold text-brand-700 underline-offset-2 hover:underline">
                대화 기록
              </button>
            </div>
            <MemoList fields={scenario.memoFields} memo={memo} />
          </Panel>
        </aside>
      </div>

      {/* 떠 있는 메모 버튼 (xl 미만) */}
      <button
        type="button"
        onClick={() => openDrawer('memo')}
        className="fixed bottom-4 right-4 z-30 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 px-4 py-3 text-sm font-extrabold text-ink-900 shadow-xl transition hover:brightness-105 xl:hidden"
      >
        📝 고객 메모 <span className="rounded-full bg-white/70 px-1.5 text-[11px]">{foundCount}/{scenario.memoFields.length}</span>
        {memoNew && <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-black text-white">NEW</span>}
      </button>

      {/* 드로어 */}
      {drawer && (
        <div className="fixed inset-0 z-40 bg-ink-900/40" onClick={() => setDrawer(null)}>
          <div className="anim-pop absolute bottom-0 right-0 top-0 flex w-[min(440px,94vw)] flex-col bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 border-b border-ink-100 px-4 py-3">
              <button type="button" onClick={() => setDrawer('memo')} className={`rounded-full px-3 py-1.5 text-sm font-bold ${drawer === 'memo' ? 'bg-amber-100 text-amber-900' : 'text-ink-500 hover:bg-ink-100'}`}>
                📝 고객 메모
              </button>
              <button type="button" onClick={() => setDrawer('log')} className={`rounded-full px-3 py-1.5 text-sm font-bold ${drawer === 'log' ? 'bg-brand-100 text-brand-800' : 'text-ink-500 hover:bg-ink-100'}`}>
                💬 대화 기록
              </button>
              <button type="button" onClick={() => setDrawer(null)} className="ml-auto rounded-full px-3 py-1 text-xl text-ink-500 hover:bg-ink-100" aria-label="닫기">
                ×
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto bg-ink-50 px-4 py-4">
              {drawer === 'memo' ? <MemoList fields={scenario.memoFields} memo={memo} /> : <DialogueLog log={log} customerName={scenario.customer.name} />}
            </div>
          </div>
        </div>
      )}

      {/* 힌트 모달 */}
      {showHint && (
        <Modal title="💡 응대 힌트" onClose={() => setShowHint(false)} footer={<Button tone="primary" className="w-full" onClick={() => setShowHint(false)}>알겠습니다</Button>}>
          <p className="rounded-2xl bg-amber-50 px-4 py-4 text-base font-semibold leading-relaxed text-ink-900">{node.hint}</p>
          <p className="mt-3 text-xs text-ink-500">힌트 사용 횟수는 결과에 표시되지만 큰 감점은 없습니다. (지금까지 {hintsUsed}회)</p>
        </Modal>
      )}
    </GameShell>
  );
}
