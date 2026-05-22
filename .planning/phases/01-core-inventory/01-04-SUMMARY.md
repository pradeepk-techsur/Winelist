---
phase: 01-core-inventory
plan: "04"
subsystem: infra
tags: [offline-first, sync, dexie, indexeddb, playwright, e2e, network-status, service-worker]

# Dependency graph
requires:
  - phase: 01-core-inventory
    plan: "02"
    provides: "Dexie schema (dexieDb, LocalWine, SyncQueueEntry interfaces)"
  - phase: 01-core-inventory
    plan: "03"
    provides: "Server Actions (getWines, addWine, updateWine, deleteWine) for sync service"
provides:
  - hydrateDexie function — fetches all wines from Turso via Server Action, bulkPut into Dexie
  - flushSyncQueue function — drains offline queue entries, sequences Dexie writes and Server Actions correctly
  - useNetworkStatus hook — navigator.onLine + /api/ping reachability probe (two-signal approach)
  - /api/ping endpoint — lightweight HEAD+GET reachability probe returning 200
  - useSync hook — mounts hydration on startup, flushes queue on reconnect
  - SyncProvider component — client component that activates sync infrastructure in the component tree
  - OfflineBanner component — shows "You're offline" after 3s of offline (anti-flicker delay)
  - SyncIndicator component — 4-state visual indicator via useLiveQuery on syncQueue count
  - e2e/sync-offline.spec.ts — Playwright tests for ping, offline page, login form
affects:
  - 01-05-PLAN (Wine list UI — can now rely on hydrated Dexie)
  - All subsequent phases — sync infrastructure is the foundation for offline-first writes

# Tech tracking
tech-stack:
  added:
    - "@playwright/test (devDependency) — E2E test framework"
  patterns:
    - "Two-signal network detection: navigator.onLine for offline banner, /api/ping probe for sync trigger"
    - "Anti-flicker offline banner: 3s setTimeout before showing (avoids flicker on brief hiccups)"
    - "Dead-letter handling: queue entries with attempts >= 5 are logged, not retried"
    - "Dexie writes and Server Actions strictly sequenced — never inside db.transaction() scope together"
    - "SyncProvider wraps app tree to activate sync on client mount via useSync hook"
    - "useLiveQuery on syncQueue.count() drives SyncIndicator state reactively"

key-files:
  created:
    - src/app/api/ping/route.ts
    - src/hooks/useNetworkStatus.ts
    - src/lib/sync/sync-service.ts
    - src/hooks/useSync.ts
    - src/components/providers/SyncProvider.tsx
    - src/components/layout/OfflineBanner.tsx
    - src/components/layout/SyncIndicator.tsx
    - e2e/sync-offline.spec.ts
    - playwright.config.ts
  modified:
    - package.json (added @playwright/test devDependency)

key-decisions:
  - "Two-signal network approach: navigator.onLine for offline banner (reliable for 'definitely offline'), /api/ping probe before sync (reliable for 'actually reachable') — per PITFALLS.md Pitfall 6"
  - "OfflineBanner delayed 3s to avoid flicker on brief disconnects per PITFALLS.md UX section"
  - "E2E tests written as deliverable; execution deferred to verify phase (test boundary: no browser tests during execute)"
  - "Dexie bulkPut upserts (not insert) to safely re-hydrate from Turso without duplicates"
  - "Queue dead-letter threshold: attempts >= 5 → log error, stop retrying (prevents infinite hammering)"

patterns-established:
  - "Sync separation: Dexie writes BEFORE Server Action calls, Dexie cleanup AFTER — never mixed in db.transaction()"
  - "SyncProvider pattern: client component in root layout activates sync infrastructure"
  - "useLiveQuery for reactive sync state: pendingCount from syncQueue drives indicator without polling"

# Metrics
duration: 8min
completed: 2026-05-22
---

# Phase 1 Plan 4: Offline Sync Infrastructure Summary

**Complete offline-first sync infrastructure: hydrateDexie + flushSyncQueue sync service, two-signal network detection with /api/ping reachability probe, SyncProvider, OfflineBanner (3s anti-flicker delay), and reactive SyncIndicator via useLiveQuery**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-05-22T01:25:00Z
- **Completed:** 2026-05-22T01:33:30Z
- **Tasks:** 2 completed
- **Files modified:** 9

## Accomplishments

- Complete sync service (`hydrateDexie` + `flushSyncQueue`) with correct Pitfall 1 compliance — Dexie writes and Server Action calls never mixed in same `db.transaction()` scope
- Two-signal network detection: `navigator.onLine` (fast, reliable for "definitely offline") + `/api/ping` HEAD probe (reliable for "actually reachable") — solves captive portal problem
- `OfflineBanner` with 3s anti-flicker delay — avoids anxiety-inducing flicker on brief network hiccups per PITFALLS.md UX section
- `SyncIndicator` with 4 states (synced/pending/syncing/offline) driven by reactive `useLiveQuery` on syncQueue count
- Dead-letter queue handling: entries failing 5+ times are logged as permanent failures, not retried
- Playwright test suite (`e2e/sync-offline.spec.ts`) covering ping endpoint, offline page, login form fields, and invalid credentials

