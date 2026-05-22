---
phase: 01-core-inventory
plan: "02"
subsystem: database
tags: [drizzle, turso, libsql, dexie, indexeddb, zod, typescript, server-only, offline-first]

# Dependency graph
requires: []
provides:
  - Drizzle ORM schema (wines + consumption_events tables) with exact ARCHITECTURE.md field names
  - Turso libSQL client with server-only guard preventing credential leak
  - Dexie.js local database schema mirroring Turso schema with sync tracking
  - Zod WineFormSchema and ConsumeEventSchema for form and Server Action validation
  - Shared TypeScript types derived from Zod (not Drizzle InferSelectModel)
  - Initial SQL migration in drizzle/ directory ready to apply to Turso
affects:
  - 01-03-PLAN (Server Actions — imports db, schema, validations)
  - 01-04-PLAN (Wine list — imports dexie/db, types)
  - 01-05-PLAN (Wine form — imports validations, types)
  - All subsequent phases — data model established here

# Tech tracking
tech-stack:
  added:
    - drizzle-orm@0.45.2
    - "@libsql/client@0.17.3"
    - server-only@0.0.1
    - dexie@4.4.2
    - zod@4.4.3
    - drizzle-kit@0.31.10 (dev)
  patterns:
    - "server-only guard: import 'server-only' as first line of lib/db/index.ts"
    - "drizzle-orm/libsql/web: use /web variant for Next.js serverless/edge compatibility"
    - "Singleton db client at module level (not inside handler) for serverless perf"
    - "Dexie version(1).stores() with explicit index list; version bump required for any schema change"
    - "z.infer<typeof Schema> for shared types — never InferSelectModel from Drizzle"
    - "Only name + type required in WineFormSchema; all other fields optional"
    - "generate + migrate workflow: drizzle-kit generate then drizzle-kit migrate (no db:push)"

key-files:
  created:
    - src/lib/db/schema.ts
    - src/lib/db/index.ts
    - src/lib/db/queries.ts
    - src/lib/dexie/db.ts
    - src/lib/dexie/wines.ts
    - src/lib/dexie/sync-queue.ts
    - src/lib/validations/wine.ts
    - src/lib/validations/consumption.ts
    - src/types/wine.ts
    - drizzle.config.ts
    - drizzle/0000_flaky_nekra.sql
  modified:
    - package.json (removed db:push, added required npm packages)

key-decisions:
  - "Use drizzle-orm/libsql/web (not drizzle-orm/libsql) for Next.js serverless/edge runtime compatibility"
  - "server-only as first import in lib/db/index.ts prevents TURSO_AUTH_TOKEN leaking to client bundle"
  - "Removed db:push script from package.json — enforce generate+migrate workflow from day 1 (PITFALLS.md Pitfall 7)"
  - "z.infer<typeof WineFormSchema> for shared types — not Drizzle InferSelectModel to prevent server bundle leakage"
  - "SyncQueueEntry.id is optional number (Dexie auto-increment) not string to match ++id Dexie primary key syntax"
  - "Migration applied to Turso requires real credentials — drizzle/ SQL files committed, apply with: TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... pnpm db:migrate"

patterns-established:
  - "server-only guard: add import 'server-only' as first line to any file accessing Drizzle/Turso"
  - "Dexie client-only: never import src/lib/dexie/db.ts from Server Components or Server Actions"
  - "Offline-first sync: _syncedAt field (null = pending sync) on all local records"
  - "CUID2 IDs: client-generated, passed to server — no auto-increment IDs in schema"

# Metrics
duration: 3min
completed: 2026-05-22
---

# Phase 1 Plan 2: Data Layer Summary

**Drizzle ORM + Turso schema, Dexie.js offline cache, Zod validation schemas, and shared types establishing the complete data layer foundation with server-only guard and generate+migrate workflow**

## Performance

- **Duration:** 3 min
- **Started:** 2026-05-22T01:05:00Z
- **Completed:** 2026-05-22T01:08:43Z
- **Tasks:** 2 completed
- **Files modified:** 12

## Accomplishments

- Drizzle schema with exact column names from ARCHITECTURE.md — 21-column wines table and 7-column consumption_events table with all required fields
- Turso libSQL client with `import 'server-only'` as first import and singleton pattern for serverless performance
- Dexie v1 schema mirroring Turso schema with `_syncedAt` sync tracking field and all required indexes for filter performance
- Zod WineFormSchema requiring only `name` + `type` with all other fields optional; ConsumeEventSchema for tasting events
- Shared TypeScript types using `z.infer<>` exclusively — no Drizzle `InferSelectModel` to prevent server bundle leakage
- Initial SQL migration generated via `drizzle-kit generate` in drizzle/ directory

