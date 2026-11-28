// Typed API client for the e-Judiciary REST contract (docs/ARCHITECTURE.md §4).
// SHARED FILE: change only via a PR labelled `shared`.
import type {
  AdjournRequest, ApiErrorBody, AssignCounselRequest, AssignJudgeRequest, CaseDetail, CaseProgress,
  CaseSearchParams, CaseSummary, CauseList, CreateUserRequest, CurrentUser, Hearing, LoginRequest,
  LoginResponse, LookupItem, LookupKind, ProposeHearingRequest, RecordOutcomeRequest,
  RegisterCaseRequest, RescheduleRequest, Role, StatusChangeRequest, UpdateUserRequest, UserSummary,
  CaseStatus, HistoryEntry,
} from './types'

const BASE_URL: string = (import.meta.env.VITE_API_URL as string | undefined) ?? ''
const TOKEN_KEY = 'ejudiciary.token'

// ---- token storage (wrapped: storage can be blocked or empty) ----
export const tokenStore = {
  get(): string | null {
    try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
  },
  set(token: string): void {
    try { localStorage.setItem(TOKEN_KEY, token) } catch { /* ignore */ }
  },
  clear(): void {
    try { localStorage.removeItem(TOKEN_KEY) } catch { /* ignore */ }
  },
}

// ---- errors ----
export class ApiError extends Error {
  status: number
  details: string[]
  constructor(status: number, message: string, details: string[] = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

type UnauthorizedHandler = () => void
let onUnauthorized: UnauthorizedHandler = () => {}
/** AuthContext registers a handler so any 401 on a protected call logs the user out. */
export function setUnauthorizedHandler(handler: UnauthorizedHandler): void {
  onUnauthorized = handler
}

type Query = Record<string, string | number | boolean | undefined | null>

function toQuery(params?: Query): string {
  if (!params) return ''
  const usp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') usp.append(k, String(v))
  }
  const s = usp.toString()
  return s ? `?${s}` : ''
}

async function request<T>(
  method: string,
  path: string,
  opts: { body?: unknown; query?: Query; auth?: boolean } = {},
): Promise<T> {
  const { body, query, auth = true } = opts
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = tokenStore.get()
  if (auth && token) headers.Authorization = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(`${BASE_URL}/api${path}${toQuery(query)}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Check your connection and try again.')
  }

  if (res.status === 204) return undefined as T

  const text = await res.text()
  let data: unknown = undefined
  if (text) {
    try { data = JSON.parse(text) } catch { data = undefined }
  }

  if (!res.ok) {
    const err = (data ?? {}) as Partial<ApiErrorBody>
    if (res.status === 401 && auth) onUnauthorized()
    throw new ApiError(res.status, err.message ?? res.statusText ?? 'Request failed', err.details ?? [])
  }
  return data as T
}

const get = <T>(path: string, query?: Query) => request<T>('GET', path, { query })
const post = <T>(path: string, body?: unknown) => request<T>('POST', path, { body })
const put = <T>(path: string, body?: unknown) => request<T>('PUT', path, { body })
const patch = <T>(path: string, body?: unknown) => request<T>('PATCH', path, { body })

// ---- UC-01 ----
export const authApi = {
  login: (req: LoginRequest) => request<LoginResponse>('POST', '/auth/login', { body: req, auth: false }),
  me: () => get<CurrentUser>('/auth/me'),
}

// ---- UC-12 / lookups ----
export const usersApi = {
  list: (role?: Role) => get<UserSummary[]>('/users', { role }),
  create: (req: CreateUserRequest) => post<UserSummary>('/users', req),
  update: (id: number, req: UpdateUserRequest) => put<UserSummary>(`/users/${id}`, req),
  changeRole: (id: number, role: Role) => patch<UserSummary>(`/users/${id}/role`, { role }),
  deactivate: (id: number) => patch<UserSummary>(`/users/${id}/deactivate`),
}
export const lookupApi = {
  list: (kind: LookupKind) => get<LookupItem[]>(`/lookup/${kind}`),
}

// ---- UC-02, 03, 05, 04, 10, 11 ----
export const casesApi = {
  register: (req: RegisterCaseRequest) => post<CaseDetail>('/cases', req),
  search: (params?: CaseSearchParams) => get<CaseSummary[]>('/cases', params as Query),
  get: (id: number) => get<CaseDetail>(`/cases/${id}`),
  allowedTransitions: (id: number) => get<CaseStatus[]>(`/cases/${id}/allowed-transitions`),
  updateStatus: (id: number, req: StatusChangeRequest) => patch<CaseDetail>(`/cases/${id}/status`, req),
  history: (id: number) => get<HistoryEntry[]>(`/cases/${id}/history`),
  progress: (id: number) => get<CaseProgress>(`/cases/${id}/progress`),
  myCases: () => get<CaseSummary[]>('/me/cases'),
  assignJudge: (id: number, req: AssignJudgeRequest) => post<void>(`/cases/${id}/assignments/judge`, req),
  assignCounsel: (id: number, req: AssignCounselRequest) => post<void>(`/cases/${id}/assignments/counsel`, req),
}

// ---- UC-06, 07, 09 ----
export const hearingsApi = {
  availableSlots: (caseId: number, from: string, to: string) =>
    get<string[]>('/hearings/available-slots', { caseId, from, to }),
  propose: (req: ProposeHearingRequest) => post<Hearing>('/hearings', req),
  pending: () => get<Hearing[]>('/hearings/pending'),
  approve: (id: number) => post<Hearing>(`/hearings/${id}/approve`),
  reschedule: (id: number, req: RescheduleRequest) => patch<Hearing>(`/hearings/${id}/reschedule`, req),
  adjourn: (id: number, req: AdjournRequest) => patch<Hearing>(`/hearings/${id}/adjourn`, req),
  recordOutcome: (id: number, req: RecordOutcomeRequest) => post<Hearing>(`/hearings/${id}/outcome`, req),
}

// ---- UC-08 ----
export const causeListsApi = {
  generate: (date: string) => post<CauseList>('/cause-lists', { date }),
  publish: (id: number) => post<CauseList>(`/cause-lists/${id}/publish`),
  byDate: (date: string) => get<CauseList[]>('/cause-lists', { date }),
}
