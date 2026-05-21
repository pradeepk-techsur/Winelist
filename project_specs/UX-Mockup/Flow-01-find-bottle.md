---

## Flow 02 — Find a Bottle (Search)

**Flow ID:** FLW-02
**Trigger:** User opens app to check if they own a specific wine (e.g., while at wine shop)
**User Stories:** US-2.1, US-2.4
**Persona:** Marcus
**Journey:** JRN-01.2

```
[Collection View — Wine List]
    │
    ▼ Tap Search bar (persistent, top of screen)
[Search Input Active — Keyboard Opens]
    │
    ▼ User types (debounced 300ms)
[Live Results Update in Wine List]
    │  "X wines found" counter updates
    │  Cards filter to matching wines
    │
    ├── Results found ──▶ [Scan cards for name + qty badge]
    │                         │
    │                         ├── Tap card ──▶ [Wine Detail View]
    │                         │
    │                         └── Done ──▶ Tap ✕ or Back
    │                                        [Clear search; full list restored]
    │
    └── No results ──▶ [Empty State: "No wines found"]
                           "Try clearing filters or a different search term"
                           [Clear Search button visible]
```

**Steps:**

1. **Entry:** Search bar is persistent at top of Wine List view — no navigation required (US-2.1).
2. **Type to search:** Real-time results as user types. Debounce 300ms. Searches across wine_name, producer, region, notes simultaneously.
3. **Result count:** "8 wines found" shown below search bar as results update.
4. **Scan result cards:** Each card shows name, producer, vintage, wine type badge, quantity badge ("2 owned"), and drinking status badge.
5. **Tap to detail:** Tap any card to open Wine Detail. Filter state preserved on back-navigation.
6. **Clear search:** ✕ button in search bar clears query. "Clear Filters" pill visible when filters are active.
7. **Empty state:** If no results — "No wines found for '[query]'" with "Clear search" button.

**Speed requirement:** Results must appear within 500ms of last keystroke (US-6.5, US-2.1).

**Edge Cases / States:**
- Zero-quantity wines: Excluded from default results. "Show all incl. consumed" toggle available.
- Special characters in search: Treated as literal string; no crash.
- Network error during search: Last cached results shown; subtle banner "Search may be outdated."

---

## Flow 03 — Open a Bottle (Consume + Tasting Note)

**Flow ID:** FLW-03
**Trigger:** User opens a wine bottle and wants to log it consumed + optionally add a tasting note
**User Stories:** US-3.1, US-4.1, US-4.2
**Persona:** Claire, Daniel
**Journey:** JRN-02.1, JRN-03.2

```
[Wine Detail View]
    │
    ▼ Tap "Mark as Consumed"
[Consume Confirmation Dialog]
    │  Date consumed: [Today — editable]
    │  [ ] Add tasting note after
    │  [Confirm]  [Cancel]
    │
    ├── Cancel ──▶ [Wine Detail — unchanged]
    │
    └── Confirm
          │
          ├── quantity_owned = 0 ──▶ Error toast: "No bottles remaining"
          │                           Dialog closed; detail unchanged
          │
          └── quantity_owned ≥ 1
                │
                ▼ Quantity decrements; consumed increments
                │
                ├── "Add tasting note" NOT checked ──▶ [Wine Detail View]
                │                                          Success toast: "Bottle logged"
                │                                          Quantities updated immediately
                │
                └── "Add tasting note" checked ──▶ [Tasting Note Form]
                                                       date_opened pre-filled
                                                       wine_id pre-filled
                                                       │
                                                       ├── Submit note ──▶ [Wine Detail View]
                                                       │                     Note appears in list
                                                       │
                                                       └── Skip note ──▶ [Wine Detail View]
```

**Steps:**

1. **Entry:** "Mark as Consumed" button on Wine Detail view action bar.
2. **Confirmation dialog:** Date consumed (defaults today, tappable date picker). Checkbox: "Add tasting note" (unchecked by default — not forced). Confirm / Cancel buttons.
3. **Quantity guard:** If quantity_owned = 0, dialog shows error inline "No bottles remaining" and disables Confirm button.
4. **On confirm:** Quantities update atomically. Wine Detail view refreshes with new counts shown immediately.
5. **Tasting note shortcut:** If "Add tasting note" checked, navigates to Tasting Note form with date pre-filled. After save (or if user taps "Skip"), returns to Wine Detail.
6. **"Last bottle" alert:** If quantity_owned = 1 (before decrement), dialog shows a passive notice: "⚠ This is your last bottle of this wine." Non-blocking.

**Edge Cases / States:**
- Future date rejected inline
- Network failure → error banner, quantities NOT decremented (atomic failure)

---

*Flow-01-find-bottle.md — WineApp UX Mockup*
