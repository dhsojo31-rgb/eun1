import type { Progress } from '../types';

export interface Mission {
  id: string;
  label: string;
  done: boolean;
}

/** 오늘의 미션: 진행 기록에서 자동 계산 */
export function computeMissions(p: Progress): Mission[] {
  const results = Object.values(p.results);
  return [
    { id: 'first', label: '첫 고객 응대 완료하기', done: p.completed.includes('case-1') },
    { id: 'trust', label: '고객 신뢰도 80 이상으로 상담 마무리하기', done: results.some((r) => r.finalTrust >= 80) },
    { id: 'nohint', label: '힌트 없이 한 고객 응대 끝내기', done: results.some((r) => r.hintsUsed === 0) },
    { id: 'referral', label: '전문 안경사에게 연결하는 선택하기', done: results.some((r) => r.referralMade) },
    { id: 'master', label: '90점 이상 "고객응대 MASTER" 받기', done: results.some((r) => r.totalScore >= 90) },
    { id: 'final', label: 'REAL CUSTOMER CHALLENGE 완료하기', done: p.completed.includes('case-final') },
  ];
}
