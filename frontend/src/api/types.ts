// Types mirror docs/ARCHITECTURE.md §3-§5.
// Request shapes follow the contract exactly. Response shapes are PROVISIONAL where the
// contract only lists field names: align them with the backend DTOs when those merge.

export type Role = 'ADMIN' | 'CLERK' | 'JUDGE' | 'LAWYER' | 'LITIGANT'
export const ROLES: Role[] = ['ADMIN', 'CLERK', 'JUDGE', 'LAWYER', 'LITIGANT']

export type CaseStatus = 'FILED' | 'IN_PROGRESS' | 'JUDGMENT_RESERVED' | 'DISPOSED' | 'CLOSED'
export type HearingStatus = 'PENDING' | 'SCHEDULED' | 'ADJOURNED' | 'COMPLETED'
export type PartyRole = 'PLAINTIFF' | 'DEFENDANT'

export interface ApiErrorBody {
  timestamp?: string
  status: number
  error?: string
  message: string
  details?: string[]
}

// UC-01
export interface LoginRequest { username: string; password: string; role: Role }
export interface LoginResponse { token: string; userId: number; displayName: string; role: Role }
export interface CurrentUser { userId: number; displayName: string; role: Role }

// UC-12
export interface UserSummary {
  id: number
  username: string
  displayName: string
  contactNo?: string
  role: Role
  active: boolean
}
export interface CreateUserRequest {
  username: string
  password: string
  displayName: string
  contactNo?: string
  role: Role
  // role-specific profile fields
  adminId?: string
  employeeId?: string
  judgeNumber?: string
  designation?: string
  courtroomNo?: string
  barNumber?: string
  chamberAddress?: string
  litigantNumber?: string
  nationalId?: string
  address?: string
}
export type UpdateUserRequest = Partial<Omit<CreateUserRequest, 'role' | 'username'>>

export interface LookupItem { id: number; name: string; number: string }
export type LookupKind = 'judges' | 'lawyers' | 'litigants'

// UC-02, 03, 05
export interface PartyInput { litigantId: number; partyRole: PartyRole; lawyerId?: number }
export interface RegisterCaseRequest {
  caseType: string
  title: string
  description?: string
  filingDate: string // ISO date
  parties: PartyInput[]
}
export interface CaseSummary {
  id: number
  caseNumber: string
  caseType: string
  title: string
  status: CaseStatus
  parties?: string[]
  nextHearing?: string | null
}
export interface CaseSearchParams {
  caseNumber?: string
  caseType?: string
  status?: CaseStatus
  party?: string
  from?: string
  to?: string
}
export interface CaseParty { id: number; litigantId: number; name: string; partyRole: PartyRole; counsel?: string | null }
export interface CaseDetail extends Omit<CaseSummary, 'parties'> {
  description?: string
  filingDate: string
  judge?: string | null
  parties: CaseParty[]
}
export interface StatusChangeRequest { newStatus: CaseStatus; reason: string }

// UC-04
export interface AssignJudgeRequest { judgeId: number }
export interface AssignCounselRequest { casePartyId: number; lawyerId: number }

// UC-06, 07, 09
export interface Hearing {
  id: number
  hearingNumber: string
  caseId: number
  caseNumber?: string
  scheduledAt: string | null
  venue?: string
  status: HearingStatus
}
export interface ProposeHearingRequest { caseId: number; scheduledAt: string; venue?: string }
export interface RescheduleRequest { newDateTime: string; reason: string }
export interface AdjournRequest { reason: string }
export interface RecordOutcomeRequest { outcomeType: string; details?: string }

// UC-08
export interface CauseListEntry { sequenceNumber: number; hearing: Hearing }
export interface CauseList {
  id: number
  listNumber: string
  hearingDate: string
  generatedAt: string
  published: boolean
  entries: CauseListEntry[]
}

// UC-10
export interface HistoryEntry {
  id: number
  occurredAt: string
  eventType: string
  description: string
  resultingStatus?: CaseStatus | null
}
export interface CaseProgress {
  caseId: number
  caseNumber: string
  status: CaseStatus
  judge?: string | null
  counsel?: string[]
  hearings: Hearing[]
  history: HistoryEntry[]
}
