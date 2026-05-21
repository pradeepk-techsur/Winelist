# Phase 1: Core Inventory - Context

**Gathered:** 2026-05-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can manage their complete wine collection — adding, viewing, editing, and deleting wine records — from a responsive mobile-friendly interface. This phase establishes the full-stack foundation: data model, offline-first architecture, authentication, and layout scaffold.

Requirements in scope: INV-01, INV-02, INV-03, INV-04, INV-05, INV-06, MOB-01

</domain>

<decisions>
## Implementation Decisions

### Tech Stack
- **Framework:** Next.js 15 with App Router (full-stack — no separate API server)
- **Bundler:** Turbopack (`next dev --turbopack`) — chosen upfront because Serwist (PWA) has two incompatible setups; this locks in `@serwist/turbopack` package (NOT `@serwist/next`)
- **Cloud database:** Turso (libSQL/SQLite) — accessed server-side only via Drizzle ORM + `import 'server-only'` guard
- **Local offline cache:** Dexie.js (IndexedDB) — all UI reads via `useLiveQuery`; offline write buffer via `syncQueue` table
- **Write path:** Next.js Server Actions exclusively — no API routes for CRUD
- **Deployment:** Decide later (not part of Phase 1 scope; build and run locally first)

### Authentication
- Simple username + password — single hardcoded user account
- Session stored in an httpOnly cookie
- No OAuth, no email verification, no third-party auth services in Phase 1

### Data Model (locked — affects all phases)
- `wines` table: one record per wine, `quantity` integer (NOT one row per bottle)
- `id`: client-generated CUID2 — no server round-trip needed before Dexie can reference it
- `vintage`: `INTEGER` nullable — supports NV wines; enables numeric sort
- `drinkFrom`/`drinkBy`: ISO date strings (`YYYY-MM-DD`)
- `status` enum: `in_cellar`, `consumed`, `gifted`, `sold`, `spoiled` — soft delete (no physical deletes)
- `consumption_events`: append-only table; `rating` lives here (not on wine record)

### Infrastructure Decisions (from research — must be wired in Phase 1)
- `import 'server-only'` added to `lib/db/index.ts` — prevents Turso credentials leaking to client bundle
- Drizzle workflow: `drizzle-kit generate` + `drizzle-kit migrate` for all schema changes — `push` is dev-only
- Dexie transactions: never mix `fetch` / Server Action calls inside a `db.transaction()` scope
- `useLiveQuery` returns `undefined` on first render (not `[]`) — all consumers must handle three states: `undefined` (loading), `[]` (empty), `array` (data)
- Sync architecture: write to Dexie first (instant UI), then forward to Turso; queue when offline
- `navigator.onLine` is unreliable — use a `/api/ping` reachability probe before flushing sync queue

### Serwist / PWA (scaffold in Phase 1)
- Use `@serwist/turbopack` package (NOT `@serwist/next` — incompatible with Turbopack)
- Precache app shell; runtime NetworkFirst for pages; offline fallback at `/~offline`
- Add build revision to precache entries to prevent stale Server Action IDs after deploy
- PWA manifest scaffolded in Phase 1; icons and full installability completed in Phase 6

### Claude's Discretion
- Exact app shell layout (nav structure, header design) — consistent with mobile-first premium aesthetic
- Loading skeleton design for wine list
- Error state handling for failed sync
- Exact form field ordering within required/optional groupings

</decisions>

<specifics>
## Specific Ideas

- The existing TechArch document (`project_specs/TechArch-WineApp.md`) describes an Express + PostgreSQL + React SPA architecture — this has been **superseded** by the decision to use Next.js 15 + Turso + Dexie.js. Downstream agents should NOT follow TechArch for stack decisions; use the research docs and this CONTEXT.md instead.
- Research notes: "Getting Phase 1 right is more important than how many features Phase 1 contains" — correctness of the offline sync infrastructure takes priority over feature completeness.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — Vision, core value, constraints
- `.planning/REQUIREMENTS.md` — Phase 1 requirements: INV-01–06, MOB-01
- `.planning/ROADMAP.md` — Phase 1 goal and success criteria

### Research (authoritative for this phase)
- `.planning/research/SUMMARY.md` — Executive summary of all research; stack decisions, architecture approach, critical pitfalls
- `.planning/research/STACK.md` — Full technology stack with versions, rationale, installation commands, alternatives considered
- `.planning/research/ARCHITECTURE.md` — Complete architecture with data models, data flow diagrams, patterns with code examples
- `.planning/research/PITFALLS.md` — 8 critical pitfalls with code-level examples and recovery strategies

### Spec Docs (for reference — note stack supersedes TechArch)
- `project_specs/PRD-WineApp.md` — Product requirements and feature IDs
- `project_specs/FRD-WineApp.md` — Functional requirements detail
- `project_specs/TechArch-WineApp.md` — ⚠️ SUPERSEDED for stack: ignore Express/PostgreSQL architecture; use for data model reference and requirement IDs only

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None yet — greenfield project; no existing source code

### Established Patterns
- None yet — Phase 1 establishes all patterns that subsequent phases will follow

### Integration Points
- Phase 1 creates the foundational layer: Drizzle schema, Dexie schema, Server Actions pattern, sync service, `useLiveQuery` hooks, Zustand stores — all subsequent phases build on these

</code_context>

<deferred>
## Deferred Ideas

- Deployment setup (Vercel + Turso env vars) — deferred to after Phase 1 features are built and working locally; user explicitly chose "Decide later"
- Full PWA installability (icons, splash screens, manifest completion) — Phase 6 per roadmap
- Multi-device sync optimization (`?since=lastSyncAt`) — Phase 6 per research recommendations

</deferred>

---

*Phase: 01-core-inventory*
*Context gathered: 2026-05-21*
