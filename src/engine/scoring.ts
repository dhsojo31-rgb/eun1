import {
  CATEGORY_META,
  CATEGORY_ORDER,
  type CaseResult,
  type Category,
  type Choice,
  type DialogueNode,
  type Emotion,
  type Grade,
  type Scenario,
} from '../types';

export function emotionFromTrust(trust: number): Emotion {
  if (trust >= 85) return 'very_happy';
  if (trust >= 65) return 'happy';
  if (trust >= 45) return 'neutral';
  if (trust >= 25) return 'uncomfortable';
  return 'angry';
}

export const EMOTION_META: Record<Emotion, { emoji: string; label: string; color: string; bg: string }> = {
  very_happy: { emoji: '😄', label: '매우 편안함', color: '#059669', bg: '#d1fae5' },
  happy: { emoji: '🙂', label: '편안함', color: '#0d9488', bg: '#ccfbf1' },
  neutral: { emoji: '😐', label: '보통', color: '#78716c', bg: '#f5f5f4' },
  uncomfortable: { emoji: '😕', label: '불편함', color: '#d97706', bg: '#fef3c7' },
  angry: { emoji: '😠', label: '불만', color: '#dc2626', bg: '#fee2e2' },
};

export function clampTrust(v: number): number {
  return Math.max(0, Math.min(100, Math.round(v)));
}

export function gradeFor(score: number): Grade {
  if (score >= 90)
    return { key: 'master', title: '고객응대 MASTER', emoji: '🏆', message: '고객의 이야기를 잘 듣고 상황에 맞게 응대했습니다.' };
  if (score >= 80)
    return { key: 'excellent', title: '우수 코디네이터', emoji: '⭐', message: '좋은 고객응대 능력을 보여주었습니다.' };
  if (score >= 70)
    return { key: 'growing', title: '성장하는 코디네이터', emoji: '🙂', message: '조금만 더 연습하면 훌륭한 응대를 할 수 있습니다.' };
  return { key: 'trainee', title: '코디네이터 연습생', emoji: '🌱', message: '괜찮습니다. 고객의 말을 먼저 듣는 것부터 다시 연습해 보세요.' };
}

export interface Decision {
  node: DialogueNode;
  choice: Choice;
}

/** 선택지 품질 → 득점 비율. 무난한 응대만 골라도 "성장하는 코디네이터"(70점대)가 되도록 설계 */
const QUALITY_SCORE: Record<number, number> = { 3: 1, 2: 0.75, 1: 0.35, 0: 0 };

/**
 * 점수 계산 방식
 * - 각 선택지는 0~3 품질 점수를 가짐. (3=1.0, 2=0.75, 1=0.35, 0=0 비율)
 * - 항목별 비율 = 방문한 해당 항목 노드의 품질 비율 평균
 * - 총점 = 100 × Σ(가중치 × 비율) / Σ(방문한 항목 가중치) → 시나리오에 등장하지 않는 항목은 평가에서 제외
 * - 힌트는 교육 목적이므로 1회당 1점, 최대 4점만 감점
 */
export function computeResult(
  scenario: Scenario,
  decisions: Decision[],
  trustHistory: number[],
  hintsUsed: number,
): CaseResult {
  const sums: Partial<Record<Category, { got: number; max: number }>> = {};
  const goodPoints: string[] = [];
  const improvePoints: string[] = [];
  let referralMade = false;

  for (const { node, choice } of decisions) {
    const s = sums[node.category] ?? { got: 0, max: 0 };
    s.got += QUALITY_SCORE[choice.quality] ?? 0;
    s.max += 1;
    sums[node.category] = s;
    if (choice.referral) referralMade = true;
    if (choice.feedback) {
      if (choice.quality === 3 && !goodPoints.includes(choice.feedback)) goodPoints.push(choice.feedback);
      if (choice.quality <= 1 && !improvePoints.includes(choice.feedback)) improvePoints.push(choice.feedback);
    }
  }

  const categoryRatios: Partial<Record<Category, number>> = {};
  const categoryScores: Partial<Record<Category, number>> = {};
  let weighted = 0;
  let weightSum = 0;
  for (const c of CATEGORY_ORDER) {
    const s = sums[c];
    if (!s || s.max === 0) continue;
    const ratio = s.got / s.max;
    categoryRatios[c] = ratio;
    categoryScores[c] = Math.round(CATEGORY_META[c].weight * ratio * 10) / 10;
    weighted += CATEGORY_META[c].weight * ratio;
    weightSum += CATEGORY_META[c].weight;
  }

  const raw = weightSum > 0 ? (100 * weighted) / weightSum : 0;
  const hintPenalty = Math.min(4, hintsUsed);
  const totalScore = Math.max(0, Math.round(raw - hintPenalty));
  const finalTrust = trustHistory[trustHistory.length - 1] ?? scenario.customer.initialTrust;

  if (goodPoints.length === 0) goodPoints.push('상담의 기본 순서를 끝까지 지켰습니다.');
  if (improvePoints.length === 0)
    improvePoints.push('좋은 흐름이었습니다. 다음에는 고객의 말에서 숨은 요구를 하나 더 찾아보세요.');

  return {
    scenarioId: scenario.id,
    customerName: scenario.customer.name,
    totalScore,
    categoryRatios,
    categoryScores,
    trustHistory,
    finalTrust,
    hintsUsed,
    referralMade,
    goodPoints: goodPoints.slice(0, 4),
    improvePoints: improvePoints.slice(0, 3),
    grade: gradeFor(totalScore),
    completedAt: new Date().toISOString(),
  };
}

export function starsFor(ratio: number): number {
  return Math.max(1, Math.min(5, Math.round(ratio * 5)));
}

/** 시드 기반 셔플: 같은 노드를 다시 방문해도 순서가 흔들리지 않음 */
export function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = (seed % 233280) || 1;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}
