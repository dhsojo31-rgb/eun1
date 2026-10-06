import { Button, GameShell, Panel } from './ui';

const STEPS = [
  { n: 1, title: '맞이하기', desc: '밝고 자연스럽게 고객을 맞이합니다.', icon: '🙋' },
  { n: 2, title: '질문하기', desc: '고객이 무엇을 원하는지 먼저 확인합니다.', icon: '❓' },
  { n: 3, title: '듣기', desc: '고객의 말을 끝까지 듣습니다.', icon: '👂' },
  { n: 4, title: '안내하기', desc: '고객 상황에 맞는 정보를 쉽게 설명합니다.', icon: '🗣️' },
  { n: 5, title: '마무리하기', desc: '추가로 필요한 것이 없는지 확인합니다.', icon: '🤝' },
];

export function EducationScreen({ storeName, onBack }: { storeName: string; onBack: () => void }) {
  return (
    <GameShell
      storeName={storeName}
      dim={0.1}
      header={
        <>
          <Button size="sm" onClick={onBack}>
            ← 돌아가기
          </Button>
          <span className="ml-2 text-sm font-extrabold text-ink-900">📘 교육내용 다시보기</span>
        </>
      }
    >
      <div className="mx-auto w-full max-w-5xl px-4 py-4 md:py-8">
        <h1 className="text-center text-2xl font-black text-ink-900 drop-shadow-sm md:text-3xl">좋은 고객응대 5단계</h1>
        <div className="stagger mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s) => (
            <Panel key={s.n} className="px-5 py-6 text-center">
              <div className="text-3xl">{s.icon}</div>
              <p className="mt-2 text-xs font-bold text-brand-700">STEP {s.n}</p>
              <h2 className="text-lg font-extrabold text-ink-900">{s.title}</h2>
              <p className="mt-2 text-sm text-ink-700">{s.desc}</p>
            </Panel>
          ))}
        </div>

        <Panel className="anim-fade-up mt-6 border-2 border-amber-300 bg-amber-50/95 px-6 py-8 text-center">
          <h2 className="text-2xl font-black text-ink-900">기억하세요!</h2>
          <p className="mt-3 text-base font-bold text-ink-900 md:text-lg">코디네이터는 모든 질문에 답해야 하는 사람이 아닙니다.</p>
          <p className="mt-2 text-sm text-ink-700 md:text-base">
            정확한 검사나 전문적인 판단이 필요한 내용은
            <br />
            <b className="text-brand-800">전문 안경사에게 연결하는 것도 좋은 고객응대입니다.</b>
          </p>
        </Panel>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Panel className="px-5 py-5">
            <h3 className="text-sm font-extrabold text-emerald-700">👍 이런 말은 좋아요</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-ink-700">
              <li>"어떤 부분을 가장 중요하게 생각하세요?"</li>
              <li>"생각하고 계신 가격대가 있으시면 그 범위에서 같이 찾아볼까요?"</li>
              <li>"많이 불편하셨겠어요. 어느 부분이 가장 불편하신지 확인해 볼게요."</li>
              <li>"정확한 부분은 안경사 선생님께서 확인해 드릴 수 있도록 안내해 드릴게요."</li>
            </ul>
          </Panel>
          <Panel className="px-5 py-5">
            <h3 className="text-sm font-extrabold text-rose-700">👎 이런 말은 피해요</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-ink-700">
              <li>"좋은 건 원래 비싸요."</li>
              <li>"고객님 얼굴에는 이게 무조건 잘 어울려요."</li>
              <li>"원래 안경은 조금 흘러내릴 수 있어요."</li>
              <li>"눈이 많이 나빠지신 것 같은데요." (진단은 코디네이터의 역할이 아님)</li>
            </ul>
          </Panel>
        </div>

        <div className="mt-6 flex justify-center">
          <Button tone="primary" size="lg" onClick={onBack}>
            돌아가기
          </Button>
        </div>
      </div>
    </GameShell>
  );
}
