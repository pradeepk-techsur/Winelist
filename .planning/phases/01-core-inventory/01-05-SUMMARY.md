---
phase: 01-core-inventory
plan: "05"
subsystem: ui
tags: [zustand, dexie, useLiveQuery, react, mobile-nav, offline-first, wine-list, playwright]

# Dependency graph
requires:
  - phase: 01-core-inventory
    plan: "01"
    provides: "Next.js 15 foundation, auth middleware, SyncProvider, OfflineBanner, SyncIndicator"
  - phase: 01-core-inventory
    plan: "02"
    provides: "Dexie schema (LocalWine), dexieDb instance"
  - phase: 01-core-inventory
    plan: "03"
    provides: "Server Actions (getWines) for hydration"
provides:
  - useWines hook with correct useLiveQuery undefined/empty/data state handling
  - Zustand cellar-store for filter/sort UI state (no wine data)
  - Zustand ui-store for drawer open/editingWineId state
  - WineCard component (name, producer, vintage, type, quantity, status badge)
  - WineStatusBadge component (in_window/approaching/not_yet/past_window/no_window)
  - (app) route group layout with server-side auth check + SyncProvider + MobileNav
  - Cellar page with loading skeletons, empty state, and wine list rendering
  - Bottom tab navigation (Cellar, Ready Now, Add+, Insights)
  - Skeleton UI component
  - Playwright E2E tests for wine list (auth redirect, nav visibility, empty state, crash-free)
affects: [01-06, 02-wine-detail, 03-edit, 04-delete]

# Tech tracking
tech-stack:
  added:
    - skeleton.tsx (shadcn-compatible animated skeleton component)
  patterns:
    - "useLiveQuery 3-state handling: undefined=loading, []=empty, LocalWine[]=data — NEVER wines ?? []"
    - "Zustand for UI state only — wine data lives in Dexie, never Zustand"
    - "(app) route group for authenticated route isolation with server-side auth check"
    - "Bottom tab nav (fixed bottom): Cellar / Ready Now / Add / Insights"
    - "WineCard links to /wine/[id] for detail view"

key-files:
  created:
    - src/lib/stores/cellar-store.ts
    - src/lib/stores/ui-store.ts
    - src/hooks/useWines.ts
    - src/components/wine/WineCard.tsx
    - src/components/wine/WineStatusBadge.tsx
    - src/app/(app)/layout.tsx
    - src/app/(app)/cellar/page.tsx
    - src/app/(app)/page.tsx
    - src/app/(app)/ready/page.tsx
    - src/app/(app)/insights/page.tsx
    - src/components/layout/MobileNav.tsx
    - src/components/ui/skeleton.tsx
    - e2e/wine-list.spec.ts
  modified:
    - src/app/page.tsx (deleted — superseded by (app)/page.tsx)

key-decisions:
  - "useLiveQuery returns { wines, isLoading, isEmpty } — undefined is loading NOT empty (PITFALLS Pitfall 3)"
  - "Cellar page uses (app) route group for isolated layout with auth + sync"
  - "Bottom tab bar (fixed bottom) per ARCHITECTURE.md mobile navigation section — not hamburger/sidebar"
  - "Removed conflicting src/app/page.tsx — (app)/page.tsx redirects / to /cellar"
  - "Skeleton component created locally (not from shadcn CLI) — simple, matching project style"

patterns-established:
  - "Wine list pattern: isLoading → skeletons, isEmpty → empty state, wines.length > 0 → WineCard list"
  - "WineStatusBadge: computeDrinkingStatus from drinkFrom/drinkBy dates, centralized status display"
  - "Route group (app) wraps all authenticated routes with SyncProvider + MobileNav"

# Metrics
duration: 9min
completed: 2026-05-22
---

# Phase 1 Plan 05: Wine List UI Summary

**useLiveQuery-powered wine list with correct 3-state handling (undefined/empty/data), mobile bottom nav, WineCard with status badge, and Zustand UI state stores — INV-02 and MOB-01 fully implemented**

