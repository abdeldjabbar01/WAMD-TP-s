import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function AuthModal({ onClose }) {
  const { signIn } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')

    const email = form.email.trim().toLowerCase()
    if (!email || form.password.length < 6) {
      setError('Enter a valid email and a password with at least 6 characters.')
      return
    }
    if (mode === 'register' && form.name.trim().length < 2) {
      setError('Please enter your full name.')
      return
    }

    const defaultName = email.split('@')[0]
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
    const isDemoAdmin = email === 'admin@parfumi.local'

    signIn({
      user: { name: mode === 'register' ? form.name.trim() : defaultName, email },
      role: isDemoAdmin ? 'admin' : 'customer',
    })
    onClose()
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
          <button className="auth-submit" type="submit">{mode === 'login' ? 'Sign in' : 'Create account'}</button>
        </form>

        <p className="auth-footnote">
          Frontend demo only. No password is sent to or saved on a server.
          <br />Use <strong>admin@parfumi.local</strong> to preview local product management (any password with 6+ characters).
        </p>
      </section>
    </div>
  )
}

export default AuthModal
