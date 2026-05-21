# Technical Architecture Document
## Personal Wine Collection Management Software
**Project Acronym:** WineApp
**TechArch Version:** 1.0
**Date:** 2026-05-21
**Status:** Draft
**Based on:** PRD-WineApp v1.0, FRD-WineApp v1.0

---

## 1. Architectural Overview

### 1.1 Architecture Pattern

WineApp v1 uses a **monolithic REST API + SPA (Single-Page Application)** architecture. This pattern is chosen deliberately for the MVP phase: it minimizes operational complexity, keeps the deployment footprint small (two services: frontend static host + backend API process + managed database), and allows rapid feature development without distributed systems overhead. The architecture is intentionally simple — a lean backend serving a mobile-first PWA frontend backed by PostgreSQL.

**Key architectural decisions:**

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Architecture style | Monolith REST API | Simple CRUD operations; no microservices needed for personal-use v1 |
| Database | PostgreSQL | Full-text search (tsvector/GIN), ACID transactions for quantity updates, managed cloud options available |
| Frontend delivery | React PWA (SPA) | Mobile-first; installable to phone home screen; no native app required |
| Auth model | Session-based, single user | No OAuth complexity; personal-use only; httpOnly cookie for security |
| Deployment | Frontend on Vercel, API + DB on Railway | Low-ops; auto-deploy from repo; managed Postgres |
| ORM/Query builder | Prisma or Knex | Migration management; parameterized queries; Postgres abstraction |
| Drinking status | Computed at read time (app layer) | Never stale; no stored computed columns; trivial logic |

---

### 1.2 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER'S PHONE / BROWSER                      │
│                                                                      │
│   ┌──────────────────────────────────────────────────────────────┐  │
│   │              React PWA (SPA)  —  Vercel CDN                  │  │
│   │                                                              │  │
│   │   ┌──────────────┐  ┌─────────────┐  ┌──────────────────┐   │  │
│   │   │  Wine List   │  │  Dashboard  │  │  Add/Edit Form   │   │  │
│   │   │  (F00, F02)  │  │   (F05)     │  │    (F00, F01)    │   │  │
│   │   └──────────────┘  └─────────────┘  └──────────────────┘   │  │
│   │   ┌──────────────┐  ┌─────────────┐  ┌──────────────────┐   │  │
│   │   │ Wine Detail  │  │ Ready to    │  │  Tasting Note    │   │  │
│   │   │  (F00–F04)   │  │  Drink (F01)│  │    Form (F04)    │   │  │
│   │   └──────────────┘  └─────────────┘  └──────────────────┘   │  │
│   │                                                              │  │
│   │   ┌──────────────────────────────────────────────────────┐   │  │
│   │   │  API Client Layer  (fetch + React Query / SWR)       │   │  │
│   │   └──────────────────────────────────────────────────────┘   │  │
│   └──────────────────────────────────────────────────────────────┘  │
│                           HTTPS / REST                               │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────────┐
│              Node.js REST API  —  Railway (or Render)             │
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │                   Express.js App                        │    │
│   │                                                         │    │
│   │  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │    │
│   │  │  Auth       │  │  Wines       │  │  Tasting Notes│  │    │
│   │  │  Middleware │  │  Router      │  │  Router       │  │    │
│   │  └─────────────┘  └──────────────┘  └───────────────┘  │    │
│   │  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │    │
│   │  │  Bottle     │  │  Dashboard   │  │  Validation   │  │    │
│   │  │  Status     │  │  Router      │  │  Middleware   │  │    │
│   │  │  Router     │  │              │  │  (Zod)        │  │    │
│   │  └─────────────┘  └──────────────┘  └───────────────┘  │    │
│   │                                                         │    │
│   │  ┌──────────────────────────────────────────────────┐   │    │
│   │  │  Drinking Status Computation Service             │   │    │
│   │  │  (pure function; computes status at read time)   │   │    │
│   │  └──────────────────────────────────────────────────┘   │    │
│   │                                                         │    │
│   │  ┌──────────────────────────────────────────────────┐   │    │
│   │  │  Database Layer  (Prisma ORM / pg pool)          │   │    │
│   │  └──────────────────────────────────────────────────┘   │    │
│   └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└───────────────────────────────┬───────────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────────┐
│              PostgreSQL 15+  —  Railway / Supabase                │
│                                                                   │
│   users  │  wines (+ tsvector/GIN)  │  bottle_status_events      │
│   tasting_notes  │  sessions                                      │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

### 1.3 Deployment Topology

```
┌──────────────────────┐     ┌─────────────────────────────┐
│   Vercel (CDN)        │     │   Railway.app               │
│                      │     │                             │
│  React SPA / PWA     │────▶│  Node.js API  (port 3000)   │
│  - Static build      │HTTPS│  - Express.js               │
│  - Web app manifest  │REST │  - Auto-deploy from main    │
│  - Service worker    │     │  - Env vars managed in UI   │
│                      │     │                             │
│  Auto-deploy from    │     │  PostgreSQL 15 (managed)    │
│  main branch         │     │  - Connection pool (pg)     │
└──────────────────────┘     │  - Prisma migrations        │
                             └─────────────────────────────┘
```

**Environment summary:**

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/wineapp` |
| `SESSION_SECRET` | Session token signing (≥32 random bytes) | Generated with `openssl rand -base64 32` |
| `NODE_ENV` | Runtime environment | `production` |
| `PORT` | API server port | `3000` |
| `CORS_ORIGIN` | Allowed frontend origin | `https://wineapp.vercel.app` |

---

### 1.4 Key Architectural Decisions

**Drinking status is computed, never stored.** The `drinking_status` field is calculated by a pure function in the application layer on every read. This avoids stale status data, removes the need for scheduled jobs or database triggers, and keeps the DB schema simple. The computation is O(1) per record and adds negligible latency.

**Full-text search via PostgreSQL tsvector/GIN.** A `search_vector` column is maintained by a BEFORE INSERT/UPDATE trigger, weighted by field importance (wine_name=A, producer=B, region=C, notes=D). A GIN index makes searches sub-millisecond even at 1,000+ records. This avoids adding a dedicated search service (Elasticsearch, Typesense) for v1.

**Session tokens in the `sessions` table.** No JWT — stateful sessions allow instant revocation (logout deletes the row). For a single-user personal app, session scalability is not a concern.

**Atomic quantity updates.** All bottle consume/gift operations are wrapped in a database transaction: event insertion + quantity decrement happen together or not at all. This prevents quantity drift if the API process crashes mid-operation.

**No real-time updates.** Dashboard and collection data are fetched fresh on navigation. No WebSocket or polling required for v1. This simplifies the backend considerably.

---

*00 — Architectural Overview*
