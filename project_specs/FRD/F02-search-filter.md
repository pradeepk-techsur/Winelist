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
