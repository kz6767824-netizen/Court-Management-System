// SHARED FILE: change only via a PR labelled `shared`.
import type { Role } from '../api/types'

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Administrator',
  CLERK: 'Court Clerk',
  JUDGE: 'Judge',
  LAWYER: 'Lawyer',
  LITIGANT: 'Litigant',
}

export const ROLE_BLURBS: Record<Role, string> = {
  ADMIN: 'Manage accounts, roles and case assignments',
  CLERK: 'Register cases and manage hearings',
  JUDGE: 'Review hearings, record outcomes, update case status',
  LAWYER: 'Follow the cases of your clients',
  LITIGANT: 'Follow the progress of your own case',
}
