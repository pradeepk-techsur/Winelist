# Functional Requirements Document
## Personal Wine Collection Management Software
**Project Acronym:** WineApp
**FRD Version:** 1.0
**Date:** 2026-05-21
**Status:** Draft
**Based on:** PRD-WineApp v1.0

---

## Scope

This document provides detailed functional specifications for all features in WineApp v1 (Phase 1 MVP). It covers every PRD feature from F0 through F6, including inputs, outputs, validation rules, error states, API surface, and database schema. This document is the authoritative reference for development implementation. Non-functional requirements (performance, reliability, accessibility) supplement but do not replace this document.

---

## Conventions

- **Feature IDs** match PRD feature IDs (F0–F6). Each feature is documented in its own chunk file.
- **Field names** use `snake_case` matching database column and API field names.
- **HTTP methods** are uppercase (GET, POST, PUT, PATCH, DELETE).
- **Required fields** are marked *(required)* in Inputs sections; all others are optional.
- **Error codes** follow the pattern `DOMAIN_CONDITION` (e.g., `WINE_NOT_FOUND`).
- **Cross-references** use the pattern `see F03 §Process step 2` or `see Y0-schema.md §wines`.
- **Priority** levels: P0 = blocking MVP delivery; P1 = high value, MVP but not blocking.
- **Validation failure** responses always return HTTP 422 with structured error payload.

---

## Table of Contents

| Section | File | Description |
|---------|------|-------------|
| F00 | `F00-wine-inventory.md` | Wine Inventory Management (Core CRUD) |
| F01 | `F01-drinking-window.md` | Drinking Window Tracking |
| F02 | `F02-search-filter.md` | Search and Filter |
| F03 | `F03-bottle-status.md` | Bottle Status Tracking |
| F04 | `F04-tasting-notes.md` | Tasting Notes & Personal Ratings |
| F05 | `F05-insights-dashboard.md` | Collection Insights Dashboard |
| F06 | `F06-mobile-ux.md` | Mobile-First User Experience |
| Y0 | `Y0-schema.md` | Database Schema (full DDL) |
| Y1 | `Y1-api.md` | REST API Endpoints (full catalog) |
| Y2 | `Y2-errors.md` | Cross-Feature Error Catalog |
| Y3 | `Y3-integrations.md` | External Integration Points |

---

## Cross-Cutting Terminology

The following terms are used consistently across all feature specifications:

- **Wine Record:** A database entry representing a specific wine (label, vintage, producer). One wine record can track multiple bottles.
- **Bottle:** A single physical unit of wine. A wine record tracks how many bottles are owned and consumed.
- **Collection:** The complete set of all wine records owned by the user, excluding fully consumed/gifted bottles with zero quantity remaining.
- **Drinking Window:** A date range (start year → end year) indicating when a wine is at its best for drinking.
- **Drinking Status:** The computed readiness of a wine based on today's date vs. its drinking window. Values: `drink_now`, `hold`, `approaching_peak`, `past_window`, `special_occasion`.
- **Tasting Note:** A structured record of the user's impressions after opening and tasting a specific bottle.
- **Storage Location:** A user-defined label for where bottles are physically kept (e.g., "Wine Fridge", "Cellar Rack A", "Kitchen Counter").
- **Quantity Owned:** The number of bottles of a specific wine the user currently possesses (not yet consumed or gifted).
- **Quantity Consumed:** The cumulative number of bottles of a specific wine the user has opened and finished.
- **Estimated Value:** The sum of `purchase_price × quantity_owned` across all wine records. Not adjusted for market appreciation.
- **User:** The single authenticated owner of the WineApp instance. Multi-user is out of scope for v1.

---

## Authentication Model

WineApp v1 uses single-user authentication. All API endpoints require a valid session token (Bearer token or cookie-based session). Unauthenticated requests to any protected resource return HTTP 401. The auth mechanism itself (JWT, session cookie, etc.) is defined in `Y1-api.md §Authentication` and `Y3-integrations.md §Auth`.

---

*FRD-WineApp v1.0 — Header chunk*
---

## F00: Wine Inventory Management (Core CRUD)

**Priority:** P0 — Critical MVP. All other features depend on this.

**Description:** Wine Inventory Management is the foundational feature of WineApp. It provides the full lifecycle for wine records: creating a new record when a bottle is acquired, viewing the complete collection list, editing any record field, and deleting records that are no longer relevant. Every other feature — drinking window tracking, search, tasting notes, insights — operates on the data created and maintained by this feature. The data model captures the full set of wine attributes a personal collector needs: provenance, physical properties, quantity, purchase information, and storage location.

---

### Terminology

- **Wine Form:** The add/edit form through which users create or update a wine record.
- **Wine List View:** The paginated or scrollable list of all wine records in the collection.
- **Wine Detail View:** A full single-record view showing all fields, tasting notes, and status.
- **Required Field:** A field that must be provided to save a wine record.
- **Appellation:** A legally defined wine region sub-designation (e.g., "Pauillac" within Bordeaux).
- **Bottle Size:** Physical container size (e.g., Standard 750ml, Magnum 1.5L).

---

### Sub-features

- **F00-A: Add Wine** — Create a new wine record via form submission
- **F00-B: View Wine List** — Browse the collection with summary card per wine
- **F00-C: View Wine Detail** — View all fields of a single wine record
- **F00-D: Edit Wine** — Update any field of an existing wine record
- **F00-E: Delete Wine** — Remove a wine record with confirmation

---

### Process

#### F00-A: Add Wine
1. User taps "Add Wine" button from the Wine List view or navigation.
2. System presents the Wine Form with required and optional fields.
3. User completes at minimum the required fields (wine name, wine type, quantity).
4. User optionally completes all other fields.
5. User submits the form.
6. System validates all inputs (see Validation below).
7. On validation success, system creates the wine record with `created_at` timestamp and returns the new wine detail view.
8. On validation failure, system returns the form with field-level error messages; no record is created.

#### F00-B: View Wine List
1. User navigates to the Wine List view (default home/landing view).
2. System fetches all wine records for the authenticated user.
3. System renders a scrollable list of wine cards showing: wine name, producer, vintage year, wine type, quantity owned, and drinking status badge.
4. List is sorted by default: most recently added first.
5. User may re-sort or apply search/filter (see F02).

#### F00-C: View Wine Detail
1. User taps on a wine card in the list.
2. System fetches the full wine record including all fields and associated tasting notes.
3. System renders the Wine Detail view with all data fields, drinking status, tasting notes list, and action buttons (Edit, Delete, Mark as Consumed/Gifted).

#### F00-D: Edit Wine
1. From the Wine Detail view, user taps "Edit."
2. System presents the Wine Form pre-populated with all existing field values.
3. User modifies any fields.
4. User submits the form.
5. System validates all inputs.
6. On validation success, system updates the record with `updated_at` timestamp and returns the updated Wine Detail view.
7. On validation failure, system returns the form with field-level errors; the record is not modified.

#### F00-E: Delete Wine
1. From the Wine Detail view, user taps "Delete."
2. System presents a confirmation dialog: "Delete [wine name]? This cannot be undone."
3. User confirms deletion.
4. System permanently removes the wine record and all associated tasting notes.
5. System navigates user back to the Wine List view.
6. If user cancels the confirmation, no action is taken.

---

### Inputs

**Required Fields:**
- `wine_name` (string, required): Name or label of the wine (e.g., "Château Margaux")
- `wine_type` (enum, required): One of `red`, `white`, `rosé`, `sparkling`, `dessert`
- `quantity_owned` (integer ≥ 0, required): Number of bottles currently owned; defaults to 1

**Optional Fields:**
- `producer` (string): Winery or producer name (e.g., "Château Margaux")
- `vintage_year` (integer): 4-digit year (e.g., 2018); `null` for non-vintage (NV)
- `country` (string): Country of origin (e.g., "France")
- `region` (string): Wine region (e.g., "Bordeaux")
- `appellation` (string): Sub-region or appellation (e.g., "Pauillac")
- `grape_variety` (string): Primary grape or blend description (e.g., "Cabernet Sauvignon blend")
- `bottle_size` (enum): One of `187ml`, `375ml`, `750ml`, `1.5L`, `3L`, `other`; defaults to `750ml`
- `purchase_price` (decimal ≥ 0.00): Price paid per bottle in user's local currency
- `purchase_date` (date): Date of purchase; format `YYYY-MM-DD`
- `purchase_source` (string): Where purchased (e.g., "Total Wine", "Vivino", "Winery direct")
- `storage_location` (string): Where bottle(s) are kept (e.g., "Wine Fridge Shelf 2")
- `notes` (text): Freeform notes about the wine (not a tasting note — see F04)
- `drink_window_start` (integer): Year the drinking window begins (see F01)
- `drink_window_end` (integer): Year the drinking window ends (see F01)
- `is_special_occasion` (boolean): If `true`, status is overridden to `special_occasion` (see F01); defaults to `false`

---

### Outputs

- **On Add Success:** Full wine record JSON; HTTP 201; redirect to Wine Detail view.
- **On Edit Success:** Updated wine record JSON; HTTP 200; redirect to Wine Detail view.
- **On Delete Success:** HTTP 204 No Content; client navigates to Wine List.
- **On List Fetch:** Array of wine summary objects (id, wine_name, producer, vintage_year, wine_type, quantity_owned, drinking_status); HTTP 200.
- **On Detail Fetch:** Full wine record object including computed `drinking_status`; HTTP 200.

---

### Validation

