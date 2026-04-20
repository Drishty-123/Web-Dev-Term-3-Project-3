import { describe, expect, it } from 'vitest'
import type { Habit, HabitLog } from '../types/models'
import { buildHabitMetrics, buildInsightCards, calculateHabitMetric } from './analytics'

const referenceDate = new Date('2026-04-20T10:00:00')

const dailyHabit: Habit = {
  id: 'habit-1',
  userId: 'user-1',
  name: 'Morning Stretch',
  description: 'Five minutes of movement.',
  category: 'Body',
  color: '#76D6A8',
  icon: 'dumbbell',
  scheduleType: 'daily',
  scheduledDays: [],
  preferredTimeSlot: 'morning',
  goalLabel: '5 min',
  cueNote: '',
  rewardNote: '',
  archived: false,
  createdAt: '2026-03-01T00:00:00Z',
}

const weeklyHabit: Habit = {
  id: 'habit-2',
  userId: 'user-1',
  name: 'Deep Work Block',
  description: 'Ninety minute focus session.',
  category: 'Focus',
  color: '#FF9A5A',
  icon: 'target',
  scheduleType: 'weekly',
  scheduledDays: [1, 3, 5],
  preferredTimeSlot: 'midday',
  goalLabel: '90 min',
  cueNote: '',
  rewardNote: '',
  archived: false,
  createdAt: '2026-03-01T00:00:00Z',
}

function makeLog(
  habitId: string,
  logDate: string,
  status: HabitLog['status'],
  completedAt: string | null,
): HabitLog {
  return {
    id: `${habitId}-${logDate}`,
    habitId,
    userId: 'user-1',
    logDate,
    status,
    completedAt,
    note: '',
    mood: 4,
    energy: 4,
    createdAt: '2026-04-20T00:00:00',
  }
}

const logs: HabitLog[] = [
  makeLog('habit-1', '2026-04-20', 'completed', '2026-04-20T08:10:00'),
  makeLog('habit-1', '2026-04-19', 'completed', '2026-04-19T08:20:00'),
  makeLog('habit-1', '2026-04-18', 'completed', '2026-04-18T08:30:00'),
  makeLog('habit-1', '2026-04-17', 'missed', null),
  makeLog('habit-1', '2026-04-16', 'completed', '2026-04-16T08:15:00'),
  makeLog('habit-1', '2026-04-15', 'completed', '2026-04-15T08:05:00'),
  makeLog('habit-1', '2026-04-14', 'completed', '2026-04-14T08:40:00'),
  makeLog('habit-1', '2026-04-13', 'missed', null),
  makeLog('habit-1', '2026-04-12', 'completed', '2026-04-12T08:20:00'),
  makeLog('habit-1', '2026-04-11', 'completed', '2026-04-11T08:45:00'),
  makeLog('habit-1', '2026-04-10', 'missed', null),
  makeLog('habit-1', '2026-04-09', 'completed', '2026-04-09T08:10:00'),
  makeLog('habit-1', '2026-04-08', 'completed', '2026-04-08T08:10:00'),
  makeLog('habit-1', '2026-04-07', 'completed', '2026-04-07T08:10:00'),
  makeLog('habit-1', '2026-04-06', 'completed', '2026-04-06T08:10:00'),
  makeLog('habit-1', '2026-04-05', 'completed', '2026-04-05T08:10:00'),
  makeLog('habit-1', '2026-04-04', 'completed', '2026-04-04T08:10:00'),
  makeLog('habit-1', '2026-04-03', 'completed', '2026-04-03T08:10:00'),
  makeLog('habit-1', '2026-04-02', 'completed', '2026-04-02T08:10:00'),
  makeLog('habit-2', '2026-04-20', 'missed', null),
  makeLog('habit-2', '2026-04-17', 'missed', null),
  makeLog('habit-2', '2026-04-15', 'missed', null),
  makeLog('habit-2', '2026-04-13', 'completed', '2026-04-13T13:00:00'),
]

describe('analytics', () => {
  it('calculates consistency, streak, and best window for a healthy habit', () => {
    const metric = calculateHabitMetric(dailyHabit, logs, referenceDate)

    expect(metric.consistency7).toBeCloseTo(6 / 7)
    expect(metric.streak).toBe(3)
    expect(metric.bestWindow).toBe('morning')
    expect(metric.riskFlag).toBe(false)
  })

  it('flags risk when the recent scheduled occurrences have no wins', () => {
    const metric = calculateHabitMetric(weeklyHabit, logs, referenceDate)

    expect(metric.riskFlag).toBe(true)
    expect(metric.bestWindow).toBe('midday')
  })

  it('builds insight cards from the habit metrics', () => {
    const metrics = buildHabitMetrics([dailyHabit, weeklyHabit], logs, referenceDate)
    const cards = buildInsightCards([dailyHabit, weeklyHabit], logs, referenceDate)

    expect(metrics['habit-1'].consistency30).toBeGreaterThan(metrics['habit-2'].consistency30)
    expect(cards.length).toBeGreaterThanOrEqual(3)
  })
})
