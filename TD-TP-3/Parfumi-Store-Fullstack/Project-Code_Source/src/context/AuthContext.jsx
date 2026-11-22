import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const STORAGE_KEY = 'parfumi_auth_session'

function readSession() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (!value?.token) return null
    // Decode the JWT expiry for UI session cleanup. The backend remains responsible for token verification.
    const encodedPayload = value.token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const paddedPayload = encodedPayload.padEnd(Math.ceil(encodedPayload.length / 4) * 4, '=')
    const payload = JSON.parse(atob(paddedPayload))
    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return value
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession)
  const signIn = useCallback((nextSession) => {
    const normalized = {
      token: nextSession.token,
      user: nextSession.user || { name: 'Signed-in user', email: '' },
      provider: nextSession.provider || 'local',
      role: nextSession.role || nextSession.user?.role || 'customer',
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
    setSession(normalized)
  }, [])
  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setSession(null)
  }, [])

  const value = useMemo(() => ({
    session,
    isAuthenticated: Boolean(session?.token),
    signIn,
    signOut,
  }), [session, signIn, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
