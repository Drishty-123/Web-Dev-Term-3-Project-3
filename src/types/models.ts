export type BackendMode = 'supabase' | 'demo'

export type HabitStatus = 'completed' | 'missed' | 'skipped'
export type ScheduleType = 'daily' | 'weekly'
export type PreferredTimeSlot = 'morning' | 'midday' | 'evening' | 'anytime'
export type InsightTone = 'positive' | 'warning' | 'neutral'

export interface Profile {
  id: string
  fullName: string
  avatarUrl: string | null
  timezone: string
  onboardingCompleted: boolean
}

export interface Habit {
  id: string
  userId: string
  name: string
  description: string
  category: string
  color: string
  icon: string
  scheduleType: ScheduleType
  scheduledDays: number[]
  preferredTimeSlot: PreferredTimeSlot
  goalLabel: string
  cueNote: string
  rewardNote: string
  archived: boolean
  createdAt: string
}

export interface HabitLog {
  id: string
  habitId: string
  userId: string
  logDate: string
  status: HabitStatus
  completedAt: string | null
  note: string
  mood: number
  energy: number
  createdAt: string
}

export interface Reflection {
  id: string
  userId: string
  reflectionDate: string
  wins: string
  blockers: string
  notes: string
  createdAt: string
}

export interface InsightCard {
  id: string
  title: string
  tone: InsightTone
  metric: string
  explanation: string
  actionLabel: string
}

export interface AuthUser {
  id: string
  email: string
  fullName: string
  mode: BackendMode
}

export interface SignUpInput {
  email: string
  password: string
  fullName: string
}

export interface SignInInput {
  email: string
  password: string
}

export interface AuthSignUpResult {
  user: AuthUser | null
  requiresEmailVerification: boolean
  message?: string
}

export interface ProfileDraft {
  fullName: string
  timezone: string
  avatarUrl?: string | null
  onboardingCompleted?: boolean
}

export interface HabitDraft {
  id?: string
  name: string
  description: string
  category: string
  color: string
  icon: string
  scheduleType: ScheduleType
  scheduledDays: number[]
  preferredTimeSlot: PreferredTimeSlot
  goalLabel: string
  cueNote: string
  rewardNote: string
  archived?: boolean
}

export interface HabitLogDraft {
  habitId: string
  logDate: string
  status: HabitStatus
  note: string
  mood: number
  energy: number
}

export interface ReflectionDraft {
  id?: string
  reflectionDate: string
  wins: string
  blockers: string
  notes: string
}

export interface HabitMetric {
  habitId: string
  consistency7: number
  consistency30: number
  streak: number
  momentum: number
  bestWindow: PreferredTimeSlot
  riskFlag: boolean
}
