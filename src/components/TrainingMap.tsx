import { isUnlocked, SCENARIOS } from '../data';
import { computeMissions } from '../engine/missions';
import type { Progress, Scenario } from '../types';
import { Button, Difficulty, GameShell, IconButton, Panel } from './ui';

interface Props {
  storeName: string;
  progress: Progress;
  onSelect: (id: string) => void;
  onBack: () => void;
  onEducator: () => void;
  onReset: () => void;
  onFinalSummary: () => void;
}

export function TrainingMap({ storeName, progress, onSelect, onBack, onEducator, onReset, onFinalSummary }: Props) {
  const missions = computeMissions(progress);
  const doneCount = progress.completed.filter((id) => SCENARIOS.some((s) => s.id === id)).length;
  const allDone = SCENARIOS.every((s) => progress.completed.includes(s.id));
  const avg = (() => {
    const scores = SCENARIOS.map((s) => progress.bestScores[s.id]).filter((v): v is number => typeof v === 'number');
    return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
  })();

  const statusOf = (s: Scenario) => {
    if (progress.completed.includes(s.id)) return 'done' as const;
    if (isUnlocked(s.id, progress.completed, progress.unlockedAll)) return 'open' as const;
    return 'locked' as const;
  };

  return (
    <GameShell
      storeName={storeName}
      dim={0.12}
      header={
        <>
          <Button size="sm" onClick={onBack}>
            ← 처음으로
          </Button>
          <span className="ml-2 text-sm font-extrabold text-ink-900">🎯 코디네이터 TRAINING</span>
          <div className="ml-auto flex items-center gap-2">
            <IconButton title="교육자 모드" onClick={onEducator}>
              🎓 <span className="hidden sm:inline">교육자 모드</span>
            </IconButton>
          </div>
        </>
      }
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-[300px_1fr] md:py-6">
        <div className="space-y-4">
          <Panel className="px-5 py-5">
            <p className="text-xs font-bold text-ink-500">전체 진행률</p>
            <div className="mt-1 flex items-end gap-2">
              <span className="text-4xl font-black text-brand-800">{doneCount}</span>
              <span className="pb-1 text-sm font-bold text-ink-500">/ {SCENARIOS.length} 고객</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-ink-100">
              <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all" style={{ width: `${(doneCount / SCENARIOS.length) * 100}%` }} />
            </div>
            {avg !== null && (
              <p className="mt-3 text-sm font-semibold text-ink-700">
                최고점 평균 <b className="text-ink-900">{avg}점</b>
              </p>
            )}
            {allDone && (
              <Button tone="gold" className="mt-4 w-full" onClick={onFinalSummary}>
                🎉 TRAINING COMPLETE 보기
              </Button>
            )}
          </Panel>

          <Panel className="px-5 py-5">
            <h2 className="text-sm font-extrabold text-ink-900">오늘의 미션</h2>
            <ul className="mt-3 space-y-2">
              {missions.map((m) => (
                <li key={m.id} className={`flex items-start gap-2 text-sm ${m.done ? 'text-ink-500 line-through' : 'text-ink-800'}`}>
                  <span className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] ${m.done ? 'border-emerald-300 bg-emerald-100 text-emerald-700' : 'border-ink-300 bg-white text-ink-400'}`}>
                    {m.done ? '✓' : ''}
                  </span>
                  <span>{m.label}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-ink-500">
              {missions.filter((m) => m.done).length} / {missions.length} 완료
            </p>
          </Panel>

          <Button tone="ghost" size="sm" className="w-full" onClick={onReset}>
            ⟲ 처음부터 다시하기
          </Button>
        </div>

        <div className="stagger grid grid-cols-1 gap-3 md:grid-cols-2">
          {SCENARIOS.map((s) => {
            const st = statusOf(s);
            const best = progress.bestScores[s.id];
            const isFinal = !!s.isFinal;
            return (
              <Panel
                key={s.id}
                className={`relative flex flex-col px-5 py-4 ${st === 'locked' ? 'opacity-60' : ''} ${isFinal ? 'border-2 border-amber-300 bg-amber-50/95 md:col-span-2' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`text-xs font-black tracking-wider ${isFinal ? 'text-amber-700' : 'text-brand-700'}`}>{s.code}</p>
                    <h3 className="text-base font-extrabold text-ink-900 md:text-lg">{s.mapTitle}</h3>
                    {!isFinal && <p className="text-xs text-ink-500">{s.title}</p>}
                  </div>
                  <span className="text-2xl" aria-label={st === 'done' ? '완료' : st === 'open' ? '도전 가능' : '잠김'}>
                    {st === 'done' ? '✅' : st === 'open' ? '🔓' : '🔒'}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs text-ink-600">
                  <span>
                    난이도 <Difficulty n={s.difficulty} />
                  </span>
                  {typeof best === 'number' && (
                    <span className="rounded-full bg-ink-100 px-2 py-0.5 font-bold text-ink-800">최고 {best}점</span>
                  )}
                </div>
                {isFinal && <p className="mt-2 text-sm text-ink-700">{s.summary}</p>}
                <div className="mt-3 flex gap-2">
                  {st === 'locked' ? (
                    <span className="text-xs font-semibold text-ink-500">{isFinal ? 'CASE 01~07을 모두 완료하면 열립니다.' : '이전 단계를 완료하면 열립니다.'}</span>
                  ) : (
                    <Button tone={st === 'done' ? 'secondary' : 'primary'} size="sm" onClick={() => onSelect(s.id)}>
                      {st === 'done' ? '다시 응대하기' : '응대 시작'}
                    </Button>
                  )}
                </div>
              </Panel>
            );
          })}
        </div>
      </div>
    </GameShell>
  );
}
