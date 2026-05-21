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
