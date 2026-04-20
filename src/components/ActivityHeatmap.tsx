import { format, parseISO } from 'date-fns'
import type { HeatmapPoint } from '../services/analytics'
import { Panel } from './ui/Panel'

const intensityClasses = [
  'bg-white/4',
  'bg-[var(--accent)]/18',
  'bg-[var(--accent)]/32',
  'bg-[var(--accent)]/55',
  'bg-[var(--accent)]',
]

export function ActivityHeatmap({ points }: { points: HeatmapPoint[] }) {
  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Consistency Heatmap
          </p>
          <h3 className="mt-2 font-['Fraunces'] text-2xl text-white">Twelve-week activity trail</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <span>Low</span>
          {[0, 1, 2, 3, 4].map((step) => (
            <span
              key={step}
              className={`h-3 w-3 rounded-sm border border-white/8 ${intensityClasses[step]}`}
            />
          ))}
          <span>High</span>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto scrollbar-none">
        <div className="grid min-w-[720px] grid-flow-col grid-rows-7 gap-2">
          {points.map((point) => (
            <div
              key={point.date}
              className={`heatmap-tile h-8 w-8 rounded-lg border border-white/8 ${intensityClasses[point.intensity]}`}
              title={`${format(parseISO(point.date), 'dd MMM yyyy')}: ${point.count}/${point.total} completed`}
            />
          ))}
        </div>
      </div>
    </Panel>
  )
}
