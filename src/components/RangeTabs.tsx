import { cn } from '../lib/utils'

interface RangeTabsProps {
  value: number
  onChange: (value: number) => void
}

export function RangeTabs({ value, onChange }: RangeTabsProps) {
  const options = [7, 30, 90]

  return (
    <div className="inline-flex rounded-full border border-white/12 bg-white/6 p-1">
      {options.map((option) => (
        <button
          key={option}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition',
            value === option
              ? 'bg-[var(--accent)] text-slate-950'
              : 'text-[var(--text-secondary)] hover:text-white',
          )}
          onClick={() => onChange(option)}
          type="button"
        >
          {option}d
        </button>
      ))}
    </div>
  )
}
