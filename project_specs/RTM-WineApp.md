# Requirements Traceability Matrix
## Personal Wine Collection Management Software
**Project Acronym:** WineApp
**RTM Version:** 1.0
**Date:** 2026-05-21
**Status:** Draft
**Based on:** PRD-WineApp v1.0 · FRD-WineApp v1.0 · TechArch-WineApp v1.0 · UserStories-WineApp v1.0

---

## 1. Overview

This Requirements Traceability Matrix (RTM) provides bidirectional traceability between all WineApp specification documents. It links every Product Requirements Document (PRD) feature through the Functional Requirements Document (FRD), into the Technical Architecture Document (TechArch), and down to concrete User Stories. Every requirement, implementation specification, and user-facing story is mapped so that coverage gaps, orphaned requirements, and missing implementations can be identified at a glance.

The RTM covers the full Phase 1 MVP scope: seven features (F0–F6) ranging from the foundational Wine Inventory Management (F0) through the Mobile-First UX constraints (F6). It is the authoritative cross-reference document for development planning, QA test design, change impact analysis, and sign-off verification. Any change to a requirement in PRD, FRD, TechArch, or UserStories must be reflected here before implementation begins.

Traceability in this document flows in two directions. Forward traceability confirms that every PRD feature is fully specified in the FRD, has a corresponding technical architecture specification, and is covered by at least one user story with testable acceptance criteria. Backward traceability confirms that no FRD requirement, TechArch spec, or user story exists without a corresponding PRD feature — preventing scope creep from entering the build unnoticed.

---

## 2. Document Reference Index

| Document | File | Version | Description |
|----------|------|---------|-------------|
| PRD | `project_specs/PRD-WineApp.md` | 1.0 | Product requirements; feature definitions F0–F6 |
| FRD | `project_specs/FRD-WineApp.md` | 1.0 | Functional specs; sub-features F00–F06, schema Y0, API Y1, errors Y2, integrations Y3 |
| TechArch | `project_specs/TechArch-WineApp.md` | 1.0 | Architecture, data model, API design, security, tech stack |
| UserStories | `project_specs/UserStories-WineApp.md` | 1.0 | 36 user stories across 7 epics; acceptance criteria |
| PROJECT | `.planning/PROJECT.md` | — | Project description, constraints, and key decisions |

---

## 3. Requirements Summary

### 3.1 PRD Features

- **F0 — Wine Inventory Management** (P0, Critical): Core CRUD operations for wine records — add, view list, view detail, edit, delete. Tracks all wine attributes, quantities, purchase info, and storage location. All other features depend on this.
- **F1 — Drinking Window Tracking** (P0, Critical): Define start/end year drinking windows per wine. Automatically computes six drinking statuses (drink_now, hold, approaching_peak, past_window, special_occasion, no_window) from today's date. Dedicated "Ready to Drink" list.
- **F2 — Search and Filter** (P0, Critical): Full-text search across wine name, producer, region, notes. Multi-attribute filtering by type, vintage, region, grape, status, price, rating. Instant results, mobile-optimized filter panel, filter state persistence.
- **F3 — Bottle Status Tracking** (P0, Critical): Mark bottles as consumed or gifted. Auto-decrement quantity. Status history per wine. Undo/correct status events.
- **F4 — Tasting Notes and Personal Ratings** (P1, High): Record structured tasting impressions after opening. Personal rating (1–100), tasting sub-fields, food pairing, occasion, would-buy-again. Multiple notes per wine, average rating computation.
- **F5 — Collection Insights Dashboard** (P1, High): At-a-glance metrics: total bottles, estimated value, drink-now count, type breakdown, top regions, top grapes, highest-rated wines, recently added, recently consumed. Live data on every visit.
- **F6 — Mobile-First User Experience** (P0, Critical): Cross-cutting UX constraint. All views functional at 375px+. Bottom navigation bar. 44px tap targets. Mobile-native input types. Performance budget (3s initial load, 2s list, 500ms search). WCAG AA contrast. PWA installability.

### 3.2 FRD Sub-features

- **F00**: F00-A (Add Wine), F00-B (View List), F00-C (View Detail), F00-D (Edit Wine), F00-E (Delete Wine)
- **F01**: F01-A (Define Window), F01-B (Compute Status), F01-C (Display Badge), F01-D (Ready to Drink List), F01-E (Special Occasion Override), F01-F (Filter by Status)
- **F02**: F02-A (Full-Text Search), F02-B (Wine Type Filter), F02-C (Attribute Filters), F02-D (Drinking Status Filter), F02-E (Price Range Filter), F02-F (Rating Filter), F02-G (Storage Location Filter), F02-H (Filter UI Controls), F02-I (Filter State Persistence), F02-J (Clear Filters)
- **F03**: F03-A (Mark Consumed), F03-B (Mark Gifted), F03-C (Quantity Auto-Decrement), F03-D (Status History), F03-E (Undo/Correct Status)
- **F04**: F04-A (Create Tasting Note), F04-B (View Tasting Notes), F04-C (Edit Tasting Note), F04-D (Delete Tasting Note), F04-E (Rating Aggregation), F04-F (Sort/Filter by Rating)
- **F05**: F05-A (Summary Stats), F05-B (Type Breakdown), F05-C (Top Regions), F05-D (Top Grapes), F05-E (Highest-Rated Wines), F05-F (Recently Added), F05-G (Recently Consumed), F05-H (Live Data Refresh)
- **F06**: F06-A (Responsive Layout), F06-B (Thumb-Friendly Navigation), F06-C (Mobile-Optimized Forms), F06-D (Card-Based Wine List), F06-E (Mobile Filter Interface), F06-F (No Horizontal Scroll), F06-G (Performance Budget), F06-H (Accessibility Baseline)

### 3.3 TechArch Specifications

- **SPEC-ARCH**: Monolithic REST API + SPA architecture; PostgreSQL; React PWA; stateful session auth; Vercel/Railway deployment
- **SPEC-DATA**: Data model — `users`, `wines`, `bottle_status_events`, `tasting_notes`, `sessions` tables; GIN full-text search index; computed fields (drinking_status, average_rating)
- **SPEC-API**: REST API with `/api/wines`, `/api/auth`, `/api/dashboard`, `/api/tasting-notes`, `/api/events` endpoint groups; JSON envelope; pagination
- **SPEC-SEC**: bcrypt passwords, httpOnly session cookies, SameSite=Strict, HTTPS-only, user_id scoping on all queries, Zod input validation, helmet HTTP headers
- **SPEC-FRONTEND**: React 18 + Vite + React Router; TanStack Query; React Hook Form + Zod; Tailwind CSS + shadcn/ui; vite-plugin-pwa; bottom navigation; FilterSheet; debounced SearchBar
- **SPEC-DRINK**: `drinkingStatusService.js` — pure function computing status at read time from window fields and current year; six status codes; never stored in DB
- **SPEC-SEARCH**: PostgreSQL `tsvector`/GIN index; `searchService.js` builds parameterized WHERE clauses; indexes on `wine_type`, `region`, `country`, `vintage_year`, `producer`, `storage_location`
- **SPEC-DASH**: `dashboardService.js` — parallel aggregate queries (Promise.all); live data on every navigation; graceful per-section error handling
- **SPEC-TRANS**: Atomic DB transactions for consume/gift operations (event insert + quantity decrement); no partial state on crash
- **SPEC-PWA**: `manifest.json` with name, icons (192/512), display:standalone, theme_color; vite-plugin-pwa service worker; StaleWhileRevalidate for static assets

### 3.4 User Story Count by Feature

