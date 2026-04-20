import type { ReactNode } from 'react'
import { Panel } from './Panel'

interface StatCardProps {
  label: string
  value: string
  description: string
  icon: ReactNode
}

export function StatCard({ label, value, description, icon }: StatCardProps) {
  return (
    <Panel className="flex h-full flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
          {label}
        </p>
        <div className="rounded-full border border-white/12 bg-white/8 p-3 text-[var(--accent)]">
          {icon}
        </div>
      </div>
      <div>
        <p className="font-['Fraunces'] text-4xl text-white">{value}</p>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{description}</p>
      </div>
    </Panel>
  )
}
