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
---

## 2. Component Architecture

### 2.1 Backend Components

The Node.js API is structured as a standard Express.js application with a layered architecture: routes → controllers → services → database layer.

```
server/
├── app.js                    # Express app setup, middleware registration
├── server.js                 # HTTP server entry point
├── config/
│   └── db.js                 # Database connection pool / Prisma client
├── middleware/
│   ├── auth.js               # Session token validation; attaches req.user
│   ├── validate.js           # Zod schema validation wrapper
│   └── errorHandler.js       # Global error handler; formats error envelope
├── routes/
│   ├── auth.js               # POST /auth/login, POST /auth/logout, GET /auth/me
│   ├── wines.js              # GET/POST /wines, GET/PUT/PATCH/DELETE /wines/:id
│   ├── wineActions.js        # POST /wines/:id/consume, POST /wines/:id/gift
│   │                         # GET /wines/:id/history, GET /wines/ready-to-drink
│   │                         # GET /wines/filter-options
│   ├── tastingNotes.js       # GET/POST /wines/:id/tasting-notes
│   │                         # GET/PUT/PATCH/DELETE /tasting-notes/:note_id
│   ├── events.js             # DELETE /events/:event_id (undo)
│   └── dashboard.js          # GET /dashboard
├── controllers/
│   ├── authController.js
│   ├── winesController.js
│   ├── tastingNotesController.js
│   ├── eventsController.js
│   └── dashboardController.js
├── services/
│   ├── drinkingStatusService.js   # Pure function: computeDrinkingStatus(wine, currentYear)
│   ├── searchService.js           # Builds parameterized search/filter queries
│   └── dashboardService.js        # Aggregation queries for F05
├── db/
│   ├── migrations/               # Prisma or node-pg-migrate migration files
│   └── schema.prisma             # (if using Prisma) schema definition
└── utils/
    ├── pagination.js             # Pagination helper (page, per_page, total_pages)
    └── errors.js                 # Error code constants and AppError class
```

**Component responsibilities:**

| Component | Responsibility |
|-----------|---------------|
| `auth.js` middleware | Validates session token from cookie or Authorization header; rejects with 401 if invalid/expired; attaches `req.user = { id, email }` |
| `validate.js` middleware | Wraps Zod schemas; returns 422 with structured `fields` error object on failure |
| `errorHandler.js` | Catches all thrown errors; formats them into the standard response envelope; logs server errors |
| `drinkingStatusService.js` | Stateless function `computeDrinkingStatus(wine)` — applies F01 logic to return one of 6 status codes; called after every wine record fetch |
| `searchService.js` | Translates query params (q, wine_type, vintage_year_min, etc.) into a parameterized SQL WHERE clause + tsvector query; handles sorting and pagination |
| `dashboardService.js` | Runs F05 aggregate queries in parallel (Promise.all); returns the full dashboard payload |
| `winesController.js` | Handles all wine CRUD; calls `computeDrinkingStatus` before returning each wine record or list item |
| `eventsController.js` | Handles consume/gift/undo operations inside a database transaction |

---

### 2.2 Frontend Components

The React PWA is structured as a standard Vite + React SPA with React Router for navigation, React Query for server state management, and a component library (Tailwind CSS + shadcn/ui or equivalent).

```
client/
├── index.html                # Root HTML; includes viewport meta, manifest link
├── vite.config.js
├── public/
│   ├── manifest.json         # PWA manifest: name, icons, display: standalone
│   └── icons/                # App icons: 192px, 512px
├── src/
│   ├── main.jsx              # React root; QueryClientProvider, Router
│   ├── App.jsx               # Route definitions; bottom navigation shell
│   ├── api/
│   │   ├── client.js         # Fetch wrapper; attaches auth header; handles 401 redirect
│   │   ├── wines.js          # API calls for wine CRUD, actions, filter-options
│   │   ├── tastingNotes.js   # API calls for tasting notes
│   │   └── dashboard.js      # API call for dashboard
│   ├── pages/
│   │   ├── WineListPage.jsx       # F00-B: scrollable wine list with search bar (F02)
│   │   ├── WineDetailPage.jsx     # F00-C: full wine record + history + tasting notes
│   │   ├── AddWinePage.jsx        # F00-A: add wine form
│   │   ├── EditWinePage.jsx       # F00-D: edit wine form (pre-populated)
│   │   ├── ReadyToDrinkPage.jsx   # F01-D: wines with drink_now status
│   │   ├── DashboardPage.jsx      # F05: collection insights
│   │   ├── TastingNoteFormPage.jsx # F04-A/C: create or edit tasting note
│   │   └── LoginPage.jsx          # Auth: email + password login
│   ├── components/
│   │   ├── WineCard.jsx           # Wine list card: name, producer, vintage, status badge
│   │   ├── DrinkingStatusBadge.jsx # Color-coded status pill component
│   │   ├── WineForm.jsx           # Shared add/edit form with mobile-optimized inputs
│   │   ├── TastingNoteCard.jsx    # Single tasting note display
│   │   ├── FilterSheet.jsx        # Bottom-sheet filter panel (F06-E)
│   │   ├── SearchBar.jsx          # Search input with 300ms debounce
│   │   ├── BottomNav.jsx          # Fixed bottom navigation bar (F06-B)
│   │   ├── ConsumeDialog.jsx      # Consume bottle confirmation dialog (F03-A)
│   │   ├── GiftDialog.jsx         # Gift bottle dialog (F03-B)
│   │   └── DashboardCard.jsx      # Individual stat card for dashboard
│   ├── hooks/
│   │   ├── useWines.js            # React Query hooks for wine list + detail
│   │   ├── useDashboard.js        # React Query hook for dashboard data
│   │   └── useAuth.js             # Auth state; login/logout mutations
│   └── utils/
│       ├── drinkingStatus.js      # Client-side status label + color mapping
│       └── formatters.js          # Currency, date, rating display formatters
```

