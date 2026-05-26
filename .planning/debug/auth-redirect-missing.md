---
status: diagnosed
trigger: "Unauthenticated users should be redirected to /login when navigating to any protected route — does not redirect"
created: 2026-05-26T21:38:00Z
updated: 2026-05-26T21:42:00Z
---

## Current Focus

hypothesis: logoutAction is defined but never exposed in the UI, so UAT tester retained a valid session cookie from prior login
test: grep all components for logoutAction usage
expecting: zero imports found (confirmed)
next_action: DIAGNOSED — root cause confirmed

## Symptoms

expected: Unauthenticated users should be redirected to /login when navigating to any protected route
actual: "does not redirect" (reported by manual UAT tester)
errors: None reported
reproduction: Visit app root without a session cookie
started: Discovered during UAT Phase 1

## Eliminated

- hypothesis: Middleware matcher excludes the root path / from coverage
  evidence: Matcher "/((?!\_next/static|\_next/image|favicon.ico).\*)" correctly matches "/" — confirmed by regex test
  timestamp: 2026-05-26T21:39:00Z

- hypothesis: withSerwist() in next.config.ts modifies or disables middleware
  evidence: withSerwist() only adds serverExternalPackages (esbuild, esbuild-wasm) — does not touch middleware config
  timestamp: 2026-05-26T21:39:00Z

- hypothesis: Compiled middleware differs from source (Turbopack compilation bug)
  evidence: .next/server/edge/chunks/[root-of-the-server]\__dc15d093._.js shows middleware compiled correctly with all redirect logic intact
  timestamp: 2026-05-26T21:40:00Z

- hypothesis: Service worker intercepts navigation and serves stale cached page
  evidence: In development (NODE_ENV !== "production"), defaultCache from @serwist/turbopack uses NetworkOnly for all requests — no caching occurs in dev
  timestamp: 2026-05-26T21:41:00Z

- hypothesis: Middleware itself is broken and doesn't redirect
  evidence: curl http://localhost:3000/ (no cookie) returns HTTP/1.1 307 Temporary Redirect → location: /login — middleware works correctly at server level
  timestamp: 2026-05-26T21:41:00Z

## Evidence

- timestamp: 2026-05-26T21:38:00Z
  checked: src/middleware.ts
  found: Middleware logic is correct — checks PUBLIC_PATHS, reads SESSION_COOKIE, redirects to /login if no token or invalid JWT
  implication: Middleware implementation is not the bug

- timestamp: 2026-05-26T21:39:00Z
  checked: next.config.ts + @serwist/turbopack/dist/index.mjs
  found: withSerwist() only adds esbuild/esbuild-wasm to serverExternalPackages — no middleware interference
  implication: Middleware config is unaffected by Serwist

- timestamp: 2026-05-26T21:39:00Z
  checked: .next/server/middleware-manifest.json
  found: Middleware correctly registered with matcher "/((?!\_next/static|\_next/image|favicon.ico).\*)"
  implication: Middleware is compiled and registered properly by Next.js

- timestamp: 2026-05-26T21:41:00Z
  checked: curl http://localhost:3000/ without session cookie
  found: HTTP/1.1 307 Temporary Redirect, location: /login
  implication: Server-side redirect works perfectly — the bug is client-side

- timestamp: 2026-05-26T21:42:00Z
  checked: grep for logoutAction in src/components/ and src/app/ (excluding actions.ts)
  found: Zero results — logoutAction is defined in src/app/login/actions.ts but never imported or called anywhere
  implication: There is NO logout UI in the application

- timestamp: 2026-05-26T21:42:00Z
  checked: src/components/layout/MobileNav.tsx
  found: Nav contains Cellar, Ready Now, Add (+), and Insights links only — no logout button
  implication: Users have no way to clear their session cookie through the UI

- timestamp: 2026-05-26T21:42:00Z
  checked: UAT test results (.planning/phases/01-core-inventory/01-UAT.md)
  found: Test 12 (Logout) was SKIPPED — consistent with no logout button being available
  implication: Corroborates that the tester couldn't log out before Test 1

## Resolution

root_cause: |
The middleware auth redirect works correctly — confirmed via curl (307 to /login when no cookie).
The actual cause of "does not redirect" is that the manual UAT tester had a VALID session cookie
from a prior login. Since logoutAction exists in src/app/login/actions.ts but is never wired to
any UI component (no logout button, no logout link anywhere in the app), the tester was unable
to log out. When they "visited the app without being logged in," their browser still sent the
valid cookie, so middleware correctly allowed the request through. There was no redirect because
the user WAS authenticated (from the server's perspective).

fix: Add a logout button to the UI that calls logoutAction — e.g. in MobileNav, a settings menu, or on the cellar page header.
verification: empty
files_changed: []
