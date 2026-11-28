// Route registry. One entry per screen.
// HOW TO USE: when you build the page for your use case, replace `element: <ComingSoon .../>`
// with your component (imported from src/features/<module>/). Do not rename paths or change `roles`
// without telling the monitor. Entries with `card` appear on the role dashboard.
import type { ReactElement } from 'react'
import type { Role } from './api/types'
import { ComingSoon } from './pages/ComingSoon'

export interface AppRoute {
  path: string
  roles: Role[]
  title: string
  uc: string
  element: ReactElement
  /** dashboard card description; omit to hide from the dashboard (e.g. detail pages) */
  card?: string
}

const ALL: Role[] = ['ADMIN', 'CLERK', 'JUDGE', 'LAWYER', 'LITIGANT']

export const appRoutes: AppRoute[] = [
  // --- Administrator ---
  {
    path: '/admin/users', roles: ['ADMIN'], title: 'Manage Users & Roles', uc: 'UC-12',
    card: 'Create, update, deactivate accounts and assign roles',
    element: <ComingSoon title="Manage Users & Roles" uc="UC-12" />,
  },
  {
    path: '/admin/assignments', roles: ['ADMIN'], title: 'Assign Judge & Lawyer', uc: 'UC-04',
    card: 'Assign a judge and counsel to a case',
    element: <ComingSoon title="Assign Judge & Lawyer" uc="UC-04" />,
  },

  // --- Court Clerk ---
  {
    path: '/cases/new', roles: ['CLERK'], title: 'Register New Case', uc: 'UC-02',
    card: 'File a new case with its parties',
    element: <ComingSoon title="Register New Case" uc="UC-02" />,
  },
  {
    path: '/hearings/new', roles: ['CLERK'], title: 'Schedule Hearing', uc: 'UC-06',
    card: 'Propose a hearing slot for a case',
    element: <ComingSoon title="Schedule Hearing" uc="UC-06" />,
  },
  {
    path: '/hearings/manage', roles: ['CLERK'], title: 'Reschedule / Adjourn Hearing', uc: 'UC-07',
    card: 'Move or adjourn an existing hearing',
    element: <ComingSoon title="Reschedule / Adjourn Hearing" uc="UC-07" />,
  },

  // --- Judge ---
  {
    path: '/hearings/pending', roles: ['JUDGE'], title: 'Pending Hearings', uc: 'UC-06',
    card: 'Approve hearings proposed by the clerk',
    element: <ComingSoon title="Pending Hearings" uc="UC-06" />,
  },
  {
    path: '/hearings/outcome', roles: ['JUDGE'], title: 'Record Hearing Outcome', uc: 'UC-09',
    card: 'Record the outcome of a hearing',
    element: <ComingSoon title="Record Hearing Outcome" uc="UC-09" />,
  },

  // --- Everyone ---
  {
    path: '/my-cases', roles: ALL, title: 'My Cases', uc: 'UC-10 / UC-11',
    card: 'Cases assigned to you or involving you, with next hearing and status',
    element: <ComingSoon title="My Cases" uc="UC-10 / UC-11" />,
  },
  {
    path: '/cases', roles: ALL, title: 'Search Cases', uc: 'UC-03',
    card: 'Search and open cases you are allowed to see',
    element: <ComingSoon title="Search Cases" uc="UC-03" />,
  },
  {
    // case detail: status update (UC-05) for CLERK/JUDGE, progress and history (UC-10) for all
    path: '/cases/:id', roles: ALL, title: 'Case Details', uc: 'UC-03 / UC-05 / UC-10',
    element: <ComingSoon title="Case Details" uc="UC-03 / UC-05 / UC-10" />,
  },
  {
    path: '/cause-lists', roles: ALL, title: 'Cause List', uc: 'UC-08',
    card: 'Daily cause list (clerks generate and publish)',
    element: <ComingSoon title="Cause List" uc="UC-08" />,
  },
]