## Performance

- **Duration:** 9 min
- **Started:** 2026-05-22T01:29:36Z
- **Completed:** 2026-05-22T01:39:08Z
- **Tasks:** 2 completed
- **Files modified:** 13 created, 1 deleted

## Accomplishments

- `useWines` hook with correct `useLiveQuery` undefined-handling — loading shows skeletons, empty shows empty state, data shows WineCard list
- Zustand stores: `cellar-store` (filter/sort UI state) and `ui-store` (drawer state) — no wine data in Zustand ever
- `WineStatusBadge` computes drinking status from drinkFrom/drinkBy with 5 states: in_window, approaching, not_yet, past_window, no_window
- `WineCard` shows name, producer, vintage, type (color-coded by wine type), quantity, and status badge — links to `/wine/[id]`
- `(app)` route group layout: server-side auth check, SyncProvider, OfflineBanner, MobileNav wrapping all authenticated routes
- Cellar page: skeleton cards during loading, 🍾 empty state when no wines, WineCard list when data exists
- Bottom tab navigation: Cellar, Ready Now, Add (opens drawer), Insights — fixed bottom per ARCHITECTURE.md
- Placeholder pages for `/ready` and `/insights` (no 404s on nav tab taps)
- Playwright E2E test file created with 5 tests for auth redirect, nav visibility, empty state, crash-free behavior

## Task Commits

Each task was committed atomically:

1. **Task 1: Zustand stores, useWines hook, WineCard, WineStatusBadge** - `fad86f3` (feat)
2. **Task 2: App layout with bottom nav, cellar page, and Playwright tests** - `619363a` (feat)

**Plan metadata:** TBD (docs: complete plan)

_Note: E2E tests written; execution deferred to verify phase (requires running browser environment)._

## Files Created/Modified

- `src/lib/stores/cellar-store.ts` — Zustand: filter/sort state (UI only, no wine data)
- `src/lib/stores/ui-store.ts` — Zustand: drawer open/editingWineId state
- `src/hooks/useWines.ts` — useLiveQuery wrapper with 3-state handling ({ wines, isLoading, isEmpty })
- `src/components/wine/WineStatusBadge.tsx` — drinking status pill component
- `src/components/wine/WineCard.tsx` — wine list item (name, producer, vintage, type, quantity, badge)
- `src/app/(app)/layout.tsx` — authenticated app shell (server auth check + SyncProvider + MobileNav)
- `src/app/(app)/page.tsx` — redirects `/` to `/cellar`
- `src/app/(app)/cellar/page.tsx` — wine list page with skeleton/empty/data states
- `src/app/(app)/ready/page.tsx` — placeholder: Ready to Drink (Phase 2)
- `src/app/(app)/insights/page.tsx` — placeholder: Insights (Phase 6)
- `src/components/layout/MobileNav.tsx` — bottom tab navigation bar (4 tabs)
- `src/components/ui/skeleton.tsx` — animated skeleton loading component
- `e2e/wine-list.spec.ts` — Playwright E2E tests for wine list
- `src/app/page.tsx` — DELETED (superseded by (app)/page.tsx)

## Decisions Made

