import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const STORAGE_KEY = 'parfumi_demo_session'

function readSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (!saved?.user?.email) return null
    return saved
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession)

  const signIn = useCallback(({ user, role = 'customer' }) => {
    const nextSession = {
      user: {
        name: user?.name || 'Parfumi member',
        email: user?.email || '',
        picture: user?.picture || '',
      },
      role,
      provider: 'local-demo',
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession))
    } catch {
      // The session still works for the current tab if storage is unavailable.
    }
    setSession(nextSession)
  }, [])

  const signOut = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore storage errors and clear the in-memory session.
    }
    setSession(null)
  }, [])

  const value = useMemo(() => ({
    session,
    isAuthenticated: Boolean(session),
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
