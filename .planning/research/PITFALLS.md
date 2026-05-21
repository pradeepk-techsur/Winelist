# Pitfalls Research

**Domain:** Personal wine collection management — mobile-first PWA, offline-first, Next.js 15 + Turso + Dexie.js
**Researched:** 2026-05-21
**Confidence:** HIGH (stack-specific, all verified against official docs)

---

## Critical Pitfalls

### Pitfall 1: Dexie IndexedDB Transaction Killed by Fetch Call

**What goes wrong:**
Inside a Dexie transaction, any `await` on a non-Dexie async API (like `fetch()`, Server Actions, `crypto`) causes the IndexedDB transaction to auto-commit and then throws `TransactionInactiveError` when subsequent Dexie operations run.

```typescript
// BROKEN — fetch inside a transaction kills it
await db.transaction('rw', db.wines, db.syncQueue, async () => {
  await db.wines.put(wineRecord);           // OK
  const result = await addWine(wineRecord); // BAD: fetch-based Server Action commits transaction early
  await db.syncQueue.delete(entry.id!);     // TransactionInactiveError
});
```

**Why it happens:**
IndexedDB spec: a transaction auto-commits as soon as no pending IDB requests exist in the current microtask tick. Any external async API (including `fetch`, `setTimeout`, `crypto`) yields control past the IDB event loop, which the browser interprets as "transaction done." Dexie can't override this browser-level behavior.

**How to avoid:**
Never mix Server Action calls (or any `fetch`) inside a Dexie `db.transaction()` scope. Sequence Dexie operations and network calls separately:

```typescript
// CORRECT — Dexie writes first, then network call outside transaction
await db.wines.put(wineRecord);              // Dexie write (auto-transaction)
await db.syncQueue.add(queueEntry);          // Dexie write

if (isOnline) {
  const result = await addWine(wineRecord);  // Network call — OUTSIDE any transaction
  if (result.success) {
    await db.wines.update(id, { _syncedAt: new Date().toISOString() });
    await db.syncQueue.delete(queueEntry.id!);
  }
}
```

**Warning signs:**
- `TransactionInactiveError` in browser console during sync
- Intermittent "some writes missing" bugs that only appear when online

**Phase to address:** Phase 1 — Offline Sync Infrastructure. This must be designed correctly from the first write operation or retrofitting is painful.

---

### Pitfall 2: Tursopack vs. Webpack Incompatibility — Serwist Requires Different Setup

**What goes wrong:**
`@serwist/next` (the webpack-based package) does **not** work with `--turbopack` dev flag. If you start with webpack setup and switch to Turbopack (or vice versa), the service worker compilation completely breaks with cryptic errors about `swSrc` not found or manifest injection failing.

**Why it happens:**
The Serwist Turbopack integration is an entirely separate package (`@serwist/turbopack`), with a different integration pattern — it uses a Route Handler at `app/serwist/[path]/route.ts` instead of `next.config.mjs` wrapping. The two approaches are mutually incompatible. The official docs treat them as separate quick-start guides.

**How to avoid:**
Decide upfront: Webpack (standard) or Turbopack. Do not mix. The Turbopack path requires:

```bash
npm install -D @serwist/turbopack esbuild serwist
```

```typescript
// next.config.mjs — Turbopack approach
import { withSerwist } from "@serwist/turbopack";
export default withSerwist({ /* next config */ });

// app/serwist/[path]/route.ts  ← required for Turbopack
import { createSerwistRoute } from "@serwist/turbopack";
export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
  swSrc: "app/sw.ts",
  useNativeEsbuild: true,
});
```

The webpack path is simpler but doesn't support `next dev --turbopack`. Since this project targets fast DX with Turbopack, use the Turbopack integration from day one.

**Warning signs:**
- Service worker file not found (404) in browser DevTools
- Build succeeds but `public/sw.js` is empty or missing `__SW_MANIFEST`
- `next dev --turbopack` with `@serwist/next` (webpack version) silently fails

**Phase to address:** Phase 1 — Foundation and PWA Shell. Get this right in initial project setup.

