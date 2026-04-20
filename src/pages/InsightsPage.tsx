import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Badge } from '../components/ui/Badge'
import { Panel } from '../components/ui/Panel'
import { RangeTabs } from '../components/RangeTabs'
import { SectionHeading } from '../components/ui/SectionHeading'
import { useAppData } from '../hooks/useAppData'
import { useDashboardPreferences } from '../hooks/useDashboardPreferences'
import {
  buildCategoryPerformance,
  buildHabitMetrics,
  buildInsightCards,
  buildTrendData,
} from '../services/analytics'
import { formatPercent, titleCase } from '../lib/utils'
import { Select } from '../components/ui/Select'

export function InsightsPage() {
  const { habits, logs } = useAppData()
  const { rangeDays, setRangeDays, highlightedCategory, setHighlightedCategory } = useDashboardPreferences()

  const activeHabits = useMemo(() => habits.filter((habit) => !habit.archived), [habits])
  const categories = useMemo(
    () => ['All', ...new Set(activeHabits.map((habit) => habit.category))],
    [activeHabits],
  )
  const filteredHabits = useMemo(
    () =>
      highlightedCategory === 'All'
        ? activeHabits
        : activeHabits.filter((habit) => habit.category === highlightedCategory),
    [activeHabits, highlightedCategory],
  )
  const metrics = useMemo(() => buildHabitMetrics(filteredHabits, logs), [filteredHabits, logs])
  const trendData = useMemo(
    () => buildTrendData(filteredHabits, logs, new Date(), rangeDays),
    [filteredHabits, logs, rangeDays],
  )
  const categoryPerformance = useMemo(
    () => buildCategoryPerformance(activeHabits, logs),
    [activeHabits, logs],
  )
  const insightCards = useMemo(() => buildInsightCards(filteredHabits, logs), [filteredHabits, logs])
  const sortedHabits = useMemo(
    () =>
      [...filteredHabits].sort(
        (left, right) => metrics[right.id].consistency30 - metrics[left.id].consistency30,
      ),
    [filteredHabits, metrics],
  )

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Insights"
        title="Turn raw habit logs into behavioral decisions"
        description="Trend lines, category performance, streak quality, and risk surfacing all live here."
        actions={
          <div className="flex flex-wrap gap-3">
            <RangeTabs onChange={setRangeDays} value={rangeDays} />
            <Select
              className="min-w-[180px]"
              value={highlightedCategory}
              onChange={(event) => setHighlightedCategory(event.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Completion trend
          </p>
          <div className="mt-6 h-[320px]">
            <ResponsiveContainer height="100%" width="100%">
              <LineChart data={trendData}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(251,244,236,0.38)" tickLine={false} axisLine={false} />
                <YAxis
                  domain={[0, 1]}
                  stroke="rgba(251,244,236,0.38)"
                  tickFormatter={(value) => `${Math.round(value * 100)}%`}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{ background: 'rgba(17,19,26,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px' }}
                  formatter={(value) => formatPercent(Number(value ?? 0))}
                />
                <Line dataKey="rate" stroke="#FF9A5A" strokeWidth={3} dot={false} type="monotone" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Coaching cards
          </p>
          <div className="mt-4 space-y-3">
            {insightCards.map((card) => (
              <Panel className="rounded-[24px] border-white/10 bg-white/4 p-4" key={card.id}>
                <div className="flex items-center justify-between gap-3">
                  <Badge tone={card.tone === 'positive' ? 'success' : card.tone === 'warning' ? 'warning' : 'default'}>
                    {card.tone}
                  </Badge>
                  <span className="font-['Fraunces'] text-2xl text-white">{card.metric}</span>
                </div>
                <p className="mt-3 text-base font-semibold text-white">{card.title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{card.explanation}</p>
              </Panel>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Category performance
          </p>
          <div className="mt-6 h-[280px]">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={categoryPerformance}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="category" stroke="rgba(251,244,236,0.38)" tickLine={false} axisLine={false} />
                <YAxis
                  domain={[0, 1]}
                  stroke="rgba(251,244,236,0.38)"
                  tickFormatter={(value) => `${Math.round(value * 100)}%`}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{ background: 'rgba(17,19,26,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px' }}
                  formatter={(value) => formatPercent(Number(value ?? 0))}
                />
                <Bar dataKey="consistency" fill="#76D6A8" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Habit leaderboard
          </p>
          <div className="mt-4 overflow-hidden rounded-[28px] border border-white/10">
            <div className="grid grid-cols-[1.5fr_repeat(4,0.8fr)] gap-3 border-b border-white/10 bg-white/4 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
              <span>Habit</span>
              <span>7d</span>
              <span>30d</span>
              <span>Streak</span>
              <span>Window</span>
            </div>
            {sortedHabits.map((habit) => (
              <div
                className="grid grid-cols-[1.5fr_repeat(4,0.8fr)] gap-3 border-b border-white/6 px-4 py-4 text-sm text-[var(--text-secondary)] last:border-b-0"
                key={habit.id}
              >
                <div>
                  <p className="font-semibold text-white">{habit.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    {habit.category}
                  </p>
                </div>
                <span>{formatPercent(metrics[habit.id].consistency7)}</span>
                <span>{formatPercent(metrics[habit.id].consistency30)}</span>
                <span>{metrics[habit.id].streak}</span>
                <span>{titleCase(metrics[habit.id].bestWindow)}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}
