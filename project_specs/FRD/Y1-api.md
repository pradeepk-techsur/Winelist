---

## Y1: REST API Endpoints

**Base URL:** `/api`
**Authentication:** All endpoints require a valid session token. Token is passed as:
- `Authorization: Bearer <token>` header, OR
- `session` cookie (httpOnly)

**Response envelope (all endpoints):**
```json
{
  "data": { ... },       // main payload
  "error": null          // or { "code": "...", "message": "...", "fields": {...} }
}
```

**Pagination envelope (list endpoints):**
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

### §Authentication

#### POST /api/auth/login
Log in with email and password; receive session token.

**Request body:**
```json
{ "email": "user@example.com", "password": "s3cur3p@ss" }
```
**Response 200:**
```json
{
  "data": {
    "token": "abc123...",
    "expires_at": "2026-05-22T14:30:00Z",
    "user": { "id": 1, "email": "user@example.com", "display_name": "Jane" }
  }
}
```
**Errors:** `401 AUTH_FAILED`, `422 AUTH_MISSING_CREDENTIALS`

---

#### POST /api/auth/logout
Invalidate the current session token.

**Request:** No body; token via header or cookie.
**Response:** `204 No Content`

---

#### GET /api/auth/me
Returns the current authenticated user's profile.

**Response 200:**
```json
{ "data": { "id": 1, "email": "user@example.com", "display_name": "Jane", "created_at": "..." } }
```
**Errors:** `401 AUTH_REQUIRED`

---

### §Wine Inventory

#### GET /api/wines
List wine records. Supports all search and filter parameters (see F02).

**Query parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `q` | string | Full-text search: wine_name, producer, region, notes |
| `wine_type` | string (comma-separated enums) | Filter by wine type(s) |
| `producer` | string | Partial match on producer |
| `country` | string | Partial match on country |
| `region` | string | Partial match on region |
| `vintage_year_min` | integer | Min vintage year |
| `vintage_year_max` | integer | Max vintage year |
| `grape_variety` | string | Partial match on grape variety |
| `drinking_status` | string (comma-separated enums) | Filter by drinking status |
| `storage_location` | string | Partial match on storage location |
| `price_min` | decimal | Min purchase price |
| `price_max` | decimal | Max purchase price |
| `rating_min` | integer | Min average personal rating |
| `sort` | enum | `recent` (default), `name_asc`, `name_desc`, `vintage_asc`, `vintage_desc`, `rating_desc`, `price_asc`, `price_desc` |
| `page` | integer | Page number (default 1) |
| `per_page` | integer | Per page (default 20, max 100) |

**Response 200:**
```json
{
  "data": [
    {
      "id": 42,
      "wine_name": "Château Margaux",
      "producer": "Château Margaux",
      "vintage_year": 2015,
      "wine_type": "red",
      "quantity_owned": 3,
      "quantity_consumed": 1,
      "drinking_status": "drink_now",
      "average_rating": 94.5,
      "storage_location": "Wine Fridge Shelf 1",
      "created_at": "2026-03-10T09:00:00Z"
    }
  ],
  "meta": { "total_count": 142, "page": 1, "per_page": 20, "total_pages": 8 }
}
```

---

#### POST /api/wines
Create a new wine record.

**Request body:**
```json
{
  "wine_name": "Château Margaux",
  "wine_type": "red",
  "quantity_owned": 3,
  "producer": "Château Margaux",
  "vintage_year": 2015,
  "country": "France",
  "region": "Bordeaux",
  "appellation": "Margaux",
  "grape_variety": "Cabernet Sauvignon blend",
  "bottle_size": "750ml",
  "purchase_price": 185.00,
  "purchase_date": "2026-01-15",
  "purchase_source": "Wine.com",
  "storage_location": "Wine Fridge Shelf 1",
  "notes": "Purchased as an investment. Wait at least 5 years.",
  "drink_window_start": 2025,
  "drink_window_end": 2045,
  "is_special_occasion": false
}
```
**Response 201:** Full wine record object (same schema as GET /api/wines/:id).
**Errors:** `422 WINE_VALIDATION_FAILED`, `401 AUTH_REQUIRED`

---

#### GET /api/wines/:id
Get a single wine record with full detail.

