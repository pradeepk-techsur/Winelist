# Project Research Summary

**Project:** Personal Wine Collection Management App
**Domain:** Mobile-first PWA — single-user wine inventory, tasting notes, drinking windows, analytics
**Researched:** 2026-05-21
**Confidence:** HIGH

## Executive Summary

A personal wine cellar app is a well-understood mobile application domain with four established competitors (CellarTracker, Vivino, InVintory, Oeni), clear user expectations, and documented patterns that can be directly applied. The recommended architecture is a **two-layer hybrid** — Turso (cloud SQLite) as the source of truth accessed via Next.js 15 Server Actions, with Dexie.js (IndexedDB) as the local read/write cache enabling true offline functionality. This combination directly addresses the primary personal use case: updating tasting notes at a dinner table without reliable WiFi. The stack choice is well-validated, with every major component at a stable, production-ready version.

The primary market opportunity is clear from competitor research: CellarTracker is functional but has a dated UX and paywalls on core features (Ready-to-Drink costs money there); Vivino is beautiful but commerce-focused rather than cellar-focused; InVintory and Oeni have strong design but niche positioning. A personal-first, free-on-core-features app with a premium mobile UX can fill a real gap. The critical product insight: **manual entry with an elegant fast flow beats scan-but-fail at 25%**, and users loudly complain about social features cluttering personal cellar apps — stay personal-first.

The most significant implementation risk is the offline sync infrastructure. The Dexie + Server Actions architecture has several sharp edges that must be addressed in Phase 1: Dexie transactions break silently when a `fetch` (including Server Actions) is mixed into them, the Serwist service worker requires a fundamentally different setup for Turbopack vs. Webpack, and Drizzle's `push` command must never be used in production deployments. These are all **correctness issues** — they produce silent failures and data loss — not merely performance concerns. Getting Phase 1 right is more important than how many features Phase 1 contains.

---

## Key Findings

### Recommended Stack

The stack is a cohesive, modern TypeScript monorepo with no unnecessary complexity for a single-user personal app. Next.js 15 with App Router eliminates a separate API layer — Server Actions are the cloud write path. Tailwind CSS v4's CSS-first config and zero-config content detection makes mobile UI iteration fast. shadcn/ui provides owned, fully-customizable components built on accessible Radix UI primitives, including all the components this app needs (Drawer for mobile add flows, Command for search, Chart for analytics).

**Core technologies:**
- **Next.js 15 (App Router):** Full-stack React framework — Server Actions as the only cloud write path; no API routes needed for CRUD
- **React 19:** Ships with Next.js 15; React Compiler optional optimization available
- **TypeScript 5.5+:** Required — complex wine data model with drinking windows, consumption events; Drizzle + Zod inference eliminates runtime errors
- **Tailwind CSS v4:** Utility-first styling — CSS-first config (Jan 2025 release), 5x faster builds, native CSS variables; pairs perfectly with shadcn/ui
- **shadcn/ui (latest):** Owned component library — copy-paste with full customization; Drawer (vaul), Command (cmdk), Chart (recharts) all included
- **Turso (libSQL/SQLite):** Cloud SQLite — free tier covers personal use entirely (500 DBs, 9GB); Drizzle first-class support; SQLite semantics fit single-user perfectly
- **Drizzle ORM 0.40+:** Type-safe ORM with SQL-like API; native SQLite + Turso support; `drizzle-kit push` for dev iteration; v1.0 RC in Beta
- **Dexie.js 4.x:** IndexedDB wrapper with `useLiveQuery` React hooks — **required for offline functionality**; without it, the app fails at the dinner table
- **@serwist/next or @serwist/turbopack:** Maintained successor to unmaintained `next-pwa`; handles App Router precaching, offline fallback, runtime caching
- **Zustand 5.x:** Minimal UI state (filters, sort, drawer open state) — not for wine data
- **TanStack Query 5.x:** Server state + mutation handling — pairs with Server Actions for optimistic updates
- **React Hook Form 7.x + Zod 4.x:** Forms + validation — single Zod schema serves both client-side form validation and server-side Server Action validation
- **date-fns 3.x:** Drinking window calculations, vintage year math, date formatting

