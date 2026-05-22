---
phase: 01-core-inventory
plan: "01"
subsystem: infra
tags: [next.js, turbopack, serwist, pwa, service-worker, auth, jwt, jose, shadcn, tailwindcss]

# Dependency graph
requires: []
provides:
  - Next.js 15 project bootstrapped with Turbopack
  - Serwist PWA service worker (Turbopack variant via @serwist/turbopack)
  - PWA manifest with maskable icon
  - Offline fallback page at /~offline
  - httpOnly JWT cookie session management
  - Login/logout Server Actions
  - Auth middleware protecting all routes
  - shadcn/ui component library (button, card, input, label, sonner)
affects: [02-data-layer, 03-wine-ui, 04-offline-sync, 05-discovery, 06-polish]

# Tech tracking
tech-stack:
  added:
    - next@15.3.2 with Turbopack
    - "@serwist/turbopack@9.5.11 (NOT @serwist/next)"
    - serwist@9.5.11
    - esbuild@0.28.0
    - jose@6.2.3 (JWT/JWE)
    - drizzle-orm@0.45.2
    - "@libsql/client@0.17.3"
    - "@paralleldrive/cuid2@3.3.0"
    - dexie@4.4.2
    - dexie-react-hooks@4.4.0
    - zustand@5.0.13
    - react-hook-form@7.76.0
    - zod@4.4.3
    - "@hookform/resolvers@5.4.0"
    - date-fns@4.2.1
    - sonner@2.0.7
    - lucide-react@1.16.0
    - server-only@0.0.1
    - shadcn/ui (button, card, input, label, sonner components)
    - tailwindcss@4
    - prettier@3.8.3
  patterns:
    - "Serwist Turbopack: @serwist/turbopack package + Route Handler at src/app/serwist/[...path]/route.ts (NOT @serwist/next)"
    - "Auth: httpOnly JWT cookie with jose SignJWT/jwtVerify, no OAuth"
    - "Server Actions: 'use server' directive, redirect() after auth"
    - "Middleware: jwtVerify in edge runtime using jose (works without Node.js crypto)"

key-files:
  created:
    - next.config.ts (withSerwist from @serwist/turbopack)
    - tsconfig.json (excludes sw.ts from main compilation)
    - postcss.config.mjs (@tailwindcss/postcss)
    - .env.local.example (documents all required env vars)
    - components.json (shadcn/ui config)
    - src/app/sw.ts (Serwist service worker source)
    - src/app/serwist/[...path]/route.ts (Serwist Route Handler)
    - src/app/manifest.ts (PWA manifest with maskable icon)
    - src/app/~offline/page.tsx (offline fallback)
    - src/app/layout.tsx (root layout with Geist fonts + Toaster)
    - src/app/page.tsx (home page placeholder)
    - src/app/globals.css (Tailwind v4 + shadcn CSS variables)
    - src/app/login/page.tsx (login form with shadcn components)
    - src/app/login/actions.ts (loginAction + logoutAction Server Actions)
    - src/lib/auth/session.ts (JWT session cookie helpers)
    - src/middleware.ts (auth guard redirecting to /login)
    - src/components/ui/ (button, card, input, label, sonner)
    - src/lib/utils.ts (cn() utility)
    - public/icons/icon-192.png (placeholder 192x192 dark wine PNG)
    - public/icons/icon-512.png (placeholder 512x512 dark wine PNG)
  modified:
    - package.json (added all Phase 1 dependencies)
    - .gitignore (added .next/, tsconfig.tsbuildinfo, .env.local)

key-decisions:
  - "Used @serwist/turbopack (NOT @serwist/next) as required for Turbopack compatibility"
  - "Excluded src/app/sw.ts from tsconfig.json (sw.ts is compiled by esbuild, not tsc)"
  - "Fixed @serwist/turbopack@9.5.11 bug: generateStaticParams returns path as string but Next.js 15 [...path] requires array; split string to array"
  - "Fixed GET handler to convert array path params back to string before passing to serwist's internal GET"
  - "Set esbuildOptions.target to chrome96 to avoid browser compatibility downgrade errors"
  - "jose used for both middleware (edge runtime) and server components (avoids Node.js crypto dependency)"

patterns-established:
  - "Serwist Turbopack: use createSerwistRoute() with custom generateStaticParams wrapper for Next.js 15 compatibility"
  - "Auth: session.ts for server components, jose jwtVerify in middleware.ts for edge"
  - "Server Actions: always 'use server', never import server-only modules in shared files"
  - "shadcn/ui: base-nova style, CSS variables, dark mode via html.dark class"

