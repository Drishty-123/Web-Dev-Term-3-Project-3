import {
  BarChart3,
  BookText,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Settings,
} from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { getInitials } from '../lib/utils'

const navigation = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/habits', label: 'Habits', icon: ListTodo },
  { to: '/insights', label: 'Insights', icon: BarChart3 },
  { to: '/journal', label: 'Journal', icon: BookText },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function AppShell() {
  const { profile, signOut, mode } = useAuth()

  return (
    <div className="app-shell-grid min-h-screen bg-[var(--bg)] px-4 py-4 md:px-6">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="glass-panel rounded-[32px] p-5 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
          <BrandMark />

          <nav className="mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none lg:flex-col">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex min-w-fit items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? 'bg-white/12 text-white'
                        : 'text-[var(--text-secondary)] hover:bg-white/8 hover:text-white'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/4 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
              Workspace mode
            </p>
            <div className="mt-3 flex items-center justify-between">
              <Badge tone={mode === 'supabase' ? 'success' : 'warning'}>{mode}</Badge>
              <p className="text-xs text-[var(--text-secondary)]">
                {mode === 'supabase' ? 'Live backend' : 'Demo fallback'}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-[28px] border border-white/10 bg-white/4 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
              {getInitials(profile?.fullName ?? 'HP')}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{profile?.fullName ?? 'HabitPulse User'}</p>
              <p className="truncate text-xs text-[var(--text-secondary)]">{profile?.timezone}</p>
            </div>
          </div>

          <Button className="mt-6 w-full" onClick={() => void signOut()} variant="secondary">
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
