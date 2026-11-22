import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { setAuthToken } from '../services/api'

const AuthContext = createContext(null)
const STORAGE_KEY = 'parfumi_auth_session'

// Read the expiry from the JWT only to clean up stale sessions in the UI.
// The backend remains responsible for verifying the token.
function isExpired(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = payload.padEnd(Math.ceil(payload.length / 4) * 4, '=')
    const { exp } = JSON.parse(atob(padded))
    return Boolean(exp) && exp * 1000 <= Date.now()
  } catch {
    return true
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [restoring, setRestoring] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY)
        const saved = raw ? JSON.parse(raw) : null
        if (saved?.token && !isExpired(saved.token)) {
          setAuthToken(saved.token)
          if (active) setSession(saved)
        } else if (saved) {
          await AsyncStorage.removeItem(STORAGE_KEY)
        }
      } catch {
        // Ignore storage errors: the user just starts signed out.
      } finally {
        if (active) setRestoring(false)
      }
    })()
    return () => { active = false }
  }, [])

  const signIn = useCallback(async ({ token, user }) => {
    const next = { token, user, role: user?.role || 'customer' }
    setAuthToken(token)
    setSession(next)
    try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* ignore */ }
  }, [])

  const signOut = useCallback(async () => {
    setAuthToken(null)
    setSession(null)
    try { await AsyncStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
  }, [])

  const value = useMemo(() => ({
    session,
    restoring,
    isAuthenticated: Boolean(session?.token),
    isAdmin: session?.role === 'admin',
    signIn,
    signOut,
  }), [session, restoring, signIn, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
