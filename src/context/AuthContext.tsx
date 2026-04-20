import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { appService } from '../services/appService'
import type {
  AuthSignUpResult,
  AuthUser,
  BackendMode,
  Profile,
  ProfileDraft,
  SignInInput,
  SignUpInput,
} from '../types/models'

interface AuthContextValue {
  user: AuthUser | null
  profile: Profile | null
  loading: boolean
  error: string | null
  mode: BackendMode
  signIn: (input: SignInInput) => Promise<void>
  signUp: (input: SignUpInput) => Promise<AuthSignUpResult>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  updateProfile: (draft: ProfileDraft) => Promise<Profile>
  clearError: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mode = appService.getMode()

  const loadProfile = useCallback(async (currentUser: AuthUser | null) => {
    if (!currentUser) {
      setProfile(null)
      return
    }
    const nextProfile = await appService.getProfile(currentUser.id)
    setProfile(
      nextProfile ?? {
        id: currentUser.id,
        fullName: currentUser.fullName,
        avatarUrl: null,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        onboardingCompleted: false,
      },
    )
  }, [])

  useEffect(() => {
    let isMounted = true

    async function bootstrap() {
      try {
        const currentUser = await appService.getCurrentUser()
        if (!isMounted) return
        setUser(currentUser)
        await loadProfile(currentUser)
      } catch (caught) {
        if (!isMounted) return
        setError(caught instanceof Error ? caught.message : 'Unable to open HabitPulse right now.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    void bootstrap()

    const unsubscribe = appService.subscribeAuth((nextUser) => {
      setUser(nextUser)
      void loadProfile(nextUser)
      setLoading(false)
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [loadProfile])

  const signIn = useCallback(async (input: SignInInput) => {
    setLoading(true)
    setError(null)
    try {
      const nextUser = await appService.signIn(input)
      setUser(nextUser)
      await loadProfile(nextUser)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to sign in.')
      throw caught
    } finally {
      setLoading(false)
    }
  }, [loadProfile])

  const signUp = useCallback(async (input: SignUpInput) => {
    setLoading(true)
    setError(null)
    try {
      const result = await appService.signUp(input)
      if (result.user) {
        setUser(result.user)
        await loadProfile(result.user)
      } else {
        setUser(null)
        setProfile(null)
      }
      return result
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to create the account.')
      throw caught
    } finally {
      setLoading(false)
    }
  }, [loadProfile])

  const signOut = useCallback(async () => {
    setLoading(true)
    try {
      await appService.signOut()
      setUser(null)
      setProfile(null)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to sign out.')
      throw caught
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    await loadProfile(user)
  }, [loadProfile, user])

  const updateProfile = useCallback(async (draft: ProfileDraft) => {
    if (!user) {
      throw new Error('You need to be signed in to update your profile.')
    }
    const nextProfile = await appService.saveProfile(user.id, draft)
    setProfile(nextProfile)
    return nextProfile
  }, [user])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    profile,
    loading,
    error,
    mode,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    updateProfile,
    clearError: () => setError(null),
  }), [
    error,
    loading,
    mode,
    profile,
    refreshProfile,
    signIn,
    signOut,
    signUp,
    updateProfile,
    user,
  ])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
