import type { TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-[120px] w-full rounded-2xl border border-white/12 bg-white/6 px-4 py-3 text-sm text-white outline-none placeholder:text-white/38 focus:border-[var(--accent)] focus:bg-white/8',
        className,
      )}
      {...props}
    />
  )
}