**What NOT to use:** `next-pwa` (unmaintained since 2022), Redux Toolkit (overkill), Prisma (heavyweight for SQLite), Firebase (cloud lock-in), React Native (spec is PWA), Material UI (fights premium aesthetic), Tailwind CSS v3 (v4 is available and superior).

**Critical version requirements:**
- `@hookform/resolvers` must be v3.10+ for Zod 4 compatibility
- `@libsql/client/web` (not `@libsql/client`) for Next.js serverless/edge compatibility
- Drizzle v1.0 uses `defineRelations()` — don't mix old and new API patterns
- Turbopack: use `@serwist/turbopack` package, NOT `@serwist/next` (incompatible)

See `.planning/research/STACK.md` for full alternatives considered and installation commands.

---

### Expected Features

The feature set is well-validated by a mature competitor landscape with App Store reviews from 2020–2026. The gap to fill: **personal-first, free on core features, premium mobile UX, manual entry done elegantly**.

**Must have (table stakes — v1 launch):**

| Feature | Why Table Stakes |
|---------|-----------------|
| Add bottles (manual entry) | Core purpose — name, producer, vintage, type, varietal, region, quantity |
| View collection list | Sortable/filterable; home base of the app |
| Edit and delete bottle records | Data hygiene; users make mistakes |
| Track bottle quantity + mark consumed/gifted | Most common cellar action |
| Storage location (text-based) | Critical for collections > 20 bottles |
| Purchase price + purchase date | Needed for collection value calculation |
| Drinking window (start/end dates) | Every competitor has this; powers ready-to-drink |
| Search and filter | Text search + filter by type, region, vintage, varietal |
| Ready-to-drink view | Most-used feature after main list in all cellar apps |
| Tasting notes + personal rating | Expected; recorded when bottle is consumed |
| Basic collection statistics | Total count, estimated value, breakdown by type |
| Mobile-first premium design | **The primary differentiator** — CellarTracker is dated, free apps are ugly |

**Should have (competitive, post-launch validation — v1.x):**
- **Past-window alert / overdue view** — high value once drinking windows are populated; trivially built from existing data
- **"What to drink tonight" smart pick** — one-tap best bottle recommendation; very fast to build
- **Consumption history log** — wine journal use case; motivates continued data entry
- **Occasion/context filter** — filter by food/occasion; confirmed desire from Oeni/CellarTracker user data

**Defer to v2+:**
- Label scanning / camera entry — highly requested but ~25% fail rate; adds ML infrastructure complexity before data model is stable
- Market valuation API — adds ongoing cost and complexity; show user-entered purchase price until PMF
- Export (CSV/PDF) — useful but not needed to validate core value
- Import from CellarTracker/Vivino — low priority until user acquisition matters
- Multi-user / household sharing — doubles complexity; post-PMF only
- 3D cellar visualization — impressive in screenshots; functionally unnecessary for personal use
- AI sommelier / chatbot — defer until data model is rich enough to make it useful; CellarChat and Vivino AI already exist for those who need it
- Push notification drinking window alerts — in-app surfacing sufficient; notifications cause uninstalls for non-urgent personal apps

**Key anti-feature decision:** No social/community features. Users explicitly complain about social noise in personal cellar apps. CellarTracker and Vivino have insurmountable community moats. Stay personal-first.

See `.planning/research/FEATURES.md` for full competitor analysis and feature dependency graph.

---

### Architecture Approach

The architecture is a **two-layer offline-first hybrid**: Turso (cloud SQLite) is the source of truth accessed exclusively through Next.js Server Actions (server-side validated, Drizzle-written), and Dexie.js (IndexedDB) is the local read/write cache that powers all UI reads via `useLiveQuery`. All writes go to Dexie first (instant UI update), then forward to Turso when online or queue for later sync when offline. This pattern — write locally, sync asynchronously — is the standard approach for personal mobile apps requiring offline capability.

**Major components:**

