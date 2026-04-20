import { starterPacks, type StarterPackId } from '../constants/habits'
import type {
  AuthSignUpResult,
  AuthUser,
  BackendMode,
  Habit,
  HabitDraft,
  HabitLog,
  HabitLogDraft,
  Profile,
  ProfileDraft,
  Reflection,
  ReflectionDraft,
  SignInInput,
  SignUpInput,
} from '../types/models'
import { seedDemoHistory } from './analytics'
import { isSupabaseConfigured, supabase } from './supabase'

const storageKeys = {
  users: 'habitpulse.demo.users',
  session: 'habitpulse.demo.session',
  profiles: 'habitpulse.demo.profiles',
  habits: 'habitpulse.demo.habits',
  logs: 'habitpulse.demo.logs',
  reflections: 'habitpulse.demo.reflections',
} as const

type DemoAccount = {
  id: string
  email: string
  password: string
  fullName: string
}

const authListeners = new Set<(user: AuthUser | null) => void>()

function getMode(): BackendMode {
  return isSupabaseConfigured ? 'supabase' : 'demo'
}

function readCollection<T>(key: string): T[] {
  const raw = localStorage.getItem(key)
  if (!raw) return []
  try {
    return JSON.parse(raw) as T[]
  } catch {
    return []
  }
}

function writeCollection<T>(key: string, value: T[]) {
  localStorage.setItem(key, JSON.stringify(value))
}

function makeId() {
  return crypto.randomUUID()
}

function mapDemoAccount(account: DemoAccount): AuthUser {
  return {
    id: account.id,
    email: account.email,
    fullName: account.fullName,
    mode: 'demo',
  }
}

function emitAuth(user: AuthUser | null) {
  authListeners.forEach((listener) => listener(user))
}

function readDemoSession() {
  const userId = localStorage.getItem(storageKeys.session)
  if (!userId) return null
  const account = readCollection<DemoAccount>(storageKeys.users).find((entry) => entry.id === userId)
  return account ? mapDemoAccount(account) : null
}

function readProfile(userId: string) {
  return readCollection<Profile>(storageKeys.profiles).find((entry) => entry.id === userId) ?? null
}

function writeProfile(profile: Profile) {
  const collection = readCollection<Profile>(storageKeys.profiles)
  writeCollection(
    storageKeys.profiles,
    collection.filter((entry) => entry.id !== profile.id).concat(profile),
  )
  return profile
}

function createDefaultProfile(userId: string, fullName: string): Profile {
  return {
    id: userId,
    fullName,
    avatarUrl: null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    onboardingCompleted: false,
  }
}

function seedDemoHabits(userId: string, packId: StarterPackId) {
  const existingHabits = readCollection<Habit>(storageKeys.habits).filter((habit) => habit.userId === userId)
  const usedNames = new Set(existingHabits.map((habit) => habit.name))
  const now = new Date().toISOString()
  const createdHabits = starterPacks[packId]
    .filter((draft) => !usedNames.has(draft.name))
    .map((draft) => ({
      id: makeId(),
      userId,
      archived: false,
      createdAt: now,
      ...draft,
    }))

  if (createdHabits.length === 0) return

  writeCollection(storageKeys.habits, readCollection<Habit>(storageKeys.habits).concat(createdHabits))
  writeCollection(
    storageKeys.logs,
    readCollection<HabitLog>(storageKeys.logs).concat(seedDemoHistory(createdHabits, userId)),
  )
}

function ensureDemoSeeded() {
  if (readCollection<DemoAccount>(storageKeys.users).length > 0) return
  const demoId = makeId()
  const demoAccount: DemoAccount = {
    id: demoId,
    email: 'demo@habitpulse.app',
    password: 'habitpulse-demo',
    fullName: 'Demo User',
  }
  writeCollection(storageKeys.users, [demoAccount])
  writeCollection(storageKeys.profiles, [createDefaultProfile(demoId, demoAccount.fullName)])
  seedDemoHabits(demoId, 'balanced-reset')
}

function mapSupabaseUser(user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }): AuthUser {
  return {
    id: user.id,
    email: user.email ?? '',
    fullName:
      (user.user_metadata?.full_name as string | undefined) ??
      user.email?.split('@')[0] ??
      'HabitPulse User',
    mode: 'supabase',
  }
}

function getFallbackProfileDraft(user: AuthUser): ProfileDraft {
  return {
    fullName: user.fullName,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    avatarUrl: null,
    onboardingCompleted: false,
  }
}

function toProfileRecord(userId: string, profile: ProfileDraft) {
  return {
    id: userId,
    full_name: profile.fullName,
    avatar_url: profile.avatarUrl ?? null,
    timezone: profile.timezone,
    onboarding_completed: profile.onboardingCompleted ?? false,
  }
}

