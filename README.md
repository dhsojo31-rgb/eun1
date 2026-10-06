# 오늘은 내가 안경원 코디네이터!

고등학생 직무교육용 **가상 안경원 고객응대 실습 시뮬레이션** 웹앱입니다.
학생이 가상의 안경원 코디네이터가 되어 고객을 맞이하고, 질문하고, 안내하고, 필요할 때 안경사에게 연결하는 상담 전체를 경험합니다.

- 분기형 대화 시나리오 (CASE 01~07 + REAL CUSTOMER CHALLENGE)
- 학생의 선택 → 고객 반응 → 표정·신뢰도 변화 → 다음 선택
- 고객 메모 자동 기록, 돌발 상황, 응대 힌트
- 실습 결과 리포트 (7개 평가 항목, 등급, 잘한 점 / 아쉬운 점)
- localStorage 진행 저장, 오늘의 미션, 교육자 모드
- 외부 API 없이 완전히 브라우저에서 동작

## 실행

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # dist/ 생성 (정적 호스팅 가능)
npm run typecheck  # 타입 검사
```

## 구조

```
src/
  data/            고객 시나리오 데이터 (case1.ts … case7.ts, final.ts, index.ts)
  engine/          점수 계산(scoring.ts), 미션(missions.ts)
  lib/             localStorage 저장(storage.ts), 효과음(audio.ts)
  components/      화면 컴포넌트
    StoreBackground.tsx   안경원 배경 (SVG)
    CustomerFigure.tsx    고객 캐릭터 (감정별 표정)
    SimulationScreen.tsx  상담 시뮬레이션 (핵심 화면)
    ReportScreen.tsx      실습 결과 리포트
    TrainingMap.tsx       코디네이터 TRAINING 진행 지도 + 오늘의 미션
    EducatorPanel.tsx     교육자 모드
  types.ts         데이터 타입 정의
```

## 시나리오 추가하기

1. `src/data/caseN.ts` 파일을 만들고 `Scenario` 타입에 맞춰 작성합니다.
2. `src/data/index.ts`의 `SCENARIOS` 배열에 추가합니다.

각 선택지(`Choice`)에는 다음을 지정합니다.

| 필드 | 설명 |
| --- | --- |
| `quality` | 3 매우 좋음 / 2 무난 / 1 부족 / 0 부적절 |
| `trust` | 고객 신뢰도 변화 |
| `reaction` | 선택 직후 고객의 반응 |
| `info` | 고객 메모에 기록되는 정보 |
| `feedback` | 리포트의 잘한 점(3) / 아쉬운 점(0~1) |
| `referral` | 안경사 연결 선택지 여부 |

## 평가 기준 (100점)

첫인사 및 태도 15 · 고객 요구 파악 20 · 경청 및 질문 20 · 설명 및 의사소통 15 · 고객 상황 대응 15 · 전문 안경사 연결 판단 10 · 상담 마무리 5

90+ 🏆 고객응대 MASTER / 80+ ⭐ 우수 코디네이터 / 70+ 🙂 성장하는 코디네이터 / 69 이하 🌱 코디네이터 연습생

## 교육자 모드

화면 우측 상단 🎓 버튼: 원하는 CASE 바로 실행, 전체 잠금 해제, 진행 초기화, 매장 이름(로고) 변경, 시나리오별 학습 포인트와 선택지 피드백 확인.
