---
phase: 01-core-inventory
plan: "07"
subsystem: auth
tags: [next.js, server-actions, auth, logout, mobile-nav, playwright, e2e]

# Dependency graph
requires:
  - phase: 01-core-inventory
    provides: logoutAction server action (destroySession + redirect /login) in src/app/login/actions.ts
provides:
  - Logout button in MobileNav calling logoutAction via <form action={logoutAction}>
  - E2E tests covering logout redirect and auth guard verification
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Server Action called via <form action={serverAction}> in client component for Next.js 15 redirect compatibility"
    - "Absolute-positioned logout icon in bottom nav — does not disrupt fixed tab count"

key-files:
  created: []
  modified:
    - src/components/layout/MobileNav.tsx
    - e2e/wine-list.spec.ts

key-decisions:
  - "Used <form action={logoutAction}> pattern — calling server action that calls redirect() from client component onClick would throw in Next.js 15; form submission routes through server correctly"
  - "Logout placed as absolute top-right icon in nav bar — preserves 4-tab layout (Cellar, Ready Now, Add, Insights) unchanged"

patterns-established:
  - "Server Actions with redirect(): invoke via <form action={...}> not onClick in client components"

# Metrics
duration: 2min
completed: 2026-05-28
---

# Phase 1 Plan 07: Logout Button in MobileNav Summary

**Wired existing `logoutAction` server action to a visible logout icon in MobileNav via `<form action={logoutAction}>`, enabling session clearance and auth guard E2E verification**

## Performance

- **Duration:** 2 min
- **Started:** 2026-05-28T22:18:33Z
- **Completed:** 2026-05-28T22:20:19Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Added `LogOut` icon button to MobileNav absolutely positioned at top-right (does not disrupt 4-tab layout)
- Wired to `logoutAction` via `<form action={logoutAction}>` for correct Next.js 15 server action redirect behavior
- Button has `aria-label="Logout"` for accessibility and E2E test targeting
- Added 2 E2E test cases in `e2e/wine-list.spec.ts`: logout redirect + auth guard post-logout

## Task Commits

Each task was committed atomically:

1. **Task 1: Add logout button to MobileNav** - `f55227f` (feat)
2. **Task 2: Update E2E test for logout flow** - `4a16883` (test)

**Plan metadata:** (docs commit follows)

_Note: E2E tests written; execution deferred to verify phase._

## Files Created/Modified

- `src/components/layout/MobileNav.tsx` - Added `logoutAction` import, `LogOut` icon import, and absolute-positioned logout form button in nav
- `e2e/wine-list.spec.ts` - Added "Logout flow" describe block with 2 tests: logout redirect and auth guard post-logout

## Decisions Made

- Used `<form action={logoutAction}>` instead of `onClick={() => logoutAction()}` — `logoutAction` calls `redirect()` server-side; form submission handles the redirect correctly in Next.js 15 client components
- Logout button placed absolutely at `top-2 right-2` inside a `relative` nav container — preserves all 4 existing tab items unchanged

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Pre-existing TypeScript environment issue: standalone `tsc --noEmit` reports `JSX.IntrinsicElements` and `Cannot find module 'next/...'` errors across the entire codebase — these are environment-level issues present before this plan. No new errors introduced by changes.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 01-core-inventory is now fully complete (all 7 plans done)
- Auth guard is testable: logout button present in MobileNav, E2E tests cover full auth cycle
- Ready for Phase 2 planning (Drinking Windows & Status)

## Self-Check: PASSED

- ✅ `src/components/layout/MobileNav.tsx` — exists on disk
- ✅ `e2e/wine-list.spec.ts` — exists on disk
- ✅ `.planning/phases/01-core-inventory/01-07-SUMMARY.md` — exists on disk
- ✅ Commit `f55227f` (feat(01-07): add logout button to MobileNav) — verified in git log
- ✅ Commit `4a16883` (test(01-07): add logout E2E tests) — verified in git log

---

_Phase: 01-core-inventory_
_Completed: 2026-05-28_
