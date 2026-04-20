import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'

interface DashboardPreferencesContextValue {
  rangeDays: number
  highlightedCategory: string
  setRangeDays: (value: number) => void
  setHighlightedCategory: (value: string) => void
}

const storageKey = 'habitpulse.preferences'

export const DashboardPreferencesContext =
  createContext<DashboardPreferencesContextValue | null>(null)

export function DashboardPreferencesProvider({ children }: PropsWithChildren) {
  const [rangeDays, setRangeDays] = useState(30)
  const [highlightedCategory, setHighlightedCategory] = useState('All')

  useEffect(() => {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as { rangeDays?: number; highlightedCategory?: string }
      setRangeDays(parsed.rangeDays ?? 30)
      setHighlightedCategory(parsed.highlightedCategory ?? 'All')
    } catch {
      localStorage.removeItem(storageKey)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        rangeDays,
        highlightedCategory,
      }),
    )
  }, [highlightedCategory, rangeDays])

  const value = useMemo(
    () => ({
      rangeDays,
      highlightedCategory,
      setRangeDays,
      setHighlightedCategory,
    }),
    [highlightedCategory, rangeDays],
  )

  return (
    <DashboardPreferencesContext.Provider value={value}>
      {children}
    </DashboardPreferencesContext.Provider>
  )
}