| Component | Responsibility |
|-----------|---------------|
| Next.js App Router | Page routing, SSR for initial shell, PWA manifest |
| Server Actions (`app/actions/*.ts`) | **Only** cloud write path — validate with Zod, write with Drizzle, return typed results |
| Drizzle ORM + Turso | Cloud source of truth; accessed server-side only via `lib/db/` (guarded with `import 'server-only'`) |
| Dexie.js (IndexedDB) | Local read cache + offline write buffer; `wines`, `consumption_events`, `syncQueue` tables |
| Sync Service (`lib/sync/sync-service.ts`) | Hydrates Dexie from Turso on load; flushes offline `syncQueue` on reconnect |
| Serwist Service Worker | Precaches app shell; runtime NetworkFirst for pages; offline `/~offline` fallback |
| shadcn/ui components | Drawer (add/edit wine — bottom sheet), Command (search palette), Chart (analytics) |
| Zustand stores | UI state only: filter/sort state, drawer open state — **never** wine data |
| `useLiveQuery` hooks | All wine list/detail/stats reads — reactive, offline-capable, zero loading spinners for cached data |

**Data model key decisions (must be followed):**
- `wines` table: one record per wine, `quantity` integer tracks stock — NOT one row per bottle
- `id` is client-generated CUID2 — no server round-trip needed for offline writes
- `vintage` is `INTEGER` nullable — allows NV wines; enables numeric sort and range queries
- `drinkFrom`/`drinkBy` stored as ISO date strings (`YYYY-MM-DD`) — readable in SQL, easy to compare
- `status` enum (`in_cellar`, `consumed`, `gifted`, `sold`, `spoiled`) — soft delete; wines are never physically deleted
- `consumption_events` table: append-only; `rating` lives here (not on wine record) — allows taste evolution tracking

**Mobile navigation:** Bottom tab bar (not hamburger/sidebar) — [Cellar] [Ready Now] [Add Bottle +] [Insights]. Add Bottle uses a bottom Drawer (`vaul`) — no full-page navigation, slides up instantly.

See `.planning/research/ARCHITECTURE.md` for full data models, data flow diagrams, patterns with code examples, and anti-patterns.

---

### Critical Pitfalls

**8 pitfalls documented; the top 5 with highest consequence:**

1. **Dexie transactions break when a Server Action (fetch) is called inside them** (`TransactionInactiveError`) — IndexedDB spec auto-commits transactions on any non-IDB async yield. Solution: always sequence Dexie writes THEN network calls, never nested inside `db.transaction()`. Must be designed correctly in Phase 1 or retrofit is painful.

2. **Serwist has two incompatible setups for Webpack vs. Turbopack** — `@serwist/next` (webpack) silently fails with `--turbopack`. Turbopack requires `@serwist/turbopack` package and a Route Handler at `app/serwist/[path]/route.ts`. Decide upfront: this project uses Turbopack for DX, so use Turbopack integration from day 1.

3. **Stale PWA serves old Server Action IDs after deploy** — Server Actions get new encrypted IDs each build; old cached bundles cause 404 errors on every mutation. Solution: add build revision to Serwist precache entries + implement "new version available" update prompt.

4. **Drizzle's `drizzle-kit push` must never be used in production** — it directly modifies the schema without migration files; SQLite column limitations can produce silent data loss with no rollback. Use `push` in dev, `generate` + `migrate` in CI/CD from the start.

5. **Drizzle/Turso client leaking into the client bundle** — if `lib/db/index.ts` is imported transitively by client components, `TURSO_AUTH_TOKEN` is exposed at build time. Solution: add `import 'server-only'` to `lib/db/index.ts`; use Zod `z.infer<>` types instead of Drizzle's `InferSelectModel` in shared type files.

**Additional pitfalls to address in planning:**
- `useLiveQuery` returns `undefined` on first render — never use `wines ?? []` as a fallback; distinguish loading vs. empty state
- `navigator.onLine` is unreliable (captive portals, hotel WiFi) — use a `/api/ping` reachability probe before flushing sync queue
- Dexie schema version not bumped when adding indexes — silent query breakage; every schema change needs `db.version(N+1)`
- Requiring too many form fields at add time — users at dinner tables abandon long forms; require only `name` + `type` to save
- "Are you sure?" for consume action — replace with undo toast for joyful moments

**"Looks Done But Isn't" checklist items:** offline queuing in Add Wine form, quantity decrement in Consume flow, sort by `drinkBy ASC` in Ready-to-Drink list, `maskable` icon in PWA manifest, retry backoff in sync queue, search debounce (200ms), `status = 'in_cellar'` filter in collection stats.

