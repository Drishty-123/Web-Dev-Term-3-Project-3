import { useEffect, useRef, useState } from 'react'
import {
  categoryOptions,
  colorOptions,
  iconOptions,
  timeSlotOptions,
  weekdayLabels,
} from '../constants/habits'
import type { Habit, HabitDraft } from '../types/models'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Modal } from './ui/Modal'
import { Select } from './ui/Select'
import { TextArea } from './ui/TextArea'

const defaultDraft: HabitDraft = {
  name: '',
  description: '',
  category: categoryOptions[0],
  color: colorOptions[0],
  icon: iconOptions[0],
  scheduleType: 'daily',
  scheduledDays: [],
  preferredTimeSlot: 'morning',
  goalLabel: '',
  cueNote: '',
  rewardNote: '',
}

export function HabitFormModal({
  open,
  habit,
  onClose,
  onSave,
}: {
  open: boolean
  habit?: Habit | null
  onClose: () => void
  onSave: (draft: HabitDraft) => Promise<void>
}) {
  const nameRef = useRef<HTMLInputElement | null>(null)
  const [draft, setDraft] = useState<HabitDraft>(defaultDraft)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setDraft(
      habit
        ? {
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
            archived: habit.archived,
          }
        : defaultDraft,
    )
    requestAnimationFrame(() => nameRef.current?.focus())
  }, [habit, open])

  const toggleDay = (day: number) => {
    setDraft((current) => ({
      ...current,
      scheduledDays: current.scheduledDays.includes(day)
        ? current.scheduledDays.filter((entry) => entry !== day)
        : current.scheduledDays.concat(day).sort(),
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    try {
      await onSave({
        ...draft,
        scheduledDays: draft.scheduleType === 'daily' ? [] : draft.scheduledDays,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      title={habit ? 'Tune this habit' : 'Create a new habit'}
      description="Design the cue, the time slot, and the reward so your insights stay actionable."
      onClose={onClose}
    >
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm text-[var(--text-secondary)]">Habit name</span>
          <Input
            ref={nameRef}
            value={draft.name}
            onChange={(event) => setDraft({ ...draft, name: event.target.value })}
            placeholder="Evening shutdown"
            required
          />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm text-[var(--text-secondary)]">Description</span>
          <TextArea
            value={draft.description}
            onChange={(event) => setDraft({ ...draft, description: event.target.value })}
            placeholder="Close open loops and set tomorrow's top priority."
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Category</span>
          <Select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Time slot</span>
          <Select
            value={draft.preferredTimeSlot}
            onChange={(event) =>
              setDraft({ ...draft, preferredTimeSlot: event.target.value as HabitDraft['preferredTimeSlot'] })
            }
          >
            {timeSlotOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Icon</span>
          <Select value={draft.icon} onChange={(event) => setDraft({ ...draft, icon: event.target.value })}>
            {iconOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Schedule</span>
          <Select
            value={draft.scheduleType}
            onChange={(event) =>
              setDraft({ ...draft, scheduleType: event.target.value as HabitDraft['scheduleType'] })
            }
          >
            <option value="daily">Daily</option>
            <option value="weekly">Custom weekdays</option>
          </Select>
        </label>
        <div className="space-y-2 md:col-span-2">
          <span className="text-sm text-[var(--text-secondary)]">Color accent</span>
          <div className="flex flex-wrap gap-3">
            {colorOptions.map((color) => (
              <button
                key={color}
                className={`h-10 w-10 rounded-full border-2 transition ${draft.color === color ? 'border-white scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: color }}
                onClick={() => setDraft({ ...draft, color })}
                type="button"
              />
            ))}
          </div>
        </div>
        {draft.scheduleType === 'weekly' ? (
          <div className="space-y-2 md:col-span-2">
            <span className="text-sm text-[var(--text-secondary)]">Scheduled days</span>
            <div className="flex flex-wrap gap-2">
              {weekdayLabels.map((label, index) => (
                <button
                  key={label}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    draft.scheduledDays.includes(index)
                      ? 'bg-[var(--accent)] text-slate-950'
                      : 'border border-white/12 bg-white/6 text-[var(--text-secondary)]'
                  }`}
                  onClick={() => toggleDay(index)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <label className="space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Goal label</span>
          <Input
            value={draft.goalLabel}
            onChange={(event) => setDraft({ ...draft, goalLabel: event.target.value })}
            placeholder="45 minute block"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Cue note</span>
          <Input
            value={draft.cueNote}
            onChange={(event) => setDraft({ ...draft, cueNote: event.target.value })}
            placeholder="Do it right after coffee."
          />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm text-[var(--text-secondary)]">Reward note</span>
          <Input
            value={draft.rewardNote}
            onChange={(event) => setDraft({ ...draft, rewardNote: event.target.value })}
            placeholder="Enjoy the calm after the streak."
          />
        </label>
        <div className="flex justify-end gap-3 md:col-span-2">
          <Button onClick={onClose} variant="ghost">
            Cancel
          </Button>
          <Button disabled={saving} type="submit">
            {saving ? 'Saving...' : habit ? 'Update habit' : 'Create habit'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