- **useLiveQuery 3-state pattern:** `wines === undefined` is loading; `wines.length === 0` is empty. Never use `wines ?? []` which hides the loading state (PITFALLS.md Pitfall 3).
- **Zustand holds only UI state:** filter preferences, sort order, drawer state — wine data lives exclusively in Dexie, never Zustand. (PITFALLS.md tech debt table).
- **Bottom tab bar:** Fixed bottom navigation per ARCHITECTURE.md Mobile Navigation section — not hamburger/sidebar.
- **Deleted conflicting src/app/page.tsx:** The `(app)` route group's `page.tsx` supersedes the root `page.tsx` — both can't coexist handling the `/` route.
- **Skeleton created locally:** Simple inline skeleton component matching project style (no shadcn CLI needed for this simple component).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Created skeleton.tsx component**
- **Found during:** Task 2 (cellar page implementation)
- **Issue:** `src/components/ui/skeleton.tsx` referenced in the cellar page was not yet installed (shadcn's `pnpm shadcn add skeleton` wasn't run, no skeleton component in components/ui/)
- **Fix:** Created a simple skeleton component matching shadcn's API (`animate-pulse`, `rounded-md`, `bg-white/10`) directly
- **Files modified:** `src/components/ui/skeleton.tsx`
- **Verification:** TypeScript compiles clean, component matches expected API usage in cellar page
- **Committed in:** 619363a (Task 2 commit)

**2. [Rule 3 - Blocking] Removed conflicting src/app/page.tsx**
- **Found during:** Task 2 (routing analysis)
- **Issue:** Both `src/app/page.tsx` (old placeholder) and `src/app/(app)/page.tsx` (new redirect) would handle the `/` route in Next.js — the route group `(app)` does not add a URL segment, so both files compete for `/`
- **Fix:** Removed `src/app/page.tsx` — the new `(app)/page.tsx` redirect to `/cellar` is the correct behavior
- **Files modified:** `src/app/page.tsx` (deleted)
- **Verification:** TypeScript compiles clean, no routing ambiguity
- **Committed in:** 619363a (Task 2 commit)

**3. [Rule 1 - Bug] Fixed TypeScript type error in E2E test helper**
- **Found during:** Task 2 (TypeScript check of e2e/wine-list.spec.ts)
- **Issue:** Login helper function used complex conditional type extraction from `test.fn` which resolved to `never`
- **Fix:** Used explicit `import { type Page } from "@playwright/test"` and typed the parameter as `page: Page`
- **Files modified:** `e2e/wine-list.spec.ts`
- **Verification:** `npx tsc --noEmit` exits 0
- **Committed in:** 619363a (Task 2 commit)

---

**Total deviations:** 3 auto-fixed (2 blocking issues, 1 bug)
**Impact on plan:** All fixes necessary for compilation and correct routing. No scope creep.

## Issues Encountered

- `src/app/(app)` route group layout with infrastructure components (SyncProvider, OfflineBanner, SyncIndicator) depended on files from plan 01-04. Those components were already committed by the time plan 01-05 execution began (committed in a previous session's `chore: update workspace artifacts` commit).
- E2E tests written to file; full execution deferred to verify phase (cannot run playwright in this environment without a browser).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Wine list UI complete — INV-02 (view wine list) fully implemented
- Mobile layout with bottom navigation complete — MOB-01 implemented
- Ready for Plan 01-06: Wine form (Add/Edit) and WineDrawer component
- All components in place for INV-03 (detail), INV-04 (edit), INV-05 (delete) to build on top of

## Self-Check: PASSED

| Check | Result |
|-------|--------|
| src/hooks/useWines.ts | ✅ FOUND |
| src/components/wine/WineCard.tsx | ✅ FOUND |
| src/components/wine/WineStatusBadge.tsx | ✅ FOUND |
| src/components/layout/MobileNav.tsx | ✅ FOUND |
| src/lib/stores/cellar-store.ts | ✅ FOUND |
| src/lib/stores/ui-store.ts | ✅ FOUND |
| src/app/(app)/layout.tsx | ✅ FOUND |
| src/app/(app)/cellar/page.tsx | ✅ FOUND |
| src/app/(app)/page.tsx | ✅ FOUND |
| src/components/ui/skeleton.tsx | ✅ FOUND |
| e2e/wine-list.spec.ts | ✅ FOUND |
| Commit fad86f3 (Task 1) | ✅ FOUND |
| Commit 619363a (Task 2) | ✅ FOUND |
| npx tsc --noEmit | ✅ PASSES |

---
*Phase: 01-core-inventory*
*Completed: 2026-05-22*