See `.planning/research/PITFALLS.md` for full code examples, recovery strategies, and phase-to-pitfall mapping.

---

## Implications for Roadmap

Based on combined research, the dependency graph and pitfall-to-phase mapping suggest **5 phases**. The offline sync infrastructure is the architectural backbone — everything else depends on it being correct.

### Phase 1: Foundation + PWA Shell + Offline Infrastructure
**Rationale:** The offline sync architecture (Dexie + Turso + Serwist) must be wired correctly before any feature work begins. Three critical pitfalls are Phase 1 concerns: Dexie/fetch transaction separation, Turbopack Serwist setup, and `server-only` boundary enforcement. Getting this wrong means retrofitting core architecture after features are built — the most expensive possible fix.
**Delivers:** Installable PWA shell with working offline detection, precaching, offline fallback page, Drizzle schema, Dexie schema, sync service skeleton, Server Action pattern, CUID2 ID generation wired, `push` vs `migrate` workflow established in CI.
**Implements:** Two-layer storage architecture, service worker, database schema (both Turso/Drizzle and Dexie), sync queue infrastructure
**Avoids:** Pitfall 1 (Dexie+fetch), Pitfall 2 (Serwist/Turbopack), Pitfall 3 (stale PWA), Pitfall 4 (Drizzle push in prod), Pitfall 5 (server bundle leak)
**Research flag:** Standard patterns — Serwist Turbopack docs are explicit; Drizzle Turso connection is well-documented. No additional research needed.

### Phase 2: Wine CRUD + Collection List
**Rationale:** The core write and read flows are the foundation for all features. Add wine form → list → edit → delete must work online and offline before building derived views. This is where `useLiveQuery` patterns are established and UX decisions are locked in (Drawer add flow, form field requirements, vintage input type).
**Delivers:** Add/edit/delete wine via bottom Drawer, collection list with sort controls, WineCard component, WineStatusBadge, Zustand filter store, `useWines` + `useWineDetail` hooks, offline queuing for all mutations, `SyncIndicator` + `OfflineBanner` components.
**Uses:** WineForm (React Hook Form + Zod + shadcn/ui), Server Actions (addWine, updateWine, deleteWine), Dexie (useLiveQuery), Zustand (filter/sort state), vaul Drawer
**Implements:** Online write flow, offline write flow, full Dexie sync queue for wines
**Avoids:** Pitfall 6 (`useLiveQuery` undefined handling), UX pitfall (too many required form fields), UX pitfall (vintage as text)
**Research flag:** Standard patterns — well-documented.

### Phase 3: Drinking Windows + Ready-to-Drink + Consume Flow
**Rationale:** The drinking window and consume flow are the most-used features in all cellar apps after the main list. They depend on Phase 2's wine records existing. The consume flow is also where tasting notes are recorded — the `consumption_events` table must be fully wired before analytics (Phase 4) can aggregate from it.
**Delivers:** Drinking window date fields on wine form, `useReadyToDrink` hook, Ready-to-Drink page (tab nav destination), ConsumeDialog (mark as consumed + tasting note + rating), quantity decrement, past-window status detection, WineStatusBadge states (Aging / Ready / Past Window / Consumed), undo toast for consume action.
**Uses:** `useLiveQuery` with `drinkFrom`/`drinkBy` indexed Dexie queries, date-fns for date comparisons, ConsumptionEvent Zod schema + Server Action, shadcn/ui Dialog/Drawer
**Implements:** Drinking window computation, consumption event append-only pattern, ready-to-drink sort (drinkBy ASC)
**Avoids:** UX pitfall (confirm dialog on consume — use undo toast), checklist item (quantity decrement), checklist item (ready-to-drink sort order)
**Research flag:** Standard patterns — Dexie range queries are well-documented.