function fromProfileRecord(record: Record<string, unknown>): Profile {
  return {
    id: String(record.id),
    fullName: String(record.full_name ?? ''),
    avatarUrl: (record.avatar_url as string | null | undefined) ?? null,
    timezone: String(record.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone),
    onboardingCompleted: Boolean(record.onboarding_completed),
  }
}

function fromHabitRecord(record: Record<string, unknown>): Habit {
  return {
    id: String(record.id),
    userId: String(record.user_id),
    name: String(record.name ?? ''),
    description: String(record.description ?? ''),
    category: String(record.category ?? ''),
    color: String(record.color ?? '#FF9A5A'),
    icon: String(record.icon ?? 'sparkles'),
    scheduleType: (record.schedule_type as Habit['scheduleType']) ?? 'daily',
    scheduledDays: (record.scheduled_days as number[] | null | undefined) ?? [],
    preferredTimeSlot: (record.preferred_time_slot as Habit['preferredTimeSlot']) ?? 'anytime',
    goalLabel: String(record.goal_label ?? ''),
    cueNote: String(record.cue_note ?? ''),
    rewardNote: String(record.reward_note ?? ''),
    archived: Boolean(record.archived),
    createdAt: String(record.created_at ?? new Date().toISOString()),
  }
}

function toHabitRecord(userId: string, habit: HabitDraft) {
  return {
    id: habit.id,
    user_id: userId,
    name: habit.name,
    description: habit.description,
    category: habit.category,
    color: habit.color,
    icon: habit.icon,
    schedule_type: habit.scheduleType,
    scheduled_days: habit.scheduledDays,
    preferred_time_slot: habit.preferredTimeSlot,
    goal_label: habit.goalLabel,
    cue_note: habit.cueNote,
    reward_note: habit.rewardNote,
    archived: habit.archived ?? false,
  }
}

function fromHabitLogRecord(record: Record<string, unknown>): HabitLog {
  return {
    id: String(record.id),
    habitId: String(record.habit_id),
    userId: String(record.user_id),
    logDate: String(record.log_date),
    status: (record.status as HabitLog['status']) ?? 'completed',
    completedAt: (record.completed_at as string | null | undefined) ?? null,
    note: String(record.note ?? ''),
    mood: Number(record.mood ?? 3),
    energy: Number(record.energy ?? 3),
    createdAt: String(record.created_at ?? new Date().toISOString()),
  }
}

function toHabitLogRecord(userId: string, log: HabitLogDraft) {
  return {
    habit_id: log.habitId,
    user_id: userId,
    log_date: log.logDate,
    status: log.status,
    completed_at: log.status === 'completed' ? new Date().toISOString() : null,
    note: log.note,
    mood: log.mood,
    energy: log.energy,
  }
}

function fromReflectionRecord(record: Record<string, unknown>): Reflection {
  return {
    id: String(record.id),
    userId: String(record.user_id),
    reflectionDate: String(record.reflection_date),
    wins: String(record.wins ?? ''),
    blockers: String(record.blockers ?? ''),
    notes: String(record.notes ?? ''),
    createdAt: String(record.created_at ?? new Date().toISOString()),
  }
}

function toReflectionRecord(userId: string, reflection: ReflectionDraft) {
  return {
    id: reflection.id,
    user_id: userId,
    reflection_date: reflection.reflectionDate,
    wins: reflection.wins,
    blockers: reflection.blockers,
    notes: reflection.notes,
  }
}

