# Stack Research

**Domain:** Personal wine collection management — mobile-first PWA, inventory, tasting notes, analytics
**Researched:** 2026-05-21
**Confidence:** HIGH (core stack), MEDIUM (deployment), HIGH (PWA approach)

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 15.x | Full-stack React framework | App Router + Server Actions provide clean data mutation; Turbopack gives fast DX; built-in PWA manifest support; ideal for this data-rich app where SSR and client-side navigation coexist. No need for a separate API layer. |
| React | 19.x | UI rendering | Ships with Next.js 15. React 19 brings improved hydration errors and React Compiler (optional optimization). No longer need `useMemo`/`useCallback` everywhere. |
| TypeScript | 5.5+ | Type safety | Required. The wine data model has complex types (vintages, drinking windows, tasting notes). Drizzle + Zod schema inference eliminates runtime type errors. |
| Tailwind CSS | 4.x | Utility-first styling | v4 released Jan 2025 — CSS-first config, 5x faster builds, zero-config content detection, native CSS variables. Ideal for building a premium mobile UI quickly. Works perfectly with shadcn/ui. |
| shadcn/ui | latest (CLI-based) | Component library | Not a package — it's source you own. Copy-paste components with full customization. Built on Radix UI (accessible). Includes Drawer, Sheet, Command, Calendar, Charts — all needed for wine UI. 115k GitHub stars. |

### Database / Persistence

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Turso (libSQL/SQLite) | latest | Server-side database | SQLite semantics with cloud hosting. Free tier covers personal use entirely (500 DBs, 9GB storage). Drizzle has first-class Turso support. Personal app with single user = perfect SQLite fit. No PostgreSQL setup complexity. |
| Drizzle ORM | 0.40+ (v1.0 RC) | Type-safe ORM | SQL-like API that you'll actually understand. Native SQLite + Turso support. Schema-as-code in TypeScript. `drizzle-kit push` for rapid development. Zero extra dependencies. v1.0 RC is in Beta as of May 2026. |
| Dexie.js | 4.x | Client-side offline cache (IndexedDB) | Required for true offline capability. Provides React hooks (`useLiveQuery`) for reactive UI updates when offline data changes. Elegantly wraps IndexedDB. 13k GitHub stars. |

### PWA / Offline

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| @serwist/next | 9.x | Service Worker for Next.js | The maintained successor to `next-pwa` (which is unmaintained). Wraps Workbox with Next.js integration. Handles precaching of App Router routes, offline fallback pages, and runtime caching strategies. Supports Turbopack. |
| serwist | 9.x | Service Worker library | Peer dependency of @serwist/next. Provides the actual Workbox-based caching runtime. |

### State Management

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Zustand | 5.x | Client-side state | 58k GitHub stars, v5.0.13 (May 2026). Minimal boilerplate — create a store as a hook, no providers needed. `persist` middleware for localStorage sync. Perfect for UI state (filters, active views, selected wine). Don't use it for server data. |
| TanStack Query | 5.x | Server state + caching | Handles fetching, caching, background refetch, optimistic updates. When the app is online, this eliminates loading state boilerplate. Pair with `useMutation` for CRUD operations. Essential for offline/online sync patterns. |

