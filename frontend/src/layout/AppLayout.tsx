import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { ROLE_LABELS } from '../auth/roles'
import { appRoutes } from '../routes'

export function AppLayout() {
  const { user, logout } = useAuth()
  if (!user) return null
  const navItems = appRoutes.filter((r) => r.card && r.roles.includes(user.role))

  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="brand">e-Judiciary</Link>
        <nav className="nav">
          {navItems.map((r) => (
            <NavLink key={r.path} to={r.path} className={({ isActive }) => (isActive ? 'active' : '')}>
              {r.title}
            </NavLink>
          ))}
        </nav>
        <div className="user">
          <span>{user.displayName} <em>({ROLE_LABELS[user.role]})</em></span>
          <button type="button" className="btn-secondary" onClick={logout}>Log out</button>
        </div>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
