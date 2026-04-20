import { format, parseISO, subDays } from 'date-fns'
import type {
  Habit,
  HabitLog,
  HabitMetric,
  InsightCard,
  PreferredTimeSlot,
} from '../types/models'
import { formatPercent } from '../lib/utils'

export interface TrendPoint {
  date: string
  completed: number
  scheduled: number
  rate: number
}

export interface HeatmapPoint {
  date: string
  count: number
  total: number
  intensity: number
}

export interface CategoryPoint {
  category: string
  consistency: number
}

export function isHabitScheduledOnDate(habit: Habit, dateKey: string) {
  if (habit.archived) return false
  if (habit.scheduleType === 'daily') return true
  const weekday = parseISO(dateKey).getDay()
  return habit.scheduledDays.includes(weekday)
}

export function getWindowFromTimestamp(value: string | null): PreferredTimeSlot {
  if (!value) return 'anytime'
  const hour = new Date(value).getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'midday'
  if (hour < 22) return 'evening'
  return 'anytime'
}

export function getLogsForHabit(logs: HabitLog[], habitId: string) {
  return logs.filter((log) => log.habitId === habitId)
}

export function calculateHabitMetric(
  habit: Habit,
  logs: HabitLog[],
  referenceDate = new Date(),
): HabitMetric {
  const referenceKey = format(referenceDate, 'yyyy-MM-dd')
  const habitLogs = getLogsForHabit(logs, habit.id)

  const buildWindowStats = (startIndex: number, days: number) => {
    let scheduled = 0
    let completed = 0
    for (let index = startIndex; index < startIndex + days; index += 1) {
      const dayKey = format(subDays(referenceDate, index), 'yyyy-MM-dd')
      if (!isHabitScheduledOnDate(habit, dayKey)) continue
      scheduled += 1
      const log = habitLogs.find((entry) => entry.logDate === dayKey)
      if (log?.status === 'completed') completed += 1
    }
    return { scheduled, completed, rate: scheduled === 0 ? 0 : completed / scheduled }
  }

  const current7 = buildWindowStats(0, 7)
  const previous7 = buildWindowStats(7, 7)
  const current30 = buildWindowStats(0, 30)

  let streak = 0
  for (let index = 0; index < 90; index += 1) {
    const dayKey = format(subDays(referenceDate, index), 'yyyy-MM-dd')
    if (!isHabitScheduledOnDate(habit, dayKey)) continue
    const log = habitLogs.find((entry) => entry.logDate === dayKey)
    if (log?.status === 'completed') {
      streak += 1
      continue
    }
    if (dayKey <= referenceKey) break
  }

  const recentScheduledKeys: string[] = []
  for (let index = 0; index < 21 && recentScheduledKeys.length < 3; index += 1) {
    const dayKey = format(subDays(referenceDate, index), 'yyyy-MM-dd')
    if (isHabitScheduledOnDate(habit, dayKey)) {
      recentScheduledKeys.push(dayKey)
    }
  }

  const noWinsAcrossRecent = recentScheduledKeys.every((dayKey) => {
    const log = habitLogs.find((entry) => entry.logDate === dayKey)
    return log?.status !== 'completed'
  })

  const completionWindows = habitLogs
    .filter((entry) => entry.status === 'completed')
    .map((entry) => getWindowFromTimestamp(entry.completedAt))

  const windowCounts = completionWindows.reduce<Record<PreferredTimeSlot, number>>(
    (accumulator, slot) => {
      accumulator[slot] += 1
      return accumulator
    },
    {
      morning: 0,
      midday: 0,
      evening: 0,
      anytime: 0,
    },
  )

  const bestWindow = Object.entries(windowCounts).sort((left, right) => right[1] - left[1])[0]?.[0]

  return {
    habitId: habit.id,
    consistency7: current7.rate,
    consistency30: current30.rate,
    streak,
    momentum: current7.rate - previous7.rate,
    bestWindow: (bestWindow as PreferredTimeSlot | undefined) ?? habit.preferredTimeSlot,
    riskFlag: noWinsAcrossRecent || current30.rate < 0.5,
  }
}

