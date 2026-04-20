import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type Tone = 'default' | 'success' | 'warning' | 'danger'

const toneClasses: Record<Tone, string> = {
  default: 'border-white/12 bg-white/8 text-[var(--text-secondary)]',
  success: 'border-emerald-300/20 bg-emerald-400/12 text-emerald-200',
  warning: 'border-amber-300/20 bg-amber-300/10 text-amber-200',
  danger: 'border-rose-300/20 bg-rose-400/10 text-rose-200',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

export function Badge({ className, tone = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]',
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  )
}
