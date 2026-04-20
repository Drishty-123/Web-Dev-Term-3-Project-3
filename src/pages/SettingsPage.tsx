import { useState } from 'react'
import { Database, Rocket, UserRound } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { InlineNotice } from '../components/ui/InlineNotice'
import { Input } from '../components/ui/Input'
import { Panel } from '../components/ui/Panel'
import { SectionHeading } from '../components/ui/SectionHeading'
import { useAppData } from '../hooks/useAppData'
import { useAuth } from '../hooks/useAuth'

export function SettingsPage() {
  const { profile, updateProfile, mode } = useAuth()
  const { habits, reflections } = useAppData()
  const [fullName, setFullName] = useState(profile?.fullName ?? '')
  const [timezone, setTimezone] = useState(profile?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    try {
      await updateProfile({
        fullName,
        timezone,
        onboardingCompleted: profile?.onboardingCompleted ?? true,
        avatarUrl: profile?.avatarUrl ?? null,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Settings"
        title="Profile, backend status, and submission readiness"
        description="Keep the user profile current and verify the project setup before deployment or demo recording."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Panel className="p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-white/8 p-3 text-[var(--accent)]">
              <UserRound className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Profile</p>
              <p className="font-semibold text-white">{profile?.fullName}</p>
            </div>
          </div>
        </Panel>
        <Panel className="p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-white/8 p-3 text-[var(--accent)]">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Backend mode</p>
              <p className="font-semibold text-white">{mode}</p>
            </div>
          </div>
        </Panel>
        <Panel className="p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-white/8 p-3 text-[var(--accent)]">
              <Rocket className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Workspace content</p>
              <p className="font-semibold text-white">
                {habits.length} habits • {reflections.length} reflections
              </p>
            </div>
          </div>
        </Panel>
      </div>

      {mode === 'demo' ? (
        <InlineNotice tone="warning">
          Supabase keys are not set yet, so HabitPulse is running in demo fallback mode. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to use live auth and database persistence.
        </InlineNotice>
      ) : (
        <InlineNotice tone="success">
          Supabase is configured. Protected routes, auth persistence, and personal habit data are ready for deployment.
        </InlineNotice>
      )}

      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <Panel className="p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm text-[var(--text-secondary)]">Full name</span>
              <Input value={fullName} onChange={(event) => setFullName(event.target.value)} />
            </label>
            <label className="block space-y-2">
              <span className="text-sm text-[var(--text-secondary)]">Timezone</span>
              <Input value={timezone} onChange={(event) => setTimezone(event.target.value)} />
            </label>
            <Button disabled={saving} type="submit">
              {saving ? 'Saving...' : 'Save profile'}
            </Button>
          </form>
        </Panel>

        <Panel className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Demo checklist
          </p>
          <div className="mt-4 space-y-4 text-sm leading-6 text-[var(--text-secondary)]">
            <div>
              <p className="font-semibold text-white">1. Back-end setup</p>
              <p>Create the Supabase project, run the schema file, and add the two environment variables.</p>
            </div>
            <div>
              <p className="font-semibold text-white">2. Product walkthrough</p>
              <p>Record auth, onboarding, habit CRUD, daily logging, insights, and journal edits in the demo video.</p>
            </div>
            <div>
              <p className="font-semibold text-white">3. Deployment</p>
              <p>Deploy to Vercel or Netlify with the same environment variables so protected routes and persistence work live.</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Badge>README ready</Badge>
            <Badge>Schema included</Badge>
            <Badge>Production build supported</Badge>
          </div>
        </Panel>
      </div>
    </div>
  )
}
