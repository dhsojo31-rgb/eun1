import { Button, GameShell, IconButton, Panel } from './ui';

interface Props {
  storeName: string;
  soundOn: boolean;
  onToggleSound: () => void;
  onStart: () => void;
  onEducation: () => void;
  onMissions: () => void;
  onEducator: () => void;
  completedCount: number;
  totalCount: number;
}

export function StartScreen({ storeName, soundOn, onToggleSound, onStart, onEducation, onMissions, onEducator, completedCount, totalCount }: Props) {
  return (
    <GameShell
      storeName={storeName}
      header={
        <>
          <span className="rounded-full border border-ink-300/60 bg-white/80 px-3 py-1 text-xs font-extrabold text-brand-800 backdrop-blur">
            👓 가상 안경원 고객응대 실습
          </span>
          <div className="ml-auto flex items-center gap-2">
            <IconButton title={soundOn ? '효과음 끄기' : '효과음 켜기'} onClick={onToggleSound} active={soundOn}>
              {soundOn ? '🔊' : '🔇'}
            </IconButton>
            <IconButton title="교육자 모드" onClick={onEducator}>
              🎓 <span className="hidden sm:inline">교육자 모드</span>
            </IconButton>
          </div>
        </>
      }
    >
      <div className="flex min-h-full items-center justify-center px-4 py-6">
        <Panel className="anim-fade-up w-full max-w-2xl px-6 py-8 text-center md:px-12 md:py-12">
          <p className="text-sm font-bold tracking-widest text-brand-700">OPTICAL STORE COORDINATOR TRAINING</p>
          <h1 className="mt-3 text-3xl font-black leading-tight text-ink-900 md:text-5xl">
            오늘은 내가
            <br />
            안경원 코디네이터!
          </h1>
          <p className="mt-4 text-base font-semibold text-ink-700 md:text-lg">고객을 직접 응대하며 안경원 업무를 체험해 보세요.</p>

          <div className="mx-auto mt-8 flex w-full max-w-sm flex-col gap-3">
            <Button tone="primary" size="lg" onClick={onStart} className="w-full">
              ▶ 실습 시작하기
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={onEducation} className="w-full">
                📘 교육내용 다시보기
              </Button>
              <Button onClick={onMissions} className="w-full">
                🎯 오늘의 미션
              </Button>
            </div>
          </div>

          {completedCount > 0 && (
            <p className="mt-5 text-xs font-semibold text-ink-500">
              진행 상황: {completedCount} / {totalCount} 고객 응대 완료
            </p>
          )}

          <p className="mt-8 text-xs font-medium text-ink-500 md:text-sm">
            고객에게 필요한 것은 좋은 제품만이 아닙니다. <b className="text-ink-700">좋은 응대도 중요한 서비스입니다.</b>
          </p>
        </Panel>
      </div>
    </GameShell>
  );
}
