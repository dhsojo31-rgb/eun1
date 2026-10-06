import { Button, GameShell, Panel } from './ui';

export function IntroScreen({ storeName, onMeet, onBack }: { storeName: string; onMeet: () => void; onBack: () => void }) {
  return (
    <GameShell storeName={storeName} dim={0.15}>
      <div className="flex min-h-full items-center justify-center px-4 py-6">
        <Panel className="anim-fade-up w-full max-w-2xl px-6 py-8 md:px-12 md:py-12">
          <p className="text-sm font-bold text-ink-500">오늘부터 여러분은</p>
          <h1 className="mt-1 text-3xl font-black text-ink-900 md:text-4xl">안경원 코디네이터입니다.</h1>

          <div className="stagger mt-6 space-y-3 text-base leading-relaxed text-ink-700 md:text-lg">
            <p>안경원에는 다양한 고객이 찾아옵니다.</p>
            <p>
              말이 많은 고객도 있고,
              <br />
              조용한 고객도 있고,
              <br />
              무엇을 원하는지 정확히 모르는 고객도 있습니다.
            </p>
            <p>좋은 코디네이터가 되기 위해 가장 중요한 것은</p>
            <p className="rounded-2xl bg-brand-50 px-5 py-4 text-center text-xl font-black text-brand-800 md:text-2xl">"고객의 이야기를 듣는 것"</p>
            <p>입니다. 고객을 직접 만나보세요.</p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button onClick={onBack}>처음으로</Button>
            <Button tone="primary" size="lg" onClick={onMeet}>
              오늘의 첫 고객 만나기 →
            </Button>
          </div>
        </Panel>
      </div>
    </GameShell>
  );
}
