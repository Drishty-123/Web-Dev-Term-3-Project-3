import type { ReactNode } from 'react'
import { Panel } from './Panel'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Panel className="rounded-[32px] border-dashed bg-white/4 p-8 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
        Empty state
      </p>
      <h3 className="mt-3 font-['Fraunces'] text-3xl text-white">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
        {description}
      </p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </Panel>
  )
}