### Forms & Validation

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| React Hook Form | 7.x | Form state management | Industry standard. Minimal re-renders (uncontrolled), native HTML validation, excellent DX. Integrates directly with shadcn/ui form components. |
| Zod | 4.x | Schema validation | Zod 4 is now stable (announced on zod.dev). TypeScript-first, zero deps, 2kb core. Use for both form validation (via `@hookform/resolvers`) and Drizzle schema validation. Single source of truth for data shapes. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@hookform/resolvers` | 3.x | Connects Zod to React Hook Form | On every form in the app |
| `date-fns` | 3.x | Date manipulation | Drinking window calculations, vintage year math, date formatting |
| `recharts` | 2.x | Charts for analytics | shadcn/ui Charts are built on Recharts — use the shadcn chart components (already in the component library) |
| `cmdk` | 1.x | Command palette / search | Powers the shadcn/ui Command component — use for the wine search/filter UI |
| `sonner` | latest | Toast notifications | Minimal, beautiful toasts. Ships as part of shadcn/ui. Use for "Bottle added", "Bottle consumed" feedback. |
| `next-themes` | 0.4+ | Dark/light mode | Pair with Tailwind CSS v4 `color-scheme` utilities for dark mode toggle |
| `lucide-react` | latest | Icon library | Default icon set for shadcn/ui. Consistent icons for wine types, regions, status. |
| `vaul` | 0.9+ | Mobile drawer | Powers shadcn/ui Drawer component. Essential for mobile bottom-sheet modals (add wine, tasting notes). |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| pnpm | Package manager | Faster than npm, better disk efficiency |
| ESLint 9 | Linting | Next.js 15 supports ESLint 9 natively |
| Prettier | Code formatting | Add `prettier-plugin-tailwindcss` for Tailwind class sorting |
| drizzle-kit | DB schema migrations | `drizzle-kit push` for dev, `drizzle-kit migrate` for production |
| `drizzle-kit studio` | DB GUI | Visual database browser for development debugging |

---

## Installation

```bash
# Create Next.js 15 app
npx create-next-app@latest wine-cellar --typescript --tailwind --eslint --app --src-dir

# Core framework additions
npm install drizzle-orm @libsql/client

# PWA (Serwist)
npm install @serwist/next serwist

# State management
npm install zustand @tanstack/react-query

# Forms + validation
npm install react-hook-form zod @hookform/resolvers

# UI components (shadcn/ui - run CLI to add individual components)
npx shadcn@latest init

# Add shadcn components as needed:
npx shadcn@latest add button card input select sheet drawer command
npx shadcn@latest add form toast badge skeleton table tabs chart

# Offline / IndexedDB
npm install dexie dexie-react-hooks

# Utilities
npm install date-fns sonner next-themes lucide-react

# Dev dependencies
npm install -D drizzle-kit prettier prettier-plugin-tailwindcss
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Next.js 15 | Remix | If you strongly prefer loader/action patterns and want smaller bundle; but Next.js has better PWA ecosystem and shadcn/ui support |
| Next.js 15 | Vite + React SPA | If you want a pure client-side app with no server (simpler deploy, no Node.js); then swap Turso for IndexedDB-only via Dexie. Viable if always-offline is the goal. |
| Turso (libSQL) | Neon (Postgres) | If you anticipate multi-user features soon or need Postgres-specific features. Neon has a free tier. More complex than SQLite for a personal app. |
| Turso (libSQL) | Supabase | If you want built-in auth, realtime, and storage out-of-the-box. Heavyweight for a single-user MVP. |
| Drizzle ORM | Prisma | If your team is already on Prisma and prefers its migrations workflow. Prisma is slower and heavier; Drizzle generates less overhead and has better SQLite support. |
| @serwist/next | next-pwa | `next-pwa` is unmaintained (last release was 2022). `@serwist/next` is the active maintained fork with Next.js 15 + App Router support. |
| Zustand | Jotai | If you prefer atomic state model. Both are fine for this scope; Zustand is simpler for a slice-per-feature pattern. |
| TanStack Query | SWR | SWR is simpler but has less powerful mutation handling. TanStack Query's `useMutation` + optimistic updates matters for inventory CRUD. |
| Dexie.js | idb | `idb` is lower-level. Dexie provides a nicer query API and React hooks. For offline wine data access, Dexie is the right abstraction level. |
| Zod 4 | Valibot | Valibot is tree-shakeable and smaller. Use if bundle size is critical. Zod 4's ecosystem (resolvers, Drizzle integration) is more mature. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `next-pwa` (wd-imahalko fork) | Unmaintained since 2022; breaks with Next.js 15 App Router and Turbopack | `@serwist/next` — actively maintained, App Router aware |
| Redux Toolkit | Massive overkill for single-user personal app; 10x boilerplate for same result | Zustand for UI state, TanStack Query for server state |
| Prisma | Heavyweight for SQLite/personal app; slower queries; migration workflow adds friction in early development | Drizzle ORM — same type safety, better performance, `drizzle-kit push` for rapid iteration |
| Firebase / Firestore | Cloud lock-in, complex pricing, overkill for personal app; real-time not needed | Turso + TanStack Query provides simpler, cheaper, data-ownable solution |
| React Native | Project spec is mobile-first web app, not native mobile; PWA + shadcn gives 90% of native feel | Next.js 15 PWA with Serwist |
| `create-react-app` | Officially abandoned by Meta; uses outdated toolchain | Next.js 15 or Vite |
| Material UI (MUI) | Heavy bundle, opinionated design system fights with wine app's premium aesthetic goals | shadcn/ui — you own the code, full Tailwind customization |
| Tailwind CSS v3 | v4 released Jan 2025 with 5x faster builds, CSS-first config, much better DX | Tailwind CSS v4 |

