import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import type {
  Habit,
  HabitDraft,
  HabitLog,
  HabitLogDraft,
  Reflection,
  ReflectionDraft,
} from '../types/models'
import { appService } from '../services/appService'
import { useAuth } from '../hooks/useAuth'
import type { StarterPackId } from '../constants/habits'

interface AppDataContextValue {
  habits: Habit[]
  logs: HabitLog[]
  reflections: Reflection[]
  loading: boolean
  error: string | null
  refreshAll: () => Promise<void>
  saveHabit: (draft: HabitDraft) => Promise<void>
  deleteHabit: (habitId: string) => Promise<void>
  saveHabitLog: (draft: HabitLogDraft) => Promise<void>
  saveReflection: (draft: ReflectionDraft) => Promise<void>
  deleteReflection: (reflectionId: string) => Promise<void>
  seedStarterPack: (packId: StarterPackId) => Promise<void>
}

export const AppDataContext = createContext<AppDataContextValue | null>(null)

export function AppDataProvider({ children }: PropsWithChildren) {
  const { user } = useAuth()
  const [habits, setHabits] = useState<Habit[]>([])
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [reflections, setReflections] = useState<Reflection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshAll = useCallback(async () => {
    if (!user) {
      setHabits([])
      setLogs([])
      setReflections([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [nextHabits, nextLogs, nextReflections] = await Promise.all([
        appService.getHabits(user.id),
        appService.getHabitLogs(user.id),
        appService.getReflections(user.id),
      ])
      setHabits(nextHabits)
      setLogs(nextLogs)
      setReflections(nextReflections)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to sync your workspace.')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    void refreshAll()
  }, [refreshAll])

  const saveHabit = useCallback(async (draft: HabitDraft) => {
    if (!user) return
    const saved = await appService.saveHabit(user.id, draft)
    setHabits((current) => current.filter((entry) => entry.id !== saved.id).concat(saved))
  }, [user])

  const deleteHabit = useCallback(async (habitId: string) => {
    if (!user) return
    await appService.deleteHabit(user.id, habitId)
    setHabits((current) => current.filter((entry) => entry.id !== habitId))
    setLogs((current) => current.filter((entry) => entry.habitId !== habitId))
  }, [user])

  const saveHabitLog = useCallback(async (draft: HabitLogDraft) => {
    if (!user) return
    const saved = await appService.saveHabitLog(user.id, draft)
    setLogs((current) => current.filter((entry) => entry.id !== saved.id).concat(saved))
  }, [user])

  const saveReflection = useCallback(async (draft: ReflectionDraft) => {
    if (!user) return
    const saved = await appService.saveReflection(user.id, draft)
    setReflections((current) => current.filter((entry) => entry.id !== saved.id).concat(saved))
  }, [user])

  const deleteReflection = useCallback(async (reflectionId: string) => {
    if (!user) return
    await appService.deleteReflection(user.id, reflectionId)
    setReflections((current) => current.filter((entry) => entry.id !== reflectionId))
  }, [user])

  const seedStarterPack = useCallback(async (packId: StarterPackId) => {
    if (!user) return
    await appService.seedStarterPack(user.id, packId)
    await refreshAll()
  }, [refreshAll, user])

  const value = useMemo<AppDataContextValue>(() => ({
    habits,
    logs,
    reflections,
    loading,
    error,
    refreshAll,
    saveHabit,
    deleteHabit,
    saveHabitLog,
    saveReflection,
    deleteReflection,
    seedStarterPack,
  }), [
    deleteHabit,
    deleteReflection,
    error,
    habits,
    loading,
    logs,
    refreshAll,
    reflections,
    saveHabit,
    saveHabitLog,
    saveReflection,
    seedStarterPack,
  ])

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}
