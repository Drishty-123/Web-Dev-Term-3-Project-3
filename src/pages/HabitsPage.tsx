import { useDeferredValue, useMemo, useState } from 'react'
import { Archive, Plus, Search, Trash2, Undo2 } from 'lucide-react'
import { DailyHabitCard } from '../components/DailyHabitCard'
import { HabitFormModal } from '../components/HabitFormModal'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { Input } from '../components/ui/Input'
import { Panel } from '../components/ui/Panel'
import { SectionHeading } from '../components/ui/SectionHeading'
import { useAppData } from '../hooks/useAppData'
import { buildHabitMetrics } from '../services/analytics'
import { toDateKey } from '../lib/utils'
import type { Habit } from '../types/models'

export function HabitsPage() {
  const { habits, logs, saveHabit, deleteHabit, saveHabitLog } = useAppData()
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const deferredQuery = useDeferredValue(query)

  const activeHabits = useMemo(() => habits.filter((habit) => !habit.archived), [habits])
  const archivedHabits = useMemo(() => habits.filter((habit) => habit.archived), [habits])
  const metrics = useMemo(() => buildHabitMetrics(activeHabits, logs), [activeHabits, logs])
  const todayKey = toDateKey(new Date())

  const filteredHabits = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase()
    if (!normalized) return activeHabits
    return activeHabits.filter((habit) =>
      [habit.name, habit.category, habit.description].some((field) =>
        field.toLowerCase().includes(normalized),
      ),
    )
  }, [activeHabits, deferredQuery])

  const openCreate = () => {
    setEditingHabit(null)
    setModalOpen(true)
  }

  const openEdit = (habit: Habit) => {
    setEditingHabit(habit)
    setModalOpen(true)
  }

  const archiveHabit = async (habit: Habit, archived: boolean) => {
    await saveHabit({
      id: habit.id,
      name: habit.name,
      description: habit.description,
      category: habit.category,
      color: habit.color,
      icon: habit.icon,
      scheduleType: habit.scheduleType,
      scheduledDays: habit.scheduledDays,
      preferredTimeSlot: habit.preferredTimeSlot,
      goalLabel: habit.goalLabel,
      cueNote: habit.cueNote,
      rewardNote: habit.rewardNote,
      archived,
    })
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Habit studio"
        title="Design routines that are easy to repeat"
        description="This is your habit system builder: create, edit, archive, delete, and log context-rich daily outcomes."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            New habit
          </Button>
        }
      />

      <Panel className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <Input
            className="pl-11"
            placeholder="Search by name, category, or behavior cue"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>{activeHabits.length} active</Badge>
          <Badge>{archivedHabits.length} archived</Badge>
        </div>
      </Panel>

      {filteredHabits.length === 0 ? (
        <EmptyState
          title="No habits match this search"
          description="Adjust the search query or create a new habit to bring your workspace to life."
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Create habit
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredHabits.map((habit) => (
            <div className="space-y-3" key={habit.id}>
              <DailyHabitCard
                habit={habit}
                metric={metrics[habit.id]}
                onEdit={() => openEdit(habit)}
                onSaveLog={saveHabitLog}
                todayLog={logs.find((log) => log.habitId === habit.id && log.logDate === todayKey)}
              />
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => void archiveHabit(habit, true)} variant="secondary">
                  <Archive className="h-4 w-4" />
                  Archive
                </Button>
                <Button onClick={() => void deleteHabit(habit.id)} variant="danger">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {archivedHabits.length > 0 ? (
        <section className="space-y-4">
          <SectionHeading
            eyebrow="Archive"
            title="Paused habits"
            description="Keep old routines accessible without letting them clutter your main execution queue."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {archivedHabits.map((habit) => (
              <Panel className="p-5" key={habit.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{habit.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{habit.description}</p>
                  </div>
                  <Badge>archived</Badge>
                </div>
                <div className="mt-5 flex gap-3">
                  <Button onClick={() => void archiveHabit(habit, false)} variant="secondary">
                    <Undo2 className="h-4 w-4" />
                    Restore
                  </Button>
                  <Button onClick={() => void deleteHabit(habit.id)} variant="danger">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </Panel>
            ))}
          </div>
        </section>
      ) : null}

      <HabitFormModal
        habit={editingHabit}
        onClose={() => setModalOpen(false)}
        onSave={saveHabit}
        open={modalOpen}
      />
    </div>
  )
}
