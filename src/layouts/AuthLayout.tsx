import { Outlet } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'

export function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg)] px-4 py-6 md:px-8">
      <div className="hero-orb hero-orb--amber left-10 top-10 h-44 w-44" />
      <div className="hero-orb hero-orb--pearl bottom-10 right-10 h-52 w-52" />
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl items-center justify-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-panel hidden rounded-[36px] p-10 lg:block">
            <BrandMark />
            <div className="mt-12 space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                Behavioral insight platform
              </p>
              <h1 className="max-w-xl font-['Fraunces'] text-6xl leading-none text-white">
                Build routines that explain themselves.
              </h1>
              <p className="max-w-xl text-base leading-8 text-[var(--text-secondary)]">
                HabitPulse goes past streaks and tells you which habits are slipping, when they work best, and what to change next.
              </p>
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