- `wine_name`: Required; 1–255 characters; must not be blank or whitespace-only.
- `wine_type`: Required; must be one of the valid enum values (`red`, `white`, `rosé`, `sparkling`, `dessert`).
- `quantity_owned`: Required; integer; must be ≥ 0; must be ≥ `quantity_consumed` at all times.
- `vintage_year`: If provided, must be a 4-digit integer between 1800 and (current year + 2) to allow futures/futures purchases.
- `bottle_size`: If provided, must be a valid enum value; defaults to `750ml` if omitted.
- `purchase_price`: If provided, must be a non-negative decimal with up to 2 decimal places.
- `purchase_date`: If provided, must be a valid `YYYY-MM-DD` date not in the future (cannot purchase a wine in the future).
- `drink_window_start`: If provided, must be a 4-digit integer.
- `drink_window_end`: If provided, must be a 4-digit integer ≥ `drink_window_start`.
- `notes`: Max 2000 characters.
- `storage_location`: Max 255 characters.
- `grape_variety`: Max 255 characters.
- `producer`, `country`, `region`, `appellation`, `purchase_source`: Max 255 characters each.

---

### Error States

| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| Required field missing | 422 | `WINE_VALIDATION_FAILED` | "wine_name is required" (field-specific) |
| Invalid wine_type value | 422 | `WINE_INVALID_TYPE` | "wine_type must be one of: red, white, rosé, sparkling, dessert" |
| quantity_owned < 0 | 422 | `WINE_INVALID_QUANTITY` | "quantity_owned must be 0 or greater" |
| vintage_year out of range | 422 | `WINE_INVALID_VINTAGE` | "vintage_year must be between 1800 and [current year + 2]" |
| drink_window_end < drink_window_start | 422 | `WINE_INVALID_WINDOW` | "drink_window_end must be equal to or after drink_window_start" |
| purchase_date in the future | 422 | `WINE_INVALID_PURCHASE_DATE` | "purchase_date cannot be in the future" |
| Wine record not found | 404 | `WINE_NOT_FOUND` | "Wine record not found" |
| Unauthenticated request | 401 | `AUTH_REQUIRED` | "Authentication required" |
| Server error | 500 | `INTERNAL_ERROR` | "An unexpected error occurred" |

---

### API Surface (this feature)

Full request/response schemas in `Y1-api.md §Wine Inventory`.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/wines` | List all wine records (paginated) |
| POST | `/api/wines` | Create new wine record |
| GET | `/api/wines/:id` | Get single wine record detail |
| PUT | `/api/wines/:id` | Replace wine record (full update) |
| PATCH | `/api/wines/:id` | Partial update wine record |
| DELETE | `/api/wines/:id` | Delete wine record |

---

### Schema Surface (this feature)

Uses table `wines` — see `Y0-schema.md §wines` for full DDL.

Key columns: `id`, `user_id`, `wine_name`, `producer`, `vintage_year`, `country`, `region`, `appellation`, `wine_type`, `grape_variety`, `bottle_size`, `quantity_owned`, `quantity_consumed`, `purchase_price`, `purchase_date`, `purchase_source`, `storage_location`, `notes`, `drink_window_start`, `drink_window_end`, `is_special_occasion`, `created_at`, `updated_at`.

---

*F00 — Wine Inventory Management*
---

## F01: Drinking Window Tracking

**Priority:** P0 — Critical MVP. Primary differentiator from spreadsheets.

**Description:** Drinking Window Tracking gives every wine in the collection an intelligent readiness status computed from today's date and the user-defined drinking window. Users define a start year and end year for when a wine is best consumed, and the system automatically derives the current drinking status in real time. This feature directly solves one of the most costly problems collectors face: opening a bottle too early, too late, or never at the right time. The status categories are designed to be immediately actionable and easy to understand without wine expertise.

---

### Terminology

- **Drink Window Start Year:** The first year the wine is considered ready to drink.
- **Drink Window End Year:** The last year the wine is expected to be at its best; after this year the wine may be declining.
- **Drinking Status:** The computed category describing a wine's current readiness relative to today's date and its defined window.
- **Approaching Peak Threshold:** A wine is "Approaching Peak" if today's year falls within 1–2 years before the drink window start year.
- **Special Occasion Flag:** A user-set boolean (`is_special_occasion = true`) that overrides the computed status and marks a wine as reserved for a specific event.
- **Windowless Wine:** A wine record with no `drink_window_start` or `drink_window_end` defined. These wines display a "No window defined" neutral indicator.

---

### Sub-features

- **F01-A: Define Drinking Window** — Set start year and end year per wine record
- **F01-B: Compute Drinking Status** — Automatically derive status from today's date
- **F01-C: Display Status Badge** — Render status as a visual badge in list and detail views
- **F01-D: Ready to Drink List** — Dedicated view showing all wines with `drink_now` status
- **F01-E: Special Occasion Override** — Flag a wine as special occasion, bypassing computed status
- **F01-F: Filter by Status** — Allow filtering the collection by drinking status (see also F02)

---

### Process

#### F01-A: Define Drinking Window
1. When adding or editing a wine record (see F00), user may optionally enter `drink_window_start` and `drink_window_end`.
2. Both fields are optional individually; however, if `drink_window_end` is provided, `drink_window_start` must also be provided (end without start is not meaningful).
3. A wine may have only `drink_window_start` defined (open-ended window — no known end date).
4. System saves the values as integer years on the wine record.

#### F01-B: Compute Drinking Status
The system computes `drinking_status` dynamically at read time (never stored; always recalculated). The computation uses the current calendar year (`current_year = NOW().year`).

**Decision logic (evaluated in order):**

1. If `is_special_occasion = true` → status = `special_occasion` (stop)
2. If neither `drink_window_start` nor `drink_window_end` is set → status = `no_window` (stop)
3. If `drink_window_end` is set and `current_year > drink_window_end` → status = `past_window` (stop)
4. If `drink_window_start` is set and `current_year >= drink_window_start` (and not past end) → status = `drink_now` (stop)
5. If `drink_window_start` is set and `current_year >= (drink_window_start - 2)` → status = `approaching_peak` (stop)
6. Otherwise (window start is > 2 years away) → status = `hold`

**Status summary table:**

| Status | Code | Definition |
|--------|------|------------|
| Drink Now | `drink_now` | current_year ≥ start AND (no end OR current_year ≤ end) |
| Hold | `hold` | current_year < start − 2 |
| Approaching Peak | `approaching_peak` | current_year is within 2 years before start (start−2 ≤ current_year < start) |
| Past Window | `past_window` | current_year > end |
| Special Occasion | `special_occasion` | is_special_occasion flag is true (overrides all other logic) |
| No Window | `no_window` | No window defined; displayed as neutral/grey indicator |

#### F01-C: Display Status Badge
1. Every wine card in the list view includes a color-coded status badge.
2. Every wine detail view prominently displays the current status.
3. Badge colors (design-level guidance):
   - `drink_now` → green
   - `approaching_peak` → amber/yellow
   - `hold` → blue
   - `past_window` → red/orange
   - `special_occasion` → purple/gold
   - `no_window` → grey

#### F01-D: Ready to Drink List
1. User navigates to "Ready to Drink" section (accessible from main navigation).
2. System queries all wine records where computed `drinking_status = drink_now` AND `quantity_owned > 0`.
3. System displays the filtered list in the same card format as the main wine list.
4. List is sorted by `drink_window_end` ascending (wines closest to their end date appear first — most urgent).

#### F01-E: Special Occasion Override
1. User edits a wine record and toggles `is_special_occasion = true`.
2. System saves the flag. The computed status is overridden to `special_occasion` regardless of window dates.
3. Wines with `special_occasion` status are excluded from the Ready to Drink list.
4. User can unset the flag at any time to restore computed status.

---

### Inputs

- `drink_window_start` (integer, optional): 4-digit year when wine is first considered ready
- `drink_window_end` (integer, optional): 4-digit year after which wine may be declining
- `is_special_occasion` (boolean, optional): Override flag; defaults to `false`

---

### Outputs

- `drinking_status` (enum): One of `drink_now`, `hold`, `approaching_peak`, `past_window`, `special_occasion`, `no_window` — included on every wine list item and detail response.
- **Ready to Drink List:** Array of wine summary objects where `drinking_status = drink_now` and `quantity_owned > 0`.

---

### Validation

- `drink_window_start`: Must be a valid 4-digit integer year if provided.
- `drink_window_end`: Must be a valid 4-digit integer year if provided; must be ≥ `drink_window_start` if both are set.
- If `drink_window_end` is provided but `drink_window_start` is not: system returns validation error `WINE_WINDOW_END_WITHOUT_START`.
- `is_special_occasion`: Must be boolean (`true` or `false`).
- `drinking_status` is a computed output field; it is never accepted as an input.

---

### Error States

| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| drink_window_end without drink_window_start | 422 | `WINE_WINDOW_END_WITHOUT_START` | "drink_window_end requires drink_window_start to also be set" |
| drink_window_end < drink_window_start | 422 | `WINE_INVALID_WINDOW` | "drink_window_end must be equal to or after drink_window_start" |
| Invalid year format (non-integer) | 422 | `WINE_INVALID_WINDOW_YEAR` | "Drinking window years must be 4-digit integers" |

---

### API Surface (this feature)

Drinking window fields are part of the wine record — no separate endpoints. Full schemas in `Y1-api.md §Wine Inventory`.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/wines?drinking_status=drink_now` | Filter wines by drinking status |
| GET | `/api/wines/ready-to-drink` | Convenience endpoint: wines ready to drink now |

