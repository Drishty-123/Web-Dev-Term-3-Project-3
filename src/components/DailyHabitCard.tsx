import { useEffect, useState } from 'react'
import { CalendarClock, Flame, PencilLine } from 'lucide-react'
import { habitIconMap } from '../lib/habitIcons'
import { formatPercent, titleCase } from '../lib/utils'
import type { Habit, HabitLog, HabitLogDraft, HabitMetric } from '../types/models'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Panel } from './ui/Panel'

interface DailyHabitCardProps {
  habit: Habit
  metric: HabitMetric
  todayLog?: HabitLog
  onSaveLog: (draft: HabitLogDraft) => Promise<void>
  onEdit: () => void
}

export function DailyHabitCard({
  habit,
  metric,
  todayLog,
  onSaveLog,
  onEdit,
}: DailyHabitCardProps) {
  const Icon = habitIconMap[habit.icon] ?? habitIconMap.sparkles
  const [note, setNote] = useState(todayLog?.note ?? '')
  const [mood, setMood] = useState(todayLog?.mood ?? 3)
  const [energy, setEnergy] = useState(todayLog?.energy ?? 3)

  useEffect(() => {
    setNote(todayLog?.note ?? '')
    setMood(todayLog?.mood ?? 3)
    setEnergy(todayLog?.energy ?? 3)
  }, [todayLog])

  const submitLog = async (status: HabitLogDraft['status']) => {
    await onSaveLog({
      habitId: habit.id,
      logDate: new Date().toISOString().slice(0, 10),
      status,
      note,
      mood,
      energy,
    })
  }

  return (
    <Panel className="flex h-full flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${habit.color}22`, color: habit.color }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-white">{habit.name}</h3>
              {todayLog ? (
                <Badge tone={todayLog.status === 'completed' ? 'success' : todayLog.status === 'missed' ? 'warning' : 'default'}>
                  {todayLog.status}
                </Badge>
              ) : null}
            </div>
            <p className="text-sm leading-6 text-[var(--text-secondary)]">{habit.description}</p>
            <div className="flex flex-wrap gap-2">
              <Badge>{habit.category}</Badge>
              <Badge>{titleCase(habit.preferredTimeSlot)}</Badge>
              <Badge>{habit.goalLabel || 'Flexible goal'}</Badge>
            </div>
          </div>
        </div>
        <Button onClick={onEdit} variant="ghost">
          <PencilLine className="h-4 w-4" />
          Edit
        </Button>
      </div>

      <div className="grid gap-3 text-sm text-[var(--text-secondary)] md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/4 p-3">
          <div className="flex items-center gap-2 text-white">
            <Flame className="h-4 w-4 text-[var(--accent)]" />
            <span>{metric.streak} streak</span>
          </div>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
            30-day {formatPercent(metric.consistency30)}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/4 p-3">
          <div className="flex items-center gap-2 text-white">
            <CalendarClock className="h-4 w-4 text-[var(--accent)]" />
            <span>{titleCase(metric.bestWindow)}</span>
          </div>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Best completion window
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/4 p-3">
          <div className="flex items-center gap-2 text-white">
            <span className={metric.riskFlag ? 'text-amber-200' : 'text-emerald-200'}>
              {metric.riskFlag ? 'Needs support' : 'Healthy pattern'}
            </span>
          </div>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Momentum {formatPercent(Math.abs(metric.momentum))}
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Today's note
          </span>
          <Input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="What helped or got in the way?"
          />
        </label>
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Mood {mood}/5
          </span>
          <Input
            max={5}
            min={1}
            type="range"
            value={mood}
            onChange={(event) => setMood(Number(event.target.value))}
          />
        </label>
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Energy {energy}/5
          </span>
          <Input
            max={5}
            min={1}
            type="range"
            value={energy}
            onChange={(event) => setEnergy(Number(event.target.value))}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => void submitLog('completed')}>Mark complete</Button>
        <Button onClick={() => void submitLog('missed')} variant="secondary">
          Mark missed
        </Button>
        <Button onClick={() => void submitLog('skipped')} variant="ghost">
          Skip for today
        </Button>
      </div>
    </Panel>
  )
}
