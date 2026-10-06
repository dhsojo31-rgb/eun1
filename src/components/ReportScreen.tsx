import { EMOTION_META, emotionFromTrust, starsFor } from '../engine/scoring';
import { CATEGORY_META, CATEGORY_ORDER, type CaseResult, type Scenario } from '../types';
import { Button, GameShell, Panel, Stars } from './ui';

interface Props {
  storeName: string;
  scenario: Scenario;
  result: CaseResult;
  isNewBest: boolean;
  hasNext: boolean;
  onRetry: () => void;
  onNext: () => void;
  onMap: () => void;
}

export function ReportScreen({ storeName, scenario, result, isNewBest, hasNext, onRetry, onNext, onMap }: Props) {
  const g = result.grade;
  return (
    <GameShell storeName={storeName} dim={0.2}>
      <div className="mx-auto w-full max-w-5xl px-4 py-4 md:py-6">
        <Panel className="anim-fade-up overflow-hidden">
          <div className="bg-gradient-to-r from-brand-800 to-brand-600 px-6 py-5 text-white md:px-8">
            <p className="text-xs font-bold tracking-[0.3em] text-brand-100">CUSTOMER SERVICE REPORT</p>
            <h1 className="mt-1 text-2xl font-black md:text-3xl">{result.customerName} 고객 응대 완료</h1>
            <p className="mt-1 text-sm text-brand-100">
              {scenario.code} · {scenario.title}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-[1fr_1.4fr] md:px-8">
            <div className="space-y-4">
              <div className="rounded-3xl bg-ink-50 px-5 py-5 text-center">
                <p className="text-xs font-bold text-ink-500">종합점수</p>
                <p className="mt-1 text-5xl font-black text-ink-900">
                  {result.totalScore}
                  <span className="text-lg font-bold text-ink-500"> / 100</span>
                </p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-base font-extrabold text-ink-900 shadow-sm">
                  <span className="text-xl">{g.emoji}</span> {g.title}
                </div>
                <p className="mt-2 text-sm text-ink-700">{g.message}</p>
                {isNewBest && <p className="mt-2 text-xs font-bold text-amber-700">🎉 이 케이스 최고 기록!</p>}
              </div>

              <div className="rounded-3xl border border-ink-100 px-5 py-4">
                <p className="text-xs font-bold text-ink-500">고객 만족도 변화</p>
                <div className="mt-2 flex flex-wrap items-center gap-1">
                  {result.trustHistory.map((t, i) => {
                    const e = EMOTION_META[emotionFromTrust(t)];
                    return (
                      <span key={i} className="flex items-center gap-1">
                        <span className="text-xl" title={`${t}`}>
                          {e.emoji}
                        </span>
                        {i < result.trustHistory.length - 1 && <span className="text-ink-300">›</span>}
                      </span>
                    );
                  })}
                </div>
                <p className="mt-2 text-sm font-semibold text-ink-800">
                  최종 신뢰도 <b style={{ color: EMOTION_META[emotionFromTrust(result.finalTrust)].color }}>{result.finalTrust}</b> · {EMOTION_META[emotionFromTrust(result.finalTrust)].label}
                </p>
                <p className="mt-1 text-xs text-ink-500">
                  힌트 사용 {result.hintsUsed}회 · 안경사 연결 {result.referralMade ? '✓' : '—'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-extrabold text-ink-900">평가</h2>
                <ul className="mt-2 divide-y divide-ink-100 rounded-2xl border border-ink-100">
                  {CATEGORY_ORDER.map((c) => {
                    const ratio = result.categoryRatios[c];
                    const meta = CATEGORY_META[c];
                    return (
                      <li key={c} className="flex items-center justify-between px-4 py-2 text-sm">
                        <span className="font-semibold text-ink-800">
                          {meta.label} <span className="text-[11px] text-ink-400">({meta.weight}점)</span>
                        </span>
                        {ratio === undefined ? (
                          <span className="text-xs text-ink-400">이번 고객에서는 평가 없음</span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Stars n={starsFor(ratio)} />
                            <span className="w-10 text-right text-xs font-bold text-ink-600">{result.categoryScores[c]}점</span>
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="rounded-2xl bg-emerald-50 px-4 py-3">
                <h3 className="text-sm font-extrabold text-emerald-800">잘한 점</h3>
                <ul className="mt-1 space-y-1 text-sm text-ink-800">
                  {result.goodPoints.map((p) => (
                    <li key={p}>✅ {p}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-amber-50 px-4 py-3">
                <h3 className="text-sm font-extrabold text-amber-800">아쉬운 점</h3>
                <ul className="mt-1 space-y-1 text-sm text-ink-800">
                  {result.improvePoints.map((p) => (
                    <li key={p}>⚠ {p}</li>
                  ))}
                </ul>
                <p className="mt-2 text-xs font-semibold text-ink-600">
                  다음에는 <b>질문 → 확인 → 제안</b> 순서로 대화를 진행해 보세요.
                </p>
              </div>
              <div className="rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm">
                <span className="font-extrabold text-brand-800">이번 케이스의 학습 포인트</span>
                <p className="mt-1 text-ink-800">{scenario.learningPoint}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-ink-100 px-6 py-4 sm:flex-row sm:justify-end md:px-8">
            <Button onClick={onMap}>훈련 지도</Button>
            <Button onClick={onRetry}>↻ 다른 선택으로 다시 해보기</Button>
            <Button tone="primary" onClick={onNext}>
              {scenario.isFinal ? '🎉 최종 결과 보기' : hasNext ? '다음 고객 만나기 →' : '훈련 지도로 →'}
            </Button>
          </div>
        </Panel>
      </div>
    </GameShell>
  );
}