### Phase 4: Search, Filter + Collection Statistics
**Rationale:** Search depends on having a meaningful collection to search (wines exist from Phase 2). Analytics require consumption events (Phase 3). Grouping these together makes sense because both are read-only derived views over existing data — no new data model changes needed.
**Delivers:** CellarSearch (shadcn Command palette), filter chips (type, region, vintage), `useWineSearch` hook with 200ms debounce, `useWines` filter integration with Zustand, CollectionStats component (total count, estimated value, type breakdown), recharts/shadcn charts for Insights tab.
**Uses:** cmdk (Command component), Dexie client-side full-scan search (sufficient for personal collections up to ~2,000), recharts via shadcn/ui Chart, date-fns for value calculations
**Implements:** Client-side search + filter architecture (Pattern 5 from ARCHITECTURE.md), analytics aggregation
**Avoids:** Performance trap (add search debounce), checklist item (collection stats only count `in_cellar` status)
**Research flag:** Standard patterns — Dexie full-scan search documented; recharts/shadcn charts well-documented.

### Phase 5: Polish + v1.x Differentiators
**Rationale:** Once all core features are validated, add the differentiating features that convert the app from functional to delightful. These are all low-complexity builds that depend on Phase 2–4 data being present. This phase also addresses PWA deployment hardening.
**Delivers:** Past-window alert / overdue view, "What to drink tonight" smart pick (in-window + highest rated), consumption history timeline log, MobileNav bottom tab bar (if not built in Phase 2), empty state / onboarding illustration, dark/light mode (next-themes), PWA update prompt ("new version available"), Serwist precache revision for deployment, incremental sync optimization (`?since=lastSyncAt`).
**Uses:** next-themes, sonner toasts, lucide-react icons, Serwist update event listener
**Implements:** Service worker update notification pattern, sync optimization
**Avoids:** Pitfall 3 (stale PWA — revisited here), performance trap (full sync optimization)
**Research flag:** Standard patterns — well-documented. Incremental sync is a simple `updatedAt` WHERE clause addition.

---

### Phase Ordering Rationale

- **Phase 1 before everything:** The Dexie + Turso + Serwist architecture has 5 of 8 pitfalls concentrated in setup. Building features on an incorrectly wired foundation is the most expensive mistake in this stack.
- **Phase 2 before Phase 3:** Wines must exist before drinking windows / consume flows matter. The data model must be stable before adding consumption events that reference wine IDs.
- **Phase 3 before Phase 4:** Consumption events must exist before the analytics phase can aggregate them meaningfully. Search is more useful once the collection has wines + drinking window data.
- **Phase 5 last:** Polish and differentiators are only valuable once core flows are validated. "What to drink tonight" is trivially built once ready-to-drink + ratings exist from Phase 3.
- **Feature groupings follow architectural layers:** Phase 1 = infrastructure, Phase 2 = write layer, Phase 3 = event layer, Phase 4 = read/query layer, Phase 5 = presentation + delivery.

---

### Research Flags

**Phases with standard patterns (skip deeper research):**
- **Phase 1:** Serwist Turbopack, Drizzle Turso, CUID2 — all have explicit official docs with working code examples
- **Phase 2:** React Hook Form + Zod + shadcn/ui — industry standard; extensively documented
- **Phase 3:** Dexie range queries, consumption event patterns — documented in official Dexie docs
- **Phase 4:** Dexie search, shadcn/ui Charts — well-documented

**Phases that may benefit from targeted research during planning:**
- **Phase 1 deployment:** Vercel + Turso environment variable setup, Turso token scoping — worth confirming exact Vercel deployment configuration before first deploy
- **Phase 5:** Serwist service worker update event API — the `window.serwist.addEventListener('waiting')` pattern should be verified against current @serwist/turbopack docs as it may differ from webpack variant

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All technologies verified against official docs (May 2026); version compatibility table explicitly documented; alternatives considered |
| Features | HIGH | Sourced from App Store listings (current 2026 versions), CellarTracker support docs, and user reviews 2020–2026; competitor analysis is comprehensive |
| Architecture | HIGH | All patterns verified against official Dexie, Drizzle, Next.js, and Serwist docs; code examples are working patterns from official documentation |
| Pitfalls | HIGH | All 8 critical pitfalls sourced from official docs, specs (IndexedDB W3C), and MDN; each includes verified code examples of both broken and correct patterns |

**Overall confidence: HIGH**

### Gaps to Address