**Response 200:**
```json
{
  "data": {
    "id": 42,
    "wine_name": "Château Margaux",
    "producer": "Château Margaux",
    "vintage_year": 2015,
    "country": "France",
    "region": "Bordeaux",
    "appellation": "Margaux",
    "wine_type": "red",
    "grape_variety": "Cabernet Sauvignon blend",
    "bottle_size": "750ml",
    "quantity_owned": 3,
    "quantity_consumed": 1,
    "purchase_price": 185.00,
    "purchase_date": "2026-01-15",
    "purchase_source": "Wine.com",
    "storage_location": "Wine Fridge Shelf 1",
    "notes": "Purchased as an investment.",
    "drink_window_start": 2025,
    "drink_window_end": 2045,
    "is_special_occasion": false,
    "drinking_status": "drink_now",
    "average_rating": 94.5,
    "tasting_notes": [ { "id": 7, "date_opened": "2026-04-20", "personal_rating": 94, ... } ],
    "created_at": "2026-03-10T09:00:00Z",
    "updated_at": "2026-05-01T18:00:00Z"
  }
}
```
**Errors:** `404 WINE_NOT_FOUND`, `401 AUTH_REQUIRED`

---

#### PUT /api/wines/:id
Full replacement update of a wine record.

**Request body:** Same structure as POST /api/wines (all fields).
**Response 200:** Updated full wine record.
**Errors:** `422 WINE_VALIDATION_FAILED`, `404 WINE_NOT_FOUND`, `401 AUTH_REQUIRED`

---

#### PATCH /api/wines/:id
Partial update of a wine record. Only supplied fields are updated.

**Request body:** Any subset of POST /api/wines fields.
**Response 200:** Updated full wine record.
**Errors:** `422 WINE_VALIDATION_FAILED`, `404 WINE_NOT_FOUND`, `401 AUTH_REQUIRED`

---

#### DELETE /api/wines/:id
Delete a wine record and all associated tasting notes and status events.

**Response:** `204 No Content`
**Errors:** `404 WINE_NOT_FOUND`, `401 AUTH_REQUIRED`

---

#### GET /api/wines/ready-to-drink
Convenience endpoint. Returns wines where `drinking_status = drink_now` and `quantity_owned > 0`, sorted by `drink_window_end` ascending.

**Response 200:** Same paginated array as GET /api/wines, pre-filtered.

---

#### GET /api/wines/filter-options
Returns distinct values available for filter dropdowns.

**Response 200:**
```json
{
  "data": {
    "producers": ["Château Margaux", "Opus One", ...],
    "countries": ["France", "USA", "Italy", ...],
    "regions": ["Bordeaux", "Napa Valley", ...],
    "grapes": ["Cabernet Sauvignon", "Pinot Noir", ...],
    "storage_locations": ["Wine Fridge", "Cellar Rack A", ...]
  }
}
```

---

### §Bottle Status

#### POST /api/wines/:id/consume
Mark one bottle as consumed. Decrements quantity_owned, increments quantity_consumed.

**Request body:**
```json
{ "event_date": "2026-05-21", "add_tasting_note": false }
```
**Response 200:**
```json
{
  "data": {
    "wine": { "id": 42, "quantity_owned": 2, "quantity_consumed": 2, ... },
    "event": { "id": 15, "event_type": "consumed", "event_date": "2026-05-21", "wine_id": 42 }
  }
}
```
**Errors:** `422 BOTTLE_NONE_REMAINING`, `422 BOTTLE_INVALID_DATE`, `404 WINE_NOT_FOUND`, `401 AUTH_REQUIRED`

---

#### POST /api/wines/:id/gift
Mark one bottle as gifted. Decrements quantity_owned.

**Request body:**
```json
{ "event_date": "2026-05-18", "recipient_name": "Alice" }
```
**Response 200:**
```json
{
  "data": {
    "wine": { "id": 42, "quantity_owned": 1, "quantity_consumed": 1, ... },
    "event": { "id": 16, "event_type": "gifted", "event_date": "2026-05-18", "recipient_name": "Alice", "wine_id": 42 }
  }
}
```
**Errors:** `422 BOTTLE_NONE_REMAINING`, `422 BOTTLE_INVALID_DATE`, `404 WINE_NOT_FOUND`, `401 AUTH_REQUIRED`

---

#### GET /api/wines/:id/history
Fetch all status events for a wine, sorted by event_date descending.

