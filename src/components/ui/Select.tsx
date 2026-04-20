import type { SelectHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-12 w-full rounded-2xl border border-white/12 bg-white/6 px-4 text-sm text-white outline-none focus:border-[var(--accent)] focus:bg-white/8',
        className,
      )}
      {...props}
    />
  )
}
