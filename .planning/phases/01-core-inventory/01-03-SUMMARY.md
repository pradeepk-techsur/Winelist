---
phase: 01-core-inventory
plan: "03"
subsystem: api
tags: [server-actions, drizzle, turso, zod, typescript, soft-delete, offline-first]

# Dependency graph
requires:
  - phase: 01-core-inventory
    plan: "02"
    provides: "db client, Drizzle schema (wines + consumptionEvents), Zod WineFormSchema and ConsumeEventSchema"
provides:
  - addWine Server Action — Zod-validated insert to Turso with client-generated CUID2 id
  - updateWine Server Action — partial Zod-validated update with updatedAt timestamp
  - deleteWine Server Action — soft delete setting status='spoiled' (no physical row removal)
  - getWines Server Action — returns all wines as plain serializable objects
  - addConsumptionEvent Server Action — append-only insert + quantity decrement with floor at 0
  - getConsumptionEventsForWine Server Action — fetch events for a specific wine
affects:
  - 01-04-PLAN (wine list UI — calls getWines for initial sync hydration)
  - 01-05-PLAN (wine form — calls addWine/updateWine from form submit handlers)
  - All phases involving consumption tracking

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "'use server' directive at top of every Server Action file"
    - "Zod safeParse before any Drizzle DB operation — server is the security boundary"
    - "Soft delete: status='spoiled' instead of db.delete() — wines never physically removed"
    - "Consumption events are append-only — no update/delete on consumptionEvents table"
    - "MAX(0, quantity - N) SQL pattern to prevent negative quantity values"
    - "Generic error messages returned to client; full errors logged server-side only"
    - "Client-generated CUID2 ids accepted by addWine and addConsumptionEvent"

key-files:
  created:
    - src/app/actions/wines.ts
    - src/app/actions/consumption.ts
  modified: []

key-decisions:
  - "deleteWine uses soft delete (status='spoiled') not physical db.delete() per CONTEXT.md data model"
  - "addConsumptionEvent is append-only — consumption history is immutable once recorded"
  - "Quantity decrement uses SQL MAX(0, quantity - N) to floor at zero without application-level check"
  - "WineFormSchema.partial() used for updateWine to allow any subset of fields to be updated"

patterns-established:
  - "'use server' in every src/app/actions/*.ts file"
  - "Validate → DB → Return pattern: always safeParse before any db operation"
  - "Error boundary: console.error server-side, generic string returned to client"

# Metrics
duration: 2min
completed: 2026-05-22
---

# Phase 1 Plan 3: Server Actions Summary

**Six Next.js Server Actions for wine CRUD and consumption tracking — Zod-validated, Drizzle-powered, with soft delete and append-only consumption events as the sole cloud write path**

## Performance

- **Duration:** 2 min
- **Started:** 2026-05-22T01:25:24Z
- **Completed:** 2026-05-22T01:27:09Z
- **Tasks:** 2 completed
- **Files modified:** 2

## Accomplishments

- Wine CRUD Server Actions (addWine, updateWine, deleteWine, getWines) with Zod validation and Drizzle ORM writes to Turso
- Soft delete pattern — `deleteWine` sets `status='spoiled'`, no physical row removal, matching CONTEXT.md data model
- Consumption event Server Actions with append-only semantics, quantity decrement floored at 0 via `MAX(0, quantity - N)` SQL
- `'use server'` directive on all action files; all return plain serializable `{ success: boolean }` objects safe for client components

## Task Commits

Each task was committed atomically:

1. **Task 1: Wine Server Actions (addWine, updateWine, deleteWine, getWines)** - `d6bb941` (feat)
2. **Task 2: Consumption event Server Action (addConsumptionEvent, getConsumptionEventsForWine)** - `cbe4354` (feat)

**Plan metadata:** `[pending]` (docs: complete plan)

## Files Created/Modified

- `src/app/actions/wines.ts` — addWine (validates + inserts CUID2-id record), updateWine (partial schema update), deleteWine (soft delete → spoiled), getWines (plain serializable array)
- `src/app/actions/consumption.ts` — addConsumptionEvent (append-only insert + quantity decrement), getConsumptionEventsForWine (fetch by wineId)

## Decisions Made

- **Soft delete pattern:** `deleteWine` sets `status='spoiled'` per CONTEXT.md — wines are never physically deleted, matching the status enum defined in the schema
- **Append-only consumption events:** Once recorded, consumption history is immutable — no update/delete operations on the `consumptionEvents` table
- **SQL floor for quantity:** `MAX(0, quantity - N)` in the SQL update prevents negative inventory values without requiring a read-before-write round-trip
- **Partial update validation:** `WineFormSchema.partial()` allows any subset of wine fields to be updated without requiring all fields to be re-sent

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required for this plan. (Turso credentials for actual DB writes were noted in plan 01-02.)

## Next Phase Readiness

- All Server Actions ready for consumption by client components
- Ready for 01-04: Wine list UI can call `getWines` for initial hydration via Server Action
- Ready for 01-05: Wine form can call `addWine` / `updateWine` on submit
- No blockers — TypeScript compiles cleanly, all patterns established

## Self-Check: PASSED

- `src/app/actions/wines.ts` — FOUND ✓
- `src/app/actions/consumption.ts` — FOUND ✓
- Commit `d6bb941` (Task 1: wine CRUD actions) — FOUND ✓
- Commit `cbe4354` (Task 2: consumption actions) — FOUND ✓

---
*Phase: 01-core-inventory*
*Completed: 2026-05-22*
