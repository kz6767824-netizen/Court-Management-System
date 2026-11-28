import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { AppLayout } from './layout/AppLayout'
import { LoginPage } from './pages/LoginPage'
import { ForbiddenPage, NotFoundPage } from './pages/StatusPages'
import { appRoutes } from './routes'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        {appRoutes.map((r) => (
          <Route
            key={r.path}
            path={r.path}
            element={<ProtectedRoute roles={r.roles}>{r.element}</ProtectedRoute>}
          />
        ))}
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
