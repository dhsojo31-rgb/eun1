import type { ReactNode } from 'react';
import { StoreBackground } from './StoreBackground';

/** 전체화면 게임 프레임: 배경 + 상단 헤더 + 본문 */
export function GameShell({
  storeName,
  header,
  children,
  variant = 'store',
  dim = 0,
  footer,
}: {
  storeName: string;
  header?: ReactNode;
  children: ReactNode;
  variant?: 'store' | 'consult';
  dim?: number;
  footer?: ReactNode;
}) {
  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-ink-100">
      <StoreBackground storeName={storeName} variant={variant} dim={dim} />
      {header && (
        <header className="relative z-20 flex items-center gap-2 px-3 py-2 md:px-5 md:py-3 min-h-14">
          {header}
        </header>
      )}
      <main className="relative z-10 flex-1 min-h-0 overflow-y-auto">{children}</main>
      {footer}
    </div>
  );
}

export function Pill({ children, tone = 'default', className = '' }: { children: ReactNode; tone?: 'default' | 'brand' | 'done' | 'now' | 'warn'; className?: string }) {
  const tones: Record<string, string> = {
    default: 'bg-white/80 text-ink-700 border-ink-300/70',
    brand: 'bg-brand-700 text-white border-brand-700',
    done: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    now: 'bg-brand-100 text-brand-800 border-brand-200 ring-2 ring-brand-500/30',
    warn: 'bg-amber-100 text-amber-800 border-amber-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold backdrop-blur ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-white/70 bg-white/90 shadow-[0_20px_60px_rgba(28,25,23,0.18)] backdrop-blur-md ${className}`}>
      {children}
    </div>
  );
}

type BtnTone = 'primary' | 'secondary' | 'ghost' | 'gold' | 'danger';
export function Button({
  children,
  onClick,
  tone = 'secondary',
  size = 'md',
  className = '',
  disabled,
  title,
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: BtnTone;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  title?: string;
  type?: 'button' | 'submit';
}) {
  const tones: Record<BtnTone, string> = {
    primary: 'bg-brand-700 text-white hover:bg-brand-800 shadow-md shadow-brand-700/20',
    secondary: 'bg-white text-ink-900 border border-ink-300 hover:bg-ink-100',
    ghost: 'bg-transparent text-ink-700 hover:bg-white/60 border border-transparent',
    gold: 'bg-gradient-to-br from-amber-300 to-amber-500 text-ink-900 hover:brightness-105 shadow-md shadow-amber-500/20',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-xl',
    md: 'px-4 py-2.5 text-sm rounded-2xl',
    lg: 'px-7 py-3.5 text-base md:text-lg rounded-2xl',
  };
  return (
    <button
      type={type}
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 font-bold transition active:scale-[.98] disabled:opacity-40 disabled:cursor-not-allowed ${tones[tone]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

export function IconButton({ children, onClick, title, active, className = '' }: { children: ReactNode; onClick?: () => void; title: string; active?: boolean; className?: string }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`inline-flex h-9 items-center justify-center gap-1 rounded-full border px-3 text-xs font-bold backdrop-blur transition hover:bg-white ${
        active ? 'border-brand-500 bg-brand-100 text-brand-800' : 'border-ink-300/70 bg-white/80 text-ink-700'
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function Modal({ title, children, onClose, wide, footer }: { title: ReactNode; children: ReactNode; onClose: () => void; wide?: boolean; footer?: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-3 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal>
      <div
        className={`anim-pop flex max-h-[92vh] w-full flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ${wide ? 'max-w-5xl' : 'max-w-xl'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <h2 className="text-lg font-extrabold text-ink-900">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-full px-3 py-1 text-xl text-ink-500 hover:bg-ink-100" aria-label="닫기">
            ×
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="border-t border-ink-100 px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}

export function Stars({ n, max = 5, size = 'text-base' }: { n: number; max?: number; size?: string }) {
  return (
    <span className={`${size} tracking-tight`} aria-label={`${n}점 / ${max}점`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < n ? 'text-amber-400' : 'text-ink-300'}>
          ★
        </span>
      ))}
    </span>
  );
}

export function Difficulty({ n }: { n: number }) {
  return <Stars n={n} size="text-sm" />;
}