**Key frontend patterns:**

| Pattern | Implementation | Purpose |
|---------|---------------|---------|
| Server state | React Query (`@tanstack/react-query`) | Caching, background refetch, loading/error states |
| Filter state | React state + URL query params | Persists across detail ↔ list navigation; shareable |
| Form validation | React Hook Form + Zod | Client-side validation matching server rules |
| Debounced search | `useDebounce` hook (300ms) | Triggers search after user stops typing |
| Bottom nav | Fixed-position `BottomNav` component | Thumb-friendly; always accessible (F06-B) |
| PWA install | `manifest.json` + service worker | Installable to phone home screen (F06) |
| Error boundaries | React ErrorBoundary at page level | Graceful fallback on unhandled errors (F06-H) |

---

### 2.3 Database Layer

PostgreSQL 15+ accessed via:
- **Prisma** (preferred): Schema-as-code, type-safe queries, built-in migration management
- **Alternative**: `knex` with `node-pg-migrate` if Prisma's overhead is undesirable for this scale

Connection pool: `pg` library or Prisma's built-in pool, size 5–10 connections.

All queries are **parameterized** — no string interpolation of user input into SQL.

---

*01 — Component Architecture*
---

## 3. Data Model

### 3.1 Entity-Relationship Diagram

```
┌──────────────────────────────────────────────────────┐
│  users                                               │
│  ─────                                               │
│  id           SERIAL PK                              │
│  email        VARCHAR(255) UNIQUE NOT NULL            │
│  password_hash VARCHAR(255) NOT NULL                  │
│  display_name VARCHAR(255)                            │
│  created_at   TIMESTAMPTZ                            │
│  updated_at   TIMESTAMPTZ                            │
└──────────────────────┬───────────────────────────────┘
                       │ 1
                       │
                       │ has many
                       ▼ N
┌──────────────────────────────────────────────────────┐
│  wines                                               │
│  ─────                                               │
│  id                  SERIAL PK                       │
│  user_id             INTEGER FK → users.id           │
│  wine_name           VARCHAR(255) NOT NULL            │
│  producer            VARCHAR(255)                    │
│  vintage_year        INTEGER                         │
│  country             VARCHAR(255)                    │
│  region              VARCHAR(255)                    │
│  appellation         VARCHAR(255)                    │
│  wine_type           VARCHAR(20) ENUM NOT NULL        │
│  grape_variety       VARCHAR(255)                    │
│  bottle_size         VARCHAR(10) ENUM DEFAULT '750ml' │
│  quantity_owned      INTEGER NOT NULL DEFAULT 1      │
│  quantity_consumed   INTEGER NOT NULL DEFAULT 0      │
│  purchase_price      NUMERIC(10,2)                   │
│  purchase_date       DATE                            │
│  purchase_source     VARCHAR(255)                    │
│  storage_location    VARCHAR(255)                    │
│  notes               TEXT                            │
│  drink_window_start  INTEGER                         │
│  drink_window_end    INTEGER                         │
│  is_special_occasion BOOLEAN DEFAULT FALSE           │
│  search_vector       TSVECTOR  ← GIN indexed         │
│  created_at          TIMESTAMPTZ                     │
│  updated_at          TIMESTAMPTZ                     │
└────────┬─────────────────────────┬───────────────────┘
         │ 1                       │ 1
         │ has many                │ has many
         ▼ N                       ▼ N
┌─────────────────────┐    ┌──────────────────────────────────────────┐
│ bottle_status_events│    │  tasting_notes                           │
│ ────────────────────│    │  ─────────────                           │
│ id         SERIAL PK│    │  id                    SERIAL PK         │
│ wine_id    FK→wines │    │  wine_id               FK → wines.id     │
│ event_type VARCHAR  │    │  bottle_status_event_id FK → events.id   │
│ event_date DATE     │◀───│                        (nullable)        │
│ recipient_name      │    │  date_opened           DATE NOT NULL     │
│ created_at TIMESTAMPTZ   │  personal_rating       INTEGER (1–100)   │
└─────────────────────┘    │  appearance_notes      TEXT              │
                           │  aroma_notes           TEXT              │
                           │  flavor_notes          TEXT              │
                           │  finish_notes          TEXT              │
                           │  overall_notes         TEXT              │
                           │  food_pairing          VARCHAR(500)      │
                           │  occasion              VARCHAR(255)      │
                           │  would_buy_again       VARCHAR(10) ENUM  │
                           │  guest_feedback        TEXT              │
                           │  created_at            TIMESTAMPTZ       │
                           │  updated_at            TIMESTAMPTZ       │
                           └──────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  sessions                                            │
│  ────────                                            │
│  id           VARCHAR(128) PK  ← secure random token │
│  user_id      INTEGER FK → users.id                  │
│  created_at   TIMESTAMPTZ                            │
│  expires_at   TIMESTAMPTZ                            │
│  ip_address   VARCHAR(45)                            │
│  user_agent   TEXT                                   │
└──────────────────────────────────────────────────────┘
```

---

### 3.2 Complete Database DDL (PostgreSQL 15+)

#### Table: users

```sql
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,        -- bcrypt hash; never store plaintext
  display_name  VARCHAR(255),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Login lookup
CREATE UNIQUE INDEX idx_users_email ON users(email);
```

---

#### Table: wines

