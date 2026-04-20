import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AlertTriangle, Flame, Sparkles, Target, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ActivityHeatmap } from '../components/ActivityHeatmap'
import { DailyHabitCard } from '../components/DailyHabitCard'
import { InsightCardBlock } from '../components/InsightCardBlock'
import { OnboardingPanel } from '../components/OnboardingPanel'
import { RangeTabs } from '../components/RangeTabs'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { InlineNotice } from '../components/ui/InlineNotice'
import { Panel } from '../components/ui/Panel'
import { SectionHeading } from '../components/ui/SectionHeading'
import { StatCard } from '../components/ui/StatCard'
import { useAppData } from '../hooks/useAppData'
import { useAuth } from '../hooks/useAuth'
import { useDashboardPreferences } from '../hooks/useDashboardPreferences'
import {
  buildHabitMetrics,
  buildHeatmapData,
  buildInsightCards,
  buildTodaySummary,
  buildTrendData,
  isHabitScheduledOnDate,
} from '../services/analytics'
import { formatPercent, toDateKey } from '../lib/utils'

export function DashboardPage() {
  const navigate = useNavigate()
  const { habits, logs, loading, error, saveHabitLog, seedStarterPack } = useAppData()
  const { profile, updateProfile } = useAuth()
  const { rangeDays, setRangeDays } = useDashboardPreferences()

  const activeHabits = useMemo(() => habits.filter((habit) => !habit.archived), [habits])
  const todayKey = toDateKey(new Date())

  const metrics = useMemo(() => buildHabitMetrics(activeHabits, logs), [activeHabits, logs])
  const summary = useMemo(() => buildTodaySummary(activeHabits, logs), [activeHabits, logs])
  const insightCards = useMemo(() => buildInsightCards(activeHabits, logs), [activeHabits, logs])
  const heatmap = useMemo(() => buildHeatmapData(activeHabits, logs), [activeHabits, logs])
  const trendData = useMemo(
    () => buildTrendData(activeHabits, logs, new Date(), rangeDays),
    [activeHabits, logs, rangeDays],
  )
  const todayHabits = useMemo(
    () =>
      activeHabits
        .filter((habit) => isHabitScheduledOnDate(habit, todayKey))
        .sort((left, right) => Number(metrics[right.id]?.riskFlag) - Number(metrics[left.id]?.riskFlag)),
    [activeHabits, metrics, todayKey],
  )

  const handleOnboarding = async ({
    fullName,
    timezone,
    packId,
  }: {
    fullName: string
    timezone: string
    packId: 'balanced-reset' | 'deep-focus' | 'mind-body'
  }) => {
    await updateProfile({
      fullName,
      timezone,
      onboardingCompleted: true,
      avatarUrl: null,
    })
    await seedStarterPack(packId)
  }

  return (
    <div className="space-y-6">
      {!profile?.onboardingCompleted ? (
        <OnboardingPanel defaultName={profile?.fullName ?? ''} onFinish={handleOnboarding} />
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel className="overflow-hidden p-6 md:p-8">
          <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 18 }}>
            <Badge tone="success">Today pulse</Badge>
            <h1 className="mt-4 font-['Fraunces'] text-4xl leading-tight text-white md:text-6xl">
              {summary.completedToday}/{summary.scheduledToday || 0} habits completed today.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
              HabitPulse reads your daily behavior, not just your streak count. The dashboard highlights what is stable, what is fragile, and what deserves a smaller next step.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Badge>{formatPercent(summary.completionRate)} completion rate</Badge>
              <Badge>{summary.totalStreak} total streak days</Badge>
              <Badge tone={summary.atRiskCount > 0 ? 'warning' : 'success'}>
                {summary.atRiskCount} at-risk habits
              </Badge>
            </div>
          </motion.div>
        </Panel>

        <Panel className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Focus card
          </p>
          <h2 className="mt-4 font-['Fraunces'] text-3xl text-white">
            {summary.bestHabit ? summary.bestHabit.name : 'Create your first habit'}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
            {summary.bestHabit
              ? `${summary.bestHabit.name} is your strongest 30-day anchor. Keep its cue simple and protect the time slot that already works.`
              : 'Start with one tiny action you can repeat every day. The dashboard becomes more useful once it has a pattern to analyze.'}
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-1">
            {insightCards.slice(0, 2).map((card) => (
              <InsightCardBlock insight={card} key={card.id} />
            ))}
          </div>
        </Panel>
      </section>

      {error ? (
        <InlineNotice tone="danger">{error}</InlineNotice>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          description="Share of scheduled habits completed today."
          icon={<Target className="h-4 w-4" />}
          label="Completion"
          value={formatPercent(summary.completionRate)}
        />
        <StatCard
          description="Combined streak length across active habits."
          icon={<Flame className="h-4 w-4" />}
          label="Streak energy"
          value={String(summary.totalStreak)}
        />
        <StatCard
          description="Habits needing a gentler cue or smaller next step."
          icon={<AlertTriangle className="h-4 w-4" />}
          label="At risk"
          value={String(summary.atRiskCount)}
        />
        <StatCard
          description="The app compares current vs previous week to expose direction."
          icon={<TrendingUp className="h-4 w-4" />}
          label="Insight mode"
          value={rangeDays === 7 ? 'Fast' : rangeDays === 30 ? 'Balanced' : 'Deep'}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel className="p-6">
          <SectionHeading
            eyebrow="Trend"
            title="Consistency over time"
            description="A clean view of scheduled versus completed habits across the selected window."
            actions={<RangeTabs onChange={setRangeDays} value={rangeDays} />}
          />
          <div className="mt-6 h-[280px]">
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="rateFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#FF9A5A" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#FF9A5A" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Area
                  dataKey="rate"
                  stroke="#FF9A5A"
                  fill="url(#rateFill)"
                  strokeWidth={3}
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <div className="grid gap-4">
          {insightCards.slice(2).map((card) => (
            <InsightCardBlock insight={card} key={card.id} />
          ))}
          {insightCards.length <= 2 ? (
            <Panel className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/8 p-3 text-[var(--accent)]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">More signals unlock as you log habits</p>
                  <p className="text-sm text-[var(--text-secondary)]">A few days of data is enough to start revealing timing patterns.</p>
                </div>
              </div>
            </Panel>
          ) : null}
        </div>
      </section>

      <ActivityHeatmap points={heatmap} />

      <section className="space-y-4">
        <SectionHeading
          eyebrow="Today"
          title="Quick complete queue"
          description="Capture completion, misses, and the context behind each result without leaving the main dashboard."
        />
        {loading ? (
          <InlineNotice>Loading your habit workspace...</InlineNotice>
        ) : todayHabits.length === 0 ? (
          <EmptyState
            title="No habits are scheduled for today"
            description="Create a habit or adjust a weekly schedule to bring today’s queue to life."
          />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {todayHabits.map((habit) => (
              <DailyHabitCard
                habit={habit}
                key={habit.id}
                metric={metrics[habit.id]}
                onEdit={() => navigate('/habits')}
                onSaveLog={saveHabitLog}
                todayLog={logs.find((log) => log.habitId === habit.id && log.logDate === todayKey)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
