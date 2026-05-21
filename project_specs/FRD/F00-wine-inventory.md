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
