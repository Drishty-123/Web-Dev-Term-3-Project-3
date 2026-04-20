import { useContext } from 'react'
import { DashboardPreferencesContext } from '../context/DashboardPreferencesContext'

export function useDashboardPreferences() {
  const context = useContext(DashboardPreferencesContext)
  if (!context) {
    throw new Error('useDashboardPreferences must be used inside DashboardPreferencesProvider.')
  }
  return context
}