---

### Pitfall 3: `useLiveQuery` Returns `undefined` on Initial Render — Treated as Error

**What goes wrong:**
`useLiveQuery()` returns `undefined` on the first render (before the async query resolves). Components that don't handle this correctly either crash with `Cannot read property of undefined`, render blank without explanation, or worse, treat `undefined` as "empty collection" and show "No wines in your cellar" immediately before data loads.

**Why it happens:**
From official Dexie docs: `useLiveQuery` returns `undefined` (or the `defaultResult` you provide) while the initial query is pending. Developers mistake this for "empty result" rather than "loading state."

```typescript
// BROKEN — undefined treated as empty array
export function useWines() {
  const wines = useLiveQuery(
    () => db.wines.where('status').equals('in_cellar').toArray()
  );
  return wines ?? []; // ← BUG: returns [] while still loading, shows empty state
}

// CORRECT — distinguish loading from empty
export function useWines() {
  const wines = useLiveQuery(
    () => db.wines.where('status').equals('in_cellar').toArray()
  );
  // undefined = loading, [] = genuinely empty, array = data
  const isLoading = wines === undefined;
  return { wines: wines ?? [], isLoading };
}
```

**How to avoid:**
Always check `if (wines === undefined) return <Skeleton />` before rendering. Never use `wines ?? []` as a shorthand that hides the loading state. Provide `defaultResult` when you want a non-`undefined` initial value:

```typescript
const wines = useLiveQuery(
  () => db.wines.where('status').equals('in_cellar').toArray(),
  [],          // deps
  []           // defaultResult — returns [] instead of undefined while loading
);
```

Note: with `defaultResult = []`, you can't distinguish "still loading" from "empty." Only use it where that distinction doesn't matter (e.g., a count badge where `0` is fine while loading).

**Warning signs:**
- "No wines" flash before the list loads
- React error `Cannot read properties of undefined (reading 'map')`
- Skeleton states never show

**Phase to address:** Phase 2 — Wine List and Collection View.

---

### Pitfall 4: Server Action Called from Client Imports Drizzle/Turso into Client Bundle

