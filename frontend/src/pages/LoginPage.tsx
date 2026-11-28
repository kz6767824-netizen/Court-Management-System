// UC-01 Authenticate User: choose role (steps 2-3), enter username + password (steps 4-5), submit (step 6).
import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import { ROLES, type Role } from '../api/types'
import { useAuth } from '../auth/AuthContext'
import { ROLE_BLURBS, ROLE_LABELS } from '../auth/roles'

export function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const [role, setRole] = useState<Role | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to="/" replace />

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!role) return
    // UC-01 extension 6a: required credentials missing
    if (!username.trim() || !password) {
      setError('Please enter both username and password.')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      await login({ username: username.trim(), password, role })
      navigate(from, { replace: true })
    } catch (err) {
      // UC-01 extension 8a/8b: invalid credentials, wrong role or inactive account
      setError(err instanceof ApiError ? err.message : 'Login failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="login-wrap">
      <div className="login-card">
        <h1 className="brand">e-Judiciary</h1>
        <p className="muted">Automated Court Case &amp; Hearing Management System</p>

        {!role ? (
          <>
            <h2>Select your role</h2>
            <div className="role-grid">
              {ROLES.map((r) => (
                <button key={r} type="button" className="role-card" onClick={() => setRole(r)}>
                  <strong>{ROLE_LABELS[r]}</strong>
                  <span>{ROLE_BLURBS[r]}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <h2>Sign in as {ROLE_LABELS[role]}</h2>
            <label>
              Username
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </label>
            {error && <p className="error" role="alert">{error}</p>}
            <div className="row">
              <button type="button" className="btn-secondary" onClick={() => { setRole(null); setError(null) }}>
                Change role
              </button>
              <button type="submit" disabled={submitting}>
                {submitting ? 'Signing in…' : 'Sign in'}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}
