---

## 7. Integration Points

### 7.1 External Systems (v1)

WineApp v1 is intentionally self-contained with minimal external dependencies. There are no third-party API integrations beyond hosting infrastructure.

| Integration | Type | Purpose | Required |
|-------------|------|---------|----------|
| Vercel | Frontend hosting | Static SPA/PWA deployment; global CDN; auto-deploy from main | Yes |
| Railway | Backend hosting + DB | Node.js process + managed PostgreSQL; env var management | Yes |
| Browser (PWA) | Client runtime | Service worker; web app manifest; installable to home screen | Yes |

---

### 7.2 Hosting Integration Details

#### Vercel (Frontend)

- Deploy React SPA via `vercel.json` or Vercel's automatic framework detection
- Build command: `pnpm run build` (Vite)
- Output directory: `dist/`
- All routes rewritten to `index.html` (SPA routing): add `vercel.json` rewrites rule
- Environment variables: `VITE_API_BASE_URL` pointing to the Railway API URL

```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

#### Railway (Backend API)

- Deploys Node.js process from `server/` directory
- Start command: `node src/server.js`
- Environment variables managed in Railway UI: `DATABASE_URL`, `SESSION_SECRET`, `NODE_ENV`, `PORT`, `CORS_ORIGIN`
- Health check endpoint recommended: `GET /health` → `200 { status: "ok" }`
- Database migrations run as a Railway deploy step: `prisma migrate deploy`

#### Railway PostgreSQL

- Managed PostgreSQL 15; `DATABASE_URL` injected automatically
- Connection pool: Prisma manages connection pooling (default 5 connections for hobby tier)
- Backups: Railway provides automatic daily backups on paid plans

---

### 7.3 PWA Integration

The frontend is a Progressive Web App installable to the user's phone home screen.

**`public/manifest.json`:**
```json
{
  "name": "WineApp",
  "short_name": "WineApp",
  "description": "Personal wine collection manager",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a0a00",
  "theme_color": "#7b1c2a",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

**Service worker (vite-plugin-pwa):**
- Caches static assets (app shell) for fast subsequent loads
- Full offline support is deferred to v2; v1 provides only shell caching
- Configured with `workbox` strategy: `StaleWhileRevalidate` for static assets, `NetworkFirst` for API calls (to avoid serving stale data)

---

### 7.4 Deferred Integrations (Out of Scope for v1)

The following integrations are explicitly deferred and the architecture does not need to accommodate them today — but the data model is designed not to block them:

| Integration | Deferred To | Architectural Note |
|-------------|-------------|-------------------|
| Wine data APIs (Vivino, Wine-Searcher) | Phase 3–4 | `wines` table has all fields needed to store externally looked-up data |
| Camera / label scanning (OCR/CV) | Phase 3 | No schema changes needed; add `label_image_url` column |
| Push notifications (drinking window alerts) | Phase 2 | Add `push_subscription` column to `users` table |
| Export (CSV/PDF) | Phase 2 | Pure read-only; no schema changes |
| Import from spreadsheet | Phase 2 | Bulk insert into existing `wines` table |
| OAuth / SSO | Phase 4 | `users` table can gain `oauth_provider` + `oauth_id` columns |
| Multi-user / household sharing | Phase 4 | `user_id` FK on all resource tables already in place |
| AI recommendation engine | Phase 3–4 | `tasting_notes` + `wines` data sufficient as training input |

---

### 7.5 Error Monitoring (Optional for v1)

No mandatory external error monitoring in v1. Recommended optional additions:

| Tool | Purpose | Notes |
|------|---------|-------|
| Sentry.io | Production error tracking | Requires user consent notice if EU access is possible |
| Railway logs | Server-side log access | Available in Railway UI; `pino` structured logs are searchable |
| Vercel analytics | Web vitals / performance | Privacy-preserving; no cookies required |

---

*06 — Integration Points*

---

## Related Documents

- `project_specs/PRD-WineApp.md` — Product Requirements Document
- `project_specs/FRD-WineApp.md` — Functional Requirements Document
- `.planning/PROJECT.md` — Project description, constraints, and key decisions
- `project_specs/UserStories-WineApp.md` — User Stories *(to be generated)*

---

*TechArch-WineApp v1.0 — Generated 2026-05-21*
