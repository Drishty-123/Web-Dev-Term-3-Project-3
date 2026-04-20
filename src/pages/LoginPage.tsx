import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { InlineNotice } from '../components/ui/InlineNotice'
import { Input } from '../components/ui/Input'
import { Panel } from '../components/ui/Panel'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, loading, error, clearError, mode, user } = useAuth()
  const state = (location.state as { from?: string; notice?: string; email?: string } | null) ?? null
  const [email, setEmail] = useState(state?.email ?? (mode === 'demo' ? 'demo@habitpulse.app' : ''))
  const [password, setPassword] = useState(mode === 'demo' ? 'habitpulse-demo' : '')

  const from = state?.from ?? '/dashboard'

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true })
    }
  }, [from, navigate, user])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    clearError()
    try {
      await signIn({ email, password })
      navigate(from, { replace: true })
    } catch {
      return
    }
  }

  return (
    <Panel className="rounded-[36px] p-6 md:p-8">
      <Badge tone={mode === 'supabase' ? 'success' : 'warning'}>
        {mode === 'supabase' ? 'Supabase mode' : 'Demo mode'}
      </Badge>
      <h1 className="mt-5 font-['Fraunces'] text-5xl text-white">Welcome back</h1>
      <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
        Sign in to your HabitPulse workspace and pick up right where your patterns left off.
      </p>
      {mode === 'demo' ? (
        <InlineNotice className="mt-5">
          Demo credentials are pre-filled so the UI works immediately even before Supabase environment keys are configured.
        </InlineNotice>
      ) : null}
      {state?.notice ? (
        <InlineNotice className="mt-5" tone="success">
          {state.notice}
        </InlineNotice>
      ) : null}
      {error ? (
        <InlineNotice className="mt-5" tone="danger">
          {error}
        </InlineNotice>
      ) : null}
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Email</span>
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Password</span>
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <Button className="w-full" disabled={loading} size="lg" type="submit">
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
      <p className="mt-5 text-sm text-[var(--text-secondary)]">
        Need an account?{' '}
        <Link className="text-[var(--accent)]" to="/signup">
          Create one
        </Link>
      </p>
    </Panel>
  )
}