---

### Schema Surface (this feature)

Uses columns on the `wines` table — see `Y0-schema.md §wines`.

Relevant columns: `drink_window_start` (integer, nullable), `drink_window_end` (integer, nullable), `is_special_occasion` (boolean, default false).

`drinking_status` is a computed/virtual field — **not stored in the database**. It is calculated by the application layer on every read.

---

*F01 — Drinking Window Tracking*
---

## F02: Search and Filter

**Priority:** P0 — Critical MVP. Core to the "Find a Bottle" user journey.

**Description:** Search and Filter enables users to quickly locate specific wines or subsets of their collection using free-text search and multi-attribute filtering. As a collection grows, this feature becomes the primary navigation mechanism. Searches must be fast (results within 500ms), applied without page reload, and the filter state must persist while browsing results. Filter controls are mobile-optimized — no desktop-style multi-column filter panels. The feature is designed for the real-world scenario: a user at the dinner table or in the cellar who needs to find the right bottle in under 10 seconds.

---

### Terminology

- **Full-Text Search:** A query against the text content of multiple fields simultaneously (wine name, producer, region, notes).
- **Filter:** A constraint applied to a specific field or attribute that narrows the wine list.
- **Combined Filter:** Multiple filters applied simultaneously; results must satisfy ALL active filters (AND logic).
- **Filter State:** The set of currently active search query and filter values; must persist while the user navigates through results.
- **Instant Update:** Filter and search results update as the user types or changes a filter, without requiring a page reload or form submission.

---

### Sub-features

- **F02-A: Full-Text Search** — Text search across wine name, producer, region, and notes
- **F02-B: Wine Type Filter** — Filter by one or more wine types
- **F02-C: Attribute Filters** — Filter by producer, country, region, vintage, grape variety
- **F02-D: Drinking Status Filter** — Filter by one or more drinking status values (see F01)
- **F02-E: Price Range Filter** — Filter by min and/or max purchase price
- **F02-F: Rating Filter** — Filter by minimum personal rating
- **F02-G: Storage Location Filter** — Filter by storage location
- **F02-H: Filter UI Controls** — Mobile-optimized filter interface (bottom sheet or collapsible panel)
- **F02-I: Filter State Persistence** — Active filters remain applied while browsing results
- **F02-J: Clear Filters** — Reset all active filters and search query

---

### Process

#### F02-A: Full-Text Search
1. User taps the search input at the top of the Wine List view.
2. User types a search query.
3. System performs a case-insensitive substring/LIKE search across: `wine_name`, `producer`, `region`, `notes`.
4. Results update in real time as the user types (debounced: trigger search after 300ms of inactivity).
5. The result count is displayed ("X wines found").
6. If no results match, system displays "No wines found" with a suggestion to clear filters.

#### F02-B through F02-G: Applying Filters
1. User taps the filter icon or "Filters" button to open the filter panel (bottom sheet on mobile).
2. The filter panel displays all available filter dimensions with current values shown.
3. User selects or adjusts one or more filter values.
4. System applies all active filters immediately on change (no separate "Apply" button required, but a persistent "Apply" or auto-close on selection is acceptable for mobile UX).
5. Filter panel closes (or collapses); filtered wine list is shown.
6. Active filters are indicated visually (e.g., filter icon badge count, highlighted filter chips).

#### F02-I: Filter State Persistence
1. Active search query and filter values persist while the user navigates through the filtered list.
2. Navigating to a wine detail view and returning to the list preserves the filter state.
3. Filter state is cleared when the user explicitly taps "Clear Filters" or navigates away from the collection to a different main section (e.g., Dashboard, Ready to Drink).

#### F02-J: Clear Filters
1. User taps "Clear Filters" or "Reset."
2. All active filter values are reset to defaults (no filter applied).
3. Search query is cleared.
4. Full wine list is shown.

---

### Inputs

**Search:**
- `q` (string): Free-text search query; 1–255 characters

**Filters:**
- `wine_type` (array of enum): One or more of `red`, `white`, `rosé`, `sparkling`, `dessert`
- `producer` (string): Exact or partial match on producer name
- `country` (string): Exact or partial match on country
- `region` (string): Exact or partial match on region
- `vintage_year_min` (integer): Minimum vintage year (inclusive)
- `vintage_year_max` (integer): Maximum vintage year (inclusive)
- `grape_variety` (string): Partial match on grape variety field
- `drinking_status` (array of enum): One or more of `drink_now`, `hold`, `approaching_peak`, `past_window`, `special_occasion`, `no_window`
- `storage_location` (string): Partial match on storage location
- `price_min` (decimal): Minimum purchase price (inclusive)
- `price_max` (decimal): Maximum purchase price (inclusive)
- `rating_min` (integer): Minimum personal rating (1–100; only wines with at least one tasting note with rating ≥ this value)

**Pagination/Sort:**
- `sort` (enum): `recent` (default), `name_asc`, `name_desc`, `vintage_asc`, `vintage_desc`, `rating_desc`, `price_asc`, `price_desc`
- `page` (integer): Page number for pagination; default 1
- `per_page` (integer): Results per page; default 20; max 100

---

### Outputs

- **Search/Filter Result:** Paginated array of wine summary objects matching all active filters; HTTP 200.
- **Metadata:** `total_count` (integer), `page`, `per_page`, `total_pages` in response envelope.
- **Empty Result:** HTTP 200 with empty array and `total_count: 0` (not a 404).

---

### Validation

- `q`: Max 255 characters; if empty string submitted, treated as no search query.
- `wine_type`: Each value must be a valid enum; invalid values are rejected with 422.
- `vintage_year_min` / `vintage_year_max`: Must be valid 4-digit integers; `min` must be ≤ `max` if both provided.
- `price_min` / `price_max`: Must be non-negative decimals; `min` must be ≤ `max` if both provided.
- `rating_min`: Must be an integer 1–100.
- `sort`: Must be a valid enum value.
- `per_page`: Maximum 100; values over 100 are clamped to 100.
- `drinking_status` values: Each must be a valid status enum.
- All filter parameters are optional; omitting a parameter means no constraint on that dimension.
- Invalid or unknown filter parameters: system ignores unknown parameters (no error) to support forward compatibility.

---

### Error States

| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| Invalid wine_type filter value | 422 | `FILTER_INVALID_TYPE` | "wine_type must be one of: red, white, rosé, sparkling, dessert" |
| vintage_year_min > vintage_year_max | 422 | `FILTER_INVALID_VINTAGE_RANGE` | "vintage_year_min must be less than or equal to vintage_year_max" |
| price_min > price_max | 422 | `FILTER_INVALID_PRICE_RANGE` | "price_min must be less than or equal to price_max" |
| rating_min out of range | 422 | `FILTER_INVALID_RATING` | "rating_min must be between 1 and 100" |
| Invalid sort value | 422 | `FILTER_INVALID_SORT` | "sort must be one of: recent, name_asc, name_desc, ..." |
| Unauthenticated request | 401 | `AUTH_REQUIRED` | "Authentication required" |

---

### API Surface (this feature)