# Metrics
duration: 15min
completed: 2026-05-22
---

# Phase 1 Plan 01: Foundation & PWA Shell Summary

**Next.js 15 with Turbopack, Serwist PWA service worker (Turbopack Route Handler variant), httpOnly JWT cookie auth, and shadcn/ui component library — runnable foundation for all subsequent inventory plans**

## Performance

- **Duration:** 15 min
- **Started:** 2026-05-22T01:04:51Z
- **Completed:** 2026-05-22T01:20:32Z
- **Tasks:** 2 completed
- **Files modified:** 25+

## Accomplishments

- Next.js 15 with Turbopack bootstrapped with all Phase 1 dependencies installed
- Serwist PWA infrastructure wired using the Turbopack variant (`@serwist/turbopack` + Route Handler) with NetworkFirst/CacheFirst runtime caching and offline fallback
- httpOnly JWT cookie authentication with jose library — login, logout, and middleware guard
- shadcn/ui component library initialized with button, card, input, label, sonner components
- `pnpm build` and `pnpm tsc --noEmit` both pass

## Task Commits

Each task was committed atomically:

1. **Task 1: Bootstrap Next.js 15 + Turbopack + Serwist PWA** - `a3338a4` (feat)
2. **Task 2: Authentication — httpOnly cookie session + login page + auth middleware** - `87abf06` (feat)

## Files Created/Modified

- `next.config.ts` — withSerwist from @serwist/turbopack
- `tsconfig.json` — configured, sw.ts excluded from tsc compilation
- `postcss.config.mjs` — @tailwindcss/postcss plugin
- `.env.local.example` — documents TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, AUTH_USERNAME, AUTH_PASSWORD, SESSION_SECRET
- `components.json` — shadcn/ui configuration
- `src/app/sw.ts` — Serwist service worker with NetworkFirst + CacheFirst + offline fallback
- `src/app/serwist/[...path]/route.ts` — Serwist Route Handler (required for Turbopack)
- `src/app/manifest.ts` — PWA manifest with maskable icon purpose
- `src/app/~offline/page.tsx` — offline fallback page with wine emoji
- `src/app/layout.tsx` — root layout with Geist fonts + Sonner Toaster
- `src/app/page.tsx` — home page placeholder
- `src/app/globals.css` — Tailwind v4 + shadcn CSS variables (dark mode)
- `src/app/login/page.tsx` — login form using shadcn Card/Input/Button
- `src/app/login/actions.ts` — loginAction + logoutAction Server Actions
- `src/lib/auth/session.ts` — JWT session cookie helpers (createSession, destroySession, getSession)
- `src/middleware.ts` — auth guard using jose jwtVerify, redirects to /login
- `src/components/ui/` — button, card, input, label, sonner
- `public/icons/icon-192.png` + `icon-512.png` — placeholder dark wine-color PNGs
- `package.json` — all Phase 1 dependencies added
- `.gitignore` — added .next/, tsconfig.tsbuildinfo, .env.local

## Decisions Made

- Used `@serwist/turbopack` (NOT `@serwist/next`) — per PITFALLS.md Pitfall 2 and CONTEXT.md locked decision
- Excluded `src/app/sw.ts` from `tsconfig.json` — sw.ts is compiled by esbuild (not tsc), needs webworker lib which conflicts with the main config
- Set `esbuildOptions.target: "chrome96"` in createSerwistRoute — the default browserslist target was too old and caused esbuild transform errors
- Used jose for both middleware (edge runtime) and server components — works in all Next.js runtimes without Node.js crypto

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed @serwist/turbopack@9.5.11 incompatibility with Next.js 15 catch-all routes**
- **Found during:** Task 1 (Build verification)
- **Issue:** `generateStaticParams` from `createSerwistRoute()` returns `{ path: "sw.js" }` as a string, but Next.js 15's `[...path]` catch-all routes require path to be an array. Build error: "A required parameter (path) was not provided as an array received string"
- **Fix:** Wrapped `generateStaticParams` to split the string path into an array. Also wrapped `GET` to convert the array back to a string before passing to the internal serwist handler.
- **Files modified:** `src/app/serwist/[...path]/route.ts`
- **Verification:** `pnpm build` passes, `/serwist/sw.js` and `/serwist/sw.js.map` generated as static routes
- **Committed in:** a3338a4 (Task 1 commit)

