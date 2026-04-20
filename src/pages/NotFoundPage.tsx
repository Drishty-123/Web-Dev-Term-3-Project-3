import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Panel } from '../components/ui/Panel'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4">
      <Panel className="max-w-xl rounded-[36px] p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
          404
        </p>
        <h1 className="mt-4 font-['Fraunces'] text-5xl text-white">That page drifted off the map.</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
          Head back to the dashboard or the landing page and we’ll get you back into rhythm.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/">
            <Button variant="secondary">Landing page</Button>
          </Link>
          <Link to="/dashboard">
            <Button>Dashboard</Button>
          </Link>
        </div>
      </Panel>
    </div>
  )
}