Full request/response schemas in `Y1-api.md §Search and Filter`.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/wines` | Wine list endpoint; accepts all filter and search parameters as query params |
| GET | `/api/wines/ready-to-drink` | Convenience: `drinking_status=drink_now` pre-applied |
| GET | `/api/wines/filter-options` | Returns available filter values (distinct producers, regions, grapes, locations) |

---

### Schema Surface (this feature)

No new tables. Uses `wines` table — see `Y0-schema.md §wines`.

**Index requirements for performance:**
- Index on `wine_type`, `country`, `region`, `vintage_year`, `storage_location`
- Index on `producer`
- Full-text search index on `wine_name`, `producer`, `region`, `notes` (PostgreSQL: `tsvector` GIN index; SQLite: FTS5 virtual table)

---

*F02 — Search and Filter*
---

## F03: Bottle Status Tracking

**Priority:** P0 — Critical MVP. Required to keep inventory accurate.

**Description:** Bottle Status Tracking closes the lifecycle loop for individual bottles. Wine is a consumable — bottles get opened, gifted, and finished. This feature allows users to update the status of bottles as they are consumed or given away, automatically keeping quantity counts accurate. It also maintains a history of consumed and gifted bottles so users can look back at what they have drunk and when. An undo mechanism protects against accidental status updates. Together with F00 (inventory) and F04 (tasting notes), this feature forms the complete "open a bottle" workflow.

---

### Terminology

- **Consumed:** A bottle that has been opened and finished by the user. Increments `quantity_consumed`, decrements `quantity_owned`.
- **Gifted:** A bottle given to another person without being consumed by the user. Decrements `quantity_owned`; does NOT increment `quantity_consumed`.
- **Bottle Status Event:** A single record of a status change (consumed or gifted) including the date and optional metadata.
- **Quantity Owned:** The current count of bottles of this wine the user physically possesses.
- **Quantity Consumed:** The cumulative count of bottles of this wine the user has opened and drunk (lifetime).

---

### Sub-features

- **F03-A: Mark as Consumed** — Record that a bottle was opened and finished
- **F03-B: Mark as Gifted** — Record that a bottle was given away
- **F03-C: Quantity Auto-Decrement** — Automatically adjust quantity counts on status change
- **F03-D: Status History** — View list of past consumed and gifted events for a wine
- **F03-E: Undo / Correct Status** — Reverse a recent status event if logged in error

---

### Process

#### F03-A: Mark as Consumed
1. From the Wine Detail view (F00-C), user taps "Mark as Consumed" (or "Open a Bottle").
2. System presents a brief confirmation/annotation dialog with:
   - Date consumed (defaults to today; user can change)
   - Option to "Add Tasting Note" (optional shortcut to F04 flow)
3. User confirms.
4. System creates a `bottle_status_events` record: `event_type = consumed`, `event_date`, `wine_id`.
5. System decrements `wines.quantity_owned` by 1 (must not go below 0).
6. System increments `wines.quantity_consumed` by 1.
7. If user chose to add a tasting note, system transitions to the Tasting Note form (F04) with `wine_id` and `event_date` pre-populated.
8. System returns to Wine Detail view showing updated quantities.

#### F03-B: Mark as Gifted
1. From the Wine Detail view, user taps "Mark as Gifted."
2. System presents a confirmation dialog with:
   - Date gifted (defaults to today; user can change)
   - Recipient name (optional free text)
3. User confirms.
4. System creates a `bottle_status_events` record: `event_type = gifted`, `event_date`, optional `recipient_name`, `wine_id`.
5. System decrements `wines.quantity_owned` by 1 (must not go below 0).
6. `quantity_consumed` is NOT incremented (gifted ≠ consumed).
7. System returns to Wine Detail view showing updated quantity.

#### F03-C: Quantity Auto-Decrement
- Every consumed or gifted event decrements `quantity_owned` by exactly 1.
- System enforces: `quantity_owned` cannot go below 0. If `quantity_owned` is already 0, the system rejects the status event with error `BOTTLE_NONE_REMAINING`.
- The decrement and event creation are atomic (database transaction); if either fails, neither is applied.

#### F03-D: Status History
1. From the Wine Detail view, user scrolls to or taps the "History" section.
2. System fetches all `bottle_status_events` for the wine, sorted by `event_date` descending.
3. System displays each event: type (consumed/gifted), date, and any metadata (recipient name, linked tasting note).

#### F03-E: Undo / Correct Status
1. From the History section, user taps "Undo" on a specific event.
2. System presents a confirmation: "Undo this [consumed/gifted] event? Quantities will be restored."
3. User confirms.
4. System deletes the `bottle_status_events` record.
5. System reverses the quantity change: increments `quantity_owned` by 1.
6. If the event was `consumed`, system also decrements `quantity_consumed` by 1 (must not go below 0).
7. If the event had an associated tasting note (linked via `bottle_status_event_id`), the tasting note is NOT automatically deleted — user must delete it separately if desired.
8. System confirms undo with a success message and updated quantity display.

---

### Inputs

**Mark as Consumed:**
- `wine_id` (integer, required): The wine record to act on
- `event_date` (date, required): Date consumed; defaults to today; format `YYYY-MM-DD`
- `add_tasting_note` (boolean, optional): If true, immediately proceed to tasting note form

**Mark as Gifted:**
- `wine_id` (integer, required): The wine record to act on
- `event_date` (date, required): Date gifted; defaults to today; format `YYYY-MM-DD`
- `recipient_name` (string, optional): Name of the recipient; max 255 characters

**Undo:**
- `event_id` (integer, required): The `bottle_status_events.id` to reverse

---

### Outputs

- **On Consumed Success:** Updated wine record (with new `quantity_owned`, `quantity_consumed`); HTTP 200; and the new `bottle_status_events` record.
- **On Gifted Success:** Updated wine record (with new `quantity_owned`); HTTP 200; and the new `bottle_status_events` record.
- **On Undo Success:** Updated wine record (quantities restored); HTTP 200.
- **On History Fetch:** Array of `bottle_status_events` for the wine; HTTP 200.

---

### Validation

- `wine_id`: Must reference an existing wine record owned by the authenticated user.
- `event_date`: Must be a valid `YYYY-MM-DD` date; cannot be in the future.
- `quantity_owned` at time of event: Must be ≥ 1 before decrement (cannot go below 0).
- `recipient_name`: Max 255 characters if provided.
- Undo `event_id`: Must reference an existing `bottle_status_events` record for the authenticated user.

---

### Error States

| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| No bottles remaining to consume/gift | 422 | `BOTTLE_NONE_REMAINING` | "No bottles remaining. quantity_owned is already 0." |
| event_date in the future | 422 | `BOTTLE_INVALID_DATE` | "Event date cannot be in the future" |
| Wine record not found | 404 | `WINE_NOT_FOUND` | "Wine record not found" |
| Status event not found (undo) | 404 | `EVENT_NOT_FOUND` | "Status event not found" |
| Unauthenticated request | 401 | `AUTH_REQUIRED` | "Authentication required" |

---

### API Surface (this feature)

Full request/response schemas in `Y1-api.md §Bottle Status`.

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/wines/:id/consume` | Mark one bottle as consumed |
| POST | `/api/wines/:id/gift` | Mark one bottle as gifted |
| GET | `/api/wines/:id/history` | Fetch status event history for a wine |
| DELETE | `/api/events/:event_id` | Undo / delete a status event |

---

### Schema Surface (this feature)

Uses table `bottle_status_events` — see `Y0-schema.md §bottle_status_events`.

Key columns: `id`, `wine_id`, `event_type` (enum: `consumed`, `gifted`), `event_date`, `recipient_name`, `created_at`.
Also uses `wines.quantity_owned` and `wines.quantity_consumed` (see `Y0-schema.md §wines`).

---

*F03 — Bottle Status Tracking*
---

## F04: Tasting Notes and Personal Ratings

**Priority:** P1 — High value. Part of core MVP but not blocking minimum usability.

**Description:** Tasting Notes and Personal Ratings allows users to record their impressions after opening and drinking a bottle of wine. Over time, this builds a personal wine journal that captures the user's evolving preferences, helps them remember what they liked or didn't like, and informs future buying and drinking decisions. Tasting notes are attached to the wine record and can be created at the time a bottle is marked as consumed (see F03) or added independently afterward. A wine may accumulate multiple tasting notes across different bottles or occasions. Ratings can be used to filter and sort the collection (see F02).

---

### Terminology

- **Tasting Note:** A structured record of the user's sensory and contextual impressions of a specific bottle on a specific date.
- **Personal Rating:** A numeric score (1–100 scale) reflecting the user's overall enjoyment of the wine. Uses the 100-point scale common in the wine world; a 1–5 star display mapping may be offered in the UI.
- **Would Buy Again:** A simple three-way flag (`yes`, `no`, `maybe`) recording whether the user would repurchase this wine.
- **Guest Feedback:** Optional freeform text capturing comments from other people who tasted the wine.
- **Tasting Note Context:** Metadata about when and why the bottle was opened — occasion and food pairing.
- **Multi-Note Wine:** A wine record with two or more tasting notes (common for wines bought in quantity across multiple occasions).

---

### Sub-features

- **F04-A: Create Tasting Note** — Add a new tasting note for a wine
- **F04-B: View Tasting Notes** — Display all tasting notes for a wine on its detail view
- **F04-C: Edit Tasting Note** — Modify an existing tasting note
- **F04-D: Delete Tasting Note** — Remove a tasting note
- **F04-E: Rating Aggregation** — Compute and display average rating from multiple tasting notes
- **F04-F: Sort/Filter by Rating** — Allow collection filtering by personal rating (see F02)

---

### Process

#### F04-A: Create Tasting Note
1. User accesses the Tasting Note form in one of two ways:
   - **Path A (via F03):** While marking a bottle as consumed, user taps "Add Tasting Note" → system pre-populates `date_opened` with the consumption event date and links `bottle_status_event_id`.
   - **Path B (independent):** From the Wine Detail view, user taps "Add Tasting Note" → system presents a blank form with `date_opened` defaulting to today.
2. System presents the Tasting Note form with all fields.
3. User completes desired fields (all fields except `date_opened` are optional).
4. User submits the form.
5. System validates inputs.
6. On validation success, system creates the `tasting_notes` record and returns the updated Wine Detail view (tasting notes section refreshed).
7. On validation failure, form is returned with field-level errors; no record is created.

#### F04-B: View Tasting Notes
1. On the Wine Detail view, all tasting notes for the wine are displayed in a dedicated section.
2. Tasting notes are sorted by `date_opened` descending (most recent first).
3. Each note displays: date, rating (if provided), summary of tasting text, occasion, would-buy-again flag.
4. User can tap a note to expand and view all fields.

#### F04-C: Edit Tasting Note
1. From the Wine Detail view tasting notes section, user taps "Edit" on a specific note.
2. System presents the Tasting Note form pre-populated with existing values.
3. User modifies any fields and submits.
4. System validates and updates the record with `updated_at` timestamp.
5. System returns the updated Wine Detail view.

#### F04-D: Delete Tasting Note
1. From the Wine Detail view tasting notes section, user taps "Delete" on a specific note.
2. System presents a confirmation: "Delete this tasting note?"
3. User confirms.
4. System permanently deletes the `tasting_notes` record.
5. System updates the wine's displayed average rating (if applicable).
6. User is returned to the Wine Detail view with the note removed.

#### F04-E: Rating Aggregation
1. When a wine has one or more tasting notes with a `personal_rating` value, the system computes:
   - **Latest rating:** The rating from the most recent tasting note.
   - **Average rating:** Average of all `personal_rating` values across all tasting notes for the wine (rounded to 1 decimal place).
