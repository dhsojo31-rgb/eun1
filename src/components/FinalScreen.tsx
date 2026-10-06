import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SCENARIOS } from '../data';
import { emotionFromTrust, EMOTION_META, starsFor } from '../engine/scoring';
import { CATEGORY_META, CATEGORY_ORDER, type Category, type Progress } from '../types';
import { Button, GameShell, Panel, Stars } from './ui';

export function FinalScreen({ storeName, progress, onReplay, onReset }: { storeName: string; progress: Progress; onReplay: () => void; onReset: () => void }) {
  const results = SCENARIOS.map((s) => progress.results[s.id]).filter(Boolean);
  const best = SCENARIOS.map((s) => progress.bestScores[s.id]).filter((v): v is number => typeof v === 'number');
  const finalScore = best.length ? Math.round(best.reduce((a, b) => a + b, 0) / best.length) : 0;
  const avgTrust = results.length ? Math.round(results.reduce((a, r) => a + r.finalTrust, 0) / results.length) : 0;

  // 항목별 평균 비율
  const catAvg: { c: Category; v: number }[] = CATEGORY_ORDER.map((c) => {
    const vals = results.map((r) => r.categoryRatios[c]).filter((v): v is number => typeof v === 'number');
    return { c, v: vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : -1 };
  }).filter((x) => x.v >= 0);
  const bestCat = catAvg.length ? catAvg.reduce((a, b) => (b.v > a.v ? b : a)) : null;
  const weakCat = catAvg.length ? catAvg.reduce((a, b) => (b.v < a.v ? b : a)) : null;

  useEffect(() => {
    const t = window.setTimeout(() => {
      confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 }, colors: ['#0f766e', '#14b8a6', '#fbbf24', '#f472b6', '#ffffff'] });
    }, 300);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <GameShell storeName={storeName} dim={0.25}>
      <div className="flex min-h-full items-center justify-center px-4 py-6">
        <Panel className="anim-fade-up w-full max-w-3xl px-6 py-8 text-center md:px-12">
          <p className="text-xs font-bold tracking-[0.35em] text-brand-700">TRAINING COMPLETE</p>
          <div className="mt-2 text-5xl">🎉</div>
          <h1 className="mt-2 text-2xl font-black text-ink-900 md:text-3xl">안경원 코디네이터 실습을 완료했습니다.</h1>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-2xl bg-ink-50 px-3 py-4">
              <p className="text-[11px] font-bold text-ink-500">최종 고객응대 점수</p>
              <p className="mt-1 text-3xl font-black text-ink-900">{finalScore}점</p>
            </div>
            <div className="rounded-2xl bg-ink-50 px-3 py-4">
              <p className="text-[11px] font-bold text-ink-500">응대한 고객</p>
              <p className="mt-1 text-3xl font-black text-ink-900">{results.length}명</p>
            </div>
            <div className="rounded-2xl bg-ink-50 px-3 py-4">
              <p className="text-[11px] font-bold text-ink-500">평균 고객 만족도</p>
              <p className="mt-1 text-xl">
                <Stars n={starsFor(avgTrust / 100)} />
              </p>
              <p className="text-xs text-ink-600">
                {EMOTION_META[emotionFromTrust(avgTrust)].emoji} {EMOTION_META[emotionFromTrust(avgTrust)].label}
              </p>
            </div>
            <div className="rounded-2xl bg-ink-50 px-3 py-4">
              <p className="text-[11px] font-bold text-ink-500">총 실습 횟수</p>
              <p className="mt-1 text-3xl font-black text-ink-900">{progress.plays}회</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-emerald-50 px-4 py-4">
              <p className="text-[11px] font-bold text-emerald-700">가장 잘한 능력</p>
              <p className="mt-1 text-lg font-extrabold text-ink-900">{bestCat ? CATEGORY_META[bestCat.c].label : '—'}</p>
            </div>
            <div className="rounded-2xl bg-amber-50 px-4 py-4">
              <p className="text-[11px] font-bold text-amber-700">조금 더 연습하면 좋은 능력</p>
              <p className="mt-1 text-lg font-extrabold text-ink-900">{weakCat ? CATEGORY_META[weakCat.c].label : '—'}</p>
            </div>
          </div>

          <blockquote className="mt-8 rounded-2xl border-l-4 border-brand-600 bg-brand-50 px-5 py-4 text-left text-sm font-semibold leading-relaxed text-ink-800 md:text-base">
            좋은 코디네이터는 말을 가장 많이 하는 사람이 아니라
            <br />
            고객의 말을 잘 듣고 필요한 도움을 연결해 주는 사람입니다.
          </blockquote>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button tone="primary" size="lg" onClick={onReplay}>
              다른 고객 다시 응대하기
            </Button>
            <Button size="lg" onClick={onReset}>
              처음부터 다시하기
            </Button>
          </div>
        </Panel>
      </div>
    </GameShell>
  );
}