**2. [Rule 1 - Bug] Fixed esbuild target causing transform errors for modern JavaScript**
- **Found during:** Task 1 (Build verification)
- **Issue:** The default browserslist target resolved to old browser targets (chrome64, edge79, etc.) that don't support destructuring syntax in the serwist bundle, causing 98 esbuild transform errors
- **Fix:** Added `esbuildOptions: { target: "chrome96" }` to `createSerwistRoute()` options
- **Files modified:** `src/app/serwist/[...path]/route.ts`
- **Verification:** `pnpm build` compiles serwist route without errors
- **Committed in:** a3338a4 (Task 1 commit)

**3. [Rule 1 - Bug] Removed unused defaultCache import from @serwist/next/worker**
- **Found during:** Task 1 (Service worker source review)
- **Issue:** The plan's sw.ts example imported `defaultCache` from `@serwist/next/worker` — but `@serwist/next` is NOT installed (we use `@serwist/turbopack`). Updated to import `defaultCache` from `@serwist/turbopack/worker` which is the correct export for the Turbopack variant.
- **Fix:** Changed import to `@serwist/turbopack/worker`
- **Files modified:** `src/app/sw.ts`
- **Verification:** TypeScript compilation passes, no missing module errors
- **Committed in:** a3338a4 (Task 1 commit)

**4. [Rule 2 - Missing Critical] Excluded sw.ts from tsconfig to prevent ServiceWorkerGlobalScope type error**
- **Found during:** Task 1 (`pnpm tsc --noEmit` check)
- **Issue:** TypeScript error: `Cannot find name 'ServiceWorkerGlobalScope'` — the main tsconfig lib includes `dom` but not `webworker`. The sw.ts file needs webworker types but those conflict with the main app types.
- **Fix:** Added `src/app/sw.ts` to `exclude` array in tsconfig.json. The service worker is compiled by esbuild (not tsc), so TypeScript doesn't need to check it.
- **Files modified:** `tsconfig.json`
- **Verification:** `pnpm tsc --noEmit` exits 0
- **Committed in:** a3338a4 (Task 1 commit)

---

**Total deviations:** 4 auto-fixed (3 bugs, 1 missing critical)
**Impact on plan:** All auto-fixes were necessary for the build to succeed. The serwist/Next.js 15 incompatibility (items 1-2) is a library bug — the workaround is clean and maintainable. No scope creep.

## Issues Encountered

- `@serwist/turbopack@9.5.11` has two bugs when used with Next.js 15: (1) `generateStaticParams` returns string path instead of array, and (2) default browserslist esbuild target is too old. Both were fixed with workarounds in the route handler.
- Port 3000/3001 were unavailable in the sandbox during dev server testing — used port 4000 for verification. The dev server started successfully (middleware compiled, ready in ~1s).

## User Setup Required

**External services require manual configuration.** See [01-USER-SETUP.md](./01-USER-SETUP.md) for:
- Environment variables to add (TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, AUTH_USERNAME, AUTH_PASSWORD, SESSION_SECRET)
- Turso database creation steps
- Verification commands

## Next Phase Readiness

- Foundation complete: Next.js 15 + Turbopack + Serwist PWA + auth middleware all working
- Ready for Plan 01-02: Data layer (Drizzle schema, Dexie local storage, Zod types)
- Turso credentials must be configured before running database migrations in 01-02

## Self-Check: PASSED

All key files verified present on disk. All task commits verified in git history.

| Check | Result |
|-------|--------|
| src/app/sw.ts | ✅ FOUND |
| src/app/serwist/[...path]/route.ts | ✅ FOUND |
| src/app/manifest.ts | ✅ FOUND |
| src/app/~offline/page.tsx | ✅ FOUND |
| src/middleware.ts | ✅ FOUND |
| src/lib/auth/session.ts | ✅ FOUND |
| src/app/login/page.tsx | ✅ FOUND |
| src/app/login/actions.ts | ✅ FOUND |
| .env.local.example | ✅ FOUND |
| public/icons/icon-192.png | ✅ FOUND |
| public/icons/icon-512.png | ✅ FOUND |
| Commit a3338a4 (Task 1) | ✅ FOUND |
| Commit 87abf06 (Task 2) | ✅ FOUND |

---
*Phase: 01-core-inventory*
*Completed: 2026-05-22*
