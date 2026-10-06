import type { LogEntry, MemoField } from '../types';

export function MemoList({ fields, memo }: { fields: MemoField[]; memo: Record<string, string> }) {
  const found = fields.filter((f) => memo[f.key]).length;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold text-ink-500">대화로 파악한 정보</span>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">
          {found} / {fields.length}
        </span>
      </div>
      <ul className="space-y-1.5">
        {fields.map((f) => {
          const v = memo[f.key];
          return (
            <li key={f.key} className={`flex items-start gap-2 rounded-xl px-3 py-2 text-sm ${v ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500'}`}>
              <span className={`mt-0.5 shrink-0 font-black ${v ? 'text-emerald-600' : 'text-amber-500'}`}>{v ? '✓' : '?'}</span>
              <span className="shrink-0 font-semibold">{f.label}</span>
              <span className={`ml-auto text-right ${v ? 'font-bold' : 'italic'}`}>{v ?? '아직 몰라요'}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[11px] text-ink-500">💡 좋은 질문을 할수록 메모가 채워집니다.</p>
    </div>
  );
}

export function DialogueLog({ log, customerName }: { log: LogEntry[]; customerName: string }) {
  if (log.length === 0) return <p className="text-sm text-ink-500">아직 대화가 없습니다.</p>;
  return (
    <ul className="space-y-2">
      {log.map((e) => {
        if (e.who === 'narration')
          return (
            <li key={e.id} className="px-2 text-center text-xs italic text-ink-500">
              {e.text}
            </li>
          );
        const mine = e.who === 'student';
        return (
          <li key={e.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${mine ? 'rounded-br-sm bg-brand-700 text-white' : 'rounded-bl-sm bg-ink-100 text-ink-900'}`}>
              <p className={`mb-0.5 text-[10px] font-bold ${mine ? 'text-brand-100' : 'text-ink-500'}`}>{mine ? '나 (코디네이터)' : customerName}</p>
              {e.text}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
