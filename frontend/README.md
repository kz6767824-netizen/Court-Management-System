# e-Judiciary frontend

React + Vite + TypeScript. Talks to the Spring Boot backend over REST (`docs/ARCHITECTURE.md` §4).

## Run
```
cd frontend
npm install
npm run dev      # http://localhost:5173  (proxies /api to http://localhost:8080)
npm run build    # type-check + production build
```
Production: set `VITE_API_URL` to the deployed backend URL (see `.env.example`).

## Layout
- `src/api/types.ts` – request/response types. Response shapes are provisional until backend DTOs merge.
- `src/api/client.ts` – typed API functions (`authApi`, `usersApi`, `casesApi`, `hearingsApi`, `causeListsApi`, `lookupApi`). Shared file.
- `src/auth/` – `AuthContext` (session), `ProtectedRoute` (role guard, UI only), `roles.ts`. Shared files.
- `src/routes.tsx` – route registry. **Each AI replaces the `<ComingSoon/>` element for its own use cases.** Entries with `card` appear on the dashboard and nav.
- `src/features/<module>/` – put your pages here (e.g. `features/cases/`, `features/hearings/`).

## Rules
- Use the functions in `src/api/client.ts`; do not call `fetch` directly.
- The role guard only hides pages. The backend enforces access control.
- Handle `ApiError` (`status`, `message`, `details`) and show the message to the user.
