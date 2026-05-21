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
