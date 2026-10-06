/** 고객 감정 단계 (신뢰도에서 자동 계산되며, 선택지에서 일시적으로 덮어쓸 수 있음) */
export type Emotion = 'very_happy' | 'happy' | 'neutral' | 'uncomfortable' | 'angry';

/** 평가 항목 (총 100점) */
export type Category =
  | 'greeting' // 첫인사 및 태도 15
  | 'needs' // 고객 요구 파악 20
  | 'listening' // 경청 및 질문 20
  | 'explanation' // 설명 및 의사소통 15
  | 'coping' // 고객 상황 대응 15
  | 'referral' // 전문 안경사 연결 판단 10
  | 'closing'; // 상담 마무리 5

export const CATEGORY_META: Record<Category, { label: string; weight: number; short: string }> = {
  greeting: { label: '첫인사 및 태도', weight: 15, short: '첫인사' },
  needs: { label: '고객 요구 파악', weight: 20, short: '요구 파악' },
  listening: { label: '경청 및 질문', weight: 20, short: '경청' },
  explanation: { label: '설명 및 의사소통', weight: 15, short: '설명' },
  coping: { label: '고객 상황 대응', weight: 15, short: '상황 대처' },
  referral: { label: '전문 안경사 연결 판단', weight: 10, short: '전문가 연결' },
  closing: { label: '상담 마무리', weight: 5, short: '마무리' },
};

export const CATEGORY_ORDER: Category[] = [
  'greeting',
  'needs',
  'listening',
  'explanation',
  'coping',
  'referral',
  'closing',
];

/** 실습 단계 */
export type Step = 1 | 2 | 3 | 4 | 5 | 6;
export const STEP_LABEL: Record<Step, string> = {
  1: '고객 입장',
  2: '방문 목적 파악',
  3: '요구사항 확인',
  4: '응대',
  5: '돌발 상황',
  6: '상담 마무리',
};

/** 선택지 품질: 3 매우 좋음 / 2 무난 / 1 부족 / 0 부적절 */
export type Quality = 0 | 1 | 2 | 3;

export interface Choice {
  id: string;
  /** 학생(코디네이터)이 말하는 문장 */
  text: string;
  /** 다음 노드 id, 또는 'END' */
  next: string;
  quality: Quality;
  /** 신뢰도 변화 (-30 ~ +20) */
  trust: number;
  /** 선택 직후 고객의 즉각 반응 (선택) */
  reaction?: string;
  /** 이 선택으로 파악되는 고객 정보 (고객 메모에 기록) */
  info?: Record<string, string>;
  /** 리포트용 피드백 문장. quality 3 → 잘한 점, 0~1 → 아쉬운 점 */
  feedback?: string;
  /** 안경사 연결 선택지 */
  referral?: boolean;
  /** 감정 일시 덮어쓰기 (예: 놀람 등) */
  emotion?: Emotion;
}

export interface DialogueNode {
  id: string;
  step: Step;
  category: Category;
  /** 상황 설명 (고객의 행동 등) */
  narration?: string;
  /** 고객의 말 */
  customer: string;
  /** 돌발 상황 표시 */
  surprise?: boolean;
  hint: string;
  choices: Choice[];
}

export type HairStyle = 'short' | 'side' | 'long' | 'bob' | 'tied' | 'wave';

export interface CustomerLook {
  skin: string;
  hair: string;
  hairStyle: HairStyle;
  top: string;
  accent: string;
  glasses?: boolean;
  /** 연령 느낌 표현용 */
  mature?: boolean;
}

export interface CustomerProfile {
  name: string;
  age: string; // "20대 초반"
  gender: 'male' | 'female';
  look: CustomerLook;
  /** 내부 설정 (학생에게는 처음에 공개하지 않음) */
  personality: string;
  visitPurpose: string;
  hiddenNeeds: string[];
  initialTrust: number;
  initialEmotion?: Emotion;
}

export interface MemoField {
  key: string;
  label: string;
}

export interface Scenario {
  id: string;
  order: number; // 1~7
  code: string; // "CASE 01" / "FINAL"
  title: string; // 안경을 처음 맞추는 고객
  mapTitle: string; // 첫 고객 응대
  difficulty: 1 | 2 | 3 | 4 | 5;
  summary: string; // 시작 전 한 줄 상황 설명
  customer: CustomerProfile;
  memoFields: MemoField[];
  startNode: string;
  nodes: Record<string, DialogueNode>;
  /** 최종 신뢰도에 따른 고객의 마지막 인사 */
  endings: { high: string; mid: string; low: string };
  learningPoint: string; // 핵심 학습 포인트 (한 줄)
  practiceGoals: string[]; // 연습해야 하는 내용
  isFinal?: boolean;
}

export interface LogEntry {
  id: number;
  who: 'customer' | 'student' | 'narration';
  text: string;
  quality?: Quality;
}

export interface Grade {
  key: 'master' | 'excellent' | 'growing' | 'trainee';
  title: string;
  emoji: string;
  message: string;
}

export interface CaseResult {
  scenarioId: string;
  customerName: string;
  totalScore: number;
  categoryRatios: Partial<Record<Category, number>>; // 0~1, 미평가 항목은 없음
  categoryScores: Partial<Record<Category, number>>; // 실제 점수
  trustHistory: number[];
  finalTrust: number;
  hintsUsed: number;
  referralMade: boolean;
  goodPoints: string[];
  improvePoints: string[];
  grade: Grade;
  completedAt: string;
}

export interface Progress {
  version: number;
  completed: string[];
  bestScores: Record<string, number>;
  results: Record<string, CaseResult>;
  unlockedAll: boolean;
  introSeen: boolean;
  plays: number;
}
