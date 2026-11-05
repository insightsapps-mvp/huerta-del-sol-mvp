import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function QtyStepper({
  value, onChange, step = 1, min = 1, max = 9999, label, size = 'md', tone = 'solid', className,
}: { value: number; onChange: (n: number) => void; step?: number; min?: number; max?: number; label?: string; size?: 'sm' | 'md' | 'lg'; tone?: 'solid' | 'outline'; className?: string }) {
  const h = size === 'lg' ? 'h-12' : size === 'sm' ? 'h-9' : 'h-11';
  const w = size === 'sm' ? 'w-9' : 'w-11';
  const round = (n: number) => Math.round(n * 100) / 100;
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className={cn('flex items-center justify-between rounded-xl', tone === 'solid' ? 'bg-huerta-600 text-white' : 'border border-huerta-900/15 bg-white text-huerta-900', h, className)}
    >
      <button type="button" aria-label="Restar" onClick={() => onChange(round(value - step))} className={cn('grid place-items-center', h, w)}>
        <Minus size={16} strokeWidth={2.6} />
      </button>
      <span className="min-w-[3.5rem] text-center text-[14px] font-bold tabular-nums">{label ?? value}</span>
      <button type="button" aria-label="Sumar" disabled={value + step > max} onClick={() => onChange(round(Math.max(min, value + step)))} className={cn('grid place-items-center disabled:opacity-40', h, w)}>
        <Plus size={16} strokeWidth={2.6} />
      </button>
    </div>
  );
}
