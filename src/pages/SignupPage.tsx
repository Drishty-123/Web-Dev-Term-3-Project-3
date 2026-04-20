import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { InlineNotice } from '../components/ui/InlineNotice'
import { Input } from '../components/ui/Input'
import { Panel } from '../components/ui/Panel'
import { useAuth } from '../hooks/useAuth'

export function SignupPage() {
  const navigate = useNavigate()
  const { signUp, loading, error, clearError, mode, user } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate, user])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    clearError()
    setSuccessMessage(null)
    try {
      const result = await signUp({ fullName, email, password })
      if (result.requiresEmailVerification) {
        navigate('/login', {
          replace: true,
          state: {
            notice: result.message,
            email,
          },
        })
        return
      }
      setSuccessMessage('Account created. Opening your HabitPulse dashboard...')
      navigate('/dashboard', { replace: true })
    } catch {
      return
    }
  }

  return (
    <Panel className="rounded-[36px] p-6 md:p-8">
      <Badge tone={mode === 'supabase' ? 'success' : 'warning'}>
        {mode === 'supabase' ? 'Live backend ready' : 'Demo fallback available'}
      </Badge>
      <h1 className="mt-5 font-['Fraunces'] text-5xl text-white">Create your workspace</h1>
      <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
        Set up your account, finish onboarding, and start tracking habits with insight-aware analytics.
      </p>
      {mode === 'demo' ? (
        <InlineNotice className="mt-5">
          This project supports full Supabase auth, and also includes a demo fallback so the product can be explored without environment secrets.
        </InlineNotice>
      ) : null}
      {successMessage ? (
        <InlineNotice className="mt-5" tone="success">
          {successMessage}
        </InlineNotice>
      ) : null}
      {error ? (
        <InlineNotice className="mt-5" tone="danger">
          {error}
        </InlineNotice>
      ) : null}
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Full name</span>
          <Input value={fullName} onChange={(event) => setFullName(event.target.value)} required />
        </label>
        <label className="block space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Email</span>
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label className="block space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Password</span>
          <Input
            minLength={8}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <Button className="w-full" disabled={loading} size="lg" type="submit">
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
      <p className="mt-5 text-sm text-[var(--text-secondary)]">
        Already have an account?{' '}
        <Link className="text-[var(--accent)]" to="/login">
          Sign in
        </Link>
      </p>
    </Panel>
  )
}
