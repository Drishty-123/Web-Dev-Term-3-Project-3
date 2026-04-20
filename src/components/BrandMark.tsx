import { Activity } from 'lucide-react'

export function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent)] text-slate-950 shadow-[0_16px_40px_rgba(255,154,90,0.35)]">
        <Activity className="h-5 w-5" />
      </div>
      <div>
        <p className="font-['Fraunces'] text-2xl text-white">HabitPulse</p>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
          Behavior, not just boxes
        </p>
      </div>
    </div>
  )
}
