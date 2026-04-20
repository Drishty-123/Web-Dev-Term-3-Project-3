import type { InsightCard } from '../types/models'
import { Badge } from './ui/Badge'
import { Panel } from './ui/Panel'

const toneMap = {
  positive: 'success',
  warning: 'warning',
  neutral: 'default',
} as const

export function InsightCardBlock({ insight }: { insight: InsightCard }) {
  return (
    <Panel className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <Badge tone={toneMap[insight.tone]}>{insight.tone}</Badge>
        <p className="font-['Fraunces'] text-2xl text-white">{insight.metric}</p>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
        <p className="text-sm leading-6 text-[var(--text-secondary)]">{insight.explanation}</p>
      </div>
      <p className="mt-auto text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
        {insight.actionLabel}
      </p>
    </Panel>
  )
}