2. The Wine Detail view and Wine List card display the average rating (or the latest if only one note exists).
3. If no tasting note has a rating, no rating is displayed (not "0" — display "Not yet rated").

---

### Inputs

- `wine_id` (integer, required): The wine this note is attached to
- `date_opened` (date, required): Date the bottle was opened; format `YYYY-MM-DD`; defaults to today
- `personal_rating` (integer, optional): Numeric score 1–100
- `appearance_notes` (text, optional): Notes on the wine's visual appearance (color, clarity, legs)
- `aroma_notes` (text, optional): Notes on the wine's nose (aromas, bouquet, intensity)
- `flavor_notes` (text, optional): Notes on the palate (taste, texture, structure)
- `finish_notes` (text, optional): Notes on the finish (length, aftertaste)
- `overall_notes` (text, optional): Combined or summary freeform notes (alternative to structured sub-fields; either structured sub-fields or overall_notes, or both may be used)
- `food_pairing` (string, optional): What food was served with the wine; max 500 characters
- `occasion` (string, optional): Context for opening the bottle (e.g., "Tuesday dinner", "Anniversary celebration"); max 255 characters
- `would_buy_again` (enum, optional): One of `yes`, `no`, `maybe`
- `guest_feedback` (text, optional): Freeform notes from other tasters; max 1000 characters
- `bottle_status_event_id` (integer, optional): Foreign key link to the `bottle_status_events` record if note was created via F03 path; may be null for independently created notes

---

### Outputs

- **On Create Success:** Full tasting note record; HTTP 201; Wine Detail view with new note shown.
- **On Edit Success:** Updated tasting note record; HTTP 200.
- **On Delete Success:** HTTP 204 No Content.
- **On Detail Fetch:** Wine record includes `tasting_notes` array (all notes, sorted by date descending) and `average_rating` (computed decimal or null).

---

### Validation

- `wine_id`: Must reference an existing wine record owned by the authenticated user.
- `date_opened`: Required; must be a valid `YYYY-MM-DD` date; cannot be in the future.
- `personal_rating`: If provided, must be an integer 1–100 inclusive.
- `would_buy_again`: If provided, must be one of `yes`, `no`, `maybe`.
- `appearance_notes`, `aroma_notes`, `flavor_notes`, `finish_notes`, `overall_notes`, `guest_feedback`: Max 2000 characters each.
- `food_pairing`: Max 500 characters.
- `occasion`: Max 255 characters.
- `bottle_status_event_id`: If provided, must reference an existing `bottle_status_events` record for the same `wine_id`.
- At least one of the optional fields (rating, any notes, food pairing, occasion, would_buy_again) should be populated for the note to be meaningful — but the system does not enforce this as a hard validation (a note with only `date_opened` is allowed).

---

### Error States

| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| personal_rating out of range | 422 | `NOTE_INVALID_RATING` | "personal_rating must be between 1 and 100" |
| date_opened in the future | 422 | `NOTE_INVALID_DATE` | "date_opened cannot be in the future" |
| Invalid would_buy_again value | 422 | `NOTE_INVALID_BUY_AGAIN` | "would_buy_again must be one of: yes, no, maybe" |
| Wine record not found | 404 | `WINE_NOT_FOUND` | "Wine record not found" |
| Tasting note not found | 404 | `NOTE_NOT_FOUND` | "Tasting note not found" |
| Field exceeds max length | 422 | `NOTE_FIELD_TOO_LONG` | "[field] exceeds maximum length of [n] characters" |
| Unauthenticated request | 401 | `AUTH_REQUIRED` | "Authentication required" |

---

### API Surface (this feature)

Full request/response schemas in `Y1-api.md §Tasting Notes`.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/wines/:id/tasting-notes` | List all tasting notes for a wine |
| POST | `/api/wines/:id/tasting-notes` | Create a new tasting note for a wine |
| GET | `/api/tasting-notes/:note_id` | Get a single tasting note |
| PUT | `/api/tasting-notes/:note_id` | Update a tasting note (full replacement) |
| PATCH | `/api/tasting-notes/:note_id` | Partial update a tasting note |
| DELETE | `/api/tasting-notes/:note_id` | Delete a tasting note |

---

### Schema Surface (this feature)

Uses table `tasting_notes` — see `Y0-schema.md §tasting_notes`.

Key columns: `id`, `wine_id`, `bottle_status_event_id` (nullable FK), `date_opened`, `personal_rating`, `appearance_notes`, `aroma_notes`, `flavor_notes`, `finish_notes`, `overall_notes`, `food_pairing`, `occasion`, `would_buy_again`, `guest_feedback`, `created_at`, `updated_at`.

`average_rating` is a computed field — not stored. Calculated as `AVG(personal_rating)` over all tasting notes for a wine where `personal_rating IS NOT NULL`.

---

*F04 — Tasting Notes and Personal Ratings*
---

## F05: Collection Insights Dashboard

**Priority:** P1 — High value. Completes the MVP and supports the "Review Collection" and "Plan Purchases" user journeys.

**Description:** The Collection Insights Dashboard gives users an at-a-glance command center for their wine collection. It is not a complex analytics tool — it surfaces the essential numbers a personal collector wants to know: how many bottles they have, what the collection is worth, what's ready to drink, and what patterns define their collection. All metrics are computed from live collection data and update automatically when records change. The dashboard is designed to be the default home screen or a prominently featured tab so users see it every time they open the app.

---

### Terminology

- **Estimated Total Value:** Sum of `(purchase_price × quantity_owned)` for all wine records where `purchase_price IS NOT NULL` and `quantity_owned > 0`.
- **Total Bottles Owned:** Sum of `quantity_owned` across all wine records.
- **Ready to Drink Count:** Count of distinct wine records where computed `drinking_status = drink_now` AND `quantity_owned > 0`.
- **Approaching Maturity Count:** Count of distinct wine records where computed `drinking_status = approaching_peak` AND `quantity_owned > 0`.
- **Average Purchase Price:** Mean of `purchase_price` across all wine records where `purchase_price IS NOT NULL` and `quantity_owned > 0`. Computed as a simple average of per-record prices (not per-bottle weighted average).
- **Highest-Rated Wines:** Wine records sorted by `average_rating` descending (computed from tasting notes, see F04).
- **Recently Added:** Wine records sorted by `created_at` descending.
- **Recently Consumed:** `bottle_status_events` records with `event_type = consumed`, sorted by `event_date` descending.

---

### Sub-features

- **F05-A: Summary Stats Panel** — Total bottles, estimated value, ready-to-drink count, approaching count, average price
- **F05-B: Type Breakdown** — Bottles by wine type (red/white/rosé/sparkling/dessert)
- **F05-C: Top Regions** — Most common regions in the collection
- **F05-D: Top Grapes** — Most common grape varieties
- **F05-E: Highest-Rated Wines** — Top wines by average personal rating
- **F05-F: Recently Added** — Last N wines added to the collection
- **F05-G: Recently Consumed** — Last N bottles consumed
- **F05-H: Live Data Refresh** — All metrics reflect current collection state without manual refresh

---

### Process

#### F05-A through F05-G: Dashboard Load
1. User navigates to the Dashboard (main navigation tab or home screen).
2. System executes all dashboard queries in parallel against the live database.
3. System renders all dashboard sections simultaneously upon query completion.
4. Dashboard displays a loading state (spinner or skeleton) while queries execute.
5. If any individual query fails, the failed section displays a graceful error ("Unable to load [section]") without blocking the rest of the dashboard.

#### F05-H: Live Data Refresh
1. Dashboard data is always fetched fresh when the user navigates to the Dashboard view.
2. There is no manual "Refresh" button required — navigation to the view triggers a fresh load.
3. If the user has the dashboard open and updates a wine record in another tab/session, data may be stale until they navigate away and back (real-time push updates are out of scope for v1).

---

### Dashboard Sections and Metrics

#### Summary Stats Panel (F05-A)
| Metric | Calculation | Display |
|--------|-------------|---------|
| Total bottles owned | `SUM(quantity_owned)` across all wines | Integer count |
| Estimated total value | `SUM(purchase_price * quantity_owned)` where price is not null | Currency (e.g., "$3,245") |
| Wines ready to drink | Count of wines with `drinking_status = drink_now` AND `quantity_owned > 0` | Integer count |
| Approaching maturity | Count of wines with `drinking_status = approaching_peak` AND `quantity_owned > 0` | Integer count |
| Average purchase price | `AVG(purchase_price)` where price is not null and quantity > 0 | Currency |
| Total wine records | `COUNT(*)` of wines table | Integer count |

**Edge cases:**
- If no wines have a `purchase_price`, "Estimated Value" and "Average Price" show "Not available" (not "0" or "$0").
- If no wines have a defined drinking window, "Ready to Drink" and "Approaching Maturity" show "0" with a note to add drinking windows.

#### Type Breakdown (F05-B)
- Displays count (bottles) per wine type: red, white, rosé, sparkling, dessert.
- Displayed as a simple bar chart or percentage breakdown.
- Zero-count types are shown as "0" (not hidden) to give a complete picture.
- Based on `SUM(quantity_owned)` grouped by `wine_type`.

#### Top Regions (F05-C)
- Displays top 5 regions by bottle count (`SUM(quantity_owned)` grouped by `region`).
- Excludes wine records where `region IS NULL` or blank.
- If fewer than 5 distinct regions exist, shows only what is available.

#### Top Grape Varieties (F05-D)
- Displays top 5 grape varieties by bottle count (`SUM(quantity_owned)` grouped by `grape_variety`).
- Excludes wine records where `grape_variety IS NULL` or blank.

#### Highest-Rated Wines (F05-E)
- Displays top 5 wines sorted by `average_rating` descending.
- Only includes wines that have at least one tasting note with a `personal_rating` value.
- Displays: wine name, producer, vintage, average rating.
- If fewer than 5 rated wines exist, shows only what is available.
- If no wines are rated, section shows "No ratings yet. Open a bottle and add your first tasting note."

#### Recently Added (F05-F)
- Displays last 5 wine records added, sorted by `created_at` descending.
- Displays: wine name, producer, vintage, date added, quantity owned.

#### Recently Consumed (F05-G)
- Displays last 5 `bottle_status_events` with `event_type = consumed`, sorted by `event_date` descending.
- Displays: wine name, date consumed, linked tasting note indicator (yes/no).

---

### Inputs

- Dashboard endpoint takes no inputs beyond the authenticated session (user ID).
- Optional query parameter `refresh=true` to bypass any potential cache and force a fresh query (for future use; all queries are live in v1).

---

### Outputs

- **Dashboard Response:** A single JSON object containing all dashboard sections; HTTP 200.
- Structure:
  ```
  {
    summary_stats: { total_bottles, estimated_value, ready_to_drink_count, approaching_count, avg_purchase_price, total_wine_records },
    type_breakdown: [ { wine_type, bottle_count } ],
    top_regions: [ { region, bottle_count } ],
    top_grapes: [ { grape_variety, bottle_count } ],
    highest_rated: [ { wine_id, wine_name, producer, vintage_year, average_rating } ],
    recently_added: [ { wine_id, wine_name, producer, vintage_year, created_at, quantity_owned } ],
    recently_consumed: [ { event_id, wine_id, wine_name, event_date, has_tasting_note } ]
  }
  ```

---

### Validation

- No input validation required (read-only endpoint, no user-submitted parameters).
- If a user has 0 wine records, all metrics return 0 or empty arrays (no error).

---

### Error States

| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| Unauthenticated request | 401 | `AUTH_REQUIRED` | "Authentication required" |
| Database query failure | 500 | `DASHBOARD_QUERY_FAILED` | "Unable to load collection insights. Please try again." |

---

### API Surface (this feature)

Full request/response schema in `Y1-api.md §Dashboard`.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dashboard` | Fetch all collection insights in one response |