- **Drizzle v1.0 RC stability:** Drizzle v1.0 is in Beta RC as of May 2026. The `defineRelations()` API change from v0.x is documented, but there may be additional breaking changes before final release. Mitigation: pin to a specific v0.40+ version if v1.0 RC is unstable; the relational query API is not essential for this app's simple two-table schema.

- **Serwist Turbopack update event API:** The `window.serwist` update notification pattern in Phase 5 is documented for the webpack variant; the Turbopack variant uses a different Route Handler approach and the update event API should be confirmed before implementing the "new version available" prompt.

- **Turso free tier limits in production:** The free tier (500 databases, 9GB storage) is documented for 2025; confirm it still applies for 2026 deployment. For a personal single-user app, this is almost certainly sufficient, but worth verifying before recommending Turso as the production host.

- **Incremental sync implementation:** The `?since={lastSyncAt}` optimization (Phase 5) requires a `getWines({ since })` Server Action that queries Turso with `WHERE updatedAt > ?`. This is straightforward Drizzle but needs explicit implementation design in the Phase 5 spec — the current architecture docs note it as a TODO.

---

## Sources

### Primary (HIGH confidence — official docs, verified 2026)
- **Next.js 15 official blog** — https://nextjs.org/blog/next-15 (React 19, Turbopack stable, Server Actions security)
- **Next.js Data Security Guide** — https://nextjs.org/docs/app/guides/data-security (updated 2026-05-19 — `'server-only'` imports, Server Action security)
- **Next.js Server Actions and Mutations** — https://nextjs.org/docs/app/getting-started/mutating-data (updated 2026-05-19)
- **Tailwind CSS v4.0 blog** — https://tailwindcss.com/blog/tailwindcss-v4 (Jan 22, 2025 — official v4 release)
- **shadcn/ui official docs** — https://ui.shadcn.com/docs (Drawer, Command, Chart components verified)
- **Drizzle ORM — Turso connection** — https://orm.drizzle.team/docs/connect-turso (`/web` import variant; v1.0 RC in beta)
- **Drizzle ORM — SQLite get-started** — https://orm.drizzle.team/docs/get-started-sqlite
- **Drizzle ORM — Serverless Performance** — https://orm.drizzle.team/docs/perf-serverless (singleton db client pattern)
- **@serwist/next Getting Started** — https://serwist.pages.dev/docs/next/getting-started (webpack integration, precache revision, offline fallback)
- **@serwist/next Turbopack Guide** — https://serwist.pages.dev/docs/next/turbo (Turbopack package separation, Route Handler pattern)
- **Dexie.js official docs — useLiveQuery** — https://dexie.org/docs/dexie-react-hooks/useLiveQuery() (undefined on initial render, non-Dexie API wrapping)
- **Dexie.js Best Practices** — https://dexie.org/docs/Tutorial/Best-Practices (transaction + async API mixing)
- **TanStack Query official docs** — https://tanstack.com/query/latest (React 19 support confirmed)
- **Zustand GitHub** — https://github.com/pmndrs/zustand (v5.0.13 as of May 2026)
- **Zod official docs** — https://zod.dev (Zod 4 now stable)
- **React Hook Form official site** — https://react-hook-form.com (verified active, v7.x)
- **CUID2 library** — https://github.com/paralleldrive/cuid2 (client-side collision-resistant ID generation)
- **IndexedDB Transaction Spec** — https://www.w3.org/TR/IndexedDB/#transaction-lifetime-concept (auto-commit on idle microtask tick)
- **MDN navigator.onLine** — https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine (reachability limitations)

### Secondary (HIGH confidence — App Store data, support documentation)
- **CellarTracker official support docs** — https://support.cellartracker.com (What you can track, Ready-to-Drink report, CellarChat AI launch)
- **Vivino App Store listing** — version 2026.20.0 (AI Sommelier 2026 launch verified)
- **InVintory App Store listing** — version 6.18.0 (~75% scan hit rate, VinLocate 3D feature)
- **Oeni App Store listing** — version 4.5.2 (5,400+ dish pairings, maturity phases)
- **App Store user reviews** — CellarTracker, Vivino, InVintory, Oeni (2020–2026); paywall complaints, UX praise, scan failure rate)

---
*Research completed: 2026-05-21*
*Ready for roadmap: yes*
