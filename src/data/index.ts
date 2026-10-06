import type { Scenario } from '../types';
import { case1 } from './case1';
import { case2 } from './case2';
import { case3 } from './case3';
import { case4 } from './case4';
import { case5 } from './case5';
import { case6 } from './case6';
import { case7 } from './case7';
import { finalCase } from './final';

/**
 * 시나리오 목록. 새 고객 사례를 추가하려면
 * 1) src/data/caseN.ts 파일을 만들고
 * 2) 아래 배열에 순서대로 넣으면 됩니다.
 */
export const SCENARIOS: Scenario[] = [case1, case2, case3, case4, case5, case6, case7, finalCase];

export const SCENARIO_ORDER = SCENARIOS.map((s) => s.id);
export const BASIC_SCENARIOS = SCENARIOS.filter((s) => !s.isFinal);
export const FINAL_SCENARIO = finalCase;

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

/** 이전 단계를 완료해야 다음 단계가 열린다. 최종 미션은 기본 케이스를 모두 완료해야 열린다. */
export function isUnlocked(id: string, completed: string[], unlockedAll: boolean): boolean {
  if (unlockedAll) return true;
  const s = getScenario(id);
  if (!s) return false;
  if (s.isFinal) return BASIC_SCENARIOS.every((b) => completed.includes(b.id));
  const idx = SCENARIO_ORDER.indexOf(id);
  if (idx === 0) return true;
  return completed.includes(SCENARIO_ORDER[idx - 1]);
}

/** 다음에 진행할 케이스 (열려 있고 아직 완료하지 않은 첫 케이스, 없으면 첫 케이스) */
export function nextScenarioId(completed: string[], unlockedAll: boolean): string {
  for (const s of SCENARIOS) {
    if (!completed.includes(s.id) && isUnlocked(s.id, completed, unlockedAll)) return s.id;
  }
  return SCENARIOS[0].id;
}