| Feature | Story Count | Priority |
|---------|-------------|----------|
| F0 — Wine Inventory Management | 7 (US-0.1 – US-0.7) | P0 |
| F1 — Drinking Window Tracking | 4 (US-1.1 – US-1.4) | P0 |
| F2 — Search and Filter | 5 (US-2.1 – US-2.5) | P0 |
| F3 — Bottle Status Tracking | 4 (US-3.1 – US-3.4) | P0 |
| F4 — Tasting Notes and Personal Ratings | 5 (US-4.1 – US-4.5) | P1 |
| F5 — Collection Insights Dashboard | 5 (US-5.1 – US-5.5) | P1 |
| F6 — Mobile-First User Experience | 6 (US-6.1 – US-6.6) | P0 |
| **Total** | **36** | |

---

## 4. Traceability Matrix

### 4.1 Forward Traceability: PRD → FRD → TechArch → User Stories

#### F0: Wine Inventory Management

| PRD Feature | FRD Sub-feature | TechArch Spec | User Story | Acceptance Criteria Coverage |
|-------------|-----------------|---------------|------------|------------------------------|
| F0: Add wine record | F00-A: Add Wine | SPEC-API (`POST /api/wines`), SPEC-DATA (`wines` table), SPEC-FRONTEND (`AddWinePage`, `WineForm`) | US-0.1: Add a New Wine to the Collection | Form accessible in 1 tap; 3 required fields; submit in ≤1s; redirect to detail |
| F0: Add wine with full attributes | F00-A: Add Wine (full fields) | SPEC-DATA (`wines` table — all optional columns), SPEC-FRONTEND (`WineForm` optional fields) | US-0.2: Add a Wine with Full Detail | All optional fields accepted; vintage/price/date validation; window order check |
| F0: View complete wine list | F00-B: View Wine List | SPEC-API (`GET /api/wines`), SPEC-FRONTEND (`WineListPage`, `WineCard`) | US-0.3: View the Complete Wine List | Default sort by recent; cards with name/producer/vintage/type/qty/status badge; loads ≤2s |
| F0: View wine detail | F00-C: View Wine Detail | SPEC-API (`GET /api/wines/:id`), SPEC-FRONTEND (`WineDetailPage`) | US-0.4: View a Wine's Full Detail | All fields shown; status badge; tasting notes section; action buttons; renders ≤1s |
| F0: View wine detail (last bottle) | F00-C: View Wine Detail (last bottle indicator) | SPEC-FRONTEND (`WineDetailPage`) | US-0.7: See a "Last Bottle" Warning | Passive "Last bottle" indicator when qty=1; non-blocking; visible before consume/gift |
| F0: Edit wine record | F00-D: Edit Wine | SPEC-API (`PUT /api/wines/:id`, `PATCH /api/wines/:id`), SPEC-FRONTEND (`EditWinePage`, `WineForm`) | US-0.5: Edit an Existing Wine Record | Pre-populated form; same validation as add; updated_at refreshed; redirect to detail |
| F0: Delete wine record | F00-E: Delete Wine | SPEC-API (`DELETE /api/wines/:id`), SPEC-FRONTEND (confirmation dialog) | US-0.6: Delete a Wine Record | Confirmation dialog with wine name; cascades to tasting notes; navigate to list |

#### F1: Drinking Window Tracking

| PRD Feature | FRD Sub-feature | TechArch Spec | User Story | Acceptance Criteria Coverage |
|-------------|-----------------|---------------|------------|------------------------------|
| F1: Define drinking window | F01-A: Define Drinking Window | SPEC-DATA (`drink_window_start`, `drink_window_end` columns), SPEC-FRONTEND (`WineForm`) | US-1.1: Define a Drinking Window for a Wine | Both fields optional; end without start rejected; end < start rejected; values shown in detail |
| F1: Compute drinking status | F01-B: Compute Drinking Status | SPEC-DRINK (`drinkingStatusService.js`; pure function; 6 status codes) | US-1.2: See Automatically Computed Drinking Status | Status computed dynamically; correct logic for all 6 values; updates on each load |
| F1: Display status badge | F01-C: Display Status Badge | SPEC-FRONTEND (`DrinkingStatusBadge` component; color mapping) | US-1.2: See Automatically Computed Drinking Status | Color-coded badges: green/amber/blue/red/purple/grey; on every wine card and detail |
| F1: Ready to Drink list | F01-D: Ready to Drink List | SPEC-API (`GET /api/wines/ready-to-drink`), SPEC-FRONTEND (`ReadyToDrinkPage`) | US-1.3: View the "Ready to Drink" List | drink_now + qty > 0; sorted by window end ASC; accessible from main nav; empty state |
| F1: Special Occasion override | F01-E: Special Occasion Override | SPEC-DATA (`is_special_occasion` boolean), SPEC-DRINK (override logic step 1) | US-1.4: Flag a Wine as Special Occasion Only | Toggle on add/edit; purple badge; excluded from ready-to-drink list; reversible |
| F1: Filter by drinking status | F01-F: Filter by Status | SPEC-API (`drinking_status` query param on `GET /api/wines`), SPEC-SEARCH | US-2.3: Filter by Drinking Status | Multi-select status filter; correct computed values; persists on detail↔list navigation |

#### F2: Search and Filter

| PRD Feature | FRD Sub-feature | TechArch Spec | User Story | Acceptance Criteria Coverage |
|-------------|-----------------|---------------|------------|------------------------------|
| F2: Full-text search | F02-A: Full-Text Search | SPEC-SEARCH (tsvector/GIN; `searchService.js`; debounce 300ms), SPEC-FRONTEND (`SearchBar`) | US-2.1: Search by Name, Producer, or Region | Case-insensitive partial match; results ≤500ms; debounce 300ms; result count shown |
| F2: Wine type filter | F02-B: Wine Type Filter | SPEC-API (`wine_type` param), SPEC-SEARCH, SPEC-FRONTEND (`FilterSheet`) | US-2.2: Filter by Wine Type and Attributes | Multi-select wine type; bottom sheet panel; immediate apply; active count badge |
| F2: Attribute filters (producer, country, region, vintage, grape) | F02-C: Attribute Filters | SPEC-API (producer, country, region, vintage_year_min/max, grape_variety params), SPEC-SEARCH | US-2.2: Filter by Wine Type and Attributes | All attribute filters in bottom sheet; AND logic; instant apply |
| F2: Drinking status filter | F02-D: Drinking Status Filter | SPEC-API (`drinking_status` param), SPEC-DRINK | US-2.3: Filter by Drinking Status | Multi-select status filter; combined with other filters; state persists |
| F2: Price range filter | F02-E: Price Range Filter | SPEC-API (`price_min`, `price_max` params), SPEC-SEARCH | US-2.2: Filter by Wine Type and Attributes | Min/max price; non-negative; min ≤ max validation |
| F2: Rating filter | F02-F: Rating Filter | SPEC-API (`rating_min` param; 1–100), SPEC-SEARCH | US-2.2: Filter by Wine Type and Attributes | Minimum rating filter; combined with other active filters |
| F2: Storage location filter | F02-G: Storage Location Filter | SPEC-API (`storage_location` param), SPEC-SEARCH | US-2.2: Filter by Wine Type and Attributes | Partial match on storage location field |
| F2: Mobile filter UI | F02-H: Filter UI Controls | SPEC-FRONTEND (`FilterSheet` bottom sheet; shadcn/ui), SPEC-ARCH (F06-E) | US-6.4: Access Filters via a Mobile-Friendly Panel | Bottom sheet; swipe to dismiss; 44px targets; search bar outside sheet |
| F2: Filter state persistence | F02-I: Filter State Persistence | SPEC-FRONTEND (URL query params + React state; React Router) | US-2.3: Filter by Drinking Status | State persists list↔detail; cleared on main section change or Clear Filters |
| F2: Clear filters | F02-J: Clear Filters | SPEC-FRONTEND (Clear Filters button; resets all state) | US-2.4: Clear All Active Filters | One-tap reset; clears search and all filters; full list shown immediately |
| F2: Sort collection | F02 (sort param) | SPEC-API (`sort` enum: recent, name_asc, name_desc, vintage_asc, vintage_desc, rating_desc, price_asc, price_desc) | US-2.5: Sort the Collection | All 8 sort options; applied immediately; state persists while browsing |

