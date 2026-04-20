import { lazy, Suspense } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { FullPageLoader } from './components/ui/Loader'
import { AppDataProvider } from './context/AppDataContext'
import { AuthProvider } from './context/AuthContext'
import { DashboardPreferencesProvider } from './context/DashboardPreferencesContext'
import { AppShell } from './layouts/AppShell'
import { AuthLayout } from './layouts/AuthLayout'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { SignupPage } from './pages/SignupPage'

const DashboardPage = lazy(async () => ({
  default: (await import('./pages/DashboardPage')).DashboardPage,
}))

const HabitsPage = lazy(async () => ({
  default: (await import('./pages/HabitsPage')).HabitsPage,
}))

const InsightsPage = lazy(async () => ({
  default: (await import('./pages/InsightsPage')).InsightsPage,
}))

const JournalPage = lazy(async () => ({
  default: (await import('./pages/JournalPage')).JournalPage,
}))

const SettingsPage = lazy(async () => ({
  default: (await import('./pages/SettingsPage')).SettingsPage,
}))

function ShellOutlet() {
  return (
    <AppDataProvider>
      <Outlet />
    </AppDataProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <DashboardPreferencesProvider>
        <Suspense fallback={<FullPageLoader label="Opening HabitPulse..." />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<ShellOutlet />}>
                <Route element={<AppShell />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/habits" element={<HabitsPage />} />
                  <Route path="/insights" element={<InsightsPage />} />
                  <Route path="/journal" element={<JournalPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </DashboardPreferencesProvider>
    </AuthProvider>
  )
}

export default App
