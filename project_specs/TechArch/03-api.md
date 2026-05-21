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
