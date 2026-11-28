import { Link } from 'react-router-dom'

export function ForbiddenPage() {
  return (
    <section className="panel">
      <h1>Access denied</h1>
      <p className="muted">Your role does not allow you to open this page.</p>
      <Link to="/">Back to dashboard</Link>
    </section>
  )
}

export function NotFoundPage() {
  return (
    <section className="panel">
      <h1>Page not found</h1>
      <Link to="/">Back to dashboard</Link>
    </section>
  )
}
