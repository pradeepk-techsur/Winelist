---

## Flow 04 — Choose a Wine for Dinner (Filter + Status)

**Flow ID:** FLW-04
**Trigger:** User needs to select a wine for tonight's dinner using type filter and drinking status
**User Stories:** US-2.2, US-2.3, US-1.2, US-2.5
**Persona:** Daniel
**Journey:** JRN-03.1

```
[Collection View — Wine List]
    │
    ▼ Tap wine type chip (e.g., "Red")
[List filtered to Red wines — instant]
    │  Status badges visible on every card
    │
    ▼ Scan for "Drink Now" (green) badges
[Identify candidates]
    │
    ├── Tap a wine card ──▶ [Wine Detail View]
    │                           Drinking status prominent
    │                           Storage location visible
    │                           Quantity shown
    │                           Last bottle alert if qty = 1
    │                           │
    │                           └── Back ──▶ [Filtered List — state preserved]
    │
    ▼ Want more filters? Tap "Filters" button
[Filter Bottom Sheet opens from bottom]
    │  Drinking status multi-select
    │  Vintage range
    │  Region, grape, etc.
    │  Filters apply instantly on change
    │
    ▼ Dismiss sheet (swipe down / tap overlay)
[Filtered list updates — filter badge count shown]
    │
    └── Tap "Clear Filters" pill ──▶ [Full list restored]
```

**Steps:**

1. **Entry:** Wine List view. Quick-filter type chips (Red / White / Rosé / Sparkling / All) pinned below search bar — one tap to filter by type.
2. **Status scan:** Drinking status badge visible on every card without tapping in — green "Drink Now" cards visually jump out.
3. **Deep filter:** Tap "Filters" button (shows badge count if active, e.g., "Filters (2)") to open bottom sheet.
4. **Bottom sheet:** Full filter panel slides up from bottom. All filter dimensions available. Filters apply in real time as user changes them — no "Apply" button required.
5. **Filter persistence:** Navigating to wine detail and back preserves filter state.
6. **Clear:** "Clear Filters" pill appears above list when any filter or search is active. One tap resets all.

**Edge Cases / States:**
- No wines match filters → empty state with "No wines match these filters" + Clear Filters CTA
- Filter count badge: "Filters (3)" on the button when 3 filters active
- Swipe-to-dismiss bottom sheet on mobile; tap overlay also closes it

---

## Flow 05 — Review Collection (Dashboard)

**Flow ID:** FLW-05
**Trigger:** User opens Dashboard to review collection health, value, and composition
**User Stories:** US-5.1, US-5.2, US-5.3, US-5.4, US-5.5
**Persona:** Vivienne, Claire
**Journey:** JRN-04.2, JRN-02.2

```
[Any Screen]
    │
    ▼ Tap "Dashboard" in bottom nav
[Dashboard View — loading skeleton shown]
    │  All sections load in parallel
    │
    ▼ Data loads (≤2 seconds)
[Dashboard — All Sections Rendered]
    │
    ├── Summary Stats Panel ──▶ [Read only — no tap action]
    │    Total bottles, est. value, drink-now count,
    │    approaching count, avg price
    │
    ├── Type Breakdown ──▶ [Read only — visual bar chart]
    │    Red / White / Rosé / Sparkling / Dessert
    │
    ├── Top Regions ──▶ Tap a region
    │                       ──▶ [Collection view filtered to that region]
    │
    ├── Top Grapes ──▶ Tap a grape
    │                      ──▶ [Collection view filtered to that grape]
    │
    ├── Highest Rated ──▶ Tap a wine entry
    │                         ──▶ [Wine Detail View]
    │
    ├── Recently Added ──▶ Tap an entry
    │                          ──▶ [Wine Detail View]
    │
    └── Recently Consumed ──▶ Tap an entry
                                  ──▶ [Wine Detail View]
```

**Steps:**

1. **Entry:** Tap "Dashboard" in bottom nav. Always fetches fresh data on navigation (US-5.5).
2. **Loading state:** Skeleton placeholders for each section render immediately. No blank screen.
3. **Summary stats:** 6 key metrics in a scannable 2×3 grid.
4. **Type breakdown:** Visual horizontal bar chart (or percentage pills) showing bottle distribution across 5 wine types. Zero-count types shown as "0."
5. **Top Regions / Top Grapes:** Ranked list with bottle counts. Each row is tappable — tapping drills into Collection view pre-filtered by that region/grape (JRN-04.2 delight opportunity).
6. **Highest Rated / Recently Added / Recently Consumed:** Horizontal scroll cards or vertical mini-list (top 5 each). Tappable rows.
7. **Section failure:** If one section fails to load, it shows a card-level error "Unable to load [section]" — other sections are not affected.

**Edge Cases / States:**
- No wines in collection → empty state with "Add your first wine" CTA across all sections
- No purchase prices set → estimated value shows "Not available" (not $0)
- No rated wines → Highest Rated shows "Open a bottle and add your first tasting note"
- No consumed events → Recently Consumed shows "No bottles consumed yet"

---

## Flow 06 — Delete Wine / Undo Status Event

**Flow ID:** FLW-06
**Trigger:** User deletes a wine record or undoes an incorrectly logged status event
**User Stories:** US-0.6, US-3.4
**Persona:** Marcus

```
DELETE WINE:
[Wine Detail View]
    │
    ▼ Tap "Delete" (intentionally placed — not in thumb zone)
[Confirmation Dialog]
    │  "Delete [wine name]? This cannot be undone."
    │  [Delete]  [Cancel]
    │
    ├── Cancel ──▶ [Wine Detail — unchanged]
    └── Delete ──▶ [Wine List View]
                     Record removed from list
                     Success toast: "[Wine name] deleted"

UNDO STATUS EVENT:
[Wine Detail View — History Section]
    │
    ▼ Tap "Undo" on a specific history event
[Confirmation Dialog]
    │  "Undo this consumed/gifted event?
    │   Quantities will be restored."
    │  [Undo]  [Cancel]
    │
    ├── Cancel ──▶ [History section — unchanged]
    └── Undo ──▶  [Wine Detail — updated quantities]
                    Event removed from history
                    Toast: "Event undone. Quantity restored."
                    Note: linked tasting note NOT auto-deleted
```

**Edge Cases / States:**
- Delete fails (network error) → error toast "Delete failed — try again"; record preserved
- Undo fails → error toast "Undo failed — try again"; quantities unchanged

---

*Flow-02-filter-dinner.md — WineApp UX Mockup*
