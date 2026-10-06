import { useState } from 'react';
import { SCENARIOS } from '../data';
import type { Progress, Quality, Scenario } from '../types';
import { STEP_LABEL, CATEGORY_META } from '../types';
import { Button, Difficulty, Modal } from './ui';

interface Props {
  progress: Progress;
  storeName: string;
  onClose: () => void;
  onJump: (id: string) => void;
  onToggleUnlockAll: (v: boolean) => void;
  onReset: () => void;
  onStoreName: (name: string) => void;
}

const QUALITY_LABEL: Record<Quality, { label: string; cls: string }> = {
  3: { label: '매우 좋은 응대', cls: 'bg-emerald-100 text-emerald-800' },
  2: { label: '무난한 응대', cls: 'bg-sky-100 text-sky-800' },
  1: { label: '부족한 응대', cls: 'bg-amber-100 text-amber-800' },
  0: { label: '부적절한 응대', cls: 'bg-rose-100 text-rose-800' },
};

export function EducatorPanel({ progress, storeName, onClose, onJump, onToggleUnlockAll, onReset, onStoreName }: Props) {
  const [tab, setTab] = useState<'control' | 'answers'>('control');
  const [selected, setSelected] = useState<string>(SCENARIOS[0].id);
  const [name, setName] = useState(storeName);
  const scenario: Scenario = SCENARIOS.find((s) => s.id === selected) ?? SCENARIOS[0];

  return (
    <Modal
      wide
      title={
        <span className="flex items-center gap-3">
          🎓 교육자 모드
          <span className="flex gap-1 text-sm">
            <button type="button" onClick={() => setTab('control')} className={`rounded-full px-3 py-1 ${tab === 'control' ? 'bg-brand-100 text-brand-800' : 'text-ink-500 hover:bg-ink-100'}`}>
              진행 관리
            </button>
            <button type="button" onClick={() => setTab('answers')} className={`rounded-full px-3 py-1 ${tab === 'answers' ? 'bg-brand-100 text-brand-800' : 'text-ink-500 hover:bg-ink-100'}`}>
              시나리오 · 선택지 피드백
            </button>
          </span>
        </span>
      }
      onClose={onClose}
    >
      {tab === 'control' ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <section>
            <h3 className="text-sm font-extrabold text-ink-900">원하는 CASE 바로 실행</h3>
            <ul className="mt-2 space-y-1.5">
              {SCENARIOS.map((s) => (
                <li key={s.id} className="flex items-center justify-between rounded-xl border border-ink-100 px-3 py-2 text-sm">
                  <span>
                    <b className={s.isFinal ? 'text-amber-700' : 'text-brand-700'}>{s.code}</b> {s.mapTitle}
                    <span className="ml-2 text-xs text-ink-500">
                      {progress.completed.includes(s.id) ? `✅ 최고 ${progress.bestScores[s.id]}점` : '미완료'}
                    </span>
                  </span>
                  <Button size="sm" tone="primary" onClick={() => onJump(s.id)}>
                    실행
                  </Button>
                </li>
              ))}
            </ul>
          </section>
          <section className="space-y-4">
            <div className="rounded-2xl border border-ink-100 px-4 py-3">
              <label className="flex cursor-pointer items-center justify-between text-sm font-bold text-ink-900">
                모든 CASE 잠금 해제
                <input type="checkbox" className="h-5 w-5 accent-brand-700" checked={progress.unlockedAll} onChange={(e) => onToggleUnlockAll(e.target.checked)} />
              </label>
              <p className="mt-1 text-xs text-ink-500">켜면 학생이 순서와 상관없이 어떤 케이스든 선택할 수 있습니다.</p>
            </div>
            <div className="rounded-2xl border border-ink-100 px-4 py-3">
              <p className="text-sm font-bold text-ink-900">매장 이름 (로고 자리)</p>
              <div className="mt-2 flex gap-2">
                <input value={name} onChange={(e) => setName(e.target.value)} maxLength={16} className="flex-1 rounded-xl border border-ink-300 px-3 py-2 text-sm" />
                <Button size="sm" onClick={() => onStoreName(name.trim() || '밝은눈 안경원')}>
                  적용
                </Button>
              </div>
              <p className="mt-1 text-xs text-ink-500">배경의 간판에 표시됩니다.</p>
            </div>
            <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3">
              <p className="text-sm font-bold text-rose-800">학생 진행 초기화</p>
              <p className="mt-1 text-xs text-ink-600">완료 기록, 최고 점수, 미션이 모두 지워집니다. (이 브라우저에만 적용)</p>
              <Button
                size="sm"
                tone="danger"
                className="mt-2"
                onClick={() => {
                  if (window.confirm('정말 모든 진행 기록을 초기화할까요?')) onReset();
                }}
              >
                초기화
              </Button>
            </div>
            <div className="rounded-2xl bg-ink-50 px-4 py-3 text-xs text-ink-600">
              <p className="font-bold text-ink-800">평가 기준 (100점)</p>
              <p className="mt-1">
                {Object.values(CATEGORY_META)
                  .map((m) => `${m.label} ${m.weight}`)
                  .join(' · ')}
              </p>
              <p className="mt-1">선택지 품질(0~3)을 항목별로 평균해 가중치를 적용합니다. 힌트는 1회 1점, 최대 4점 감점.</p>
            </div>
          </section>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[220px_1fr]">
          <ul className="space-y-1">
            {SCENARIOS.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setSelected(s.id)}
                  className={`w-full rounded-xl px-3 py-2 text-left text-sm font-semibold ${selected === s.id ? 'bg-brand-100 text-brand-900' : 'hover:bg-ink-100'}`}
                >
                  <span className="text-xs text-ink-500">{s.code}</span>
                  <br />
                  {s.mapTitle}
                </button>
              </li>
            ))}
          </ul>
          <div className="space-y-4">
            <div className="rounded-2xl bg-brand-50 px-4 py-3">
              <p className="text-xs font-bold text-brand-700">
                {scenario.code} · 난이도 <Difficulty n={scenario.difficulty} />
              </p>
              <h3 className="text-lg font-extrabold text-ink-900">{scenario.title}</h3>
              <p className="mt-1 text-sm text-ink-700">{scenario.summary}</p>
              <p className="mt-2 text-sm">
                <b className="text-brand-800">핵심 학습 포인트:</b> {scenario.learningPoint}
              </p>
              <p className="mt-1 text-sm">
                <b className="text-brand-800">연습 내용:</b> {scenario.practiceGoals.join(' · ')}
              </p>
            </div>
            <div className="rounded-2xl border border-ink-100 px-4 py-3 text-sm">
              <p className="font-bold text-ink-900">
                고객 내부 설정 — {scenario.customer.name} ({scenario.customer.age})
              </p>
              <p className="mt-1 text-ink-700">성격: {scenario.customer.personality}</p>
              <p className="text-ink-700">방문 목적: {scenario.customer.visitPurpose}</p>
              <p className="text-ink-700">숨은 요구: {scenario.customer.hiddenNeeds.join(' / ')}</p>
              <p className="text-ink-700">시작 신뢰도: {scenario.customer.initialTrust}</p>
            </div>
            <div className="space-y-3">
              {Object.values(scenario.nodes).map((n) => (
                <div key={n.id} className="rounded-2xl border border-ink-100 px-4 py-3">
                  <p className="text-[11px] font-bold text-ink-500">
                    {n.id} · STEP {n.step}. {STEP_LABEL[n.step]} · 평가 항목: {CATEGORY_META[n.category].label}
                    {n.surprise && <span className="ml-2 rounded-full bg-rose-100 px-2 text-rose-700">돌발</span>}
                  </p>
                  {n.narration && <p className="mt-1 text-xs italic text-ink-500">{n.narration}</p>}
                  <p className="mt-1 text-sm font-semibold text-ink-900">고객: “{n.customer}”</p>
                  <p className="mt-1 text-xs text-amber-800">💡 힌트: {n.hint}</p>
                  <ul className="mt-2 space-y-1.5">
                    {n.choices.map((c) => (
                      <li key={c.id} className="rounded-xl bg-ink-50 px-3 py-2 text-sm">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${QUALITY_LABEL[c.quality].cls}`}>{QUALITY_LABEL[c.quality].label}</span>
                          <span className="text-[11px] font-bold text-ink-500">신뢰도 {c.trust > 0 ? `+${c.trust}` : c.trust}</span>
                          {c.referral && <span className="rounded-full bg-brand-100 px-2 text-[11px] font-bold text-brand-800">안경사 연결</span>}
                          {c.info && <span className="rounded-full bg-amber-100 px-2 text-[11px] font-bold text-amber-800">정보 획득</span>}
                        </div>
                        <p className="mt-1 text-ink-900">“{c.text}”</p>
                        {c.reaction && <p className="mt-0.5 text-xs text-ink-600">→ 고객 반응: “{c.reaction}”</p>}
                        {c.feedback && <p className="mt-0.5 text-xs text-ink-500">피드백: {c.feedback}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