export function buildHabitMetrics(
  habits: Habit[],
  logs: HabitLog[],
  referenceDate = new Date(),
) {
  return habits.reduce<Record<string, HabitMetric>>((accumulator, habit) => {
    accumulator[habit.id] = calculateHabitMetric(habit, logs, referenceDate)
    return accumulator
  }, {})
}

export function buildInsightCards(
  habits: Habit[],
  logs: HabitLog[],
  referenceDate = new Date(),
): InsightCard[] {
  const activeHabits = habits.filter((habit) => !habit.archived)
  const metrics = buildHabitMetrics(activeHabits, logs, referenceDate)

  if (activeHabits.length === 0) {
    return [
      {
        id: 'empty-state',
        title: 'No habits yet',
        tone: 'neutral',
        metric: '0 active habits',
        explanation: 'Create your first ritual to unlock streaks, heatmaps, and coaching.',
        actionLabel: 'Create a habit',
      },
    ]
  }

  const strongestHabit = [...activeHabits].sort(
    (left, right) => metrics[right.id].consistency30 - metrics[left.id].consistency30,
  )[0]
  const atRiskHabit = activeHabits.find((habit) => metrics[habit.id].riskFlag)
  const momentumHabit = [...activeHabits].sort(
    (left, right) => metrics[right.id].momentum - metrics[left.id].momentum,
  )[0]
  const bestWindowHabit = [...activeHabits].sort(
    (left, right) => metrics[right.id].streak - metrics[left.id].streak,
  )[0]

  const cards: InsightCard[] = [
    {
      id: 'strongest-habit',
      title: `${strongestHabit.name} is your anchor`,
      tone: 'positive',
      metric: formatPercent(metrics[strongestHabit.id].consistency30),
      explanation: 'This routine is your most reliable behavior over the last 30 days.',
      actionLabel: 'Protect this pattern',
    },
    {
      id: 'momentum-signal',
      title: `${momentumHabit.name} is trending ${metrics[momentumHabit.id].momentum >= 0 ? 'up' : 'down'}`,
      tone: metrics[momentumHabit.id].momentum >= 0 ? 'positive' : 'warning',
      metric: formatPercent(Math.abs(metrics[momentumHabit.id].momentum)),
      explanation: 'Momentum compares this week to the previous week and surfaces direction, not just totals.',
      actionLabel: 'Review this week',
    },
    {
      id: 'timing-fit',
      title: `${bestWindowHabit.name} wins in the ${metrics[bestWindowHabit.id].bestWindow}`,
      tone: 'neutral',
      metric: `${metrics[bestWindowHabit.id].streak} streak`,
      explanation: 'Timing patterns help you slot fragile habits into hours where they naturally stick.',
      actionLabel: 'Keep the same cue',
    },
  ]

  if (atRiskHabit) {
    cards.push({
      id: 'risk-alert',
      title: `${atRiskHabit.name} needs a reset`,
      tone: 'warning',
      metric: formatPercent(metrics[atRiskHabit.id].consistency30),
      explanation: 'Three scheduled misses without a win usually signal friction in the cue, timing, or scope.',
      actionLabel: 'Reduce the goal for 3 days',
    })
  }

  return cards
}

export function buildHeatmapData(
  habits: Habit[],
  logs: HabitLog[],
  referenceDate = new Date(),
  days = 84,
): HeatmapPoint[] {
  const points: HeatmapPoint[] = []
  for (let index = days - 1; index >= 0; index -= 1) {
    const day = subDays(referenceDate, index)
    const dateKey = format(day, 'yyyy-MM-dd')
    const scheduled = habits.filter((habit) => isHabitScheduledOnDate(habit, dateKey)).length
    const completed = logs.filter(
      (entry) => entry.logDate === dateKey && entry.status === 'completed',
    ).length
    const ratio = scheduled === 0 ? 0 : completed / scheduled
    points.push({
      date: dateKey,
      total: scheduled,
      count: completed,
      intensity: ratio === 0 ? 0 : ratio < 0.35 ? 1 : ratio < 0.65 ? 2 : ratio < 0.95 ? 3 : 4,
    })
  }
  return points
}

