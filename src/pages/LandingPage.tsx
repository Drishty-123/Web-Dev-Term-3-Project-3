import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, ShieldCheck, Sparkles, TimerReset } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Panel } from '../components/ui/Panel'
import { useAuth } from '../hooks/useAuth'

const featureCards = [
  {
    icon: Sparkles,
    title: 'Daily execution with context',
    description: 'Complete, miss, or skip habits while capturing mood, energy, and friction notes.',
  },
  {
    icon: BarChart3,
    title: 'Behavioral insight engine',
    description: 'Measure 7/30-day consistency, streak quality, timing fit, and recovery risk.',
  },
  {
    icon: ShieldCheck,
    title: 'Protected user workspace',
    description: 'Supabase-ready auth, protected routing, and persistent personal habit data.',
  },
  {
    icon: TimerReset,
    title: 'Starter packs with momentum',
    description: 'Seed polished routines from onboarding so the dashboard feels alive from day one.',
  },
]

export function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg)] px-4 py-6 md:px-8">
      <div className="hero-orb hero-orb--amber left-8 top-8 h-44 w-44" />
      <div className="hero-orb hero-orb--pearl right-10 top-24 h-52 w-52" />
      <div className="mx-auto max-w-7xl">
        <header className="glass-panel flex flex-col gap-6 rounded-[36px] px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">
          <BrandMark />
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{user ? 'Authenticated' : 'Open for signup'}</Badge>
            <Link to={user ? '/dashboard' : '/login'}>
              <Button variant="secondary">{user ? 'Go to dashboard' : 'Log in'}</Button>
            </Link>
            <Link to={user ? '/dashboard' : '/signup'}>
              <Button>{user ? 'Open workspace' : 'Create account'}</Button>
            </Link>
          </div>
        </header>

        <section className="grid items-center gap-8 px-2 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Badge>End-term React project • Premium UI • Supabase-ready</Badge>
            <h1 className="max-w-4xl font-['Fraunces'] text-5xl leading-none text-white md:text-7xl">
              A habit tracker that explains why your routine holds or cracks.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
              HabitPulse is built for students and young professionals who need more than a streak counter.
              It shows the pattern behind consistency and turns daily check-ins into actionable coaching.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to={user ? '/dashboard' : '/signup'}>
                <Button size="lg">
                  Launch HabitPulse
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="secondary">
                  Explore features
                </Button>
              </a>
            </div>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-4"
          >
            <Panel className="overflow-hidden rounded-[36px] bg-[linear-gradient(155deg,rgba(255,154,90,0.18),rgba(255,255,255,0.03))] p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[28px] border border-white/10 bg-slate-950/35 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Today pulse</p>
                  <p className="mt-4 font-['Fraunces'] text-5xl text-white">82%</p>
                  <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                    Completion rate is up from last week. Evening habits are your strongest anchor.
                  </p>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-slate-950/35 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Risk flag</p>
                  <p className="mt-4 font-['Fraunces'] text-4xl text-white">Hydration Check</p>
                  <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                    Missed 3 scheduled occurrences. Recommendation: shrink the goal for the next 72 hours.
                  </p>
                </div>
              </div>
              <div className="mt-4 rounded-[28px] border border-white/10 bg-slate-950/35 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Behavior story</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Badge tone="success">Morning Stretch • 11-day streak</Badge>
                  <Badge>Best window: evening</Badge>
                  <Badge tone="warning">Momentum dip: Focus Sprint</Badge>
                </div>
              </div>
            </Panel>
          </motion.div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            ['Students & young professionals', 'Who is the user?'],
            ['Consistency with explanation', 'What problem is solved?'],
            ['Better feedback loops create better routines', 'Why it matters'],
          ].map(([value, label]) => (
            <Panel key={label} className="rounded-[30px] p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">{label}</p>
              <p className="mt-3 font-['Fraunces'] text-3xl text-white">{value}</p>
            </Panel>
          ))}
        </section>

        <section className="py-14" id="features">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                Core product experience
              </p>
              <h2 className="mt-2 font-['Fraunces'] text-4xl text-white">Built to feel production-ready</h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
              The app combines React fundamentals, protected routes, global state, reusable components,
              charts, lazy-loaded pages, and a premium editorial dashboard instead of a generic clone.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 18 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Panel className="h-full rounded-[30px] p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/8 text-[var(--accent)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-white">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                      {feature.description}
                    </p>
                  </Panel>
                </motion.div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
