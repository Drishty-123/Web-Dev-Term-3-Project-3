import { useEffect, useState } from 'react'
import type { Reflection, ReflectionDraft } from '../types/models'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Panel } from './ui/Panel'
import { TextArea } from './ui/TextArea'

export function ReflectionComposer({
  reflection,
  onSave,
  onDelete,
}: {
  reflection?: Reflection
  onSave: (draft: ReflectionDraft) => Promise<void>
  onDelete?: (reflectionId: string) => Promise<void>
}) {
  const [draft, setDraft] = useState<ReflectionDraft>({
    reflectionDate: new Date().toISOString().slice(0, 10),
    wins: '',
    blockers: '',
    notes: '',
  })

  useEffect(() => {
    if (!reflection) return
    setDraft({
      id: reflection.id,
      reflectionDate: reflection.reflectionDate,
      wins: reflection.wins,
      blockers: reflection.blockers,
      notes: reflection.notes,
    })
  }, [reflection])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSave(draft)
  }

  return (
    <Panel className="p-6">
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-[220px_1fr]">
          <label className="space-y-2">
            <span className="text-sm text-[var(--text-secondary)]">Reflection date</span>
            <Input
              type="date"
              value={draft.reflectionDate}
              onChange={(event) => setDraft({ ...draft, reflectionDate: event.target.value })}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-[var(--text-secondary)]">Today's wins</span>
            <Input
              value={draft.wins}
              onChange={(event) => setDraft({ ...draft, wins: event.target.value })}
              placeholder="Finished my focus block before lunch."
            />
          </label>
        </div>
        <label className="space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Blockers</span>
          <Input
            value={draft.blockers}
            onChange={(event) => setDraft({ ...draft, blockers: event.target.value })}
            placeholder="Phone drift after 4 PM."
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Notes</span>
          <TextArea
            value={draft.notes}
            onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
            placeholder="What pattern do you want to remember tomorrow?"
          />
        </label>
        <div className="flex flex-wrap gap-3">
          <Button type="submit">{reflection ? 'Update reflection' : 'Save reflection'}</Button>
          {reflection && onDelete ? (
            <Button variant="danger" onClick={() => void onDelete(reflection.id)}>
              Delete reflection
            </Button>
          ) : null}
        </div>
      </form>
    </Panel>
  )
}
