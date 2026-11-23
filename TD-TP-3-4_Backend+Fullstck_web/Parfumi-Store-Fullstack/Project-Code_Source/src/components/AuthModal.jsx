import { useState } from 'react'
import { apiRequest } from '../services/api'
import { useAuth } from '../context/AuthContext'

function AuthModal({ onClose }) {
  const { signIn } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'register') {
        const result = await apiRequest('/auth/register', {
          method: 'POST',
          body: JSON.stringify(form),
        })
        signIn({ token: result.token, user: result.user, provider: 'local' })
      } else {
        const result = await apiRequest('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: form.email, password: form.password }),
        })
        signIn({ token: result.token, user: result.user, provider: 'local' })
      }
      onClose()
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="auth-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="auth-close" type="button" onClick={onClose} aria-label="Close">×</button>
        <span className="auth-eyebrow">WELCOME TO PARFUMI</span>
        <h2 id="auth-title">{mode === 'login' ? 'Your account' : 'Create an account'}</h2>
        <p className="auth-description">{mode === 'login' ? 'Sign in to manage your store access.' : 'Create your account to get started.'}</p>

        <div className="auth-tabs" role="tablist" aria-label="Account access">
          <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError('') }}>Sign in</button>
          <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError('') }}>Create account</button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label>Full name<input name="name" value={form.name} onChange={updateField} autoComplete="name" required minLength={2} /></label>
          )}
          <label>Email address<input name="email" type="email" value={form.email} onChange={updateField} autoComplete="email" required /></label>
          <label>Password<input name="password" type="password" value={form.password} onChange={updateField} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required minLength={6} /></label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="auth-submit" type="submit" disabled={loading}>{loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
        </form>

        <p className="auth-footnote">Your password is securely hashed by the server. Never share your password.</p>
      </section>
    </div>
  )
}

export default AuthModal
