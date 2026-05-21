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