export function buildTrendData(
  habits: Habit[],
  logs: HabitLog[],
  referenceDate = new Date(),
  days = 30,
): TrendPoint[] {
  const points: TrendPoint[] = []
  for (let index = days - 1; index >= 0; index -= 1) {
    const day = subDays(referenceDate, index)
    const dateKey = format(day, 'yyyy-MM-dd')
    const scheduled = habits.filter((habit) => isHabitScheduledOnDate(habit, dateKey)).length
    const completed = logs.filter(
      (entry) => entry.logDate === dateKey && entry.status === 'completed',
    ).length
    points.push({
      date: format(day, 'dd MMM'),
      completed,
      scheduled,
      rate: scheduled === 0 ? 0 : completed / scheduled,
    })
  }
  return points
}

export function buildCategoryPerformance(
  habits: Habit[],
  logs: HabitLog[],
  referenceDate = new Date(),
): CategoryPoint[] {
  const grouped = habits.reduce<Record<string, Habit[]>>((accumulator, habit) => {
    accumulator[habit.category] ??= []
    accumulator[habit.category].push(habit)
    return accumulator
  }, {})

  return Object.entries(grouped)
    .map(([category, categoryHabits]) => ({
      category,
      consistency:
        categoryHabits.reduce(
          (sum, habit) => sum + calculateHabitMetric(habit, logs, referenceDate).consistency30,
          0,
        ) / categoryHabits.length,
    }))
    .sort((left, right) => right.consistency - left.consistency)
}

export function buildTodaySummary(
  habits: Habit[],
  logs: HabitLog[],
  referenceDate = new Date(),
) {
  const dateKey = format(referenceDate, 'yyyy-MM-dd')
  const activeHabits = habits.filter((habit) => !habit.archived)
  const scheduledToday = activeHabits.filter((habit) => isHabitScheduledOnDate(habit, dateKey))
  const completedToday = logs.filter(
    (entry) => entry.logDate === dateKey && entry.status === 'completed',
  )

  const metrics = buildHabitMetrics(activeHabits, logs, referenceDate)
  const atRiskCount = activeHabits.filter((habit) => metrics[habit.id].riskFlag).length
  const totalStreak = activeHabits.reduce((sum, habit) => sum + metrics[habit.id].streak, 0)
  const bestHabit =
    [...activeHabits].sort(
      (left, right) => metrics[right.id].consistency30 - metrics[left.id].consistency30,
    )[0] ?? null

  return {
    scheduledToday: scheduledToday.length,
    completedToday: completedToday.length,
    completionRate: scheduledToday.length === 0 ? 0 : completedToday.length / scheduledToday.length,
    atRiskCount,
    totalStreak,
    bestHabit,
  }
}

export function seedDemoHistory(habits: Habit[], userId: string, referenceDate = new Date()) {
  return habits.flatMap((habit, habitIndex) => {
    const entries: HabitLog[] = []
    for (let index = 42; index >= 1; index -= 1) {
      const day = subDays(referenceDate, index)
      const dateKey = format(day, 'yyyy-MM-dd')
      if (!isHabitScheduledOnDate(habit, dateKey)) continue
      const hitThreshold = (index + habitIndex * 2) % 5
      const status = hitThreshold === 0 ? 'missed' : 'completed'
      const completionHour = 8 + (habitIndex % 3) * 4
      entries.push({
        id: `${habit.id}-${dateKey}`,
        habitId: habit.id,
        userId,
        logDate: dateKey,
        status,
        completedAt:
          status === 'completed'
            ? new Date(`${dateKey}T${String(completionHour).padStart(2, '0')}:15:00`).toISOString()
            : null,
        note: '',
        mood: 3 + ((habitIndex + index) % 3),
        energy: 2 + ((habitIndex + index) % 4),
        createdAt: new Date().toISOString(),
      })
    }
    return entries
  })
}
