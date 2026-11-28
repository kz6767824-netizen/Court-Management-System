// SHARED FILE: change only via a PR labelled `shared`.
// UC-01: holds the logged-in user and role. The token lives in localStorage (see api/client.ts).
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authApi, setUnauthorizedHandler, tokenStore } from '../api/client'
import type { CurrentUser, LoginRequest } from '../api/types'

interface AuthState {
  user: CurrentUser | null
  /** true while the stored token is being validated on first load */
  loading: boolean
  login: (req: LoginRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState<boolean>(() => tokenStore.get() !== null)

  const logout = useCallback(() => {
    tokenStore.clear()
    setUser(null)
  }, [])

  // Any 401 from a protected call logs the user out.
  useEffect(() => {
    setUnauthorizedHandler(logout)
  }, [logout])

  // Restore the session from a stored token.
  useEffect(() => {
    if (tokenStore.get() === null) return
    let cancelled = false
    authApi
      .me()
      .then((u) => { if (!cancelled) setUser(u) })
      .catch(() => { if (!cancelled) tokenStore.clear() })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const login = useCallback(async (req: LoginRequest) => {
    const res = await authApi.login(req)
    tokenStore.set(res.token)
    setUser({ userId: res.userId, displayName: res.displayName, role: res.role })
  }, [])

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