export const appService = {
  getMode,

  async getCurrentUser() {
    if (getMode() === 'demo') {
      ensureDemoSeeded()
      return readDemoSession()
    }

    const { data } = await supabase!.auth.getUser()
    return data.user ? mapSupabaseUser(data.user) : null
  },

  subscribeAuth(listener: (user: AuthUser | null) => void) {
    if (getMode() === 'demo') {
      authListeners.add(listener)
      return () => {
        authListeners.delete(listener)
      }
    }

    const subscription = supabase!.auth.onAuthStateChange((_event, session) => {
      listener(session?.user ? mapSupabaseUser(session.user) : null)
    })

    return () => {
      subscription.data.subscription.unsubscribe()
    }
  },

  async ensureProfile(user: AuthUser) {
    const existing = await appService.getProfile(user.id)
    if (existing) return existing
    return appService.saveProfile(user.id, getFallbackProfileDraft(user))
  },

  async signUp(input: SignUpInput): Promise<AuthSignUpResult> {
    if (getMode() === 'demo') {
      ensureDemoSeeded()
      const accounts = readCollection<DemoAccount>(storageKeys.users)
      if (accounts.some((entry) => entry.email.toLowerCase() === input.email.toLowerCase())) {
        throw new Error('An account with that email already exists.')
      }
      const account: DemoAccount = {
        id: makeId(),
        email: input.email,
        password: input.password,
        fullName: input.fullName,
      }
      writeCollection(storageKeys.users, accounts.concat(account))
      writeProfile(createDefaultProfile(account.id, input.fullName))
      localStorage.setItem(storageKeys.session, account.id)
      const user = mapDemoAccount(account)
      emitAuth(user)
      return {
        user,
        requiresEmailVerification: false,
      }
    }

    const { data, error } = await supabase!.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          full_name: input.fullName,
        },
      },
    })

    if (error) throw error
    if (!data.user) {
      throw new Error('Sign up completed but no user was returned. Check your Supabase auth settings.')
    }

    if (!data.session) {
      return {
        user: null,
        requiresEmailVerification: true,
        message:
          'Your account was created. Check your inbox and confirm your email before signing in.',
      }
    }

    const nextUser = mapSupabaseUser(data.user)
    await appService.ensureProfile(nextUser)

    return {
      user: nextUser,
      requiresEmailVerification: false,
    }
  },

  async signIn(input: SignInInput) {
    if (getMode() === 'demo') {
      ensureDemoSeeded()
      const account = readCollection<DemoAccount>(storageKeys.users).find(
        (entry) =>
          entry.email.toLowerCase() === input.email.toLowerCase() &&
          entry.password === input.password,
      )
      if (!account) {
        throw new Error('Invalid email or password. Try the demo account shown on the page.')
      }
      localStorage.setItem(storageKeys.session, account.id)
      const user = mapDemoAccount(account)
      emitAuth(user)
      return user
    }

    const { data, error } = await supabase!.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    })
    if (error) throw error
    if (!data.user) throw new Error('No user returned from Supabase sign in.')
    const nextUser = mapSupabaseUser(data.user)
    await appService.ensureProfile(nextUser)
    return nextUser
  },

  async signOut() {
    if (getMode() === 'demo') {
      localStorage.removeItem(storageKeys.session)
      emitAuth(null)
      return
    }
    const { error } = await supabase!.auth.signOut()
    if (error) throw error
  },

  async getProfile(userId: string) {
    if (getMode() === 'demo') {
      ensureDemoSeeded()
      return readProfile(userId)
    }

    const { data, error } = await supabase!
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    if (error) throw error
    return data ? fromProfileRecord(data as Record<string, unknown>) : null
  },

  async saveProfile(userId: string, profile: ProfileDraft) {
    if (getMode() === 'demo') {
      const existing = readProfile(userId) ?? createDefaultProfile(userId, profile.fullName)
      return writeProfile({
        ...existing,
        ...profile,
        avatarUrl: profile.avatarUrl ?? existing.avatarUrl,
        onboardingCompleted: profile.onboardingCompleted ?? existing.onboardingCompleted,
      })
    }

    const { data, error } = await supabase!
      .from('profiles')
      .upsert(toProfileRecord(userId, profile))
      .select('*')
      .single()

    if (error) throw error
    return fromProfileRecord(data as Record<string, unknown>)
  },

  async getHabits(userId: string) {
    if (getMode() === 'demo') {
      return readCollection<Habit>(storageKeys.habits)
        .filter((entry) => entry.userId === userId)
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    }

    const { data, error } = await supabase!
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data as Record<string, unknown>[]).map(fromHabitRecord)
  },

  async saveHabit(userId: string, habit: HabitDraft) {
    if (getMode() === 'demo') {
      const collection = readCollection<Habit>(storageKeys.habits)
      const id = habit.id ?? makeId()
      const nextHabit: Habit = {
        id,
        userId,
        name: habit.name,
        description: habit.description,
        category: habit.category,
        color: habit.color,
        icon: habit.icon,
        scheduleType: habit.scheduleType,
        scheduledDays: habit.scheduledDays,
        preferredTimeSlot: habit.preferredTimeSlot,
        goalLabel: habit.goalLabel,
        cueNote: habit.cueNote,
        rewardNote: habit.rewardNote,
        archived: habit.archived ?? false,
        createdAt:
          collection.find((entry) => entry.id === id)?.createdAt ?? new Date().toISOString(),
      }
      writeCollection(
        storageKeys.habits,
        collection.filter((entry) => entry.id !== id).concat(nextHabit),
      )
      return nextHabit
    }

    const { data, error } = await supabase!
      .from('habits')
      .upsert(toHabitRecord(userId, habit))
      .select('*')
      .single()

    if (error) throw error
    return fromHabitRecord(data as Record<string, unknown>)
  },

  async deleteHabit(userId: string, habitId: string) {
    if (getMode() === 'demo') {
      writeCollection(
        storageKeys.habits,
        readCollection<Habit>(storageKeys.habits).filter((entry) => entry.id !== habitId),
      )
      writeCollection(
        storageKeys.logs,
        readCollection<HabitLog>(storageKeys.logs).filter((entry) => entry.habitId !== habitId),
      )
      return
    }

    const { error } = await supabase!.from('habits').delete().eq('user_id', userId).eq('id', habitId)
    if (error) throw error
  },

  async getHabitLogs(userId: string) {
    if (getMode() === 'demo') {
      return readCollection<HabitLog>(storageKeys.logs)
        .filter((entry) => entry.userId === userId)
        .sort((left, right) => right.logDate.localeCompare(left.logDate))
    }

    const { data, error } = await supabase!
      .from('habit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('log_date', { ascending: false })

    if (error) throw error
    return (data as Record<string, unknown>[]).map(fromHabitLogRecord)
  },

  async saveHabitLog(userId: string, log: HabitLogDraft) {
    if (getMode() === 'demo') {
      const collection = readCollection<HabitLog>(storageKeys.logs)
      const existing = collection.find(
        (entry) =>
          entry.userId === userId &&
          entry.habitId === log.habitId &&
          entry.logDate === log.logDate,
      )
      const nextLog: HabitLog = {
        id: existing?.id ?? makeId(),
        userId,
        habitId: log.habitId,
        logDate: log.logDate,
        status: log.status,
        completedAt: log.status === 'completed' ? new Date().toISOString() : null,
        note: log.note,
        mood: log.mood,
        energy: log.energy,
        createdAt: existing?.createdAt ?? new Date().toISOString(),
      }
      writeCollection(
        storageKeys.logs,
        collection
          .filter((entry) => entry.id !== nextLog.id)
          .concat(nextLog)
          .sort((left, right) => right.logDate.localeCompare(left.logDate)),
      )
      return nextLog
    }

    const { data, error } = await supabase!
      .from('habit_logs')
      .upsert(toHabitLogRecord(userId, log), { onConflict: 'habit_id,log_date' })
      .select('*')
      .single()

    if (error) throw error
    return fromHabitLogRecord(data as Record<string, unknown>)
  },

  async getReflections(userId: string) {
    if (getMode() === 'demo') {
      return readCollection<Reflection>(storageKeys.reflections)
        .filter((entry) => entry.userId === userId)
        .sort((left, right) => right.reflectionDate.localeCompare(left.reflectionDate))
    }

    const { data, error } = await supabase!
      .from('reflections')
      .select('*')
      .eq('user_id', userId)
      .order('reflection_date', { ascending: false })

    if (error) throw error
    return (data as Record<string, unknown>[]).map(fromReflectionRecord)
  },

  async saveReflection(userId: string, reflection: ReflectionDraft) {
    if (getMode() === 'demo') {
      const collection = readCollection<Reflection>(storageKeys.reflections)
      const existing = collection.find(
        (entry) => entry.userId === userId && entry.reflectionDate === reflection.reflectionDate,
      )
      const nextReflection: Reflection = {
        id: reflection.id ?? existing?.id ?? makeId(),
        userId,
        reflectionDate: reflection.reflectionDate,
        wins: reflection.wins,
        blockers: reflection.blockers,
        notes: reflection.notes,
        createdAt: existing?.createdAt ?? new Date().toISOString(),
      }
      writeCollection(
        storageKeys.reflections,
        collection.filter((entry) => entry.id !== nextReflection.id).concat(nextReflection),
      )
      return nextReflection
    }

    const { data, error } = await supabase!
      .from('reflections')
      .upsert(toReflectionRecord(userId, reflection), { onConflict: 'user_id,reflection_date' })
      .select('*')
      .single()

    if (error) throw error
    return fromReflectionRecord(data as Record<string, unknown>)
  },

  async deleteReflection(userId: string, reflectionId: string) {
    if (getMode() === 'demo') {
      writeCollection(
        storageKeys.reflections,
        readCollection<Reflection>(storageKeys.reflections).filter((entry) => entry.id !== reflectionId),
      )
      return
    }

    const { error } = await supabase!
      .from('reflections')
      .delete()
      .eq('user_id', userId)
      .eq('id', reflectionId)

    if (error) throw error
  },

  async seedStarterPack(userId: string, packId: StarterPackId) {
    if (getMode() === 'demo') {
      seedDemoHabits(userId, packId)
      return
    }

    const existing = await appService.getHabits(userId)
    const usedNames = new Set(existing.map((habit) => habit.name))
    const templates = starterPacks[packId].filter((habit) => !usedNames.has(habit.name))
    if (templates.length === 0) return

    const { error } = await supabase!.from('habits').insert(
      templates.map((habit) => toHabitRecord(userId, habit)),
    )

    if (error) throw error
  },
}
