import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-12 w-full rounded-2xl border border-white/12 bg-white/6 px-4 text-sm text-white outline-none placeholder:text-white/38 focus:border-[var(--accent)] focus:bg-white/8',
        className,
      )}
      {...props}
    />
  ),
)

Input.displayName = 'Input'
