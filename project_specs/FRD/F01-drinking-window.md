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