---

### Schema Surface (this feature)

Dashboard is read-only. No new tables. Queries across: `wines`, `bottle_status_events`, `tasting_notes` — see `Y0-schema.md`.

Performance note: Dashboard queries may scan the full `wines` table. With up to 1,000 records per user (per NFR), queries should complete well under 500ms without additional optimization in v1.

---

*F05 — Collection Insights Dashboard*
---

## F06: Mobile-First User Experience

**Priority:** P0 — Critical MVP constraint. Hard UX requirement defined by product vision.

**Description:** WineApp is designed to be used on a phone — at home, at a wine shop, at a restaurant, or while entertaining guests. Mobile-first is not a style preference; it is the primary design requirement. Every view, form, and interaction must be fully functional on a 375px-wide screen before desktop layout is considered. This feature specification defines the UX constraints, interaction patterns, and performance requirements that all other features must comply with. F06 is a cross-cutting quality requirement, not a discrete feature with its own endpoints — but it is listed as a feature to ensure its requirements are testable and tracked explicitly.

---

### Terminology

- **Mobile-First:** The primary design and development target is a phone screen (375px+); desktop is a responsive enhancement.
- **Thumb Zone:** The area of a phone screen reachable by the user's thumb in one-handed use; primary actions must land here.
- **Tap Target:** A tappable UI element (button, link, input); must be ≥ 44×44px to be finger-friendly.
- **Bottom Sheet:** A panel that slides up from the bottom of the screen — the mobile-native pattern for filter panels, action menus, and secondary forms.
- **PWA (Progressive Web App):** A web app that behaves app-like on mobile: installable, offline-capable (future phase), fast-loading.
- **Viewport Width Breakpoints:** sm ≥ 375px (phone), md ≥ 768px (tablet), lg ≥ 1024px (desktop).

---

### Sub-features

- **F06-A: Responsive Layout** — All views render correctly at 375px and above
- **F06-B: Thumb-Friendly Navigation** — Primary nav in bottom bar; key actions reachable one-handed
- **F06-C: Mobile-Optimized Forms** — Fast form completion with mobile-native input types
- **F06-D: Card-Based Wine List** — Vertical scrolling list with touch-optimized wine cards
- **F06-E: Mobile Filter Interface** — Bottom sheet or collapsible panel for search/filter controls
- **F06-F: No Horizontal Scroll** — All views fit within the viewport width
- **F06-G: Performance Budget** — Fast load times on mobile connections
- **F06-H: Accessibility Baseline** — Tap targets, contrast, labels throughout

---

### Requirements

#### F06-A: Responsive Layout
- All views are functional at viewport widths ≥ 375px.
- At 375px, no content is clipped or requires horizontal scrolling.
- Layouts stack vertically on small screens; multi-column layouts are reserved for ≥ 768px viewports.
- The Wine List, Wine Detail, Dashboard, and Add/Edit forms are all tested at 375px, 390px (iPhone 14), and 414px (iPhone Plus) widths.

#### F06-B: Thumb-Friendly Navigation
- Primary navigation (Wine List, Dashboard, Ready to Drink, Add Wine) is in a bottom navigation bar pinned to the bottom of the viewport.
- The "Add Wine" button (primary CTA) is a floating action button (FAB) or prominently placed in the bottom bar, always reachable.
- Destructive actions (Delete, Undo) are not placed in the thumb zone — they require intentional reach or confirmation.
- Navigation between sections requires ≤ 2 taps from any screen.

#### F06-C: Mobile-Optimized Forms
- The Add Wine form is completable in ≤ 60 seconds for a typical record (wine name, type, vintage, quantity).
- Required fields are marked visually and appear first in the form.
- Optional fields are grouped in a collapsible "More Details" section to reduce visual overwhelm.
- Input types use native mobile keyboards:
  - `vintage_year`, `quantity_owned`, `personal_rating` → `inputmode="numeric"` or `type="number"`
  - `purchase_date`, `date_opened` → `type="date"` (native date picker on iOS/Android)
  - `purchase_price` → `inputmode="decimal"`
  - `wine_type`, `bottle_size`, `would_buy_again` → native select or segmented control
  - All text fields → `type="text"` with autocapitalize as appropriate
- Form submission shows inline validation errors immediately (no full-page reload).
- After a successful submit, user is navigated to the Wine Detail view for the saved record.

#### F06-D: Card-Based Wine List
- The wine list uses a card-based or row-based layout with vertical scrolling.
- Each card shows: wine name, producer, vintage year, wine type, quantity owned, and drinking status badge.
- Cards are tappable (full-card tap area) with sufficient height to be finger-friendly (minimum 64px per card).
- No pagination buttons — the list uses infinite scroll or "Load more" to extend results.
- The list renders the first 20 records immediately; additional records load on scroll.

#### F06-E: Mobile Filter Interface
- Filter controls are accessed via a "Filters" button that opens a bottom sheet modal.
- The bottom sheet is dismissible by swiping down or tapping the overlay.
- Filter controls inside the sheet use large, finger-friendly input elements (minimum 44px tap targets).
- Active filter count is shown as a badge on the "Filters" button (e.g., "Filters (3)").
- The search bar remains visible in the main list view (not inside the bottom sheet).

#### F06-F: No Horizontal Scroll
- No core view produces horizontal scrolling at any viewport width ≥ 375px.
- Tables in detail views are replaced with stacked key-value pairs on small screens.
- Long text (tasting notes, wine names) wraps and does not overflow the viewport.

#### F06-G: Performance Budget
- Initial app load (first meaningful paint): ≤ 3 seconds on a 4G mobile connection.
- Wine list load (up to 500 records): ≤ 2 seconds.
- Search result update after keystroke: ≤ 500ms (with 300ms debounce).
- Add/edit form submission and confirmation: ≤ 1 second.
- Dashboard load: ≤ 2 seconds.

#### F06-H: Accessibility Baseline
- All text meets WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text).
- All form inputs have visible, associated `<label>` elements.
- Error messages are descriptive and associated with the relevant input field.
- All interactive elements have a minimum tap target of 44×44px.
- Status badges and icons include accessible text alternatives (not icon-only for critical information).

---

### Inputs

F06 defines UX constraints — no dedicated API inputs.

---

### Outputs

F06 defines UX constraints — no dedicated API outputs.

---

### Validation (UX Compliance Checklist)

The following are testable acceptance criteria for F06:

- [ ] Add Wine form completes in ≤ 60 seconds on a 375px phone screen
- [ ] No horizontal scroll at 375px on Wine List, Wine Detail, Dashboard, Add/Edit forms
- [ ] All tap targets ≥ 44×44px (verifiable with browser DevTools)
- [ ] Filter panel opens as bottom sheet on mobile
- [ ] Date fields trigger native mobile date picker
- [ ] Numeric fields trigger numeric keyboard
- [ ] Primary navigation accessible within 2 taps from any screen
- [ ] Wine list loads in ≤ 2 seconds (test collection of 500 records)
- [ ] Search updates in ≤ 500ms after keystroke
- [ ] Dashboard loads in ≤ 2 seconds

---

### Error States