#### F3: Bottle Status Tracking

| PRD Feature | FRD Sub-feature | TechArch Spec | User Story | Acceptance Criteria Coverage |
|-------------|-----------------|---------------|------------|------------------------------|
| F3: Mark bottle consumed | F03-A: Mark as Consumed | SPEC-API (`POST /api/wines/:id/consume`), SPEC-TRANS (atomic transaction), SPEC-FRONTEND (`ConsumeDialog`) | US-3.1: Mark a Bottle as Consumed | Date (default today); quantity stepper ≤ qty_owned; tasting note shortcut; atomic decrement/increment; rejects qty=0 |
| F3: Mark bottle gifted | F03-B: Mark as Gifted | SPEC-API (`POST /api/wines/:id/gift`), SPEC-TRANS, SPEC-FRONTEND (`GiftDialog`) | US-3.2: Mark a Bottle as Gifted | Date + optional recipient; qty_owned decrements; qty_consumed unchanged; gifted event recorded |
| F3: Quantity auto-decrement | F03-C: Quantity Auto-Decrement | SPEC-TRANS (atomic: event insert + qty decrement in single DB transaction) | US-3.1, US-3.2 | qty_owned never below 0; atomic operation; crash-safe |
| F3: Status history | F03-D: Status History | SPEC-API (`GET /api/wines/:id/history`), SPEC-DATA (`bottle_status_events` table), SPEC-FRONTEND (History section in WineDetailPage) | US-3.3: View Bottle History for a Wine | Events sorted date DESC; type/date/metadata shown; empty state; no separate navigation step |
| F3: Undo status event | F03-E: Undo/Correct Status | SPEC-API (`DELETE /api/events/:event_id`), SPEC-TRANS (atomic reversal), SPEC-FRONTEND (Undo button in history) | US-3.4: Undo an Incorrectly Logged Status Event | Confirmation before undo; qty_owned +1; qty_consumed -1 if consumed; tasting note NOT auto-deleted |

#### F4: Tasting Notes and Personal Ratings

| PRD Feature | FRD Sub-feature | TechArch Spec | User Story | Acceptance Criteria Coverage |
|-------------|-----------------|---------------|------------|------------------------------|
| F4: Record tasting note via consume flow | F04-A: Create Tasting Note (Path A) | SPEC-API (`POST /api/wines/:id/tasting-notes`), SPEC-FRONTEND (`TastingNoteFormPage` pre-populated from event) | US-4.1: Record a Tasting Note When Opening a Bottle | Shortcut from Mark Consumed; date pre-filled; all fields optional except date; redirect to detail |
| F4: Record tasting note independently | F04-A: Create Tasting Note (Path B) | SPEC-API (`POST /api/wines/:id/tasting-notes`), SPEC-FRONTEND (`TastingNoteFormPage`) | US-4.2: Add a Tasting Note Independently | "Add Tasting Note" on detail view; date defaults to today; no required event link; no future dates |
| F4: View tasting notes | F04-B: View Tasting Notes | SPEC-API (`GET /api/wines/:id/tasting-notes`), SPEC-FRONTEND (tasting notes section in WineDetailPage, `TastingNoteCard`) | US-4.3: View All Tasting Notes for a Wine | Sorted date DESC; date/rating/occasion/pairing/would-buy-again/preview shown; expandable; empty state |
| F4: Edit tasting note | F04-C: Edit Tasting Note | SPEC-API (`PUT /api/tasting-notes/:note_id`, `PATCH /api/tasting-notes/:note_id`), SPEC-FRONTEND | US-4.4: Edit or Delete a Tasting Note | Edit pre-populated; any field modifiable; updated_at refreshed; redirect to detail |
| F4: Delete tasting note | F04-D: Delete Tasting Note | SPEC-API (`DELETE /api/tasting-notes/:note_id`), SPEC-FRONTEND (confirmation dialog) | US-4.4: Edit or Delete a Tasting Note | Confirmation dialog; permanent delete; average rating recalculated; bottle event NOT undone |
| F4: Rating aggregation | F04-E: Rating Aggregation | SPEC-DATA (`average_rating` computed via AVG; not stored), SPEC-API (average_rating on WineDetail/WineSummary) | US-4.5: See Average Rating and Would-Buy-Again Status | AVG of personal_rating; shown on card and detail; "Not yet rated" if no ratings; 1 decimal place |
| F4: Sort/filter by rating | F04-F: Sort/Filter by Rating | SPEC-API (`rating_min` filter param, `rating_desc` sort option), SPEC-SEARCH | US-2.5: Sort the Collection | rating_min filter; rating_desc sort; integrated with F02 filter/sort system |

#### F5: Collection Insights Dashboard

| PRD Feature | FRD Sub-feature | TechArch Spec | User Story | Acceptance Criteria Coverage |
|-------------|-----------------|---------------|------------|------------------------------|
| F5: Summary stats | F05-A: Summary Stats Panel | SPEC-API (`GET /api/dashboard` → summary_stats), SPEC-DASH (`dashboardService.js`) | US-5.1: View Collection Summary Stats | Total bottles, total records, estimated value, ready-to-drink, approaching, avg price; "Not available" if no prices |
| F5: Type breakdown | F05-B: Type Breakdown | SPEC-API (type_breakdown array in DashboardResponse), SPEC-DASH | US-5.2: View Collection Composition Breakdown | All 5 types shown; zero-count types display as 0; SUM(qty_owned) grouped by wine_type |
| F5: Top regions | F05-C: Top Regions | SPEC-API (top_regions in DashboardResponse), SPEC-DASH | US-5.2: View Collection Composition Breakdown | Top 5 by bottle count; NULL regions excluded; fewer than 5 shows available |
| F5: Top grape varieties | F05-D: Top Grapes | SPEC-API (top_grapes in DashboardResponse), SPEC-DASH | US-5.2: View Collection Composition Breakdown | Top 5 by bottle count; NULL grapes excluded; fewer than 5 shows available |
| F5: Highest-rated wines | F05-E: Highest-Rated Wines | SPEC-API (highest_rated in DashboardResponse), SPEC-DASH | US-5.3: See Highest-Rated and Recently Added Wines | Top 5 by avg_rating; at least one rating required; shows name/producer/vintage/avg_rating; empty state |
| F5: Recently added | F05-F: Recently Added | SPEC-API (recently_added in DashboardResponse), SPEC-DASH | US-5.3: See Highest-Rated and Recently Added Wines | Last 5 by created_at DESC; shows name/producer/vintage/date/qty |
| F5: Recently consumed | F05-G: Recently Consumed | SPEC-API (recently_consumed in DashboardResponse), SPEC-DASH | US-5.4: See Recently Consumed Wines | Last 5 consumed events; shows wine name, date, tasting note indicator; taps to wine detail |
| F5: Live data refresh | F05-H: Live Data Refresh | SPEC-DASH (fresh query on every navigation; no manual refresh; per-section error handling) | US-5.5: Dashboard Loads Fresh Data Every Visit | Fresh load on every visit; skeleton loading; per-section graceful error; loads ≤2s |

#### F6: Mobile-First User Experience