## Task Commits

Each task was committed atomically:

1. **Task 1: Drizzle schema, Turso client, server-only guard, and migration** - `87c24fa` (feat)
2. **Task 2: Dexie local schema, Zod validation schemas, and shared types** - `bb46677` (feat)

**Plan metadata:** `[pending]` (docs: complete plan)

## Files Created/Modified

- `src/lib/db/schema.ts` — Drizzle schema: wines (21 cols) + consumption_events (7 cols) tables
- `src/lib/db/index.ts` — Drizzle Turso client with `import 'server-only'` guard and singleton pattern
- `src/lib/db/queries.ts` — Reusable server-side query helpers (getAllWines, getWineById, getConsumptionEventsForWine)
- `src/lib/dexie/db.ts` — CellarDatabase class with v1 Dexie schema, LocalWine/LocalConsumptionEvent/SyncQueueEntry interfaces
- `src/lib/dexie/wines.ts` — Dexie wine query helpers (getLocalWines, getLocalWineById, putLocalWine, updateLocalWine)
- `src/lib/dexie/sync-queue.ts` — Sync queue operations (enqueueOperation, getQueuedOperations, removeFromQueue, incrementAttempts)
- `src/lib/validations/wine.ts` — WineFormSchema (Zod) and WineFormValues type
- `src/lib/validations/consumption.ts` — ConsumeEventSchema (Zod) and ConsumeEventValues type
- `src/types/wine.ts` — Shared types: WineFormValues, ConsumeEventValues, LocalWine, DrinkingStatus, WineStatus, WineType
- `drizzle.config.ts` — Drizzle-kit config with turso dialect
- `drizzle/0000_flaky_nekra.sql` — Initial migration SQL (wines + consumption_events DDL)
- `package.json` — Added drizzle-orm, @libsql/client, server-only, dexie, zod, drizzle-kit; removed db:push script

## Decisions Made

- **drizzle-orm/libsql/web** used (not `drizzle-orm/libsql`) — the `/web` variant works in both serverless and edge runtimes (Next.js + Vercel compatibility)
- **db:push removed** from package.json — enforce `generate + migrate` workflow from day 1 per PITFALLS.md Pitfall 7 (push can silently drop data in production)
- **SyncQueueEntry.id typed as `number | undefined`** — matches Dexie's `++id` auto-increment primary key (not string)
- **z.infer<> for shared types** — `InferSelectModel` from Drizzle would pull server-only modules into client bundle

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Removed db:push script from package.json**
- **Found during:** Task 1 (reviewing package.json)
- **Issue:** package.json already contained `"db:push": "drizzle-kit push"` — the plan explicitly requires this NOT exist per PITFALLS.md Pitfall 7 (push can silently drop data in production environments)
- **Fix:** Removed the `db:push` script from scripts section
- **Files modified:** package.json
- **Verification:** `grep -q '"db:push"' package.json` returns "NO db:push OK"
- **Committed in:** 87c24fa (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 missing critical security/workflow fix)
**Impact on plan:** The db:push removal was explicitly required by the plan spec. No scope creep.

## Issues Encountered

- **Turso migration not applied:** No `.env.local` with real Turso credentials available in the execution environment. Migration SQL was generated successfully in `drizzle/` directory. To apply: `TURSO_DATABASE_URL=libsql://your-db.turso.io TURSO_AUTH_TOKEN=your-token npm run db:migrate`
- **Pre-existing TypeScript errors:** Files from plan 01-01 (serwist/sw setup) have TypeScript errors due to missing `@serwist/turbopack` and `serwist` packages. These are pre-existing and unrelated to this plan's scope. Zero TypeScript errors in all files created by this plan.

## User Setup Required

**Turso credentials required to apply migrations.** Steps:
1. Create a Turso database: `turso db create wine-cellar`
2. Get credentials: `turso db show wine-cellar --url` and `turso db tokens create wine-cellar`
3. Create `.env.local` with TURSO_DATABASE_URL and TURSO_AUTH_TOKEN
4. Apply migration: `npm run db:migrate`

## Next Phase Readiness

- Data layer complete — all schemas, types, and query helpers are ready
- Ready for 01-03: Server Actions (addWine, updateWine, deleteWine) which import `db`, `schema`, and `validations`
- Ready for 01-04: Wine list UI which imports `dexie/db` and `types/wine`
- Turso migration must be applied before any Server Actions can write to the database

## Self-Check: PASSED

All 11 key files exist on disk. Both task commits (87c24fa, bb46677) verified in git log.

---
*Phase: 01-core-inventory*
*Completed: 2026-05-22*
