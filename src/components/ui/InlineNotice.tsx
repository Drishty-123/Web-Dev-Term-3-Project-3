import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

type Tone = 'default' | 'success' | 'warning' | 'danger'

const toneClasses: Record<Tone, string> = {
  default: 'border-white/12 bg-white/6 text-[var(--text-secondary)]',
  success: 'border-emerald-300/18 bg-emerald-400/8 text-emerald-200',
  warning: 'border-amber-300/18 bg-amber-400/10 text-amber-200',
  danger: 'border-rose-300/18 bg-rose-400/10 text-rose-200',
}

export function InlineNotice({
  tone = 'default',
  children,
  className,
}: {
  tone?: Tone
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('rounded-2xl border px-4 py-3 text-sm leading-6', toneClasses[tone], className)}>
      {children}
    </div>
  )
}