---

## Stack Patterns by Variant

**If targeting fully-offline personal use (no server at all):**
- Replace Turso + Drizzle with Dexie.js only
- Remove Next.js Server Actions (use client-side mutations)
- Use Vite instead of Next.js (simpler build)
- All data lives in browser IndexedDB
- Risk: data loss if browser storage is cleared; no cross-device sync

**If adding multi-user / household access (future):**
- Keep Turso; add authentication (Clerk or Auth.js)
- Add Turso Cloud Sync or move to Neon Postgres
- Add user_id foreign keys to all tables in Drizzle schema

**If prioritizing progressive enhancement for very slow connections:**
- Enable Serwist `backgroundSync` strategy for mutations
- Use Dexie as the write-ahead local cache, sync to Turso when online

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| Next.js 15.x | React 19 | App Router only (Pages Router stays on React 18) |
| Next.js 15.x | Tailwind CSS v4 | Use `@tailwindcss/postcss` — Tailwind v4 ships its own PostCSS plugin |
| shadcn/ui latest | Tailwind CSS v4 | shadcn/ui CLI handles Tailwind v4 config automatically as of 2025 |
| @serwist/next 9.x | Next.js 15 | Turbopack support documented in serwist.pages.dev |
| Drizzle ORM 0.40+ | Node.js 18.18+ | Next.js 15 minimum Node.js version is 18.18.0 |
| Zod 4.x | React Hook Form 7.x + `@hookform/resolvers` 3.x | Zod 4 requires `zodResolver` from resolvers v3.10+ |
| TanStack Query 5.x | React 19 | Full React 19 support — uses `use()` hook internally |
| Zustand 5.x | React 18/19 | Both supported |
| Dexie 4.x | All modern browsers | IndexedDB v2 required — all evergreen browsers qualify |

---

## Architecture Decision: Hybrid Storage Strategy

For this wine cellar app, use a **two-layer storage architecture**:

```
Layer 1 (Server): Turso (libSQL) via Drizzle ORM
  - Source of truth
  - All wine records, tasting notes, locations
  - Accessed via Next.js Server Actions

Layer 2 (Client): Dexie.js (IndexedDB)
  - Offline cache / read layer
  - Synced from server on load
  - Enables offline viewing and queuing of writes
  - Writes buffered offline → synced when online
```

**Why not server-only?** The project requires offline capability — users update tasting notes at the dinner table without reliable WiFi.

**Why not client-only?** No cross-device access; no data safety guarantees; data tied to one browser.

---

## Sources

- **Next.js 15 official blog** — https://nextjs.org/blog/next-15 (React 19, Turbopack stable, Server Actions security)
- **Tailwind CSS v4.0 blog** — https://tailwindcss.com/blog/tailwindcss-v4 (Jan 22, 2025 — official v4 release)
- **shadcn/ui official docs** — https://ui.shadcn.com/docs (verified: Drawer, Command, Chart components available)
- **Drizzle ORM official docs** — https://orm.drizzle.team/docs/connect-turso (Turso integration; v1.0 RC in beta)
- **@serwist/next official docs** — https://serwist.pages.dev/docs/next/getting-started (Next.js 15 + App Router + Turbopack verified)
- **Zustand GitHub** — https://github.com/pmndrs/zustand (v5.0.13 as of May 2026; 58.1k stars)
- **TanStack Query official docs** — https://tanstack.com/query/latest (React 19 support confirmed)
- **Dexie.js official docs** — https://dexie.org/docs/API-Reference (v4.x, IndexedDB wrapper)
- **Zod official docs** — https://zod.dev (Zod 4 now stable)
- **React Hook Form official site** — https://react-hook-form.com (verified active, v7.x)

---
*Stack research for: personal wine cellar mobile-first PWA*
*Researched: 2026-05-21*
