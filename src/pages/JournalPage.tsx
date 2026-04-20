import { useMemo, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { ReflectionComposer } from '../components/ReflectionComposer'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { Panel } from '../components/ui/Panel'
import { SectionHeading } from '../components/ui/SectionHeading'
import { useAppData } from '../hooks/useAppData'
import type { Reflection } from '../types/models'

export function JournalPage() {
  const { reflections, saveReflection, deleteReflection } = useAppData()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const sortedReflections = useMemo(
    () => [...reflections].sort((left, right) => right.reflectionDate.localeCompare(left.reflectionDate)),
    [reflections],
  )
  const selectedReflection = useMemo<Reflection | undefined>(
    () => sortedReflections.find((reflection) => reflection.id === selectedId) ?? sortedReflections[0],
    [selectedId, sortedReflections],
  )

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Journal"
        title="Capture the story behind the streak"
        description="Reflections add meaning to your data. Record what worked, what broke, and what to try tomorrow."
      />

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <ReflectionComposer
          onDelete={deleteReflection}
          onSave={saveReflection}
          reflection={selectedReflection}
        />

        <div className="space-y-4">
          <Panel className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/8 p-3 text-[var(--accent)]">
                <CalendarDays className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{sortedReflections.length} reflections saved</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  Use these notes to connect your analytics with real-world context.
                </p>
              </div>
            </div>
          </Panel>

          {sortedReflections.length === 0 ? (
            <EmptyState
              title="No reflections yet"
              description="Add one short reflection after today’s check-ins and the journal becomes a memory layer for your habit data."
            />
          ) : (
            sortedReflections.map((reflection) => (
              <Panel
                className={`cursor-pointer p-5 transition ${selectedReflection?.id === reflection.id ? 'border-[var(--accent)]/24 bg-white/8' : 'hover:bg-white/6'}`}
                key={reflection.id}
                onClick={() => setSelectedId(reflection.id)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{reflection.reflectionDate}</p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">{reflection.wins || 'No wins added'}</p>
                  </div>
                  <Badge>{selectedReflection?.id === reflection.id ? 'editing' : 'saved'}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                  {reflection.notes || reflection.blockers || 'Open this reflection to add more context.'}
                </p>
              </Panel>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