| PRD Feature | FRD Sub-feature | TechArch Spec | User Story | Acceptance Criteria Coverage |
|-------------|-----------------|---------------|------------|------------------------------|
| F6: Responsive layout | F06-A: Responsive Layout | SPEC-FRONTEND (Tailwind CSS; mobile-first breakpoints: sm≥375px, md≥768px) | US-6.1: Use the App Comfortably on a Phone | All views functional at 375px+; no horizontal scroll; vertical stacking |
| F6: Thumb-friendly navigation | F06-B: Thumb-Friendly Navigation | SPEC-FRONTEND (`BottomNav` component; fixed to viewport bottom; FAB for Add Wine) | US-6.2: Navigate via a Thumb-Friendly Bottom Bar | Bottom nav bar with Wine List/Dashboard/Ready to Drink/Add Wine; ≤2 taps; destructive actions not in thumb zone |
| F6: Mobile-optimized forms | F06-C: Mobile-Optimized Forms | SPEC-FRONTEND (`WineForm`; inputmode=numeric, type=date, native selects; React Hook Form + Zod) | US-6.3: Add a Wine in Under 60 Seconds | Form completable ≤60s at 375px; required fields first; optional fields collapsible; native inputs; inline validation |
| F6: Card-based wine list | F06-D: Card-Based Wine List | SPEC-FRONTEND (`WineListPage`, `WineCard`; infinite scroll; 64px min card height) | US-0.3: View the Complete Wine List | Card layout; vertical scroll; infinite scroll / Load more; 20 records initial render |
| F6: Mobile filter interface | F06-E: Mobile Filter Interface | SPEC-FRONTEND (`FilterSheet`; bottom sheet modal; shadcn/ui) | US-6.4: Access Filters via a Mobile-Friendly Panel | Bottom sheet; swipe-to-dismiss; 44px controls; search bar outside sheet; active count badge |
| F6: No horizontal scroll | F06-F: No Horizontal Scroll | SPEC-FRONTEND (Tailwind overflow-x:hidden; stacked key-value pairs; text wrapping) | US-6.1: Use the App Comfortably on a Phone | No horizontal scroll at any viewport ≥375px; tables replaced with stacked pairs; long text wraps |
| F6: Performance budget | F06-G: Performance Budget | SPEC-ARCH (Vercel CDN; Vite production build; React Query caching; PostgreSQL indexes) | US-6.5: Experience Fast Load Times on a Mobile Connection | Initial load ≤3s (4G); list ≤2s; search ≤500ms; form submit ≤1s; dashboard ≤2s; skeleton on slow connection |
| F6: Accessibility baseline | F06-H: Accessibility Baseline | SPEC-FRONTEND (shadcn/ui accessible components; WCAG AA; aria labels; `manifest.json`; vite-plugin-pwa) | US-6.6: Experience Accessible, Readable Interface | WCAG AA contrast (4.5:1 normal, 3:1 large); visible labels; descriptive errors; 44px tap targets; PWA manifest; Lighthouse installability |

---

## 5. Requirement Detail by Feature

### F0: Wine Inventory Management

**PRD Capabilities → FRD Implementation:**

- Add new wine via form → F00-A: form with 3 required fields (`wine_name`, `wine_type`, `quantity_owned`) + 17 optional fields; validates all; HTTP 201 on success
- View complete wine list → F00-B: paginated/scrollable list; summary cards; default sort by `created_at DESC`; supports re-sort via F02
- View all detail fields → F00-C: full `WineDetail` response; includes computed `drinking_status`, `average_rating`, `tasting_notes[]`; "Last bottle" indicator when `quantity_owned = 1`
- Edit any field → F00-D: pre-populated form; identical validation to add; `updated_at` refreshed; HTTP 200
- Delete with confirmation → F00-E: confirmation dialog; cascades delete to `tasting_notes`; navigates to list; HTTP 204
- Track all wine attributes → `wines` table: `wine_name`, `producer`, `vintage_year`, `country`, `region`, `appellation`, `wine_type`, `grape_variety`, `bottle_size`, plus quantity, purchase, storage, window, and notes columns
- Track quantity owned/consumed → `quantity_owned` INTEGER (decremented by F03); `quantity_consumed` INTEGER (incremented by F03)
- Track purchase info → `purchase_price`, `purchase_date`, `purchase_source` columns
- Track storage location → `storage_location` VARCHAR(255)

**Error codes:** `WINE_VALIDATION_FAILED`, `WINE_INVALID_TYPE`, `WINE_INVALID_QUANTITY`, `WINE_INVALID_VINTAGE`, `WINE_INVALID_WINDOW`, `WINE_INVALID_PURCHASE_DATE`, `WINE_NOT_FOUND`, `AUTH_REQUIRED`, `INTERNAL_ERROR`

**API endpoints:** `GET /api/wines`, `POST /api/wines`, `GET /api/wines/:id`, `PUT /api/wines/:id`, `PATCH /api/wines/:id`, `DELETE /api/wines/:id`

---

### F1: Drinking Window Tracking

**PRD Capabilities → FRD Implementation:**

- Define window start/end per wine → F01-A: `drink_window_start` / `drink_window_end` integer columns; both optional; end requires start; end ≥ start enforced
- Auto-compute current status → F01-B: `drinkingStatusService.js` pure function; evaluated in priority order: special_occasion → no_window → past_window → drink_now → approaching_peak → hold
- Display status badge → F01-C: `DrinkingStatusBadge` component; 6 color-coded states; shown on every wine card and detail view
- "Ready to Drink" dedicated list → F01-D: `GET /api/wines/ready-to-drink`; `drink_now` AND `qty > 0`; sorted by `drink_window_end ASC`
- Special Occasion flag → F01-E: `is_special_occasion` boolean; overrides all computed logic; excluded from ready-to-drink list; reversible

**Status logic:**
| Status | Condition |
|--------|-----------|
| `special_occasion` | `is_special_occasion = true` (overrides all) |
| `no_window` | No `drink_window_start` or `drink_window_end` set |
| `past_window` | `current_year > drink_window_end` |
| `drink_now` | `current_year >= drink_window_start` (and not past end) |
| `approaching_peak` | `current_year >= drink_window_start - 2` (and < start) |
| `hold` | `current_year < drink_window_start - 2` |

**Error codes:** `WINE_WINDOW_END_WITHOUT_START`, `WINE_INVALID_WINDOW`, `WINE_INVALID_WINDOW_YEAR`

---

### F2: Search and Filter

**PRD Capabilities → FRD Implementation:**

- Full-text search (name, producer, region, notes) → F02-A: PostgreSQL `tsvector` GIN index; weights A/B/C/D; `searchService.js` parameterized queries; 300ms debounce in `SearchBar`
- Filter by wine type, producer, country, region, vintage range, grape, status, storage, price range, rating → F02-B through F02-G: all implemented as query params on `GET /api/wines`; AND logic across active filters
- Instant results without page reload → F02-A/B-G: TanStack Query key includes filter state; auto-refetch on filter change
- Filter state persistence → F02-I: React state + URL query params via React Router; survives list↔detail navigation
- Mobile filter controls → F02-H: `FilterSheet` bottom sheet component; swipe-to-dismiss; 44px targets; filter count badge
- Clear all filters → F02-J: resets all query params and React state; full list immediately
- Sort options → 8 sort values via `sort` param: `recent`, `name_asc`, `name_desc`, `vintage_asc`, `vintage_desc`, `rating_desc`, `price_asc`, `price_desc`

**Filter options endpoint:** `GET /api/wines/filter-options` returns distinct producers, countries, regions, grapes, storage_locations for dropdown population

**Error codes:** `FILTER_INVALID_TYPE`, `FILTER_INVALID_VINTAGE_RANGE`, `FILTER_INVALID_PRICE_RANGE`, `FILTER_INVALID_RATING`, `FILTER_INVALID_SORT`

---

### F3: Bottle Status Tracking

**PRD Capabilities → FRD Implementation:**

- Mark consumed (single or multi-bottle) → F03-A: `POST /api/wines/:id/consume`; `ConsumeDialog` with date + quantity stepper; tasting note shortcut when qty=1; one event record per bottle; atomic transaction
- Mark gifted → F03-B: `POST /api/wines/:id/gift`; `GiftDialog` with date + optional recipient; `qty_owned` decrements; `qty_consumed` unchanged
- Quantity auto-decrement → F03-C: atomic DB transaction (event insert + qty update together); `qty_owned` cannot go below 0; `BOTTLE_NONE_REMAINING` error if already 0
- View consumed/gifted history → F03-D: `GET /api/wines/:id/history`; `bottle_status_events` sorted by `event_date DESC`; type/date/metadata displayed; tasting note link indicator
- Undo status event → F03-E: `DELETE /api/events/:event_id`; confirms before action; `qty_owned +1`; if consumed, `qty_consumed -1`; linked tasting note NOT auto-deleted; atomic reversal

