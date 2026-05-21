---

## Y3: External Integration Points

**Scope:** All external system dependencies and integration contracts for WineApp v1. This document covers authentication, hosting infrastructure, and frontend delivery. WineApp v1 has minimal external integrations by design — the personal-use MVP is intentionally self-contained.

---

### §Auth

#### Authentication Mechanism — v1

WineApp v1 uses **single-user session-based authentication** (no external identity provider). The user registers once with an email and password, and the system manages sessions internally.

**Implementation:**
- Password is hashed with **bcrypt** (minimum cost factor 12) before storage.
- Login generates a **secure random session token** (minimum 128 bits, URL-safe base64).
- Session token is stored in the `sessions` table (see `Y0-schema.md §sessions`).
- Token is delivered to the client as an **httpOnly, SameSite=Strict cookie** (preferred for web/PWA) OR as a Bearer token in the Authorization header (for API clients).
- Session expiry: **30 days** (rolling; refreshed on each authenticated request).
- Logout deletes the session record from the database.
- Expired sessions are cleaned up by a background job or on-demand at login time.

**No multi-user, OAuth, or SSO in v1.** These are deferred to a future phase.

**Security constraints:**
- All API endpoints (except `/api/auth/login`) require a valid session.
- Tokens must be transmitted only over HTTPS.
- Password reset flow is out of scope for v1 (single-user; user controls the instance).

---

### §Hosting and Infrastructure

#### Cloud Hosting (v1)

WineApp v1 is intended for cloud deployment with minimal operational overhead. Recommended (not mandated) options:

| Layer | Option A | Option B | Notes |
|-------|----------|----------|-------|
| Frontend | Vercel | Netlify | Static build (React/Vue PWA); auto-deploy from main branch |
| Backend API | Railway | Render | Node.js process; managed restarts |
| Database | Railway PostgreSQL | Supabase (managed Postgres) | Prefer managed Postgres; SQLite is acceptable for MVP if running on a single server |
| File Storage | N/A (no file uploads in v1) | — | Label images are out of scope |

**Environment variables required (backend):**
- `DATABASE_URL` — PostgreSQL connection string
- `SESSION_SECRET` — Secret for signing/validating session tokens (minimum 32 random bytes)
- `NODE_ENV` — `production` | `development`
- `PORT` — Server port (default 3000)
- `CORS_ORIGIN` — Allowed frontend origin(s)

---

### §Frontend Delivery

#### PWA / Responsive Web

WineApp frontend is a **Progressive Web App (PWA)** or responsive Single Page Application (SPA). Key delivery requirements:

- **HTTPS only.** PWA features (service worker, installability) require a secure context.
- **Service Worker (optional for MVP):** A basic service worker that caches static assets (app shell) improves load performance but is not a hard requirement for v1. Full offline support is deferred.
- **Web App Manifest:** Provide `manifest.json` with app name, icons (192px, 512px), `display: standalone`, and `theme_color` so users can install the app to their phone home screen.
- **Meta viewport:** All pages must include `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- **Content Security Policy:** Recommended but not mandated in v1.

---

### §Database

#### Database Connection

- Backend connects to PostgreSQL via a connection pool (recommended: `pg` library with pool size 5–10).
- All queries are parameterized — no string interpolation of user input into SQL.
- Database migrations are managed via a migration tool (e.g., `node-pg-migrate`, `Knex migrations`, `Prisma migrations`).
- Initial schema is applied from `Y0-schema.md` DDL via the migration tool.

#### SQLite Alternative

For local development or a very lightweight single-instance deployment, SQLite is acceptable with the type mappings documented in `Y0-schema.md §Column Type Reference`. The application layer must abstract the database driver to allow switching between PostgreSQL and SQLite without application code changes.

---

### §External Data Sources (Out of Scope)

The following integrations are **explicitly out of scope for v1**:

| Integration | Deferred To | Reason |
|-------------|-------------|--------|
| Wine label scanning (camera/OCR) | Phase 3 | Requires native app or specialized CV API |
| Wine data lookup (Vivino API, Wine-Searcher, etc.) | Phase 3–4 | Third-party agreements and data quality work required |
| Drinking window data from external sources | Phase 3–4 | Requires reliable external wine data API |
| Push notifications (drinking window alerts) | Phase 2 | Notification infrastructure not required for MVP |
| Export to CSV/PDF | Phase 2 | Post-MVP convenience feature |
| Import from spreadsheet | Phase 2 | Post-MVP onboarding enhancement |
| AI-based recommendation engine | Phase 3–4 | Requires usage data accumulation |

---

### §Error Monitoring and Logging

v1 has no mandatory external error monitoring integration. However, the following are recommended:

- **Server-side logging:** All API errors (4xx, 5xx) should be logged with timestamp, request path, error code, and user ID (no PII in logs).
- **Client-side error boundary:** React/Vue error boundaries should catch unhandled UI errors and display a graceful fallback screen.
- **Optional:** Sentry.io or equivalent for production error tracking. Integration requires explicit user consent notice if EU users are possible.

---

*Y3 — External Integration Points*