**Response 200:**
```json
{
  "data": [
    { "id": 15, "event_type": "consumed", "event_date": "2026-05-21", "has_tasting_note": true },
    { "id": 16, "event_type": "gifted",   "event_date": "2026-05-18", "recipient_name": "Alice" }
  ]
}
```

---

#### DELETE /api/events/:event_id
Undo a status event. Reverses quantity changes atomically.

**Response 200:** Updated wine record with restored quantities.
**Errors:** `404 EVENT_NOT_FOUND`, `401 AUTH_REQUIRED`

---

### §Tasting Notes

#### GET /api/wines/:id/tasting-notes
List all tasting notes for a wine, sorted by date_opened descending.

**Response 200:** Array of tasting note objects.

---

#### POST /api/wines/:id/tasting-notes
Create a tasting note for a wine.

**Request body:**
```json
{
  "date_opened": "2026-05-21",
  "personal_rating": 92,
  "appearance_notes": "Deep ruby, clear",
  "aroma_notes": "Blackcurrant, cedar, subtle tobacco",
  "flavor_notes": "Full-bodied, firm tannins, plum and blackberry",
  "finish_notes": "Long, lingering, mineral",
  "overall_notes": null,
  "food_pairing": "Grilled ribeye with roasted vegetables",
  "occasion": "Saturday dinner with friends",
  "would_buy_again": "yes",
  "guest_feedback": "Alice loved it. Bob thought it needed more time.",
  "bottle_status_event_id": 15
}
```
**Response 201:** Full tasting note object.
**Errors:** `422 NOTE_INVALID_RATING`, `422 NOTE_INVALID_DATE`, `404 WINE_NOT_FOUND`, `401 AUTH_REQUIRED`

---

#### GET /api/tasting-notes/:note_id
Get a single tasting note.

**Response 200:** Full tasting note object.
**Errors:** `404 NOTE_NOT_FOUND`, `401 AUTH_REQUIRED`

---

#### PUT /api/tasting-notes/:note_id
Full replacement update of a tasting note.

**Request body:** Same as POST.
**Response 200:** Updated tasting note object.
**Errors:** `422 NOTE_VALIDATION_FAILED`, `404 NOTE_NOT_FOUND`, `401 AUTH_REQUIRED`

---

#### PATCH /api/tasting-notes/:note_id
Partial update of a tasting note.

**Request body:** Any subset of POST fields.
**Response 200:** Updated tasting note object.

---

#### DELETE /api/tasting-notes/:note_id
Delete a tasting note.

**Response:** `204 No Content`
**Errors:** `404 NOTE_NOT_FOUND`, `401 AUTH_REQUIRED`

---

### §Dashboard

#### GET /api/dashboard
Fetch all collection insights in a single response.

**Response 200:**
```json
{
  "data": {
    "summary_stats": {
      "total_bottles": 87,
      "total_wine_records": 42,
      "estimated_value": 3245.00,
      "ready_to_drink_count": 12,
      "approaching_count": 8,
      "avg_purchase_price": 52.40
    },
    "type_breakdown": [
      { "wine_type": "red",      "bottle_count": 54 },
      { "wine_type": "white",    "bottle_count": 18 },
      { "wine_type": "rosé",     "bottle_count": 6  },
      { "wine_type": "sparkling","bottle_count": 6  },
      { "wine_type": "dessert",  "bottle_count": 3  }
    ],
    "top_regions": [
      { "region": "Bordeaux",  "bottle_count": 24 },
      { "region": "Burgundy",  "bottle_count": 15 }
    ],
    "top_grapes": [
      { "grape_variety": "Cabernet Sauvignon", "bottle_count": 30 }
    ],
    "highest_rated": [
      { "wine_id": 42, "wine_name": "Château Margaux", "producer": "Château Margaux", "vintage_year": 2015, "average_rating": 94.5 }
    ],
    "recently_added": [
      { "wine_id": 55, "wine_name": "Opus One", "producer": "Opus One", "vintage_year": 2019, "created_at": "2026-05-18T12:00:00Z", "quantity_owned": 2 }
    ],
    "recently_consumed": [
      { "event_id": 15, "wine_id": 42, "wine_name": "Château Margaux", "event_date": "2026-05-21", "has_tasting_note": true }
    ]
  }
}
```
**Errors:** `401 AUTH_REQUIRED`, `500 DASHBOARD_QUERY_FAILED`

---

*Y1 — REST API Endpoints*