**DB table:** `bottle_status_events` (`id`, `wine_id`, `event_type` [consumed|gifted], `event_date`, `recipient_name`, `created_at`)

**Error codes:** `BOTTLE_NONE_REMAINING`, `BOTTLE_QUANTITY_EXCEEDS_OWNED`, `BOTTLE_INVALID_DATE`, `WINE_NOT_FOUND`, `EVENT_NOT_FOUND`

---

### F4: Tasting Notes and Personal Ratings

**PRD Capabilities → FRD Implementation:**

- Record tasting note after consuming → F04-A (Path A): shortcut from `ConsumeDialog`; `date_opened` pre-filled from event; `bottle_status_event_id` FK linked
- Add note independently → F04-A (Path B): "Add Tasting Note" button on Wine Detail; `date_opened` defaults to today; no event link required; no future dates
- Note fields: date, rating, appearance, aroma, flavor, finish, overall, food pairing, occasion, would-buy-again, guest feedback → all stored in `tasting_notes` table; all optional except `date_opened`
- Multiple notes per wine → `tasting_notes` has many-to-one FK to `wines`; sorted by `date_opened DESC` in display
- View all notes on wine detail → F04-B: included in `GET /api/wines/:id` response as `tasting_notes[]`; expandable cards via `TastingNoteCard`
- Edit/delete notes → F04-C/D: `PUT/PATCH /api/tasting-notes/:note_id`, `DELETE /api/tasting-notes/:note_id`; pre-populated form; confirmation for delete; average rating recomputed after delete
- Rating aggregation → F04-E: `average_rating = AVG(personal_rating)` computed at read time; not stored; displayed on wine card and detail; "Not yet rated" if no ratings; 1 decimal place
- Filter/sort by rating → F04-F: integrated into F02 via `rating_min` filter and `rating_desc` sort

**Error codes:** `NOTE_INVALID_RATING`, `NOTE_INVALID_DATE`, `NOTE_INVALID_BUY_AGAIN`, `NOTE_NOT_FOUND`, `NOTE_FIELD_TOO_LONG`

---

### F5: Collection Insights Dashboard

**PRD Capabilities → FRD Implementation:**

- Summary stats → F05-A: `dashboardService.js` parallel queries returning `total_bottles` (SUM qty_owned), `total_wine_records` (COUNT), `estimated_value` (SUM purchase_price × qty_owned), `ready_to_drink_count`, `approaching_count`, `avg_purchase_price`
- Breakdown by wine type → F05-B: `SUM(qty_owned) GROUP BY wine_type`; all 5 types shown; zero-count shown as 0
- Top 5 regions → F05-C: `SUM(qty_owned) GROUP BY region ORDER BY count DESC LIMIT 5`; NULL regions excluded
- Top 5 grape varieties → F05-D: same pattern by `grape_variety`
- Highest-rated wines → F05-E: wines with at least one rated note; `AVG(personal_rating) DESC LIMIT 5`; name/producer/vintage/avg_rating shown
- Recently added → F05-F: `ORDER BY created_at DESC LIMIT 5`; name/producer/vintage/date/qty shown
- Recently consumed → F05-G: `bottle_status_events WHERE event_type='consumed' ORDER BY event_date DESC LIMIT 5`; name/date/has_tasting_note shown; navigates to wine detail on tap
- Live data → F05-H: fresh query on every Dashboard navigation; skeleton loading state; per-section error fallback; no manual refresh required

**Single endpoint:** `GET /api/dashboard` returns full `DashboardResponse` payload in parallel queries via `Promise.all`

---

### F6: Mobile-First User Experience

**PRD Capabilities → FRD Implementation:**

- All views functional at 375px+ → F06-A: Tailwind mobile-first breakpoints; tested at 375px, 390px, 414px; vertical stacking on sm screens
- Thumb-friendly navigation → F06-B: `BottomNav` fixed to viewport bottom; Wine List / Dashboard / Ready to Drink / Add Wine slots; Add Wine as FAB or primary slot; destructive actions require intentional reach
- Add-bottle form completable ≤60s → F06-C: required fields first; optional fields in collapsible "More Details"; native input types (inputmode=numeric, type=date, type=select); inline validation; no full-page reload
- Card-based scrollable wine list → F06-D: `WineCard` minimum 64px height; infinite scroll / "Load more"; 20 records initial render; no pagination buttons
- Mobile filter panel → F06-E: `FilterSheet` bottom sheet; swipe to dismiss; all controls ≥44px; search bar stays in main view
- No horizontal scroll → F06-F: Tailwind overflow constraints; tables → stacked key-value pairs; long text wraps
- Performance budget → F06-G: Vite optimized build; Vercel CDN; React Query caching; PostgreSQL indexes; initial ≤3s, list ≤2s, search ≤500ms, form submit ≤1s, dashboard ≤2s
- Accessibility → F06-H: shadcn/ui accessible base components; WCAG AA; visible labels; descriptive errors; icon+text for status badges; `manifest.json`; vite-plugin-pwa Lighthouse check

---

## 6. Non-Functional Requirements Traceability

| NFR Category | PRD Requirement | TechArch Implementation | Test Approach |
|--------------|-----------------|------------------------|---------------|
| Performance | Wine list loads ≤2s for ≤500 bottles | PostgreSQL indexes on wine_type/region/vintage/producer; pagination (default 20); React Query caching | Load test with 500 records; measure Time to Interactive |
| Performance | Search results ≤500ms | tsvector GIN index; parameterized search query; 300ms debounce in frontend | Timing measurement in browser DevTools; API response time |
| Performance | Form submit ≤1s | Zod validation (fast); parameterized Prisma query; HTTP 201/200 response | API integration test with timer |
| Performance | Initial app load ≤3s on 4G | Vite production build (code splitting, tree shaking); Vercel CDN (global edge); vite-plugin-pwa shell caching | Lighthouse performance audit; WebPageTest on simulated 4G |
| Reliability | No data loss on network interruption during form submit | React Hook Form preserves state; error banner: "Could not save. Check your connection and try again." | Simulate network drop during form submit; verify form state preserved |
| Reliability | Graceful recovery from unexpected errors | React ErrorBoundary at page level; `errorHandler.js` global handler; generic 500 message in production | Trigger 500 error; verify no stack trace exposed; verify ErrorBoundary renders fallback |
| Usability | Non-technical user adds first record without instructions | Required fields first and clearly marked; optional fields collapsible; native mobile inputs; minimal form length | Usability test with wine enthusiast; time-to-first-record ≤60s |
| Usability | Primary nav within 2 taps from any screen | `BottomNav` always visible; all 4 primary sections accessible directly | Manual navigation test from every page |
| Accessibility | WCAG AA contrast | Tailwind palette configured for AA ratios; shadcn/ui accessible defaults | Lighthouse accessibility audit; manual contrast checker |
| Accessibility | Visible labels and descriptive errors | React Hook Form error handling; all inputs labelled; aria-describedby on errors | axe accessibility scan; screen reader test |
| Security | Wine data requires authentication | All `/api/*` endpoints (except `/api/auth/login`) validate session token via `auth.js` middleware; 401 on failure | API integration test: unauthenticated requests return 401 |
| Security | No third-party tracking | No analytics/ad SDK included; data stays in Railway PostgreSQL | Code review; network request audit (no calls to tracking domains) |
| Data Integrity | No silent data loss | All DB writes use parameterized Prisma queries; atomic transactions for quantity operations; no silent catch-and-ignore | Integration tests for consume/gift operations; verify both event and qty update committed together |
| Scalability | Supports up to 1,000 bottles without degradation | PostgreSQL B-tree indexes on all filter dimensions; pagination (default 20, max 100); tsvector GIN for search | Performance test with 1,000 records; measure list and search response times |
| Compatibility | Works on Safari iOS, Chrome Android, Chrome/Safari desktop | React PWA (no native app required); Tailwind CSS cross-browser compatible; Vite production build targets modern browsers | Manual testing on iOS Safari and Android Chrome; Playwright cross-browser tests |