```sql
CREATE TABLE wines (
  id                  SERIAL PRIMARY KEY,
  user_id             INTEGER       NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Core identity
  wine_name           VARCHAR(255)  NOT NULL,
  producer            VARCHAR(255),
  vintage_year        INTEGER       CHECK (vintage_year >= 1800 AND vintage_year <= 2100),
  country             VARCHAR(255),
  region              VARCHAR(255),
  appellation         VARCHAR(255),
  wine_type           VARCHAR(20)   NOT NULL
                        CHECK (wine_type IN ('red', 'white', 'rosé', 'sparkling', 'dessert')),
  grape_variety       VARCHAR(255),
  bottle_size         VARCHAR(10)   DEFAULT '750ml'
                        CHECK (bottle_size IN ('187ml', '375ml', '750ml', '1.5L', '3L', 'other')),

  -- Quantity tracking
  quantity_owned      INTEGER       NOT NULL DEFAULT 1  CHECK (quantity_owned >= 0),
  quantity_consumed   INTEGER       NOT NULL DEFAULT 0  CHECK (quantity_consumed >= 0),

  -- Purchase info
  purchase_price      NUMERIC(10,2) CHECK (purchase_price >= 0),
  purchase_date       DATE,
  purchase_source     VARCHAR(255),

  -- Storage
  storage_location    VARCHAR(255),

  -- Freeform notes (general; not a tasting note)
  notes               TEXT,

  -- Drinking window (see F01)
  drink_window_start  INTEGER,
  drink_window_end    INTEGER,
  is_special_occasion BOOLEAN       NOT NULL DEFAULT FALSE,

  -- Full-text search vector (maintained by trigger below)
  search_vector       TSVECTOR,

  -- Metadata
  created_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT chk_drink_window_order CHECK (
    drink_window_end IS NULL
    OR drink_window_start IS NULL
    OR drink_window_end >= drink_window_start
  ),
  CONSTRAINT chk_quantity_non_negative CHECK (
    quantity_owned >= 0 AND quantity_consumed >= 0
  )
);

-- Indexes for common queries and filter dimensions (F02)
CREATE INDEX idx_wines_user_id       ON wines(user_id);
CREATE INDEX idx_wines_wine_type     ON wines(wine_type);
CREATE INDEX idx_wines_country       ON wines(country);
CREATE INDEX idx_wines_region        ON wines(region);
CREATE INDEX idx_wines_vintage_year  ON wines(vintage_year);
CREATE INDEX idx_wines_producer      ON wines(producer);
CREATE INDEX idx_wines_storage_loc   ON wines(storage_location);
CREATE INDEX idx_wines_created_at    ON wines(created_at DESC);

-- Full-text search GIN index (F02)
CREATE INDEX idx_wines_fts ON wines USING GIN(search_vector);

-- Trigger function: maintain search_vector on insert/update
CREATE OR REPLACE FUNCTION wines_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.wine_name,  '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.producer,   '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.region,     '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.notes,      '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wines_search_vector_trigger
  BEFORE INSERT OR UPDATE ON wines
  FOR EACH ROW EXECUTE FUNCTION wines_search_vector_update();

-- Auto-update updated_at on any row change
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wines_updated_at_trigger
  BEFORE UPDATE ON wines
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

---

#### Table: bottle_status_events

```sql
CREATE TABLE bottle_status_events (
  id             SERIAL       PRIMARY KEY,
  wine_id        INTEGER      NOT NULL REFERENCES wines(id) ON DELETE CASCADE,
  event_type     VARCHAR(20)  NOT NULL CHECK (event_type IN ('consumed', 'gifted')),
  event_date     DATE         NOT NULL,
  recipient_name VARCHAR(255),              -- populated only when event_type = 'gifted'
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bottle_events_wine_id    ON bottle_status_events(wine_id);
CREATE INDEX idx_bottle_events_event_date ON bottle_status_events(event_date DESC);
CREATE INDEX idx_bottle_events_type       ON bottle_status_events(event_type);
```

---

#### Table: tasting_notes

```sql
CREATE TABLE tasting_notes (
  id                      SERIAL       PRIMARY KEY,
  wine_id                 INTEGER      NOT NULL REFERENCES wines(id) ON DELETE CASCADE,
  bottle_status_event_id  INTEGER      REFERENCES bottle_status_events(id) ON DELETE SET NULL,

  -- Core tasting fields
  date_opened             DATE         NOT NULL,
  personal_rating         INTEGER      CHECK (personal_rating >= 1 AND personal_rating <= 100),
  appearance_notes        TEXT,
  aroma_notes             TEXT,
  flavor_notes            TEXT,
  finish_notes            TEXT,
  overall_notes           TEXT,

  -- Context
  food_pairing            VARCHAR(500),
  occasion                VARCHAR(255),
  would_buy_again         VARCHAR(10)  CHECK (would_buy_again IN ('yes', 'no', 'maybe')),
  guest_feedback          TEXT,

  -- Metadata
  created_at              TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasting_notes_wine_id    ON tasting_notes(wine_id);
CREATE INDEX idx_tasting_notes_date       ON tasting_notes(date_opened DESC);
CREATE INDEX idx_tasting_notes_rating     ON tasting_notes(personal_rating DESC);
CREATE INDEX idx_tasting_notes_event_id   ON tasting_notes(bottle_status_event_id);

CREATE TRIGGER tasting_notes_updated_at_trigger
  BEFORE UPDATE ON tasting_notes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

---

#### Table: sessions

```sql
CREATE TABLE sessions (
  id          VARCHAR(128) PRIMARY KEY,     -- secure random token (≥128 bits, URL-safe base64)
  user_id     INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  expires_at  TIMESTAMPTZ  NOT NULL,
  ip_address  VARCHAR(45),                  -- IPv4 or IPv6
  user_agent  TEXT
);

CREATE INDEX idx_sessions_user_id    ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

---

### 3.3 Computed Fields (Application Layer, Not Stored)

| Field | Computed From | Location |
|-------|--------------|----------|
| `drinking_status` | `drink_window_start`, `drink_window_end`, `is_special_occasion`, current date | `drinkingStatusService.js` — called after every wine fetch |
| `average_rating` | `AVG(personal_rating)` from `tasting_notes` WHERE `personal_rating IS NOT NULL` | Joined query in `winesController.getWineById`; not stored |

---

### 3.4 Column Type Reference

| PostgreSQL Type | SQLite Equivalent | Notes |
|----------------|-------------------|-------|
| `SERIAL` | `INTEGER PRIMARY KEY AUTOINCREMENT` | Auto-increment PK |
| `TIMESTAMPTZ` | `TEXT` | Store ISO 8601: `2026-05-21T14:30:00Z` |
| `NUMERIC(10,2)` | `REAL` | SQLite has no fixed-precision decimal |
| `BOOLEAN` | `INTEGER` (0/1) | SQLite has no native boolean |
| `VARCHAR(n)` | `TEXT` | SQLite ignores length constraints |
| `DATE` | `TEXT` | Store as `YYYY-MM-DD` string |

SQLite is acceptable for local development or single-instance deployment. For production, use PostgreSQL (required for tsvector full-text search).

---

*02 — Data Model*
---

## 4. API Design

### 4.1 API Conventions

- **Base URL:** `/api`
- **Authentication:** All endpoints (except `/api/auth/login`) require a valid session token via:
  - `Authorization: Bearer <token>` header, **or**
  - `session` httpOnly cookie (preferred for web/PWA clients)
- **Content-Type:** `application/json` for all request and response bodies
- **Response envelope (all endpoints):**

```json
{
  "data": { ... },
  "error": null
}
```

- **Error envelope:**

```json
{
  "data": null,
  "error": {
    "code": "WINE_NOT_FOUND",
    "message": "Wine record not found",
    "fields": {}
  }
}
```

- **Pagination envelope (list endpoints):**

```json
{
  "data": [ ... ],
  "meta": {
    "total_count": 142,
    "page": 1,
    "per_page": 20,
    "total_pages": 8
  }
}
```

---

### 4.2 TypeScript Interfaces

```typescript
// ─── Enums ────────────────────────────────────────────────────────────────

type WineType = 'red' | 'white' | 'rosé' | 'sparkling' | 'dessert';

type BottleSize = '187ml' | '375ml' | '750ml' | '1.5L' | '3L' | 'other';

type DrinkingStatus =
  | 'drink_now'
  | 'hold'
  | 'approaching_peak'
  | 'past_window'
  | 'special_occasion'
  | 'no_window';

type EventType = 'consumed' | 'gifted';

type WouldBuyAgain = 'yes' | 'no' | 'maybe';

type SortOption =
  | 'recent'
  | 'name_asc'
  | 'name_desc'
  | 'vintage_asc'
  | 'vintage_desc'
  | 'rating_desc'
  | 'price_asc'
  | 'price_desc';

// ─── Auth ─────────────────────────────────────────────────────────────────

interface User {
  id: number;
  email: string;
  display_name: string | null;
  created_at: string;           // ISO 8601
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  expires_at: string;           // ISO 8601
  user: User;
}

// ─── Wine Record ──────────────────────────────────────────────────────────

interface WineSummary {
  id: number;
  wine_name: string;
  producer: string | null;
  vintage_year: number | null;
  wine_type: WineType;
  quantity_owned: number;
  quantity_consumed: number;
  drinking_status: DrinkingStatus;   // computed, not stored
  average_rating: number | null;     // computed from tasting_notes
  storage_location: string | null;
  created_at: string;
}

interface WineDetail extends WineSummary {
  country: string | null;
  region: string | null;
  appellation: string | null;
  grape_variety: string | null;
  bottle_size: BottleSize;
  purchase_price: number | null;
  purchase_date: string | null;      // YYYY-MM-DD
  purchase_source: string | null;
  notes: string | null;
  drink_window_start: number | null;
  drink_window_end: number | null;
  is_special_occasion: boolean;
  tasting_notes: TastingNote[];
  updated_at: string;
}

interface CreateWineRequest {
  wine_name: string;                 // required
  wine_type: WineType;               // required
  quantity_owned: number;            // required; default 1
  producer?: string;
  vintage_year?: number | null;
  country?: string;
  region?: string;
  appellation?: string;
  grape_variety?: string;
  bottle_size?: BottleSize;
  purchase_price?: number;
  purchase_date?: string;            // YYYY-MM-DD
  purchase_source?: string;
  storage_location?: string;
  notes?: string;
  drink_window_start?: number;
  drink_window_end?: number;
  is_special_occasion?: boolean;
}

type UpdateWineRequest = Partial<CreateWineRequest>;

// ─── Bottle Status Events ─────────────────────────────────────────────────

interface BottleStatusEvent {
  id: number;
  wine_id: number;
  event_type: EventType;
  event_date: string;               // YYYY-MM-DD
  recipient_name: string | null;
  has_tasting_note: boolean;
  created_at: string;
}

interface ConsumeBottleRequest {
  event_date: string;               // YYYY-MM-DD; defaults to today
  add_tasting_note?: boolean;
}

interface GiftBottleRequest {
  event_date: string;               // YYYY-MM-DD; defaults to today
  recipient_name?: string;
}

interface BottleActionResponse {
  wine: WineSummary;
  event: BottleStatusEvent;
}

// ─── Tasting Notes ────────────────────────────────────────────────────────

interface TastingNote {
  id: number;
  wine_id: number;
  bottle_status_event_id: number | null;
  date_opened: string;              // YYYY-MM-DD
  personal_rating: number | null;   // 1–100
  appearance_notes: string | null;
  aroma_notes: string | null;
  flavor_notes: string | null;
  finish_notes: string | null;
  overall_notes: string | null;
  food_pairing: string | null;
  occasion: string | null;
  would_buy_again: WouldBuyAgain | null;
  guest_feedback: string | null;
  created_at: string;
  updated_at: string;
}

interface CreateTastingNoteRequest {
  date_opened: string;              // required; YYYY-MM-DD
  personal_rating?: number;
  appearance_notes?: string;
  aroma_notes?: string;
  flavor_notes?: string;
  finish_notes?: string;
  overall_notes?: string;
  food_pairing?: string;
  occasion?: string;
  would_buy_again?: WouldBuyAgain;
  guest_feedback?: string;
  bottle_status_event_id?: number;
}

type UpdateTastingNoteRequest = Partial<CreateTastingNoteRequest>;

// ─── Dashboard ────────────────────────────────────────────────────────────

interface DashboardResponse {
  summary_stats: {
    total_bottles: number;
    total_wine_records: number;
    estimated_value: number | null;
    ready_to_drink_count: number;
    approaching_count: number;
    avg_purchase_price: number | null;
  };
  type_breakdown: Array<{ wine_type: WineType; bottle_count: number }>;
  top_regions: Array<{ region: string; bottle_count: number }>;
  top_grapes: Array<{ grape_variety: string; bottle_count: number }>;
  highest_rated: Array<{
    wine_id: number;
    wine_name: string;
    producer: string | null;
    vintage_year: number | null;
    average_rating: number;
  }>;
  recently_added: Array<{
    wine_id: number;
    wine_name: string;
    producer: string | null;
    vintage_year: number | null;
    created_at: string;
    quantity_owned: number;
  }>;
  recently_consumed: Array<{
    event_id: number;
    wine_id: number;
    wine_name: string;
    event_date: string;
    has_tasting_note: boolean;
  }>;
}

// ─── Filter Options ───────────────────────────────────────────────────────

interface FilterOptionsResponse {
  producers: string[];
  countries: string[];
  regions: string[];
  grapes: string[];
  storage_locations: string[];
}

// ─── Pagination Meta ──────────────────────────────────────────────────────

interface PaginationMeta {
  total_count: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// ─── API Envelopes ────────────────────────────────────────────────────────

interface ApiResponse<T> {
  data: T;
  error: null;
}

interface ApiError {
  data: null;
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}

interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
```

---

### 4.3 Endpoint Catalog

#### Authentication

| Method | Path | Auth | Description | Request | Response |
|--------|------|------|-------------|---------|----------|
| `POST` | `/api/auth/login` | None | Log in; receive session token | `LoginRequest` | `200 LoginResponse` |
| `POST` | `/api/auth/logout` | Required | Invalidate session | — | `204` |
| `GET` | `/api/auth/me` | Required | Get current user profile | — | `200 User` |

---

#### Wine Inventory (F00, F01, F02)

| Method | Path | Auth | Description | Request | Response |
|--------|------|------|-------------|---------|----------|
| `GET` | `/api/wines` | Required | List wines; supports all search/filter query params | Query params (see below) | `200 PaginatedResponse<WineSummary>` |
| `POST` | `/api/wines` | Required | Create new wine record | `CreateWineRequest` | `201 WineDetail` |
| `GET` | `/api/wines/ready-to-drink` | Required | Wines with `drink_now` status, sorted by window end ASC | — | `200 PaginatedResponse<WineSummary>` |
| `GET` | `/api/wines/filter-options` | Required | Distinct values for filter dropdowns | — | `200 FilterOptionsResponse` |
| `GET` | `/api/wines/:id` | Required | Get single wine with tasting notes | — | `200 WineDetail` |
| `PUT` | `/api/wines/:id` | Required | Full replace of wine record | `CreateWineRequest` | `200 WineDetail` |
| `PATCH` | `/api/wines/:id` | Required | Partial update of wine record | `UpdateWineRequest` | `200 WineDetail` |
| `DELETE` | `/api/wines/:id` | Required | Delete wine + all related records | — | `204` |

**`GET /api/wines` query parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `q` | string | Full-text search (wine_name, producer, region, notes) |
| `wine_type` | comma-separated enums | Filter by wine type(s) |
| `producer` | string | Partial match |
| `country` | string | Partial match |
| `region` | string | Partial match |
| `vintage_year_min` | integer | Min vintage year (inclusive) |
| `vintage_year_max` | integer | Max vintage year (inclusive) |
| `grape_variety` | string | Partial match |
| `drinking_status` | comma-separated enums | Filter by status(es) |
| `storage_location` | string | Partial match |
| `price_min` | decimal | Min purchase price |
| `price_max` | decimal | Max purchase price |
| `rating_min` | integer | Min average rating (1–100) |
| `sort` | enum | `recent` (default), `name_asc`, `name_desc`, `vintage_asc`, `vintage_desc`, `rating_desc`, `price_asc`, `price_desc` |
| `page` | integer | Page number (default 1) |
| `per_page` | integer | Per page (default 20, max 100) |

---

#### Bottle Status (F03)

| Method | Path | Auth | Description | Request | Response |
|--------|------|------|-------------|---------|----------|
| `POST` | `/api/wines/:id/consume` | Required | Mark one bottle consumed; decrements `quantity_owned`, increments `quantity_consumed` | `ConsumeBottleRequest` | `200 BottleActionResponse` |
| `POST` | `/api/wines/:id/gift` | Required | Mark one bottle gifted; decrements `quantity_owned` only | `GiftBottleRequest` | `200 BottleActionResponse` |
| `GET` | `/api/wines/:id/history` | Required | All status events for wine, sorted by date DESC | — | `200 BottleStatusEvent[]` |
| `DELETE` | `/api/events/:event_id` | Required | Undo status event; reverses quantity atomically | — | `200 WineDetail` |

---

#### Tasting Notes (F04)

| Method | Path | Auth | Description | Request | Response |
|--------|------|------|-------------|---------|----------|
| `GET` | `/api/wines/:id/tasting-notes` | Required | List tasting notes for wine, sorted by date DESC | — | `200 TastingNote[]` |
| `POST` | `/api/wines/:id/tasting-notes` | Required | Create tasting note | `CreateTastingNoteRequest` | `201 TastingNote` |
| `GET` | `/api/tasting-notes/:note_id` | Required | Get single tasting note | — | `200 TastingNote` |
| `PUT` | `/api/tasting-notes/:note_id` | Required | Full replace of tasting note | `CreateTastingNoteRequest` | `200 TastingNote` |
| `PATCH` | `/api/tasting-notes/:note_id` | Required | Partial update of tasting note | `UpdateTastingNoteRequest` | `200 TastingNote` |
| `DELETE` | `/api/tasting-notes/:note_id` | Required | Delete tasting note | — | `204` |

---

#### Dashboard (F05)

| Method | Path | Auth | Description | Request | Response |
|--------|------|------|-------------|---------|----------|
| `GET` | `/api/dashboard` | Required | All collection insights in one response | — | `200 DashboardResponse` |

---

### 4.4 Drinking Status Computation

The `drinkingStatusService` is a pure function applied to every wine record at read time:

```typescript
function computeDrinkingStatus(wine: {
  drink_window_start: number | null;
  drink_window_end: number | null;
  is_special_occasion: boolean;
}, currentYear: number = new Date().getFullYear()): DrinkingStatus {

  // 1. Special occasion override
  if (wine.is_special_occasion) return 'special_occasion';

  // 2. No window defined
  if (!wine.drink_window_start && !wine.drink_window_end) return 'no_window';

  // 3. Past window
  if (wine.drink_window_end && currentYear > wine.drink_window_end) return 'past_window';

  // 4. Drink now (within window)
  if (wine.drink_window_start && currentYear >= wine.drink_window_start) return 'drink_now';

  // 5. Approaching peak (within 2 years of start)
  if (wine.drink_window_start && currentYear >= wine.drink_window_start - 2) return 'approaching_peak';

  // 6. Still holding
  return 'hold';
}
```

---

*03 — API Design*
---

## 5. Security Architecture

### 5.1 Authentication

WineApp v1 uses **stateful session-based authentication** for a single registered user.

**Login flow:**

```
Client                         Server                          Database
  │                               │                               │
  │  POST /api/auth/login          │                               │
  │  { email, password }          │                               │
  │──────────────────────────────▶│                               │
  │                               │  SELECT * FROM users          │
  │                               │  WHERE email = $1             │
  │                               │──────────────────────────────▶│
  │                               │◀──────────────────────────────│
  │                               │  bcrypt.compare(password,     │
  │                               │    password_hash)             │
  │                               │  → match                      │
  │                               │                               │
  │                               │  Generate secure random       │
  │                               │  token (128-bit, base64url)   │
  │                               │                               │
  │                               │  INSERT INTO sessions         │
  │                               │  (id, user_id, expires_at)    │
  │                               │──────────────────────────────▶│
  │                               │◀──────────────────────────────│
  │◀──────────────────────────────│                               │
  │  200 { token, expires_at }    │                               │
  │  Set-Cookie: session=<token>  │                               │
  │  HttpOnly; SameSite=Strict    │                               │
```

**Session validation middleware (every protected request):**

1. Extract token from `Authorization: Bearer <token>` header or `session` cookie
2. `SELECT * FROM sessions WHERE id = $1 AND expires_at > NOW()`
3. If not found or expired → `401 AUTH_REQUIRED`
4. Attach `req.user = { id: session.user_id }` for downstream handlers
5. Extend session expiry (rolling 30-day window): `UPDATE sessions SET expires_at = NOW() + '30 days'`

**Password security:**
- Passwords hashed with **bcrypt**, minimum cost factor **12**
- Plaintext passwords never stored, logged, or transmitted after hashing
- Password reset is out of scope for v1 (single-user personal instance)

**Session security:**
- Token is a cryptographically random 128-bit value, URL-safe base64 encoded
- Delivered as `httpOnly` cookie with `SameSite=Strict` to prevent CSRF and XSS token theft
- All session tokens transmitted exclusively over **HTTPS**
- Logout deletes the session row immediately (instant revocation)
- Expired sessions are purged at login time or by a lightweight cleanup job

---

### 5.2 Authorization

WineApp v1 has a simple ownership-based authorization model: **all resources belong to the authenticated user**.

**Rule:** Every database query for wines, bottle events, tasting notes, and sessions is scoped by `user_id`:

```sql
-- Example: wine ownership check embedded in every query
SELECT * FROM wines WHERE id = $1 AND user_id = $2;
```

If a record exists but belongs to a different user, the response is **404 WINE_NOT_FOUND** (not 403) — this avoids leaking the existence of records to potential future users.

**Authorization matrix:**

| Resource | Unauthenticated | Authenticated user |
|----------|-----------------|--------------------|
| `POST /api/auth/login` | Allowed | Allowed |
| `GET /api/auth/me` | 401 | Own profile only |
| Any `/api/wines/*` | 401 | Own wines only |
| Any `/api/tasting-notes/*` | 401 | Own notes only |
| Any `/api/events/*` | 401 | Own events only |
| `GET /api/dashboard` | 401 | Own data only |

---

### 5.3 Input Validation

All incoming request bodies and query parameters are validated by **Zod schemas** in the `validate.js` middleware before reaching controllers:

- Required fields presence check
- Type coercion (string → integer where appropriate)
- Enum membership validation
- Range and length constraints (matching FRD validation rules)
- Date format validation (`YYYY-MM-DD`; no future dates where prohibited)

Validation failures return `422` with the structured `fields` error map. Invalid inputs **never reach the database layer**.

---

### 5.4 SQL Injection Prevention

- All database queries use **parameterized statements** (no string interpolation of user values)
- Prisma's query builder automatically parameterizes all values
- Raw SQL queries (if any) use `$1, $2, ...` placeholders with the `pg` driver's parameterized query API
- The application never constructs SQL strings from user input

---

### 5.5 Transport Security

- All traffic is HTTPS-only (enforced by Vercel and Railway hosting)
- HTTP requests are redirected to HTTPS at the hosting layer
- Session tokens are never transmitted over HTTP
- CORS is configured to allow only the specific frontend origin (`CORS_ORIGIN` env var):

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN,  // e.g. "https://wineapp.vercel.app"
  credentials: true,                // allow cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));
```

---

### 5.6 Data Protection

**Sensitive data handling:**

| Data | Protection |
|------|-----------|
| Passwords | bcrypt hashed (cost 12); never stored or logged in plaintext |
| Session tokens | httpOnly cookie; never exposed in JS; not in logs |
| Wine data | Scoped to user_id in all queries; no cross-user data access possible |
| User IDs in logs | Server logs include `user_id` for error tracking but no PII (email, name) |

**No third-party data sharing:** WineApp v1 has no analytics, advertising, or external tracking integrations. All user data resides exclusively in the application's PostgreSQL database.

---

### 5.7 Error Handling and Information Leakage

- Server errors (`500`) return a generic message: "An unexpected error occurred" — no stack traces, SQL errors, or internal details in production responses
- `404 WINE_NOT_FOUND` is returned for both "not found" and "belongs to another user" cases (prevents existence probing)
- Error logging writes to server logs with `user_id`, request path, and error code — no PII, no full request bodies in logs

---

*04 — Security Architecture*
---

## 6. Technology Stack

### 6.1 Stack Summary

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Frontend framework** | React | 18.x | SPA / PWA; component model; ecosystem |
| **Frontend build** | Vite | 5.x | Fast dev server; optimized production build; PWA plugin |
| **Frontend routing** | React Router | 6.x | Client-side navigation; URL-based filter state |
| **Server state** | TanStack Query (React Query) | 5.x | API caching, background refetch, loading/error states |
| **Form handling** | React Hook Form | 7.x | Performant forms; integrates with Zod validation |
| **Client validation** | Zod | 3.x | Schema validation shared between client and server |
| **Styling** | Tailwind CSS | 3.x | Utility-first; mobile-first responsive design |
| **UI components** | shadcn/ui | latest | Accessible, unstyled base components; Tailwind-compatible |
| **PWA** | vite-plugin-pwa | latest | Service worker; web app manifest generation |
| **Backend runtime** | Node.js | 20.x LTS | JavaScript runtime; widely supported on hosting platforms |
| **Backend framework** | Express.js | 4.x | Minimal REST API; middleware ecosystem |
| **ORM / Query builder** | Prisma | 5.x | Type-safe DB queries; migration management; schema-as-code |
| **Database** | PostgreSQL | 15.x | Full-text search (tsvector/GIN); ACID; managed cloud options |
| **DB driver** | pg (node-postgres) | 8.x | Low-level PostgreSQL driver; used by Prisma |
| **Password hashing** | bcryptjs | 2.x | bcrypt hashing; pure JS (no native bindings needed) |
| **Input validation** | Zod | 3.x | Server-side request validation; same schemas as client |
| **HTTP security** | helmet | 7.x | HTTP security headers (CSP, HSTS, etc.) |
| **CORS** | cors | 2.x | Cross-origin request control |
| **Logging** | pino | 8.x | Fast structured JSON logging |
| **Environment config** | dotenv | 16.x | `.env` file loading in development |
| **Testing (API)** | Vitest + supertest | latest | Unit and integration tests for API routes |
| **Testing (UI)** | Vitest + Testing Library | latest | Component and page tests |
| **Linting** | ESLint + Prettier | latest | Code quality and formatting |
| **Frontend hosting** | Vercel | — | Static SPA hosting; global CDN; auto-deploy from git |
| **Backend hosting** | Railway | — | Node.js process hosting; managed PostgreSQL |

---

### 6.2 Key Dependency Rationale

**React (not Vue):** React's larger ecosystem, wider hosting/tooling support, and stronger mobile PWA tooling make it the better fit. The team's likely React familiarity also reduces onboarding time.

**Prisma (not raw SQL or Knex):** Prisma's type-safe query API, excellent migration tooling (`prisma migrate`), and schema introspection reduce boilerplate and schema drift risk. For a personal-use app at this scale, Prisma's startup overhead is acceptable.

**PostgreSQL (not SQLite):** Full-text search with `tsvector`/GIN index is a first-class requirement (F02). PostgreSQL's managed cloud options (Railway, Supabase) have near-zero ops overhead. SQLite remains an acceptable local development alternative.

**TanStack Query:** Handles all server state caching, background refetch, and loading/error states — eliminates the need for Redux or custom fetch infrastructure. Particularly useful for the wine list with filters (query key includes filter state for automatic cache invalidation).

**Tailwind + shadcn/ui:** Tailwind's utility classes pair well with mobile-first development. shadcn/ui provides accessible base components (dialogs, bottom sheets, forms) that can be customized to the wine aesthetic without design system lock-in.

---

### 6.3 Development Tooling

| Tool | Purpose |
|------|---------|
| `pnpm` or `npm` | Package management |
| `prisma studio` | GUI for database inspection during development |
| `prisma migrate dev` | Apply schema migrations in development |
| `prisma migrate deploy` | Apply migrations in production (Railway build step) |
| ESLint | Code quality; catch common React and Node.js antipatterns |
| Prettier | Consistent code formatting |
| Vitest | Fast unit/integration tests (replaces Jest; Vite-native) |
| supertest | HTTP integration tests for API routes without a running server |

---

### 6.4 Project Structure Overview

```
wineapp/
├── client/           # React PWA (Vite)
│   ├── src/
│   ├── public/
│   └── package.json
├── server/           # Node.js REST API (Express)
│   ├── src/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── package.json
├── shared/           # (optional) Shared Zod schemas used by both client and server
│   └── schemas/
└── README.md
```

A monorepo layout (pnpm workspaces or Turborepo) is recommended to share Zod validation schemas between client and server, ensuring validation rules stay in sync.

---

*05 — Technology Stack*
---

## 7. Integration Points

### 7.1 External Systems (v1)

WineApp v1 is intentionally self-contained with minimal external dependencies. There are no third-party API integrations beyond hosting infrastructure.

| Integration | Type | Purpose | Required |
|-------------|------|---------|----------|
| Vercel | Frontend hosting | Static SPA/PWA deployment; global CDN; auto-deploy from main | Yes |
| Railway | Backend hosting + DB | Node.js process + managed PostgreSQL; env var management | Yes |
| Browser (PWA) | Client runtime | Service worker; web app manifest; installable to home screen | Yes |

---

### 7.2 Hosting Integration Details

#### Vercel (Frontend)

- Deploy React SPA via `vercel.json` or Vercel's automatic framework detection
- Build command: `pnpm run build` (Vite)
- Output directory: `dist/`
- All routes rewritten to `index.html` (SPA routing): add `vercel.json` rewrites rule
- Environment variables: `VITE_API_BASE_URL` pointing to the Railway API URL

```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

#### Railway (Backend API)

- Deploys Node.js process from `server/` directory
- Start command: `node src/server.js`
- Environment variables managed in Railway UI: `DATABASE_URL`, `SESSION_SECRET`, `NODE_ENV`, `PORT`, `CORS_ORIGIN`
- Health check endpoint recommended: `GET /health` → `200 { status: "ok" }`
- Database migrations run as a Railway deploy step: `prisma migrate deploy`

#### Railway PostgreSQL

- Managed PostgreSQL 15; `DATABASE_URL` injected automatically
- Connection pool: Prisma manages connection pooling (default 5 connections for hobby tier)
- Backups: Railway provides automatic daily backups on paid plans

---

### 7.3 PWA Integration

The frontend is a Progressive Web App installable to the user's phone home screen.

**`public/manifest.json`:**
```json
{
  "name": "WineApp",
  "short_name": "WineApp",
  "description": "Personal wine collection manager",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a0a00",
  "theme_color": "#7b1c2a",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

**Service worker (vite-plugin-pwa):**
- Caches static assets (app shell) for fast subsequent loads
- Full offline support is deferred to v2; v1 provides only shell caching
- Configured with `workbox` strategy: `StaleWhileRevalidate` for static assets, `NetworkFirst` for API calls (to avoid serving stale data)

---

### 7.4 Deferred Integrations (Out of Scope for v1)

The following integrations are explicitly deferred and the architecture does not need to accommodate them today — but the data model is designed not to block them:

| Integration | Deferred To | Architectural Note |
|-------------|-------------|-------------------|
| Wine data APIs (Vivino, Wine-Searcher) | Phase 3–4 | `wines` table has all fields needed to store externally looked-up data |
| Camera / label scanning (OCR/CV) | Phase 3 | No schema changes needed; add `label_image_url` column |
| Push notifications (drinking window alerts) | Phase 2 | Add `push_subscription` column to `users` table |
| Export (CSV/PDF) | Phase 2 | Pure read-only; no schema changes |
| Import from spreadsheet | Phase 2 | Bulk insert into existing `wines` table |
| OAuth / SSO | Phase 4 | `users` table can gain `oauth_provider` + `oauth_id` columns |
| Multi-user / household sharing | Phase 4 | `user_id` FK on all resource tables already in place |
| AI recommendation engine | Phase 3–4 | `tasting_notes` + `wines` data sufficient as training input |

---

### 7.5 Error Monitoring (Optional for v1)

No mandatory external error monitoring in v1. Recommended optional additions:

| Tool | Purpose | Notes |
|------|---------|-------|
| Sentry.io | Production error tracking | Requires user consent notice if EU access is possible |
| Railway logs | Server-side log access | Available in Railway UI; `pino` structured logs are searchable |
| Vercel analytics | Web vitals / performance | Privacy-preserving; no cookies required |

---

*06 — Integration Points*

---

## Related Documents

- `project_specs/PRD-WineApp.md` — Product Requirements Document
- `project_specs/FRD-WineApp.md` — Functional Requirements Document
- `.planning/PROJECT.md` — Project description, constraints, and key decisions
- `project_specs/UserStories-WineApp.md` — User Stories *(to be generated)*

---

*TechArch-WineApp v1.0 — Generated 2026-05-21*
