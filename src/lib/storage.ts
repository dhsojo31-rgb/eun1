import type { CaseResult, Progress } from '../types';

const KEY = 'optician-coordinator-progress-v2';
const SETTINGS_KEY = 'optician-coordinator-settings-v2';

const EMPTY: Progress = {
  version: 2,
  completed: [],
  bestScores: {},
  results: {},
  unlockedAll: false,
  introSeen: false,
  plays: 0,
};

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return { ...EMPTY, ...parsed };
  } catch {
    return { ...EMPTY };
  }
}

function persist(p: Progress): Progress {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* 저장 불가 환경(시크릿 모드 등)에서는 메모리로만 진행 */
  }
  return p;
}

export function recordResult(p: Progress, result: CaseResult): Progress {
  const completed = p.completed.includes(result.scenarioId)
    ? p.completed
    : [...p.completed, result.scenarioId];
  const prevBest = p.bestScores[result.scenarioId] ?? -1;
  const bestScores = { ...p.bestScores, [result.scenarioId]: Math.max(prevBest, result.totalScore) };
  const results = { ...p.results, [result.scenarioId]: result };
  return persist({ ...p, completed, bestScores, results, plays: p.plays + 1 });
}

export function markIntroSeen(p: Progress): Progress {
  return persist({ ...p, introSeen: true });
}

export function setUnlockAll(p: Progress, value: boolean): Progress {
  return persist({ ...p, unlockedAll: value });
}

export function resetProgress(): Progress {
  return persist({ ...EMPTY });
}

export interface Settings {
  sound: boolean;
  storeName: string;
}

const DEFAULT_SETTINGS: Settings = { sound: true, storeName: '밝은눈 안경원' };

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(s: Settings): Settings {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
  return s;
}
