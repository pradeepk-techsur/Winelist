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