| Scenario | Handling |
|----------|----------|
| App load exceeds 3s on slow connection | Show skeleton loading state; do not show blank screen |
| Form validation failure | Display inline error below the failing field; focus the first error field |
| Network error during form submit | Show persistent error banner: "Could not save. Check your connection and try again." Preserve form state. |
| No wines in collection | Wine List shows empty state illustration with "Add your first wine" CTA |

---

### API Surface (this feature)

F06 has no dedicated API endpoints. It defines client-side behavior and performance constraints.

---

### Schema Surface (this feature)

F06 has no dedicated database tables or columns.

---

*F06 — Mobile-First User Experience*
---

## Y0: Database Schema

**Scope:** Full DDL for all WineApp v1 entities. Written as PostgreSQL-compatible SQL with SQLite compatibility notes where they differ.

---

### Entity Relationship Overview

```
users
  └─ wines (one user → many wines)
       ├─ bottle_status_events (one wine → many events)
       └─ tasting_notes (one wine → many notes)
            └─ bottle_status_events (one event → zero or one note, via FK on tasting_notes)
```

---

### §users

Stores the single authenticated user's account. Multi-user is out of scope for v1, but the table is designed to support it without schema changes.

```sql
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,         -- bcrypt hash; never store plaintext
  display_name  VARCHAR(255),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for login lookup
CREATE UNIQUE INDEX idx_users_email ON users(email);
```

**SQLite note:** Use `INTEGER PRIMARY KEY AUTOINCREMENT`; `TIMESTAMPTZ` → `TEXT` (store as ISO 8601 strings); no `SERIAL` type.

---

### §wines

Core table. Every wine record in the user's collection.

```sql
CREATE TABLE wines (
  id                  SERIAL PRIMARY KEY,
  user_id             INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Core identity
  wine_name           VARCHAR(255) NOT NULL,
  producer            VARCHAR(255),
  vintage_year        INTEGER CHECK (vintage_year >= 1800 AND vintage_year <= 2100),
  country             VARCHAR(255),
  region              VARCHAR(255),
  appellation         VARCHAR(255),
  wine_type           VARCHAR(20) NOT NULL CHECK (wine_type IN ('red', 'white', 'rosé', 'sparkling', 'dessert')),
  grape_variety       VARCHAR(255),
  bottle_size         VARCHAR(10) DEFAULT '750ml' CHECK (bottle_size IN ('187ml', '375ml', '750ml', '1.5L', '3L', 'other')),

  -- Quantity tracking
  quantity_owned      INTEGER NOT NULL DEFAULT 1 CHECK (quantity_owned >= 0),
  quantity_consumed   INTEGER NOT NULL DEFAULT 0 CHECK (quantity_consumed >= 0),

  -- Purchase info
  purchase_price      NUMERIC(10, 2) CHECK (purchase_price >= 0),
  purchase_date       DATE,
  purchase_source     VARCHAR(255),

  -- Storage
  storage_location    VARCHAR(255),

  -- Freeform notes (not tasting notes)
  notes               TEXT,

  -- Drinking window (see F01)
  drink_window_start  INTEGER,
  drink_window_end    INTEGER,
  is_special_occasion BOOLEAN NOT NULL DEFAULT FALSE,

  -- Metadata
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT chk_drink_window_order CHECK (
    drink_window_end IS NULL OR drink_window_start IS NULL OR drink_window_end >= drink_window_start
  ),
  CONSTRAINT chk_quantity_balance CHECK (
    quantity_owned >= 0 AND quantity_consumed >= 0
  )
);

-- Indexes for common queries and filters (see F02)
CREATE INDEX idx_wines_user_id       ON wines(user_id);
CREATE INDEX idx_wines_wine_type     ON wines(wine_type);
CREATE INDEX idx_wines_country       ON wines(country);
CREATE INDEX idx_wines_region        ON wines(region);
CREATE INDEX idx_wines_vintage_year  ON wines(vintage_year);
CREATE INDEX idx_wines_producer      ON wines(producer);
CREATE INDEX idx_wines_storage_loc   ON wines(storage_location);
CREATE INDEX idx_wines_created_at    ON wines(created_at DESC);

-- Full-text search index (PostgreSQL; see F02)
ALTER TABLE wines ADD COLUMN search_vector TSVECTOR;
CREATE INDEX idx_wines_fts ON wines USING GIN(search_vector);

-- Trigger to maintain search_vector (PostgreSQL)
CREATE OR REPLACE FUNCTION wines_search_vector_update() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.wine_name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.producer, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.region, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.notes, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wines_search_vector_trigger
  BEFORE INSERT OR UPDATE ON wines
  FOR EACH ROW EXECUTE FUNCTION wines_search_vector_update();
```

**SQLite note:** SQLite does not support `tsvector`. Use SQLite FTS5 virtual table:
```sql
CREATE VIRTUAL TABLE wines_fts USING fts5(
  wine_name, producer, region, notes,
  content='wines', content_rowid='id'
);
```

---

### §bottle_status_events

Records each time a bottle is consumed or gifted (see F03).

```sql
CREATE TABLE bottle_status_events (
  id              SERIAL PRIMARY KEY,
  wine_id         INTEGER NOT NULL REFERENCES wines(id) ON DELETE CASCADE,
  event_type      VARCHAR(20) NOT NULL CHECK (event_type IN ('consumed', 'gifted')),
  event_date      DATE NOT NULL,
  recipient_name  VARCHAR(255),             -- only meaningful when event_type = 'gifted'
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bottle_events_wine_id    ON bottle_status_events(wine_id);
CREATE INDEX idx_bottle_events_event_date ON bottle_status_events(event_date DESC);
CREATE INDEX idx_bottle_events_type       ON bottle_status_events(event_type);
```

---

### §tasting_notes

Stores tasting notes and ratings for consumed bottles (see F04).

```sql
CREATE TABLE tasting_notes (
  id                      SERIAL PRIMARY KEY,
  wine_id                 INTEGER NOT NULL REFERENCES wines(id) ON DELETE CASCADE,
  bottle_status_event_id  INTEGER REFERENCES bottle_status_events(id) ON DELETE SET NULL,

  -- Core tasting fields
  date_opened             DATE NOT NULL,
  personal_rating         INTEGER CHECK (personal_rating >= 1 AND personal_rating <= 100),
  appearance_notes        TEXT,
  aroma_notes             TEXT,
  flavor_notes            TEXT,
  finish_notes            TEXT,
  overall_notes           TEXT,

  -- Context
  food_pairing            VARCHAR(500),
  occasion                VARCHAR(255),
  would_buy_again         VARCHAR(10) CHECK (would_buy_again IN ('yes', 'no', 'maybe')),
  guest_feedback          TEXT,

  -- Metadata
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasting_notes_wine_id     ON tasting_notes(wine_id);
CREATE INDEX idx_tasting_notes_date        ON tasting_notes(date_opened DESC);
CREATE INDEX idx_tasting_notes_rating      ON tasting_notes(personal_rating DESC);
CREATE INDEX idx_tasting_notes_event_id    ON tasting_notes(bottle_status_event_id);
```

---

### §sessions

Manages user authentication sessions (see Y3-integrations.md §Auth).

