import { useState } from 'react'
import { starterPackOptions, type StarterPackId } from '../constants/habits'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Panel } from './ui/Panel'
import { Select } from './ui/Select'

interface OnboardingPanelProps {
  defaultName: string
  onFinish: (payload: { fullName: string; timezone: string; packId: StarterPackId }) => Promise<void>
}

export function OnboardingPanel({ defaultName, onFinish }: OnboardingPanelProps) {
  const [fullName, setFullName] = useState(defaultName)
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [packId, setPackId] = useState<StarterPackId>('balanced-reset')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    try {
      await onFinish({ fullName, timezone, packId })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Panel className="relative overflow-hidden border-[var(--accent)]/16 bg-[linear-gradient(135deg,rgba(255,154,90,0.12),rgba(255,255,255,0.02))] p-6 md:p-8">
      <div className="hero-orb hero-orb--amber -right-6 top-0 h-32 w-32" />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
          First-run setup
        </p>
        <h3 className="mt-3 font-['Fraunces'] text-4xl text-white">Shape the routine around you</h3>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
          Pick a starting pack, set your timezone, and HabitPulse will seed a polished workspace with insights-ready history.
        </p>
      </div>

      <form className="relative mt-8 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <label className="space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Full name</span>
          <Input value={fullName} onChange={(event) => setFullName(event.target.value)} required />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Timezone</span>
          <Input value={timezone} onChange={(event) => setTimezone(event.target.value)} required />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm text-[var(--text-secondary)]">Starter pack</span>
          <Select value={packId} onChange={(event) => setPackId(event.target.value as StarterPackId)}>
            {starterPackOptions.map((pack) => (
              <option key={pack.id} value={pack.id}>
                {pack.title} — {pack.description}
              </option>
            ))}
          </Select>
        </label>
        <div className="md:col-span-2">
          <Button disabled={saving} size="lg" type="submit">
            {saving ? 'Preparing your workspace...' : 'Launch my dashboard'}
          </Button>
        </div>
      </form>
    </Panel>
  )
}
