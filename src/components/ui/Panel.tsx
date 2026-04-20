import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'glass-panel rounded-[28px] bg-[var(--card)] p-5 text-left text-white',
        className,
      )}
      {...props}
    />
  )
}