```sql
CREATE TABLE sessions (
  id          VARCHAR(128) PRIMARY KEY,         -- secure random token
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at  TIMESTAMPTZ NOT NULL,
  ip_address  VARCHAR(45),                       -- IPv4 or IPv6
  user_agent  TEXT
);

CREATE INDEX idx_sessions_user_id    ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

---

### Column Type Reference

| PostgreSQL Type | SQLite Equivalent | Notes |
|----------------|-------------------|-------|
| `SERIAL` | `INTEGER PRIMARY KEY AUTOINCREMENT` | Auto-increment PK |
| `TIMESTAMPTZ` | `TEXT` | Store ISO 8601: `2026-05-21T14:30:00Z` |
| `NUMERIC(10,2)` | `REAL` | SQLite has no fixed-precision decimal |
| `BOOLEAN` | `INTEGER` (0/1) | SQLite has no native boolean |
| `VARCHAR(n)` | `TEXT` | SQLite ignores length constraints |
| `DATE` | `TEXT` | Store as `YYYY-MM-DD` string |

---

*Y0 — Database Schema*
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
---

## Y2: Cross-Feature Error Catalog

**Scope:** All error codes used across WineApp v1 features. Error codes follow the pattern `DOMAIN_CONDITION`. All error responses use the standard envelope:

```json
{
  "data": null,
  "error": {
    "code": "WINE_NOT_FOUND",
    "message": "Wine record not found",
    "fields": {}        // only present for 422 validation errors; maps field name → error message
  }
}
```

For validation errors (422), the `fields` object maps each failing field to its specific error:
```json
{
  "error": {
    "code": "WINE_VALIDATION_FAILED",
    "message": "One or more fields failed validation",
    "fields": {
      "wine_name": "wine_name is required",
      "vintage_year": "vintage_year must be between 1800 and 2028"
    }
  }
}
```

---

### Authentication Errors

| Error Code | HTTP Status | Description | Retry? |
|------------|-------------|-------------|--------|
| `AUTH_REQUIRED` | 401 | No valid session token present or token expired | Re-authenticate |
| `AUTH_FAILED` | 401 | Email/password combination is incorrect | Check credentials |
| `AUTH_MISSING_CREDENTIALS` | 422 | Login request missing email or password | Fix request |
| `AUTH_ACCOUNT_LOCKED` | 403 | Account has been locked (future: brute-force protection) | Contact support |

---

### Wine Inventory Errors (F00)

| Error Code | HTTP Status | Description | Field |
|------------|-------------|-------------|-------|
| `WINE_VALIDATION_FAILED` | 422 | One or more fields failed validation | See `fields` object |
| `WINE_NOT_FOUND` | 404 | No wine record with this ID exists for this user | — |
| `WINE_INVALID_TYPE` | 422 | wine_type value is not a recognized enum | `wine_type` |
| `WINE_INVALID_QUANTITY` | 422 | quantity_owned is negative | `quantity_owned` |
| `WINE_INVALID_VINTAGE` | 422 | vintage_year is outside allowed range (1800–current+2) | `vintage_year` |
| `WINE_INVALID_PURCHASE_DATE` | 422 | purchase_date is in the future | `purchase_date` |
| `WINE_INVALID_WINDOW` | 422 | drink_window_end is before drink_window_start | `drink_window_end` |
| `WINE_WINDOW_END_WITHOUT_START` | 422 | drink_window_end provided without drink_window_start | `drink_window_start` |
| `WINE_INVALID_WINDOW_YEAR` | 422 | Drinking window year is not a valid 4-digit integer | `drink_window_start` or `drink_window_end` |

---

### Bottle Status Errors (F03)

| Error Code | HTTP Status | Description | Field |
|------------|-------------|-------------|-------|
| `BOTTLE_NONE_REMAINING` | 422 | quantity_owned is already 0; cannot consume or gift | — |
| `BOTTLE_INVALID_DATE` | 422 | event_date is in the future | `event_date` |
| `EVENT_NOT_FOUND` | 404 | No bottle_status_events record with this ID for this user | — |

---

### Tasting Note Errors (F04)

| Error Code | HTTP Status | Description | Field |
|------------|-------------|-------------|-------|
| `NOTE_NOT_FOUND` | 404 | No tasting note with this ID exists for this user | — |
| `NOTE_INVALID_RATING` | 422 | personal_rating is outside 1–100 range | `personal_rating` |
| `NOTE_INVALID_DATE` | 422 | date_opened is in the future | `date_opened` |
| `NOTE_INVALID_BUY_AGAIN` | 422 | would_buy_again is not one of: yes, no, maybe | `would_buy_again` |
| `NOTE_FIELD_TOO_LONG` | 422 | A text field exceeds its maximum character limit | See `fields` |
| `NOTE_VALIDATION_FAILED` | 422 | Generic validation failure across multiple fields | See `fields` |

---

### Search and Filter Errors (F02)

| Error Code | HTTP Status | Description | Field |
|------------|-------------|-------------|-------|
| `FILTER_INVALID_TYPE` | 422 | A wine_type filter value is not a valid enum | `wine_type` |
| `FILTER_INVALID_VINTAGE_RANGE` | 422 | vintage_year_min > vintage_year_max | `vintage_year_min` |
| `FILTER_INVALID_PRICE_RANGE` | 422 | price_min > price_max | `price_min` |
| `FILTER_INVALID_RATING` | 422 | rating_min is outside 1–100 range | `rating_min` |
| `FILTER_INVALID_SORT` | 422 | sort parameter is not a valid enum value | `sort` |

---

### Dashboard Errors (F05)

| Error Code | HTTP Status | Description | Retry? |
|------------|-------------|-------------|--------|
| `DASHBOARD_QUERY_FAILED` | 500 | One or more dashboard queries failed | Yes — transient |

---

### Server Errors (All Features)

| Error Code | HTTP Status | Description | Retry? |
|------------|-------------|-------------|--------|
| `INTERNAL_ERROR` | 500 | Unexpected server error | Yes — transient |
| `SERVICE_UNAVAILABLE` | 503 | Server temporarily unable to handle request | Yes — after delay |
| `NOT_FOUND` | 404 | Route or resource does not exist | No |
| `METHOD_NOT_ALLOWED` | 405 | HTTP method not allowed for this endpoint | No |
| `RATE_LIMITED` | 429 | Too many requests (future: rate limiting) | Yes — after delay |

---

### Client-Side Error Handling Guidelines

**For 401 errors:** Redirect to login. Do not display raw error to user.
**For 404 errors:** Show a "not found" inline message in the relevant view. Navigate back if appropriate.
**For 422 errors:** Display field-level error messages below each failing form field. Do not clear other field values.
**For 500/503 errors:** Show a persistent banner: "Something went wrong. Please try again." Preserve any unsaved form state.
**For network errors (no response):** Show: "Could not connect. Check your internet connection and try again."

---

*Y2 — Cross-Feature Error Catalog*
---

## Y3: External Integration Points

**Scope:** All external system dependencies and integration contracts for WineApp v1. This document covers authentication, hosting infrastructure, and frontend delivery. WineApp v1 has minimal external integrations by design — the personal-use MVP is intentionally self-contained.

---

### §Auth

#### Authentication Mechanism — v1

WineApp v1 uses **single-user session-based authentication** (no external identity provider). The user registers once with an email and password, and the system manages sessions internally.

**Implementation:**
- Password is hashed with **bcrypt** (minimum cost factor 12) before storage.
- Login generates a **secure random session token** (minimum 128 bits, URL-safe base64).
- Session token is stored in the `sessions` table (see `Y0-schema.md §sessions`).
- Token is delivered to the client as an **httpOnly, SameSite=Strict cookie** (preferred for web/PWA) OR as a Bearer token in the Authorization header (for API clients).
- Session expiry: **30 days** (rolling; refreshed on each authenticated request).
- Logout deletes the session record from the database.
- Expired sessions are cleaned up by a background job or on-demand at login time.

**No multi-user, OAuth, or SSO in v1.** These are deferred to a future phase.

**Security constraints:**
- All API endpoints (except `/api/auth/login`) require a valid session.
- Tokens must be transmitted only over HTTPS.
- Password reset flow is out of scope for v1 (single-user; user controls the instance).

---

### §Hosting and Infrastructure

#### Cloud Hosting (v1)

WineApp v1 is intended for cloud deployment with minimal operational overhead. Recommended (not mandated) options:

| Layer | Option A | Option B | Notes |
|-------|----------|----------|-------|
| Frontend | Vercel | Netlify | Static build (React/Vue PWA); auto-deploy from main branch |
| Backend API | Railway | Render | Node.js process; managed restarts |
| Database | Railway PostgreSQL | Supabase (managed Postgres) | Prefer managed Postgres; SQLite is acceptable for MVP if running on a single server |
| File Storage | N/A (no file uploads in v1) | — | Label images are out of scope |

**Environment variables required (backend):**
- `DATABASE_URL` — PostgreSQL connection string
- `SESSION_SECRET` — Secret for signing/validating session tokens (minimum 32 random bytes)
- `NODE_ENV` — `production` | `development`
- `PORT` — Server port (default 3000)
- `CORS_ORIGIN` — Allowed frontend origin(s)

---

### §Frontend Delivery

#### PWA / Responsive Web

WineApp frontend is a **Progressive Web App (PWA)** or responsive Single Page Application (SPA). Key delivery requirements:

- **HTTPS only.** PWA features (service worker, installability) require a secure context.
- **Service Worker (optional for MVP):** A basic service worker that caches static assets (app shell) improves load performance but is not a hard requirement for v1. Full offline support is deferred.
- **Web App Manifest:** Provide `manifest.json` with app name, icons (192px, 512px), `display: standalone`, and `theme_color` so users can install the app to their phone home screen.
- **Meta viewport:** All pages must include `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- **Content Security Policy:** Recommended but not mandated in v1.

---

### §Database

#### Database Connection

- Backend connects to PostgreSQL via a connection pool (recommended: `pg` library with pool size 5–10).
- All queries are parameterized — no string interpolation of user input into SQL.
- Database migrations are managed via a migration tool (e.g., `node-pg-migrate`, `Knex migrations`, `Prisma migrations`).
- Initial schema is applied from `Y0-schema.md` DDL via the migration tool.

#### SQLite Alternative

For local development or a very lightweight single-instance deployment, SQLite is acceptable with the type mappings documented in `Y0-schema.md §Column Type Reference`. The application layer must abstract the database driver to allow switching between PostgreSQL and SQLite without application code changes.

---

### §External Data Sources (Out of Scope)

The following integrations are **explicitly out of scope for v1**:

| Integration | Deferred To | Reason |
|-------------|-------------|--------|
| Wine label scanning (camera/OCR) | Phase 3 | Requires native app or specialized CV API |
| Wine data lookup (Vivino API, Wine-Searcher, etc.) | Phase 3–4 | Third-party agreements and data quality work required |
| Drinking window data from external sources | Phase 3–4 | Requires reliable external wine data API |
| Push notifications (drinking window alerts) | Phase 2 | Notification infrastructure not required for MVP |
| Export to CSV/PDF | Phase 2 | Post-MVP convenience feature |
| Import from spreadsheet | Phase 2 | Post-MVP onboarding enhancement |
| AI-based recommendation engine | Phase 3–4 | Requires usage data accumulation |

---

### §Error Monitoring and Logging

v1 has no mandatory external error monitoring integration. However, the following are recommended:

- **Server-side logging:** All API errors (4xx, 5xx) should be logged with timestamp, request path, error code, and user ID (no PII in logs).
- **Client-side error boundary:** React/Vue error boundaries should catch unhandled UI errors and display a graceful fallback screen.
- **Optional:** Sentry.io or equivalent for production error tracking. Integration requires explicit user consent notice if EU users are possible.

---

*Y3 — External Integration Points*
