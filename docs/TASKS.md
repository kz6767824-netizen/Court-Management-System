# e-Judiciary — Task Board & Workflow

Monitor/reviewer: Claude (this session). Merger: Kashif. AIs: k1, c2, k2, c3, k3.
Read docs/ARCHITECTURE.md first. It is the contract. Do not change it silently — propose changes in your PR description.

## Workflow
1. Kashif gives an AI one task from below. The AI works ONLY inside its own files/packages.
2. Branch name: `<ai>/<task>` e.g. `c2/foundation`. Never commit to `main`.
3. AI returns complete files (path + full content). Kashif commits them on that branch and opens a PR using the template.
4. Kashif sends the PR link (or diff) to the monitor. Monitor reviews against the checklist, replies APPROVE or FIX list.
5. Kashif merges only after APPROVE and after `mvn test` (backend) / `npm run build` (frontend) pass locally.
6. After every merge: Kashif tells the AIs still working to `git pull main` and rebase.
Note: free chat AIs usually cannot push to GitHub themselves. Kashif does the commits; the PR step is still worth it for review history.

## Shared files (touch only via a small PR labelled `shared`, and tell the monitor)
backend/pom.xml · application*.yml · SecurityConfig · GlobalExceptionHandler · domain/* entities · history/CaseHistoryService · frontend/src/api/client.ts · frontend/src/auth/*

## Wave 1 — start now, parallel, no dependencies
| AI | Task | Output |
|---|---|---|
| c2 | **Foundation (BLOCKS wave 2).** Maven project, Spring Boot config (dev=H2, prod=Postgres), Flyway V1 from §3, ALL entities/enums + repositories, GlobalExceptionHandler/ApiError, Security+JWT, `CaseHistoryService.record(...)`, UC-01 login/me. Tests for login (valid, bad password, wrong role, inactive). | `/backend` boots, `mvn test` green, V1 verified on H2 and Postgres |
| k3 | **Frontend shell.** Vite+React+TS in /frontend, router, login page with role selection (UC-01 flow), auth context + token storage, route guards per role, role dashboards (empty cards linking to future pages), typed API client built from §4, `.env` for API URL. | `npm run build` green |
| k2 | **Seed data.** `V30__seed_demo_data.sql` (dev only via Flyway location or profile): 1 admin, 2 clerks, 3 judges, 4 lawyers, 8 litigants, 6 cases in different statuses with parties/assignments/hearings/outcomes/history. BCrypt hash of `Password123!` for all. Plus `docs/demo-data.md` listing usernames. | SQL runs on H2 after V1 |
| c3 | **Rules + test plan.** `common/rules`: `CaseStatusRules`, `HearingStatusRules`, `SlotRules` (pure Java, no Spring) with JUnit tests covering §5. Plus `docs/test-plan.md`: a table of test cases per UC-01..12 derived from each use case's Main Scenario and Extensions (ID, UC, steps, expected). | tests green once c2 merges pom |
| k1 | **DevOps.** `.gitignore`, `Dockerfile` (backend), `docker-compose.yml` (backend + postgres), GitHub Actions CI (mvn test + npm build), root `README.md` (setup, run, demo users, folder map), PR template. | CI file valid |

## Wave 2 — starts after c2 merges (each AI also builds the frontend pages for its own use cases in `frontend/src/features/<module>/`)
| AI | Use cases | Notes |
|---|---|---|
| k1 | UC-02 Register case, UC-03 Search/Retrieve, UC-05 Update status | package `cases`; uses CaseStatusRules + CaseHistoryService; case-number generator; role-scoped search |
| c3 | UC-06 Schedule, UC-07 Reschedule/Adjourn, UC-08 Cause list, UC-09 Record outcome | packages `hearing`, `causelist`; hardest rules (double-booking, slot availability, approval); concurrency: rely on DB unique constraint + catch → 409 |
| k2 | UC-04 Assign judge/lawyer, UC-12 Manage users, UC-10 Progress/History, UC-11 Assigned cases | packages `assignment`, `user`, `view`; access scoping §6 |
| c2 | Integration: end-to-end test of the full workflow (register → assign → schedule → approve → outcome → cause list → litigant views), fix cross-module bugs | after the three modules merge |
| k3 | Frontend polish + shared components (tables, forms, toasts, error display), role-based nav, empty states | pulls others' pages together |

## Wave 3 — hardening and delivery
Security review (monitor), test report (c3: run test-plan, record results), deployment (k1: Render/Railway + Neon/Supabase + Vercel), final README, demo script, SDA report screenshots.

## Definition of done for any PR
- Matches API/DB contract exactly (paths, field names, status codes).
- Business rules enforced in the service layer; role + scope checks present.
- Every state change writes case history in the same transaction.
- Tests included; Extensions from Deliverable 3 that apply are covered.
- No secrets, no `System.out`, no unused code, no edits outside own files (or labelled `shared`).
- PR description: use cases covered, files added, how to run tests, anything that deviates from the contract.

## Monitor review checklist
1. Contract match  2. Role/scope enforcement (try as the wrong role)  3. History written atomically
4. Validation + error codes  5. Tests meaningful, not just happy path  6. No cross-module reach-in
7. SQL portable to H2 + Postgres  8. Traceability comments (UC numbers)