**What goes wrong:**
If `lib/db/index.ts` (the Drizzle client) is imported anywhere in the `use client` component tree — even transitively through a shared utility — it gets bundled into the client JavaScript. This exposes `TURSO_AUTH_TOKEN` as a hard-coded build-time string (Next.js inlines env vars that aren't `NEXT_PUBLIC_` at build time if they leak into client chunks) and bloats the client bundle with Node.js-only modules.

**Why it happens:**
Server Actions are imported as functions by Client Components, creating a natural path for transitive imports. If `actions/wines.ts` imports from `lib/db/schema.ts` and also re-exports a type that uses `DrizzleD`, TypeScript may force the import of the full schema.

**How to avoid:**
Use `import 'server-only'` at the top of every file that accesses Drizzle or Turso:

```typescript
// lib/db/index.ts
import 'server-only'; // Causes build error if imported in client bundle

import { drizzle } from 'drizzle-orm/libsql/web';
import { createClient } from '@libsql/client/web';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle({ client });
```

Keep Drizzle types out of shared type files. Use `z.infer<typeof WineFormSchema>` in `types/wine.ts` instead of `InferSelectModel<typeof wines>` from Drizzle schema.

**Warning signs:**
- `@libsql/client` in your browser bundle analyzer output
- Build warnings about "node: protocol" imports in client chunks
- Environment variables appearing in the `__NEXT_DATA__` page JSON

**Phase to address:** Phase 1 — Foundation. Must be wired correctly from the first `lib/db` file.

---

### Pitfall 5: Dexie Schema Version Mismatch — Silent Data Loss on App Update

**What goes wrong:**
When the app is updated with a new Dexie schema version (e.g., adding an `appellation` field to wines), returning users on the previous version get a Dexie upgrade that may silently drop data if the version migration isn't handled. Even worse: if the schema string changes without bumping the version number, Dexie silently ignores the new indexes until the user clears IndexedDB.

**Why it happens:**
Dexie uses integer version numbers. If you add a new field and forget to call `db.version(2).stores(...)`, the new index never gets created and queries that filter by it return zero results with no error.

**How to avoid:**
Every schema change — even just adding an index — requires a version bump:

```typescript
class CellarDatabase extends Dexie {
  wines!: Table<LocalWine, string>;
  consumptionEvents!: Table<LocalConsumptionEvent, string>;
  syncQueue!: Table<SyncQueueEntry, number>;

  constructor() {
    super('wine-cellar-v1');
    
    // Version 1: initial schema
    this.version(1).stores({
      wines: 'id, status, type, region, vintage, drinkFrom, drinkBy, producer, updatedAt',
      consumptionEvents: 'id, wineId, consumedAt',
      syncQueue: '++id, table, recordId, createdAt',
    });

    // Version 2: added appellation index
    this.version(2).stores({
      wines: 'id, status, type, region, vintage, drinkFrom, drinkBy, producer, updatedAt, appellation',
      // other tables unchanged but must be re-declared
    });
    // No upgrade() callback needed for just adding an index
  }
}
```

For migrations that need data transformation, use `.upgrade()`:

```typescript
this.version(3).stores({...}).upgrade(async tx => {
  await tx.wines.toCollection().modify(wine => {
    wine.status = wine.status ?? 'in_cellar'; // backfill missing status field
  });
});
```

**Warning signs:**
- Filters that used to work return empty results after deploying schema changes
- New index added to `stores()` string but no version bump — no error, just wrong behavior
- "database version mismatch" errors in console after deploy

**Phase to address:** Phase 2 onward — every schema change must include version management.

---

### Pitfall 6: `navigator.onLine` Is Unreliable for Sync Triggering

**What goes wrong:**
`navigator.onLine` returns `true` even when the user is on a captive portal or has a "connected but no internet" state (hotel WiFi, metered airplane connection). Using it as the only signal to trigger sync results in sync queue entries never being sent while the user thinks they're online, or Server Actions timing out silently.

**Why it happens:**
`navigator.onLine` is a browser property that only checks if the device is connected to *a* network — not whether that network has actual internet connectivity. As of 2026, there is no native browser API that verifies true internet reachability.

**How to avoid:**
Use a two-signal approach: `navigator.onLine` for the offline banner UI (reliable for "definitely offline" detection), and a lightweight connectivity probe (an actual fetch to your own endpoint) before triggering sync:

```typescript
// hooks/useNetworkStatus.ts
'use client';
import { useEffect, useState, useCallback } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isReachable, setIsReachable] = useState<boolean | null>(null);

  // navigator.onLine is reliable for offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => { setIsOnline(false); setIsReachable(false); };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Probe reachability before actual sync
  const checkReachability = useCallback(async () => {
    if (!navigator.onLine) return false;
    try {
      await fetch('/api/ping', { method: 'HEAD', signal: AbortSignal.timeout(3000) });
      setIsReachable(true);
      return true;
    } catch {
      setIsReachable(false);
      return false;
    }
  }, []);

  return { isOnline, isReachable, checkReachability };
}
```

Add a simple `app/api/ping/route.ts` that returns `200 OK`. Before flushing the sync queue, call `checkReachability()`.

**Warning signs:**
- Sync queue grows but never drains despite user reporting "I'm online"
- Server Action timeouts appearing in logs from users in hotel/airport WiFi

**Phase to address:** Phase 2 — Offline Infrastructure.

---

### Pitfall 7: Drizzle `drizzle-kit push` vs. `migrate` Used Wrong in Production

**What goes wrong:**
`drizzle-kit push` directly applies schema changes to the database without generating migration files. It is designed for rapid development iteration. Used in production CI/CD, it can produce silent data loss (SQLite `ALTER TABLE` limitations mean columns are sometimes dropped and recreated), and has no rollback capability.

**Why it happens:**
`push` is convenient during development (no migration files to manage) and many tutorials use it without distinguishing the dev-only use case. The Drizzle docs explicitly state it's for development environments.

**How to avoid:**
Use `push` only in local development. Use `generate` + `migrate` for any deployed environment:

```bash
# Development only:
npx drizzle-kit push

# Production workflow:
npx drizzle-kit generate   # creates migration SQL file in /drizzle/
npx drizzle-kit migrate    # applies pending migrations to Turso
```

Add to CI/CD pipeline:
```yaml
# .github/workflows/deploy.yml
- name: Run database migrations
  run: npx drizzle-kit migrate
  env:
    TURSO_DATABASE_URL: ${{ secrets.TURSO_DATABASE_URL }}
    TURSO_AUTH_TOKEN: ${{ secrets.TURSO_AUTH_TOKEN }}
```

**Warning signs:**
- `drizzle-kit push` in package.json `scripts` without a `push:dev` vs. `migrate:prod` distinction
- No `/drizzle/` migration files directory in the repository
- Schema changes deployed without reviewing generated SQL

**Phase to address:** Phase 1 (establish the pattern), critical to enforce before any production deploy.

---

### Pitfall 8: Serwist Precaches Stale HTML — App Feels Broken After Deploy

**What goes wrong:**
After deploying a new version of the app, users who installed the PWA (or who have the service worker active) continue to see the old version for hours or even days. Form submissions may fail with "Server Action ID not found" errors because the client bundle references action IDs that no longer exist on the server.

**Why it happens:**
Serwist's precaching caches all JS/CSS/HTML chunks at service worker install time. The old service worker serves old assets from cache. While `skipWaiting: true` causes the new service worker to activate immediately, `clientsClaim: true` only claims new page loads — existing open tabs still use old assets until they're fully refreshed.

Server Actions use encrypted, non-deterministic IDs that change with each build. Old cached bundles reference old action IDs. If the service worker serves old JS but the server has new action IDs, every mutation will fail with 404.

**How to avoid:**
1. Use a build-based revision for precache entries so the service worker manifest changes on every deploy:

```typescript
// next.config.mjs
import { spawnSync } from "node:child_process";
const revision = spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout 
  ?? crypto.randomUUID();

const withSerwist = withSerwistInit({
  additionalPrecacheEntries: [{ url: "/~offline", revision }],
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
});
```

2. Add a `reloadOnOnline: true` option so the PWA reloads when connectivity is restored, picking up new service worker versions.

3. Show a "New version available — tap to update" prompt when a new service worker is waiting:

```typescript
// In your root layout or SerwistProvider
const serwist = window.serwist;
if (serwist) {
  serwist.addEventListener('waiting', () => {
    // Show toast: "Update available. Refresh to get latest version."
  });
}
```

**Warning signs:**
- "Server Action not found" errors after deploy
- Users reporting seeing old UI after you've released changes
- Service worker "waiting" state in Chrome DevTools > Application

**Phase to address:** Phase 1 — PWA setup, and then specifically revisited in any deployment phase.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| `drizzle-kit push` in production | Zero migration file management | Silent data loss risk, no rollback | Never in production |
| `wines ?? []` hiding undefined loading state | Simpler components | Empty-state flash, user confusion | Never — always distinguish loading vs. empty |
| Full Dexie hydration on every app load | Simple sync logic | Slow initial load when collection > 1,000 wines | Acceptable in v1 (MVP), add `?since=` optimization by Phase 3 |
| Calling `navigator.onLine` only (no probe) | Zero complexity | Sync fails silently on captive portals | OK for offline banner display; unacceptable for sync triggering |
| Importing Drizzle types in shared `types/` files | DRY feels good | Leaks server-only modules into client bundle | Never — use Zod infer types instead |
| Using `useEffect` to read Dexie instead of `useLiveQuery` | Familiar pattern | Stale data, no reactivity to Dexie changes | Never — `useLiveQuery` is the correct Dexie hook |
| Putting wine data in Zustand | Single state store feels tidy | Offline writes bypass Dexie, data lost on refresh | Never — Dexie owns wine data, Zustand owns UI state only |
| Skipping `'server-only'` imports | Less boilerplate | `TURSO_AUTH_TOKEN` may leak to client bundle | Never |

---

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Drizzle + Turso in Next.js | Import `drizzle-orm/libsql` (Node.js client) instead of `drizzle-orm/libsql/web` | Use `drizzle-orm/libsql/web` in Next.js — the `/web` variant works in both serverless and edge runtimes |
| Turso auth token | Setting `NEXT_PUBLIC_TURSO_AUTH_TOKEN` to make it accessible "everywhere" | Never use `NEXT_PUBLIC_` prefix for secrets; use `TURSO_AUTH_TOKEN` (server-only) and `import 'server-only'` in `lib/db/index.ts` |
| Serwist + Turbopack | Using `@serwist/next` with `next dev --turbopack` | Use `@serwist/turbopack` package (separate from `@serwist/next`); requires a Route Handler at `app/serwist/[path]/route.ts` |
| Serwist + service worker scope | Service worker registered at wrong scope, doesn't intercept navigation | Default `swDest: "public/sw.js"` registers at `/` scope which is correct; only breaks if you move `sw.js` to a subdirectory |
| Dexie + SSR | Importing Dexie in a Server Component or Server Action causes `window is not defined` | All Dexie imports must be in client components or hooks with `'use client'`; never import `lib/dexie/db.ts` from server-side code |
| Zod 4 + React Hook Form | Using `zodResolver` from `@hookform/resolvers` versions below 3.10 | Zod 4 requires `@hookform/resolvers` v3.10+ — verify version compatibility; the resolver import path is `@hookform/resolvers/zod` (unchanged) |
| Drizzle v1.0 RC | Relational queries API changed from v0.x to v1.0 | Relations are now defined with `defineRelations()` in Drizzle v1.0 — don't mix old and new API patterns; review the [v1 migration guide](https://orm.drizzle.team/docs/relations-v1-v2) |

---

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Full collection sync every app load | Slow first-paint for large collections; repeated full fetches waste bandwidth | Add `updatedAt` index to Turso; implement `?since={lastSyncAt}` incremental sync | Collections > 500 wines (personal use ceiling); any multi-device sync |
| Dexie `.and()` filter on non-indexed fields | Filter queries become O(n) full-table scans | Add indexes for all commonly-filtered fields (`type`, `region`, `status`, `drinkFrom`, `drinkBy`) | Collections > 200 wines with active filtering — noticeable lag |
| `useLiveQuery` with complex inline filter function | Over-reactive — re-runs on any table mutation even if irrelevant | Structure queries to use indexed `where()` clauses first, then `.and()` for secondary filters | Not about scale — this causes render churn at any size |
| Re-creating Drizzle db client on every Server Action call | Connection pool exhaustion; slow cold starts | Declare `db` as a module-level singleton outside the handler (Drizzle serverless docs pattern) | Vercel Functions with high concurrency; any serverless cold-start scenario |
| Sync queue processing in sequential `for` loop | Queue drain is slow when many offline writes accumulated | Process queue entries in parallel batches (5 at a time max to avoid rate limits) | Any offline session with > 20 accumulated writes |
| Missing `_syncedAt` index on Dexie wines table | Can't efficiently query "unsynced wines" for incremental sync | Include `_syncedAt` in Dexie schema indexes from the start | Optimization only matters at > 1,000 wines |

---

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| No input validation in Server Actions | Malicious requests can insert garbage data into Turso | Always `safeParse(input)` with Zod before any Drizzle operation; reject invalid inputs with `{ success: false }` |
| Accepting client-generated IDs without validation | CUID2 format bypass — arbitrary string IDs injected into database | Validate CUID2 format: `z.string().cuid2()` in Zod schema for all `id` fields |
| Server Actions reachable without HTTPS | Auth token interceptable in transit | Enforce HTTPS in production (Vercel does this by default; self-hosted must configure) |
| `TURSO_AUTH_TOKEN` in `.env.local` committed to git | Database fully compromised | Add `.env.local` to `.gitignore` (Next.js does this by default); rotate tokens immediately if ever committed |
| No error message sanitization in Server Action responses | Stack traces / SQL errors leaking internal structure to client | Return generic `{ success: false, error: 'Request failed' }` to client; log full error server-side only |
| Personal wine data accessible to anyone who knows the URL | Wine collection and valuation data exposed | This is single-user; Turso credentials are server-side only. Risk is real if someone gets the deployment URL — add HTTP Basic Auth or IP allowlist for production |

---

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Requiring all wine fields before allowing save | Users abandon entry mid-way; bottles go unlogged | Require only `name` + `type` for save; everything else optional with defaults. A user at a dinner table won't know the appellation |
| No feedback after adding a bottle | User taps "Save" and wonders if it worked | Show a toast ("Bottle added") immediately after Dexie write — before network sync completes |
| Showing "offline" banner for every network hiccup | Anxiety about data safety; users distrust the app | Only show offline banner after 5+ seconds offline; sync silently in the background |
| Full-page navigation for "Add Bottle" | Heavy context switch disrupts browsing flow | Use a bottom Drawer (`vaul`) — slides up over current content; feels native on mobile |
| Pagination for wine list | Breaks search experience; users lose position | Virtualized list with `@tanstack/react-virtual` or just render all rows (fine up to ~500 wines) |
| Showing quantity `0` wines in the main list | Confuses users who want to see "what I own" | Default filter: `status = 'in_cellar' AND quantity > 0`; offer a "Consumed" archive view |
| Vintage year input as free text | Typos create unsortable vintages ("20015", "unknown", "NV") | Use a numeric spinner input with min 1800 / max current year + 1; separate NV checkbox |
| Drinking window dates in arbitrary format | ISO vs. display format confusion creates wrong filter results | Store as ISO date strings (`YYYY-MM-DD`) always; only format for display with `date-fns` |
| "Are you sure?" confirmation for consume action | Friction at a critical joyful moment (opening a bottle) | Use an undo toast instead: "Bottle marked as consumed. Undo?" (5-second window) |
| No visual indicator of sync status | User not sure if offline edits were saved | `SyncIndicator` component: dot that shows Syncing / Synced / Pending states |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Add Wine Form:** Often missing offline queuing — verify that bottles added without network appear in local list AND are queued for server sync
- [ ] **Consume Bottle Flow:** Often missing quantity decrement — verify that consuming a bottle reduces `quantity` on the wine record (not just creates a consumption event)
- [ ] **Drinking Window Display:** Often missing "past window" state — verify that wines where `drinkBy` is in the past show a distinct "Past Window" status (not just "Ready")
- [ ] **Ready to Drink List:** Often missing sort order — verify wines are sorted by `drinkBy ASC` (most urgent first), not creation date
- [ ] **Service Worker:** Often missing offline fallback — verify `/~offline` page exists and is precached by Serwist
- [ ] **PWA Install:** Often missing `maskable` icon purpose — verify `manifest.json` has `"purpose": "maskable"` on at least one icon (required for Android adaptive icons)
- [ ] **Sync Queue:** Often missing retry backoff — verify failed sync queue entries don't hammer the server; implement `attempts` counter with `>5` → dead letter behavior
- [ ] **Collection Stats:** Often missing "estimated value" calculation — verify it only counts `status = 'in_cellar'` bottles, not consumed ones
- [ ] **Search:** Often missing debounce — verify search input has 200ms debounce before triggering `useLiveQuery` (prevents over-reactive renders on every keystroke)
- [ ] **Turbopack Serwist:** Often missing service worker Route Handler — verify `app/serwist/[path]/route.ts` exists if using Turbopack integration

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Dexie transaction killed by fetch | MEDIUM | Refactor sync code to separate Dexie operations from network calls; no data loss if sync queue is intact |
| Turso auth token leaked to client bundle | HIGH | Immediately rotate Turso token via dashboard; rebuild and redeploy; audit git history for other leaks |
| Dexie schema version mismatch | MEDIUM | Add `.version(N+1).stores()` with corrected schema; existing data preserved if no destructive `upgrade()` is needed |
| Serwist serving stale assets after deploy | LOW | Add build revision to precache entry; instruct users to fully close and reopen PWA; long-term: implement service worker update prompt |
| Full Dexie sync too slow (large collection) | MEDIUM | Add `updatedAt` index to Turso schema; implement incremental sync with `since` timestamp parameter |
| Dexie imported in Server Component | MEDIUM | Move Dexie code to `'use client'` hook; add `import 'client-only'` guard to prevent future regression |
| Drizzle `push` used in production | HIGH | Restore from Turso backup; generate migration SQL from diff; apply migration; use `migrate` going forward |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Dexie transaction + fetch mixing | Phase 1 — Offline Sync Infrastructure | Write a test: offline add wine → go online → verify Turso has the record |
| Tursopack vs. Webpack Serwist mismatch | Phase 1 — Foundation + PWA Shell | Service worker visible in DevTools > Application; `/~offline` page loads without network |
| `useLiveQuery` undefined handling | Phase 2 — Wine List | Toggle IndexedDB in DevTools; verify skeleton shows while loading, not empty state |
| Server-only leakage into client bundle | Phase 1 — Foundation | Run `next build` and check bundle output for `@libsql/client`; add `'server-only'` to `lib/db/index.ts` |
| Dexie schema version management | Phase 2+ — any schema change | Version bump checklist in PR template; test in fresh browser profile (no existing IndexedDB) |
| `navigator.onLine` unreliable | Phase 2 — Sync Infrastructure | Test on airplane WiFi (or captive portal); verify sync queues correctly with probe |
| Drizzle push vs. migrate | Phase 1 setup → enforced in all deploys | CI/CD pipeline runs `migrate` not `push`; check package.json scripts |
| Stale PWA after deploy | Phase 1 — PWA Setup, reinforced in deployment phase | Deploy a change; verify old PWA sessions prompt for update |
| Form requiring too many fields | Phase 2 — Wine Entry Form | UX test: try adding a wine knowing only name + type |
| Vintage as text input | Phase 2 — Wine Entry Form | Verify input is `type="number"` with constraints |
| Consume flow missing quantity decrement | Phase 3 — Consumption Events | Add 1 bottle; consume; verify quantity = 0 |

---

## Sources

- **Dexie.js Best Practices (official):** https://dexie.org/docs/Tutorial/Best-Practices — transaction + async API mixing; promise error handling
- **Dexie.js `useLiveQuery()` docs (official):** https://dexie.org/docs/dexie-react-hooks/useLiveQuery() — undefined on initial render; non-Dexie API wrapping rules
- **@serwist/next Getting Started (official):** https://serwist.pages.dev/docs/next/getting-started — webpack integration pattern, precache revision, offline fallback
- **@serwist/next Turbopack Guide (official):** https://serwist.pages.dev/docs/next/turbo — Turbopack uses separate package `@serwist/turbopack`, Route Handler pattern
- **Drizzle ORM Turso Connection (official):** https://orm.drizzle.team/docs/connect-turso — `/web` import variant for Next.js
- **Drizzle ORM Serverless Performance (official):** https://orm.drizzle.team/docs/perf-serverless — singleton db client outside handler
- **Next.js Data Security Guide (official):** https://nextjs.org/docs/app/guides/data-security (updated 2026-05-19) — `'server-only'` imports, Server Action security, never return raw DB records to client
- **Next.js Server Actions and Mutations (official):** https://nextjs.org/docs/app/getting-started/mutating-data (updated 2026-05-19) — POST-only invocation, action IDs regenerate per build
- **IndexedDB Transaction Spec:** https://www.w3.org/TR/IndexedDB/#transaction-lifetime-concept — auto-commit on idle microtask tick
- **MDN navigator.onLine:** https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine — "does not always know whether the host is actually connected to the internet"

---
*Pitfalls research for: Personal wine collection management PWA — Next.js 15 + Turso + Dexie.js*
*Researched: 2026-05-21*
