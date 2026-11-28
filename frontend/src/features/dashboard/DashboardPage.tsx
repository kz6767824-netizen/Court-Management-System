// UC-01 step 9: role-based dashboard. Cards come from the route registry (src/routes.tsx).
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { ROLE_BLURBS, ROLE_LABELS } from '../../auth/roles'
import { appRoutes } from '../../routes'

export function DashboardPage() {
  const { user } = useAuth()
  if (!user) return null
  const cards = appRoutes.filter((r) => r.card && r.roles.includes(user.role))

  return (
    <>
      <section className="panel">
        <h1>Welcome, {user.displayName}</h1>
        <p className="muted">{ROLE_LABELS[user.role]}: {ROLE_BLURBS[user.role]}</p>
      </section>
      <div className="card-grid">
        {cards.map((r) => (
          <Link key={r.path} to={r.path} className="card">
            <strong>{r.title}</strong>
            <span>{r.card}</span>
            <small>{r.uc}</small>
          </Link>
        ))}
      </div>
    </>
  )
}