---

## 7. Test Case Coverage Matrix

The following matrix maps each PRD feature to its user stories, acceptance criteria count, and estimated test case coverage. Test cases should be created in the project's test management system using the user story acceptance criteria as the base.

| Feature | User Stories | Acceptance Criteria Count | Estimated Test Cases | Coverage |
|---------|-------------|--------------------------|---------------------|----------|
| F0: Wine Inventory Management | US-0.1, US-0.2, US-0.3, US-0.4, US-0.5, US-0.6, US-0.7 | 50 | 25 | 100% |
| F1: Drinking Window Tracking | US-1.1, US-1.2, US-1.3, US-1.4 | 24 | 18 | 100% |
| F2: Search and Filter | US-2.1, US-2.2, US-2.3, US-2.4, US-2.5 | 29 | 22 | 100% |
| F3: Bottle Status Tracking | US-3.1, US-3.2, US-3.3, US-3.4 | 27 | 20 | 100% |
| F4: Tasting Notes and Personal Ratings | US-4.1, US-4.2, US-4.3, US-4.4, US-4.5 | 29 | 18 | 100% |
| F5: Collection Insights Dashboard | US-5.1, US-5.2, US-5.3, US-5.4, US-5.5 | 27 | 16 | 100% |
| F6: Mobile-First UX | US-6.1, US-6.2, US-6.3, US-6.4, US-6.5, US-6.6 | 36 | 24 | 100% |
| **Total** | **36 stories** | **222** | **143** | **100%** |

### 7.1 Test Category Coverage

| Test Category | Features Covered | Test Type |
|---------------|-----------------|-----------|
| Unit tests — `drinkingStatusService.js` | F1 (all 6 status codes, edge cases) | Unit (Vitest) |
| Unit tests — `searchService.js` | F2 (filter param → SQL WHERE) | Unit (Vitest) |
| Unit tests — `dashboardService.js` | F5 (aggregate computations) | Unit (Vitest) |
| Unit tests — `formatters.js` | F5, F4 (currency, date, rating display) | Unit (Vitest) |
| API integration tests — Wine CRUD | F0 (all 5 sub-features; validation; error codes) | Integration (supertest) |
| API integration tests — Drinking Window | F1 (window validation; status filter) | Integration (supertest) |
| API integration tests — Search & Filter | F2 (all query params; AND logic; pagination; sort) | Integration (supertest) |
| API integration tests — Bottle Status | F3 (consume/gift; atomic transactions; undo; error cases) | Integration (supertest) |
| API integration tests — Tasting Notes | F4 (create/edit/delete; rating aggregation; paths A and B) | Integration (supertest) |
| API integration tests — Dashboard | F5 (all dashboard sections; empty collection edge cases) | Integration (supertest) |
| API integration tests — Auth | All features (401 on unauthenticated; session validation) | Integration (supertest) |
| Component tests — WineForm | F0, F6 (validation display; native input types; 60s completion) | Component (Testing Library) |
| Component tests — DrinkingStatusBadge | F1 (all 6 status colors and labels) | Component (Testing Library) |
| Component tests — FilterSheet | F2, F6 (bottom sheet; filter state; clear) | Component (Testing Library) |
| Component tests — ConsumeDialog / GiftDialog | F3 (date default; qty stepper; tasting note shortcut) | Component (Testing Library) |
| Component tests — DashboardPage | F5 (loading state; section error fallback; stat rendering) | Component (Testing Library) |
| End-to-end tests — Add a Bottle journey | F0, F6 (add form → detail view in ≤60s) | E2E (Playwright) |
| End-to-end tests — Find a Bottle journey | F2 (search → filter → detail → back to filtered list) | E2E (Playwright) |
| End-to-end tests — Open a Bottle journey | F3, F4 (consume → tasting note → qty updated) | E2E (Playwright) |
| End-to-end tests — Review Collection journey | F5 (dashboard all sections fresh on visit) | E2E (Playwright) |
| Performance tests | F6 (list ≤2s; search ≤500ms; dashboard ≤2s; initial ≤3s) | Lighthouse + load test |
| Accessibility audit | F6 (WCAG AA; PWA installability; Lighthouse score) | Lighthouse + axe |
| Cross-browser tests | F6 (Safari iOS; Chrome Android; Chrome desktop) | Manual + Playwright |

### 7.2 Critical Test Scenarios (P0 — Must Pass Before Release)

