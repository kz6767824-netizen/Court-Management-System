# e-Judiciary — Task Board & Workflow

Monitor/reviewer: Claude (this session). Merger: Kashif. Active AIs: k1, c2, c3 (k2 and k3 are on standby).
Read docs/ARCHITECTURE.md first. It is the contract. Do not change it silently — propose changes in your PR description.

## Workflow
1. Kashif gives an AI one task from below. The AI works ONLY inside its own files/packages.
2. Branch name: `<ai>/<task>` e.g. `c2/foundation`. Never commit to `main`.
3. AI returns complete files (path + full content). Kashif commits them on that branch and opens a PR.
4. Kashif sends the PR link to the monitor. Monitor reviews against the checklist, replies APPROVE or FIX list.
5. Kashif merges only after APPROVE and after `mvn test` (backend) / `npm run build` (frontend) pass locally.
6. After every merge: Kashif tells the AIs still working to `git pull main` and rebase.
Start every new branch from the latest main: `git switch main`, `git pull`, `git switch -c <ai>/<task>`.

## Shared files (touch only via a small PR labelled `shared`, and tell the monitor)
backend/pom.xml · application*.yml · SecurityConfig · GlobalExceptionHandler · domain/* entities · history/CaseHistoryService · frontend/src/api/client.ts · frontend/src/auth/*

## Wave 1 — start now, parallel, no dependencies between them
| AI | Task | Output |
|---|---|---|
| c2 | **Foundation (BLOCKS wave 2).** Maven project in /backend, Spring Boot config (dev=H2, prod=Postgres), Flyway V1 from ARCHITECTURE §3, ALL entities/enums + repositories, GlobalExceptionHandler/ApiError, Security + JWT, `CaseHistoryService.record(...)`, UC-01 login/me. Tests for login (valid, bad password, wrong role, inactive user). | backend boots, `mvn test` green, V1 verified on H2 and Postgres syntax |
| k1 | **Frontend shell.** Vite + React + TS in /frontend, router, login page with role selection (UC-01 flow), auth context + token storage, route guards per role, empty role dashboards linking to future pages, typed API client built from ARCHITECTURE §4, `.env` for API URL, root `.gitignore` covering backend and frontend. | `npm run build` green |
| c3 | **Rules, test plan, seed data.** (a) `common/rules`: `CaseStatusRules`, `HearingStatusRules`, `SlotRules` — pure Java, no Spring, with JUnit tests covering ARCHITECTURE §5. (b) `docs/test-plan.md`: test cases per UC-01..12 from each use case's Main Scenario and Extensions (ID, UC, steps, expected). (c) `V30__seed_demo_data.sql`: 1 admin, 2 clerks, 3 judges, 4 lawyers, 8 litigants, 6 cases in different statuses with parties, assignments, hearings, outcomes, history; BCrypt hash of `Password123!` for all; plus `docs/demo-data.md` listing usernames. | tests green once c2's pom is merged; seed runs on H2 after V1 |

## Wave 2 — starts after c2's foundation is merged. Each AI also builds the frontend pages for its own use cases in `frontend/src/features/<module>/`.
| AI | Use cases | Packages / notes |
|---|---|---|
| c2 | UC-04 Assign judge & lawyer, UC-12 Manage users and roles | `assignment`, `user`; admin-only; assignment ends previous judge (ended_on) and writes history |
| k1 | UC-02 Register case, UC-03 Search/Retrieve, UC-05 Update status, UC-10 View case progress, UC-11 View assigned cases | `cases`, `view`; case-number generator; role-scoped search and access (ARCHITECTURE §6); uses CaseStatusRules + CaseHistoryService |
| c3 | UC-06 Schedule, UC-07 Reschedule/Adjourn, UC-08 Cause list, UC-09 Record outcome | `hearing`, `causelist`; hardest rules: double-booking, slot availability, judge approval; rely on DB unique constraint and map the violation to 409 |

## Wave 3 — hardening and delivery
| AI | Task |
|---|---|
| c2 | End-to-end integration test: register → assign → schedule → approve → outcome → cause list → litigant views progress. Fix cross-module bugs. |
| k1 | Frontend polish (shared components, toasts, error display, empty states, role-based nav). Then deployment: README (setup, run, demo users), host the backend + Postgres + frontend. |
| c3 | Run the test plan, record results in `docs/test-report.md`. |
| Monitor | Security review (try every endpoint as the wrong role), final contract check, demo script. |

Docker is NOT needed for development. Add a `Dockerfile` in wave 3 only if the chosen hosting service requires it.

## Definition of done for any PR
- Matches API/DB contract exactly (paths, field names, status codes).
- Business rules enforced in the service layer; role + scope checks present.
- Every state change writes case history in the same transaction.
- Tests included; applicable Extensions from Deliverable 3 are covered.
- No secrets, no `System.out`, no unused code, no edits outside own files (or labelled `shared`).
- PR description: use cases covered, files added, how to run tests, anything that deviates from the contract.

## Monitor review checklist
1. Contract match  2. Role/scope enforcement (try as the wrong role)  3. History written atomically
4. Validation + error codes  5. Tests meaningful, not just happy path  6. No cross-module reach-in
7. SQL portable to H2 + Postgres  8. Traceability comments (UC numbers)