## Task Commits

Each task was committed atomically:

1. **Task 1: Network status hook, /api/ping probe, and sync service** - `44eb4d1` (feat)
2. **Task 2: SyncProvider, OfflineBanner, SyncIndicator, useSync, and Playwright E2E** - `cf3605b` (feat)

**Plan metadata:** `[pending]` (docs: complete plan)

## Files Created/Modified

- `src/app/api/ping/route.ts` — HEAD + GET reachability probe endpoint returning 200
- `src/hooks/useNetworkStatus.ts` — `{ isOnline, isReachable, checkReachability }` hook with two-signal approach
- `src/lib/sync/sync-service.ts` — `hydrateDexie` (bulkPut from Turso) and `flushSyncQueue` (drain offline queue)
- `src/hooks/useSync.ts` — Combines hydration on mount + queue flush on reconnect
- `src/components/providers/SyncProvider.tsx` — Client component activating useSync in component tree
- `src/components/layout/OfflineBanner.tsx` — Delayed offline notification with WifiOff icon
- `src/components/layout/SyncIndicator.tsx` — Reactive 4-state sync dot indicator
- `e2e/sync-offline.spec.ts` — Playwright E2E tests for sync infrastructure
- `playwright.config.ts` — Playwright configuration with local dev server
- `package.json` — Added @playwright/test as devDependency

## Decisions Made

- **Two-signal network approach:** `navigator.onLine` used for the offline banner (it's reliable for "definitely offline"), but before flushing the sync queue, `checkReachability()` probes `/api/ping` with a 3000ms timeout — this catches captive portals and "connected but no internet" scenarios per PITFALLS.md Pitfall 6
- **OfflineBanner 3s delay:** Per PITFALLS.md UX section — brief network hiccups (a few seconds of poor signal) should not alarm users; the banner only appears if offline for 3+ seconds
- **E2E test execution deferred:** Tests written as deliverables; running Playwright during execute phase would launch browser processes that can stall. Deferred to verify phase per test execution boundary.
- **bulkPut for hydration:** Uses `bulkPut` (upsert) not `bulkAdd` — safe to call on every app load without duplicates
- **Dead-letter threshold:** 5 failed attempts → log as permanent failure, skip during subsequent flushes

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Escaped apostrophe in OfflineBanner JSX**
- **Found during:** Task 2 (creating OfflineBanner component)
- **Issue:** The plan's template used `You're offline` directly in JSX — unescaped apostrophes in JSX string content cause React compilation warnings/errors in strict mode
- **Fix:** Changed to `You&apos;re offline` (HTML entity) in the JSX span content
- **Files modified:** src/components/layout/OfflineBanner.tsx
- **Verification:** TypeScript compile clean, no JSX string literal warnings
- **Committed in:** cf3605b (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 missing critical — JSX string safety)
**Impact on plan:** Trivial correction. No scope creep. Component behavior identical to spec.

## Issues Encountered

- **Playwright E2E tests not run during execute phase:** Per test execution boundary rules, E2E tests that launch browsers are strictly the verifier's job. Tests written to `e2e/sync-offline.spec.ts` and `playwright.config.ts` created. Chromium browser installation (`playwright install chromium`) deferred to verifier phase. This is by design, not a failure.

## User Setup Required

None — no external service configuration required for this plan.

## Next Phase Readiness

- Sync infrastructure complete — `SyncProvider` ready to be added to the root layout (`src/app/layout.tsx`)
- `OfflineBanner` and `SyncIndicator` ready to integrate into the app shell
- `hydrateDexie` will populate Dexie from Turso once Turso credentials are configured (per plan 01-02 user setup)
- Ready for 01-05: Wine list UI which relies on hydrated Dexie data

## Self-Check: PASSED

- `src/app/api/ping/route.ts` — FOUND ✓
- `src/hooks/useNetworkStatus.ts` — FOUND ✓
- `src/lib/sync/sync-service.ts` — FOUND ✓
- `src/hooks/useSync.ts` — FOUND ✓
- `src/components/providers/SyncProvider.tsx` — FOUND ✓
- `src/components/layout/OfflineBanner.tsx` — FOUND ✓
- `src/components/layout/SyncIndicator.tsx` — FOUND ✓
- `e2e/sync-offline.spec.ts` — FOUND ✓
- `playwright.config.ts` — FOUND ✓
- Commit `44eb4d1` (Task 1: network status + ping + sync service) — FOUND ✓
- Commit `cf3605b` (Task 2: SyncProvider + OfflineBanner + SyncIndicator + E2E) — FOUND ✓
- TypeScript: `tsc --noEmit` exits 0 ✓
- No `db.transaction()` calls in sync-service.ts (only in comments) ✓

---
*Phase: 01-core-inventory*
*Completed: 2026-05-22*