| Test ID | Scenario | Feature | Expected Result |
|---------|----------|---------|-----------------|
| TEST-001 | Add wine with minimum required fields (name, type, qty) | F0 | Record created; redirected to detail view; appears in list |
| TEST-002 | Add wine with all fields; verify all saved correctly | F0 | All field values persisted; no data truncation |
| TEST-003 | Delete wine; verify tasting notes cascade-deleted | F0 | Wine and all linked notes removed; list updated |
| TEST-004 | Edit wine; verify updated_at changes, original data preserved if cancel | F0 | updated_at refreshed on save; no change on cancel |
| TEST-005 | Last bottle indicator — qty=1 | F0 | "Last bottle" indicator visible; non-blocking |
| TEST-006 | Drinking status = drink_now when current_year within window | F1 | Green "Drink Now" badge; appears in Ready to Drink list |
| TEST-007 | Drinking status = approaching_peak when current_year = start_year - 1 | F1 | Amber "Approaching Peak" badge |
| TEST-008 | Drinking status = hold when current_year < start_year - 2 | F1 | Blue "Hold" badge; NOT in Ready to Drink list |
| TEST-009 | Drinking status = past_window when current_year > end_year | F1 | Red "Past Window" badge; NOT in Ready to Drink list |
| TEST-010 | Special occasion override regardless of window dates | F1 | Purple "Special Occasion" badge; NOT in Ready to Drink list |
| TEST-011 | drink_window_end without drink_window_start → validation error | F1 | HTTP 422; WINE_WINDOW_END_WITHOUT_START |
| TEST-012 | Full-text search returns partial match on wine_name | F2 | Correct wines returned within 500ms |
| TEST-013 | Filter by wine_type=red returns only red wines | F2 | Only red wines in results |
| TEST-014 | Multiple filters combined (AND logic) | F2 | Results satisfy ALL active filters |
| TEST-015 | Filter state persists after navigating to detail and back | F2 | Same filter applied on return to list |
| TEST-016 | Clear Filters resets all state | F2 | Full wine list shown; no active filters |
| TEST-017 | Mark bottle consumed — qty_owned decrements; qty_consumed increments | F3 | Atomic update; both values correct; event created |
| TEST-018 | Mark bottle consumed when qty_owned = 0 → error | F3 | HTTP 422; BOTTLE_NONE_REMAINING |
| TEST-019 | Mark bottle gifted — only qty_owned decrements | F3 | qty_owned -1; qty_consumed unchanged; gifted event created |
| TEST-020 | Undo consumed event — qty_owned +1; qty_consumed -1 | F3 | Atomic reversal; tasting note not deleted |
| TEST-021 | Unauthenticated request to any /api/* endpoint → 401 | All | HTTP 401; AUTH_REQUIRED |
| TEST-022 | Wine list loads ≤2s for 500-record collection | F0, F6 | Response time ≤2000ms |
| TEST-023 | No horizontal scroll at 375px viewport | F6 | No overflow-x scroll on any core view |
| TEST-024 | All tap targets ≥44×44px | F6 | Browser DevTools audit passes |
| TEST-025 | PWA manifest validation — Lighthouse installability check | F6 | No critical PWA errors in Lighthouse |

---

## 8. Bidirectional Traceability Verification

### 8.1 Forward Coverage Check — PRD Features → Implementation

| PRD Feature | FRD Spec | TechArch Spec | User Stories | Status |
|-------------|----------|---------------|--------------|--------|
| F0: Wine Inventory Management | F00-A through F00-E ✓ | SPEC-API, SPEC-DATA, SPEC-FRONTEND ✓ | US-0.1–US-0.7 ✓ | **Covered** |
| F1: Drinking Window Tracking | F01-A through F01-F ✓ | SPEC-DRINK, SPEC-DATA, SPEC-FRONTEND ✓ | US-1.1–US-1.4 ✓ | **Covered** |
| F2: Search and Filter | F02-A through F02-J ✓ | SPEC-SEARCH, SPEC-API, SPEC-FRONTEND ✓ | US-2.1–US-2.5 ✓ | **Covered** |
| F3: Bottle Status Tracking | F03-A through F03-E ✓ | SPEC-API, SPEC-TRANS, SPEC-FRONTEND ✓ | US-3.1–US-3.4 ✓ | **Covered** |
| F4: Tasting Notes & Ratings | F04-A through F04-F ✓ | SPEC-API, SPEC-DATA, SPEC-FRONTEND ✓ | US-4.1–US-4.5 ✓ | **Covered** |
| F5: Collection Insights Dashboard | F05-A through F05-H ✓ | SPEC-DASH, SPEC-API, SPEC-FRONTEND ✓ | US-5.1–US-5.5 ✓ | **Covered** |
| F6: Mobile-First UX | F06-A through F06-H ✓ | SPEC-FRONTEND, SPEC-PWA, SPEC-ARCH ✓ | US-6.1–US-6.6 ✓ | **Covered** |

### 8.2 Backward Coverage Check — No Orphaned Specifications

| Document | Orphaned Items | Status |
|----------|----------------|--------|
| FRD sub-features (F00–F06, Y0–Y1) | None — all sub-features map to a PRD feature | **Clean** |
| TechArch specs (SPEC-*) | None — all specs implement at least one FRD sub-feature | **Clean** |
| User Stories (US-0.1–US-6.6) | None — all stories reference a PRD feature (F0–F6) | **Clean** |
| TechArch deferred integrations (Section 7.4) | Vercel, Railway, PWA — all map to SPEC-ARCH / SPEC-PWA | **Clean** |

### 8.3 Non-Functional Requirements Coverage

| PRD NFR | FRD Reference | TechArch Implementation | User Story | Status |
|---------|---------------|------------------------|------------|--------|
| Performance — list ≤2s | F06-G, F00-B | PostgreSQL indexes; pagination; React Query | US-6.5 | **Covered** |
| Performance — search ≤500ms | F06-G, F02-A | tsvector GIN; searchService; debounce | US-2.1, US-6.5 | **Covered** |
| Performance — form submit ≤1s | F06-G, F00-A | Zod validation; Prisma query; HTTP 201 | US-6.3 | **Covered** |
| Performance — initial load ≤3s | F06-G | Vite build; Vercel CDN; service worker | US-6.5 | **Covered** |
| Reliability — no data loss on network interrupt | F06 error states | React Hook Form state preservation; error banner | US-6.5 | **Covered** |
| Reliability — graceful error recovery | F06-H, all error states | React ErrorBoundary; errorHandler.js; generic 500 | US-6.5, US-5.5 | **Covered** |
| Usability — first wine without instructions | F06-C, F00-A | Required fields first; collapsible optional; native inputs | US-0.1, US-6.3 | **Covered** |
| Usability — primary nav within 2 taps | F06-B | BottomNav always visible; 4 primary sections | US-6.2 | **Covered** |
| Accessibility — WCAG AA contrast | F06-H | shadcn/ui; Tailwind configured palette | US-6.6 | **Covered** |
| Accessibility — labels and descriptive errors | F06-H | React Hook Form error handling; aria labels | US-6.6 | **Covered** |
| Security — data requires auth | F00–F05 (all features) | auth.js middleware on all /api/* routes; 401 | All features | **Covered** |
| Security — no third-party tracking | PRD §6 | No analytics SDK; data in Railway DB only | — | **Covered** |
| Data Integrity — no silent data loss | F03-C, F03-E | Atomic transactions; parameterized queries | US-3.1–US-3.4 | **Covered** |
| Scalability — 1,000 bottles | F00-B, F02 | PostgreSQL indexes; pagination; tsvector GIN | US-0.3 | **Covered** |
| Compatibility — iOS Safari, Android Chrome | F06-A | React PWA; Tailwind; modern browser targets | US-6.1 | **Covered** |

---

## 9. Data Model Traceability

| Table | PRD Feature | FRD Reference | TechArch DDL Section | Purpose |
|-------|-------------|---------------|---------------------|---------|
| `users` | Auth (all features) | FRD §Authentication | TechArch §3.2 Table: users | Single-user account; bcrypt password; session FK |
| `wines` | F0, F1, F2 (core) | F00, F01, F02 | TechArch §3.2 Table: wines | Core wine record; all inventory, window, and quantity fields |
| `wines.search_vector` | F2 | F02-A | TechArch §3.2 wines trigger | Maintained tsvector; GIN indexed; full-text search |
| `bottle_status_events` | F3 | F03 | TechArch §3.2 Table: bottle_status_events | Consumed/gifted event log; referenced by tasting_notes |
| `tasting_notes` | F4 | F04 | TechArch §3.2 Table: tasting_notes | Tasting impressions; personal_rating; optional FK to events |
| `sessions` | Auth (all features) | FRD §Authentication | TechArch §3.2 Table: sessions | Stateful session tokens; rolling 30-day expiry |

---

## 10. API Endpoint Traceability

| Endpoint | HTTP Method | PRD Feature | FRD Spec | TechArch Section | User Stories |
|----------|-------------|-------------|----------|------------------|--------------|
| `/api/auth/login` | POST | Auth | Y1 §Authentication | TechArch §4.3 | — (login prerequisite) |
| `/api/auth/logout` | POST | Auth | Y1 §Authentication | TechArch §4.3 | — |
| `/api/auth/me` | GET | Auth | Y1 §Authentication | TechArch §4.3 | — |
| `/api/wines` | GET | F0, F1, F2 | F00-B, F01-F, F02 | TechArch §4.3 Wine Inventory | US-0.3, US-2.1–2.5 |
| `/api/wines` | POST | F0 | F00-A | TechArch §4.3 Wine Inventory | US-0.1, US-0.2 |
| `/api/wines/ready-to-drink` | GET | F1 | F01-D | TechArch §4.3 Wine Inventory | US-1.3 |
| `/api/wines/filter-options` | GET | F2 | F02-H | TechArch §4.3 Wine Inventory | US-2.2 |
| `/api/wines/:id` | GET | F0 | F00-C | TechArch §4.3 Wine Inventory | US-0.4 |
| `/api/wines/:id` | PUT / PATCH | F0 | F00-D | TechArch §4.3 Wine Inventory | US-0.5 |
| `/api/wines/:id` | DELETE | F0 | F00-E | TechArch §4.3 Wine Inventory | US-0.6 |
| `/api/wines/:id/consume` | POST | F3 | F03-A, F03-C | TechArch §4.3 Bottle Status | US-3.1 |
| `/api/wines/:id/gift` | POST | F3 | F03-B, F03-C | TechArch §4.3 Bottle Status | US-3.2 |
| `/api/wines/:id/history` | GET | F3 | F03-D | TechArch §4.3 Bottle Status | US-3.3 |
| `/api/events/:event_id` | DELETE | F3 | F03-E | TechArch §4.3 Bottle Status | US-3.4 |
| `/api/wines/:id/tasting-notes` | GET | F4 | F04-B | TechArch §4.3 Tasting Notes | US-4.3 |
| `/api/wines/:id/tasting-notes` | POST | F4 | F04-A | TechArch §4.3 Tasting Notes | US-4.1, US-4.2 |
| `/api/tasting-notes/:note_id` | GET | F4 | F04-B | TechArch §4.3 Tasting Notes | US-4.3 |
| `/api/tasting-notes/:note_id` | PUT / PATCH | F4 | F04-C | TechArch §4.3 Tasting Notes | US-4.4 |
| `/api/tasting-notes/:note_id` | DELETE | F4 | F04-D | TechArch §4.3 Tasting Notes | US-4.4 |
| `/api/dashboard` | GET | F5 | F05-A through F05-H | TechArch §4.3 Dashboard | US-5.1–US-5.5 |

---

## 11. Error Code Reference

| Error Code | HTTP Status | Feature | FRD Reference | Trigger Condition |
|------------|-------------|---------|---------------|-------------------|
| `WINE_VALIDATION_FAILED` | 422 | F0 | F00 | Required field missing or invalid |
| `WINE_INVALID_TYPE` | 422 | F0 | F00 | wine_type not in valid enum |
| `WINE_INVALID_QUANTITY` | 422 | F0 | F00 | quantity_owned < 0 |
| `WINE_INVALID_VINTAGE` | 422 | F0 | F00 | vintage_year outside 1800 to current+2 |
| `WINE_INVALID_WINDOW` | 422 | F0, F1 | F00, F01 | drink_window_end < drink_window_start |
| `WINE_INVALID_PURCHASE_DATE` | 422 | F0 | F00 | purchase_date in the future |
| `WINE_NOT_FOUND` | 404 | F0, F3, F4 | F00, F03, F04 | Wine not found or belongs to different user |
| `WINE_WINDOW_END_WITHOUT_START` | 422 | F1 | F01 | end year provided without start year |
| `WINE_INVALID_WINDOW_YEAR` | 422 | F1 | F01 | Non-integer year value |
| `FILTER_INVALID_TYPE` | 422 | F2 | F02 | Invalid wine_type filter value |
| `FILTER_INVALID_VINTAGE_RANGE` | 422 | F2 | F02 | vintage_year_min > vintage_year_max |
| `FILTER_INVALID_PRICE_RANGE` | 422 | F2 | F02 | price_min > price_max |
| `FILTER_INVALID_RATING` | 422 | F2 | F02 | rating_min outside 1–100 |
| `FILTER_INVALID_SORT` | 422 | F2 | F02 | Invalid sort enum value |
| `BOTTLE_NONE_REMAINING` | 422 | F3 | F03 | quantity_owned is already 0 |
| `BOTTLE_QUANTITY_EXCEEDS_OWNED` | 422 | F3 | F03 | Selected quantity > quantity_owned |
| `BOTTLE_INVALID_DATE` | 422 | F3 | F03 | Event date in the future |
| `EVENT_NOT_FOUND` | 404 | F3 | F03 | Status event not found (undo) |
| `NOTE_INVALID_RATING` | 422 | F4 | F04 | personal_rating outside 1–100 |
| `NOTE_INVALID_DATE` | 422 | F4 | F04 | date_opened in the future |
| `NOTE_INVALID_BUY_AGAIN` | 422 | F4 | F04 | would_buy_again not in (yes, no, maybe) |
| `NOTE_NOT_FOUND` | 404 | F4 | F04 | Tasting note not found |
| `NOTE_FIELD_TOO_LONG` | 422 | F4 | F04 | Text field exceeds max length |
| `DASHBOARD_QUERY_FAILED` | 500 | F5 | F05 | Database query failure on dashboard |
| `AUTH_REQUIRED` | 401 | All | All | Unauthenticated request to protected endpoint |
| `AUTH_FAILED` | 401 | Auth | Y1 §Auth | Incorrect email or password at login |
| `INTERNAL_ERROR` | 500 | All | All | Unexpected server error |

---

## 12. Deferred Requirements Tracking

The following requirements were explicitly deferred from v1 scope. They are tracked here to ensure they can be traced to future phases without introducing scope creep into the current build.

| Deferred Feature | PRD Reference | Reason Deferred | Target Phase | Architectural Note |
|-----------------|---------------|-----------------|--------------|-------------------|
| Export to spreadsheet / PDF | PRD §9 Deferred | Lower priority; core value independent | Phase 2 | Pure read-only; no schema changes needed |
| Drinking window alerts / reminders | PRD §9 Deferred | Notification infrastructure out of scope | Phase 2 | Add `push_subscription` to `users` table |
| Food pairing suggestions | PRD §9 Deferred | Adds complexity; deferred until core works | Phase 2 | `tasting_notes.food_pairing` field already exists |
| Occasion-based recommendations | PRD §9 Deferred | Adds complexity | Phase 2 | `tasting_notes.occasion` field already exists |
| Import from spreadsheets | PRD §9 Deferred | Nice-to-have for onboarding | Phase 2 | Bulk insert into existing `wines` table |
| Label scanning via camera | PRD §9 Deferred | Requires AI/camera; scope risk | Phase 3 | Add `label_image_url` column to `wines` |
| AI-assisted bottle entry | PRD §9 Deferred | Future enhancement after manual entry proven | Phase 3 | No schema changes needed |
| Wine valuation support | PRD §9 Deferred | Requires external data integration | Phase 3 | `wines.purchase_price` provides base data |
| Cellar map / storage visualization | PRD §9 Deferred | UX complexity | Phase 3 | `wines.storage_location` field already exists |
| AI-based recommendation engine | PRD §9 Deferred | Requires sufficient usage data | Phase 3–4 | `tasting_notes` + `wines` data sufficient as input |
| Integration with external wine APIs | PRD §9 Deferred | Requires third-party agreements | Phase 3–4 | All `wines` columns ready to receive external data |
| Shared household / multi-user access | PRD §9 Deferred | Auth complexity; personal-use first | Phase 4 | `user_id` FK on all tables already in place |
| OAuth / SSO | TechArch §7.4 | Not needed for single-user MVP | Phase 4 | `users` table supports adding oauth_provider column |

---

## 13. Change Management Log

| Change # | Date | Changed By | Description | Documents Affected | Impact |
|----------|------|------------|-------------|-------------------|--------|
| CHG-001 | 2026-05-21 | — | Initial RTM creation from PRD v1.0, FRD v1.0, TechArch v1.0, UserStories v1.0 | All | Baseline established |

*All future changes to PRD, FRD, TechArch, or UserStories that affect requirements traceability must be logged here before implementation begins.*

---

## 14. Approval and Sign-Off

This RTM is considered approved when all parties below have reviewed and signed. Sign-off confirms:

1. All PRD features are fully specified in the FRD with no gaps
2. All FRD requirements have corresponding TechArch implementation plans
3. All features have user stories with testable acceptance criteria
4. No orphaned specifications exist without a PRD parent
5. Test case coverage is satisfactory for MVP release

| Role | Name | Signature | Date | Status |
|------|------|-----------|------|--------|
| Product Owner | — | — | — | Pending |
| Lead Engineer | — | — | — | Pending |
| QA Lead | — | — | — | Pending |
| UX Lead | — | — | — | Pending |
| Project Sponsor | — | — | — | Pending |

---

## Related Documents

- `project_specs/PRD-WineApp.md` — Product Requirements Document v1.0
- `project_specs/FRD-WineApp.md` — Functional Requirements Document v1.0
- `project_specs/TechArch-WineApp.md` — Technical Architecture Document v1.0
- `project_specs/UserStories-WineApp.md` — User Stories v1.0
- `.planning/PROJECT.md` — Project description, constraints, and key decisions

---

*RTM-WineApp v1.0 — Generated 2026-05-21*
