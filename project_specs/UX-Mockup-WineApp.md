# UX Mockup — WineApp
**Project:** Personal Wine Collection Management Software
**Generated:** 2026-05-21
**Based on:** UserStories-WineApp.md, PRD-WineApp.md, FRD-WineApp.md, JOURNEYS-WineApp.md
**Version:** 1.0

---

## UX Approach & Design Principles

### Vision
WineApp must feel like a *premium personal lifestyle app* — not an inventory system. Every screen should evoke the pleasure of wine collecting: unhurried, elegant, trustworthy. Users should feel in control of something they love, not burdened by administration.

### Core UX Mandate
> Simple to use. Fast to update. Visually clean. Mobile-first. Search-driven. Personalized. Helpful without being complicated.

### Design Principles

| # | Principle | What it means in practice |
|---|-----------|---------------------------|
| P1 | **Speed first** | App load ≤3s; search results ≤500ms; form submit ≤1s. Every interaction feels instant. |
| P2 | **Thumb-zone native** | All primary actions reachable one-handed at 375px. Destructive actions intentionally placed out of thumb zone. |
| P3 | **Progressive disclosure** | Required fields first, always. Optional detail hidden behind collapsible "More Details." Never overwhelm with fields. |
| P4 | **Status at a glance** | Drinking status badges on every wine card — never force a tap-in to answer "is this ready?" |
| P5 | **Graceful trust** | Data completeness indicators; live dashboard updates; "last bottle" alerts. The app earns trust through accuracy. |
| P6 | **Reward engagement** | Quick add is fast, but full detail is celebrated. Tasting note completion, collection milestones, and dashboard value updates feel satisfying. |
| P7 | **Mobile-first, desktop-responsive** | Design target: 375px phone. Desktop is a responsive enhancement — wider forms, more fields visible at once. |

---

### Color Palette (Drinking Status)

| Status | Color | Code |
|--------|-------|------|
| Drink Now | Green | `#2D6A4F` (or similar deep green) |
| Approaching Peak | Amber | `#D97706` |
| Hold | Blue | `#2563EB` |
| Past Window | Red-Orange | `#DC2626` |
| Special Occasion | Purple | `#7C3AED` |
| No Window | Grey | `#6B7280` |

---

### Navigation Architecture

```
┌──────────────────────────────────┐
│          Bottom Nav Bar          │
│  [Collection] [Drink Now] [+Add] │
│  [Dashboard]  [Search]           │
└──────────────────────────────────┘
```

**Primary Navigation (Bottom Bar — 5 items):**
1. **Collection** — Wine list (default landing)
2. **Drink Now** — Ready to drink filtered view
3. **+ Add** — Floating action / prominent CTA (center slot)
4. **Dashboard** — Collection insights
5. **Search** — Quick access to search/filter (or persistent search bar in Collection)

> Per US-6.2: Bottom nav pinned to viewport bottom. "Add Wine" is most prominent CTA — center slot with differentiated styling. Any section reachable in ≤2 taps.

---

### Screen Inventory

| Screen ID | Screen Name | Primary User Stories |
|-----------|-------------|----------------------|
| SCR-01 | Wine List / Collection View | US-0.3, US-2.1, US-2.2, US-2.4, US-2.5 |
| SCR-02 | Add / Edit Wine Form | US-0.1, US-0.2, US-0.5, US-1.1, US-1.4, US-6.3 |
| SCR-03 | Wine Detail View | US-0.4, US-0.6, US-3.1, US-3.2, US-3.3, US-4.2, US-4.3 |
| SCR-04 | Search & Filter Panel | US-2.1, US-2.2, US-2.3, US-2.4, US-6.4 |
| SCR-05 | Ready to Drink View | US-1.3, US-1.2 |
| SCR-06 | Tasting Notes Entry | US-4.1, US-4.2, US-4.4 |
| SCR-07 | Collection Insights Dashboard | US-5.1, US-5.2, US-5.3, US-5.4, US-5.5 |

---

### Flow Inventory

| Flow ID | Flow Name | Primary Journeys |
|---------|-----------|-----------------|
| FLW-01 | Add a Wine (Quick Path) | JRN-01.1 |
| FLW-02 | Find a Bottle (Search) | JRN-01.2 |
| FLW-03 | Open a Bottle (Consume + Tasting Note) | JRN-02.1, JRN-03.2 |
| FLW-04 | Choose a Wine for Dinner (Filter + Status) | JRN-03.1 |
| FLW-05 | Review Collection (Dashboard) | JRN-04.2, JRN-02.2 |
| FLW-06 | Delete Wine / Undo Status Event | US-0.6, US-3.4 |

---

*00-overview.md — WineApp UX Mockup*
---

## Flow 01 — Add a Wine (Quick Path)

**Flow ID:** FLW-01
**Trigger:** User taps the "+" Add button from any screen
**User Stories:** US-0.1, US-0.2, US-6.3
**Persona:** Marcus (quick add), Vivienne (full detail)
**Journey:** JRN-01.1

```
[Any Screen]
    │
    ▼ Tap "+" (bottom nav center / FAB)
[Add Wine Form — Required Fields]
    │  wine_name, wine_type, quantity_owned (3 fields)
    │
    ├── Tap "More Details" ──▶ [Expanded Form — Optional Fields]
    │                              producer, vintage, region, country,
    │                              appellation, grape, bottle_size,
    │                              purchase_price, purchase_date,
    │                              purchase_source, storage_location,
    │                              drink_window_start, drink_window_end,
    │                              is_special_occasion toggle, notes
    │
    ├── Fill required only ──▶ Tap "Save Wine"
    │                              │
    │                              ├── Validation Pass ──▶ [Wine Detail View]
    │                              │                          Success toast:
    │                              │                          "Château X added!"
    │                              │
    │                              └── Validation Fail ──▶ [Form with inline errors]
    │                                                         Field-level red messages
    │                                                         Data preserved — no reset
    │
    └── Fill full detail ──▶ Tap "Save Wine"
                                 │
                                 └── Validation Pass ──▶ [Wine Detail View]
                                                            Success toast + collection
                                                            value update reflected
```

**Steps:**

1. **Entry:** User taps the "+" button (always visible, center of bottom nav bar). Navigates to Add Wine form.
2. **Required fields shown immediately:** Wine Name (text input, auto-focus), Wine Type (segmented control: Red / White / Rosé / Sparkling / Dessert), Quantity (numeric stepper, defaults to 1).
3. **Optional fields hidden:** A "More Details ▼" accordion sits below required fields. Tapping it reveals all optional fields in logical grouped sections (Provenance, Purchase, Storage, Drinking Window).
4. **Numeric keyboard triggers:** Vintage year, quantity, and purchase price fields open numeric keyboard automatically (US-6.3).
5. **Native date picker:** Purchase date triggers OS native date picker.
6. **Submit:** "Save Wine" button — full width, fixed at bottom of scroll area (always visible on mobile).
7. **Success:** Redirected to Wine Detail view for new record. Toast: "Added to your collection." New record appears at top of Wine List.
8. **Error:** Field-level inline red messages beneath each invalid field. No data lost. Focus auto-moves to first error.

**Edge Cases / States:**
- Empty form submit → inline required field errors (wine_name, wine_type)
- Drink window end < start → inline error on drink_window_end field
- Purchase date in future → inline error on purchase_date
- Network failure during submit → persistent banner "Save failed — check connection" + form preserved

---

*Flow-00-add-wine.md — WineApp UX Mockup*
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
---

## Screen 01 — Wine List / Collection View

**Screen ID:** SCR-01
**Purpose:** Default landing view. Users survey their collection, search, filter, and sort. Primary hub for collection management.
**User Stories:** US-0.3, US-2.1, US-2.2, US-2.4, US-2.5, US-6.1, US-6.2, US-6.4

---

### Layout (Mobile — 375px)

```
┌─────────────────────────────────────┐
│  ≡  My Collection          Sort ↕   │  ← Header bar: title + sort icon
├─────────────────────────────────────┤
│ 🔍 Search wines...         [Filters]│  ← Persistent search bar + Filters button
│                                     │    "Filters (2)" badge when active
├─────────────────────────────────────┤
│ [Red] [White] [Rosé] [Sparkling][All│  ← Quick-filter type chips (horizontal scroll)
├─────────────────────────────────────┤
│ 47 wines                [Clear ×]   │  ← Result count + Clear Filters pill (if active)
├─────────────────────────────────────┤
│ ┌───────────────────────────────┐   │
│ │ Château Margaux               │   │  ← Wine card
│ │ Margaux · 2016 · Red          │   │
│ │ ● Drink Now        [2 owned]  │   │  ← Status badge (green) + quantity
│ │ ★ 93                          │   │  ← Average rating (if available)
│ └───────────────────────────────┘   │
│ ┌───────────────────────────────┐   │
│ │ Barolo Cannubi                │   │
│ │ Vietti · 2018 · Red           │   │
│ │ ● Hold              [6 owned] │   │  ← Status badge (blue)
│ │ ★ Not rated                   │   │
│ └───────────────────────────────┘   │
│ ┌───────────────────────────────┐   │
│ │ Gevrey-Chambertin 1er Cru     │   │
│ │ Rossignol-Trapet · 2015 · Red │   │
│ │ ● Approaching Peak  [3 owned] │   │  ← Status badge (amber)
│ │ ★ 91                          │   │
│ └───────────────────────────────┘   │
│         [Load more...]              │  ← Infinite scroll trigger
│                                     │
│                                     │
├─────────────────────────────────────┤
│  [🍷] [⏰] [  +  ] [📊] [🔍]        │  ← Bottom nav bar (pinned)
│  List  Ready  Add  Dash  Search     │
└─────────────────────────────────────┘
```

---

### Layout (Desktop — ≥1024px)

```
┌──────────────────────────────────────────────────────────────────┐
│ WineApp Logo    [🔍 Search wines...]     [Sort ↕]  [+ Add Wine]  │
├─────────────┬────────────────────────────────────────────────────┤
│  FILTERS    │  [Red][White][Rosé][Sparkling][All]   47 wines     │
│  ─────────  │                                                    │
│  Wine Type  │  ┌──────────────────┐  ┌──────────────────┐       │
│  ○ Red   ✓  │  │ Château Margaux  │  │ Barolo Cannubi   │       │
│  ○ White    │  │ Margaux · 2016   │  │ Vietti · 2018    │       │
│  ○ Rosé     │  │ ● Drink Now  2   │  │ ● Hold       6   │       │
│  ─────────  │  │ ★ 93             │  │ ★ Not rated      │       │
│  Status     │  └──────────────────┘  └──────────────────┘       │
│  ○ Drink Now│                                                    │
│  ○ Hold     │  ┌──────────────────┐  ┌──────────────────┐       │
│  ─────────  │  │ Gevrey-Chambert. │  │ Côtes du Rhône   │       │
│  Vintage    │  │ Rossignol · 2015 │  │ Chateau Rayas... │       │
│  2010–2024  │  │ ● Appr. Peak  3  │  │ ● Past Window  1 │       │
│             │  │ ★ 91             │  │ ★ 88             │       │
│  [Clear All]│  └──────────────────┘  └──────────────────┘       │
└─────────────┴────────────────────────────────────────────────────┘
```

---

### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Wine name | Top of card, large text |
| Primary | Drinking status badge | Prominent colored badge on card |
| Primary | Quantity owned | Right-aligned quantity chip on card |
| Secondary | Producer, vintage, wine type | Second line of card, smaller text |
| Secondary | Search bar | Pinned top — always visible |
| Tertiary | Average rating | Bottom of card if rated |
| Tertiary | Sort + filter controls | Header area, accessible but not dominant |

---

### Wine Card Design

```
┌──────────────────────────────────────────────┐
│ Wine Name (truncate at ~35 chars)            │
│ Producer · Vintage · Type                    │
│ ●●● STATUS BADGE    [N owned] ← quantity chip│
│ ★ XX.X  (or "Not rated")                    │
└──────────────────────────────────────────────┘
```

**Status Badge Colors:**
- `Drink Now` → Green pill, white text
- `Approaching Peak` → Amber pill, white text
- `Hold` → Blue pill, white text
- `Past Window` → Red-Orange pill, white text
- `Special Occasion` → Purple pill, white text
- `No Window` → Grey pill, dark text

---

### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Scrollable card list, 20 items initially | "47 wines" count shown |
| Loading (initial) | Skeleton cards (3–5 grey rectangles) | No spinner — skeleton for polish |
| Loading more (scroll) | Subtle spinner at bottom of list | Infinite scroll |
| Search active | List updates in real time | "X wines found" counter |
| Filters active | Filter badge count on button; "Clear ×" pill visible | Visual confirmation filters are on |
| Empty (no wines) | Centered illustration + "Add your first wine" CTA button | Inviting, not alarming |
| Empty (no search results) | "No wines found for '[query]'" + "Clear search" button | Helpful — not a dead end |
| Error (load failed) | "Could not load collection. Tap to retry." | Inline, non-modal |

---

### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Search bar | Text input | Auto-debounce 300ms; ✕ to clear |
| Filters button | Button + badge | Opens bottom sheet filter panel |
| Type chips (Red/White/etc.) | Toggle chips | Single-select quick type filter; "All" resets |
| Sort icon (↕) | Dropdown trigger | Opens sort options sheet: 8 sort modes |
| Wine card | Tap target (min 44×44px) | Navigates to Wine Detail view |
| "Clear ×" pill | Button | Resets all active search + filters |
| "Load more" / scroll | Infinite scroll | Loads next 20 records |
| Bottom nav bar | 5-item nav | Active state highlighted; "+" center |

---

*Screen-00-wine-list.md — WineApp UX Mockup*
---

## Screen 02 — Add / Edit Wine Form

**Screen ID:** SCR-02
**Purpose:** Create a new wine record or edit an existing one. Designed for speed (≤60s for typical record) while supporting full detail capture for serious collectors.
**User Stories:** US-0.1, US-0.2, US-0.5, US-1.1, US-1.4, US-6.3

---

### Layout (Mobile — Add Wine)

```
┌─────────────────────────────────────┐
│ ←  Add Wine                         │  ← Back arrow + screen title
├─────────────────────────────────────┤
│                                     │
│  Wine Name *                        │
│  ┌───────────────────────────────┐  │  ← Required field, auto-focus on open
│  │ e.g. Château Margaux          │  │
│  └───────────────────────────────┘  │
│                                     │
│  Wine Type *                        │
│  [Red][White][Rosé][Spark][Dessert] │  ← Segmented control (required)
│                                     │
│  Quantity *                         │
│  ┌──────────┐                       │
│  │  [−] 1 [+]│                      │  ← Stepper control; numeric keyboard
│  └──────────┘                       │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │  ▼ More Details (optional)      │ │  ← Collapsible accordion (closed by default)
│ └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐│
│  │        Save Wine                ││  ← Fixed primary CTA at bottom
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

---

### Layout (Mobile — More Details Expanded)

```
┌─────────────────────────────────────┐
│ ←  Add Wine                         │
├─────────────────────────────────────┤
│  [Required fields as above...]      │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │  ▲ More Details                 │ │  ← Expanded accordion
│ └─────────────────────────────────┘ │
│                                     │
│  ── PROVENANCE ──────────────────   │
│  Producer                           │
│  ┌───────────────────────────────┐  │
│  │ Winery or producer name       │  │
│  └───────────────────────────────┘  │
│                                     │
│  Vintage Year          Bottle Size  │
│  ┌──────────┐          ┌──────────┐ │
│  │ e.g. 2018│          │ 750ml  ▼ │ │  ← Numeric keyboard; native select
│  └──────────┘          └──────────┘ │
│                                     │
│  Country               Region       │
│  ┌──────────┐          ┌──────────┐ │
│  │ France   │          │ Bordeaux │ │
│  └──────────┘          └──────────┘ │
│                                     │
│  Appellation                        │
│  ┌───────────────────────────────┐  │
│  │ e.g. Pauillac                 │  │
│  └───────────────────────────────┘  │
│                                     │
│  Grape Variety                      │
│  ┌───────────────────────────────┐  │
│  │ e.g. Cabernet Sauvignon blend │  │
│  └───────────────────────────────┘  │
│                                     │
│  ── PURCHASE ────────────────────   │
│  Purchase Price        Purchase Date│
│  ┌──────────┐          ┌──────────┐ │
│  │ £ 0.00   │          │ MM/DD/YY │ │  ← Numeric keyboard; date picker
│  └──────────┘          └──────────┘ │
│                                     │
│  Purchase Source                    │
│  ┌───────────────────────────────┐  │
│  │ e.g. Berry Bros, Vivino       │  │
│  └───────────────────────────────┘  │
│                                     │
│  ── STORAGE ─────────────────────   │
│  Storage Location                   │
│  ┌───────────────────────────────┐  │
│  │ e.g. Wine Fridge Shelf 2      │  │
│  └───────────────────────────────┘  │
│                                     │
│  ── DRINKING WINDOW ─────────────   │
│  Drink From Year       Drink Until  │
│  ┌──────────┐          ┌──────────┐ │
│  │ e.g. 2025│          │ e.g. 2035│ │  ← Numeric keyboard; free-entry years
│  └──────────┘          └──────────┘ │
│                                     │
│  Special Occasion Only              │
│  Reserve for a specific event  [🔘] │  ← Toggle (off by default)
│                                     │
│  ── NOTES ───────────────────────   │
│  Notes (optional)                   │
│  ┌───────────────────────────────┐  │
│  │                               │  │  ← Multiline text area, 2000 char max
│  └───────────────────────────────┘  │
│                                     │
│  ┌─────────────────────────────────┐│
│  │        Save Wine                ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

---

### Edit Wine — Differences

- Screen title: "Edit Wine" with wine name in subtitle
- All fields pre-populated with existing values
- "Delete Wine" option accessible from top-right menu (⋮) — intentionally not a primary button
- "Save Changes" instead of "Save Wine"

---

### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Wine Name, Wine Type, Quantity | Top of form, always visible |
| Primary | Required field indicators (*) | Adjacent to label — clear but not alarming |
| Secondary | Grouped optional fields | Collapsed accordion — opened on demand |
| Secondary | "Save Wine" button | Fixed to bottom of screen — always accessible |
| Tertiary | Field section headings (Provenance, Purchase, etc.) | Visual separators inside accordion |
| Tertiary | Placeholder text in fields | Helper text showing example values |

---

### Field Groups (inside "More Details" accordion)

| Group | Fields |
|-------|--------|
| Provenance | Producer, Vintage Year, Bottle Size, Country, Region, Appellation, Grape Variety |
| Purchase | Purchase Price, Purchase Date, Purchase Source |
| Storage | Storage Location |
| Drinking Window | Drink From Year, Drink Until Year, Special Occasion Only toggle |
| Notes | Free-text notes |

---

### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Required fields visible; accordion closed | Focus on Wine Name input |
| Accordion open | Full form visible with section dividers | Smooth expand animation |
| Validation error | Red border on field + red message below | Field-specific, inline — no page reset |
| Submitting | "Save Wine" button shows spinner + "Saving…" | Disabled during submit |
| Success | Navigate to Wine Detail | Toast: "Added to your collection" |
| Network error | Error banner at top: "Save failed — check connection" | Form state fully preserved |

---

### Inline Validation Errors (Examples)

| Field | Error Condition | Error Message |
|-------|----------------|---------------|
| wine_name | Empty / whitespace | "Wine name is required" |
| vintage_year | Outside 1800–current+2 | "Enter a year between 1800 and 2028" |
| purchase_price | Negative value | "Price must be 0 or greater" |
| purchase_date | Future date | "Purchase date cannot be in the future" |
| drink_window_end | Before start | "Drink until year must be after the start year" |
| drink_window_end | Set without start | "Set a 'Drink From' year first" |

---

### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Wine Name | Text input | Auto-focus on form open |
| Wine Type | Segmented control | Single-select; one always active |
| Quantity | Stepper (− / + ) | Numeric keyboard; min 0 |
| More Details | Accordion | Smooth expand/collapse |
| Vintage Year | Numeric text input | Numeric keyboard; 4-digit validation |
| Purchase Price | Decimal text input | Numeric keyboard with decimal |
| Purchase Date | Date input | Native OS date picker |
| Bottle Size | Select (dropdown) | Native OS select; 750ml default |
| Drink From / Until | Numeric text input | Numeric keyboard; free 4-digit year entry |
| Special Occasion | Toggle | Off by default; instantly visible in preview |
| Save Wine | Primary button | Full-width; fixed to bottom |

---

*Screen-01-add-edit-form.md — WineApp UX Mockup*
---

## Screen 03 — Wine Detail View

**Screen ID:** SCR-03
**Purpose:** Full single-record view. Users review all wine data, take actions (consume, gift, edit, delete), and read/add tasting notes and bottle history. The decision-making screen.
**User Stories:** US-0.4, US-0.5, US-0.6, US-3.1, US-3.2, US-3.3, US-3.4, US-4.2, US-4.3, US-4.4, US-4.5

---

### Layout (Mobile — Full Scroll)

```
┌─────────────────────────────────────┐
│ ←                              ⋮   │  ← Back + overflow menu (Edit / Delete)
├─────────────────────────────────────┤
│                                     │
│  Château Margaux                    │  ← Wine name (H1, large)
│  Château Margaux · 2016             │  ← Producer · Vintage (subtitle)
│                                     │
│  ●●● DRINK NOW  ██████████ 2 owned  │  ← Status badge (green) + quantity chip
│                                     │
│  ⚠ This is your last bottle        │  ← Last bottle alert (amber) — only if qty=1
│                                     │
│  ── DETAILS ─────────────────────   │
│  Type         Red                   │
│  Region       Bordeaux              │
│  Appellation  Margaux               │
│  Grape        Cabernet Sauvignon    │
│  Vintage      2016                  │
│  Bottle Size  750ml                 │
│  Storage      Wine Fridge Shelf 1   │  ← Storage prominent for easy retrieval
│                                     │
│  ── PURCHASE ────────────────────   │
│  Price        £ 185.00              │
│  Date         12 Jun 2022           │
│  Source       Berry Bros & Rudd     │
│                                     │
│  ── DRINKING WINDOW ─────────────   │
│  Window       2022 – 2038           │
│  Status       ● Drink Now           │
│  Time left    In window · 12 yrs   │  ← Computed: years remaining in window
│                                     │
│  ── QUANTITY ────────────────────   │
│  Owned        2 bottles             │
│  Consumed     1 bottle              │
│                                     │
│  ── NOTES ───────────────────────   │
│  "Purchased at auction. Exceptional │
│   vintage — save for special occ."  │
│                                     │
│  ── ACTIONS ─────────────────────   │
│  ┌─────────────────┐┌─────────────┐ │
│  │ Mark Consumed   ││ Mark Gifted │ │  ← Primary actions side-by-side
│  └─────────────────┘└─────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │      + Add Tasting Note         │ │  ← Secondary action
│  └─────────────────────────────────┘ │
│                                     │
│  ── TASTING NOTES ───────────────   │
│  ┌───────────────────────────────┐  │
│  │ 14 Mar 2024  ★ 93             │  │  ← Tasting note card (most recent first)
│  │ Occasion: Anniversary dinner  │  │
│  │ Pairing: Rack of lamb         │  │
│  │ "Excellent. Long finish…"     │  │
│  │ ↺ Would buy again: Yes        │  │
│  │                 [Edit][Delete] │  │  ← Edit / Delete — NOT in thumb zone
│  └───────────────────────────────┘  │
│  [No more tasting notes]            │
│  ─ Add your first tasting note ─   │  ← Empty state prompt
│                                     │
│  ── BOTTLE HISTORY ──────────────   │
│  ┌───────────────────────────────┐  │
│  │ 🍷 Consumed  14 Mar 2024      │  │  ← Event type + date
│  │    [Tasting note attached ✓]  │  │
│  │                        [Undo] │  │  ← Undo — intentionally to the right
│  └───────────────────────────────┘  │
│  No more history                    │
│                                     │
├─────────────────────────────────────┤
│  [🍷] [⏰] [  +  ] [📊] [🔍]        │
└─────────────────────────────────────┘
```

---

### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Wine name | H1, top of screen |
| Primary | Drinking status badge | Immediately below name — unmissable |
| Primary | Quantity owned | Paired with status badge |
| Primary | Storage location | Visible in Details section without scrolling (near top) |
| Secondary | Drinking window + time left | Drinking Window section |
| Secondary | Action buttons (Consume / Gift / Add Note) | Mid-screen action bar |
| Secondary | Tasting notes list | Scrollable section after details |
| Tertiary | Bottle history / events | Bottom of scroll — audit trail |
| Tertiary | Edit / Delete | Overflow menu (⋮) in header — intentionally not primary |

---

### "Last Bottle" Alert

```
┌──────────────────────────────────────┐
│ ⚠ This is your last bottle of       │
│   this wine.                         │
└──────────────────────────────────────┘
```
- Amber background, non-blocking
- Appears when `quantity_owned = 1`
- Disappears after consuming (quantity becomes 0)
- Per CP-06 (Last Bottle Risk pattern) from JOURNEYS

---

### Tasting Note Card (Expanded)

```
┌──────────────────────────────────────────┐
│ 14 March 2024                  ★ 93      │
│ Anniversary dinner · Rack of lamb        │
│ ─────────────────────────────────────    │
│ Appearance: Deep ruby, clear             │
│ Aroma: Dark cherry, cedar, tobacco       │
│ Flavour: Full-bodied, grippy tannins     │
│ Finish: Long, mineral                    │
│ Overall: Outstanding vintage             │
│ Guest feedback: "Best wine tonight"      │
│ ↺ Would buy again: Yes                   │
│                            [Edit][Delete]│
└──────────────────────────────────────────┘
```
- Cards collapsed by default (show date, rating, occasion, pairing, first line of notes)
- Tap to expand full detail
- Edit / Delete positioned right-aligned (not in thumb zone)

---

### Mark as Consumed — Dialog

```
┌──────────────────────────────────────┐
│ Mark as Consumed                     │
│ ─────────────────────────────────    │
│ Date consumed: [Today — 21 May 2026] │  ← Tappable date picker
│                                      │
│ ⚠ This is your last bottle.         │  ← Alert if qty=1
│                                      │
│ [ ] Add tasting note after           │  ← Checkbox, unchecked by default
│                                      │
│ [Confirm]              [Cancel]      │
└──────────────────────────────────────┘
```

---

### Mark as Gifted — Dialog

```
┌──────────────────────────────────────┐
│ Mark as Gifted                       │
│ ─────────────────────────────────    │
│ Date gifted: [Today — 21 May 2026]   │
│                                      │
│ Recipient (optional):                │
│ ┌──────────────────────────────────┐ │
│ │ e.g. Sarah & Tom                 │ │
│ └──────────────────────────────────┘ │
│                                      │
│ [Confirm]              [Cancel]      │
└──────────────────────────────────────┘
```

---

### Delete Confirmation — Dialog

```
┌──────────────────────────────────────┐
│ Delete Château Margaux?              │
│                                      │
│ This cannot be undone. All tasting   │
│ notes will also be permanently       │
│ removed.                             │
│                                      │
│ [Delete]               [Cancel]      │
│  (red)                               │
└──────────────────────────────────────┘
```
- "Delete" button is red (destructive)
- "Cancel" is the safer/left position

---

### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Full detail rendered | All sections visible on scroll |
| Loading | Skeleton card (header) + section spinners | Renders within 1 second (US-0.4) |
| Quantity = 0 | "Mark as Consumed" and "Mark as Gifted" buttons disabled | Tooltip: "No bottles remaining" |
| Quantity = 1 | Last bottle amber alert shown | Passive, non-blocking |
| No tasting notes | "No tasting notes yet" + "Add Note" shortcut | Inviting, not empty-feeling |
| No history | "No history yet" neutral message | |
| Special Occasion | Status badge shows purple "Special Occasion" | Status overrides computed window |

---

### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| ← Back | Navigation | Returns to Wine List (filter state preserved) |
| ⋮ Menu | Overflow | Opens sheet: Edit Wine / Delete Wine |
| Mark Consumed | Primary button | Opens confirmation dialog |
| Mark Gifted | Secondary button | Opens confirmation dialog |
| + Add Tasting Note | Secondary button | Navigates to Tasting Note form |
| Tasting note card | Tap to expand | Reveals all tasting note fields |
| Edit (note) | Inline button | Navigates to Tasting Note edit form |
| Delete (note) | Inline button | Confirmation dialog |
| Undo (history) | Inline button | Confirmation dialog |

---

*Screen-02-wine-detail.md — WineApp UX Mockup*
---

## Screen 04 — Search & Filter Panel

**Screen ID:** SCR-04
**Purpose:** Mobile-optimized filter bottom sheet. Allows users to narrow the collection by multiple attributes simultaneously. Also covers the sort modal.
**User Stories:** US-2.2, US-2.3, US-2.4, US-2.5, US-6.4

---

### Filter Bottom Sheet (Mobile)

```
┌─────────────────────────────────────┐
│                                     │
│  ─────────────── ●●● ───────────   │  ← Drag handle (swipe to dismiss)
│                                     │
│  Filters                  [Reset]   │  ← Reset all button (only if filters active)
│                                     │
│  ── DRINKING STATUS ─────────────   │
│  [●Drink Now][●Approach.][○Hold]   │
│  [○Past Wnd ][○Spec.Occ.][○No Wnd]│  ← Multi-select toggle pills
│                                     │
│  ── WINE TYPE ───────────────────   │
│  [●Red][●White][○Rosé][○Sparkling] │
│  [○Dessert]                         │
│                                     │
│  ── VINTAGE YEAR ────────────────   │
│  From: ┌──────┐  To: ┌──────────┐  │
│        │ 2015 │       │  2024   │  │  ← Numeric inputs; range
│        └──────┘       └──────────┘  │
│                                     │
│  ── PRICE RANGE ─────────────────   │
│  Min £: ┌──────┐ Max £: ┌───────┐  │
│         │      │         │       │  │
│         └──────┘         └───────┘  │
│                                     │
│  ── REGION ──────────────────────   │
│  ┌───────────────────────────────┐  │
│  │ e.g. Bordeaux, Burgundy       │  │  ← Text filter (partial match)
│  └───────────────────────────────┘  │
│                                     │
│  ── STORAGE LOCATION ────────────   │
│  ┌───────────────────────────────┐  │
│  │ e.g. Wine Fridge              │  │
│  └───────────────────────────────┘  │
│                                     │
│  ── MIN. RATING ─────────────────   │
│  ┌────────────────────────────┐     │
│  │ Rating ≥: [──●────────] 75 │     │  ← Slider or numeric input
│  └────────────────────────────┘     │
│                                     │
│  ─ Filters apply instantly ─        │
│                                     │
└─────────────────────────────────────┘
  [//////////////////overlay//////////]  ← Tap overlay to dismiss
```

> Filters apply **instantly** on change — no "Apply" button required.
> Bottom sheet is dismissible via swipe down or tapping the background overlay.

---

### Sort Options Sheet (Mobile)

Triggered by tapping the Sort (↕) icon in the Collection header.

```
┌─────────────────────────────────────┐
│  ──── ●●● ────                      │
│  Sort by                            │
│  ─────────────────────────────────  │
│  ● Most Recently Added (default)    │  ← Radio-style single-select
│  ○ Name A → Z                       │
│  ○ Name Z → A                       │
│  ○ Vintage: Oldest first            │
│  ○ Vintage: Newest first            │
│  ○ Highest Rated                    │
│  ○ Price: Low → High                │
│  ○ Price: High → Low                │
│  ─────────────────────────────────  │
│  [Close]                            │
└─────────────────────────────────────┘
```

---

### Filter Panel (Desktop — Left Sidebar)

On desktop (≥1024px), the filter panel becomes a persistent left sidebar instead of a bottom sheet:

```
┌──────────────────────────────────────────────────────────┐
│  FILTERS                                       [Clear All]│
│  ─────────────────────────────────────────────────────── │
│  Drinking Status                                          │
│  ☑ Drink Now  ☑ Approaching Peak  ☐ Hold                 │
│  ☐ Past Window  ☐ Special Occasion  ☐ No Window          │
│                                                           │
│  Wine Type                                                │
│  ☑ Red  ☑ White  ☐ Rosé  ☐ Sparkling  ☐ Dessert         │
│                                                           │
│  Vintage Range                                            │
│  From: [2015]  To: [2024]                                 │
│                                                           │
│  Price Range                                              │
│  Min: [£  ]  Max: [£  ]                                   │
│                                                           │
│  Region: [_____________________]                          │
│  Storage: [____________________]                          │
│  Min Rating: [──●────] 75                                 │
└──────────────────────────────────────────────────────────┘
```

---

### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Drinking Status filter | First group — most used |
| Primary | Wine Type filter | Second group |
| Secondary | Vintage range | Third group |
| Secondary | Price range, Region | Mid-sheet |
| Tertiary | Storage Location, Min Rating | Bottom of sheet |
| Support | Reset button | Top-right — available but not dominant |

---

### Filter Active States

**Filter button (in Wine List header):**
```
Default:     [Filters]
With 1 active: [Filters (1)]
With 3 active: [Filters (3)]   ← badge count
```

**In the filter sheet, active filters shown as:**
- Toggle pills: filled/colored when active, outlined when inactive
- Text inputs: filled if non-empty
- Reset button: only visible when any filter is active

---

### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Closed | Bottom sheet off-screen | Collection list fully visible |
| Opening | Sheet slides up from bottom (200ms) | Smooth animation |
| Filters active | Filled toggle pills; Reset button visible | Visual confirmation |
| Filters cleared | All pills outlined; Reset button hidden | Clean slate |
| Dismissing | Sheet slides down on swipe or overlay tap | 200ms transition |

---

### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Drag handle | Swipe target | Swipe down to dismiss |
| Overlay | Tap target | Tap to dismiss sheet |
| Status pills | Multi-select toggles | Instant filter on tap |
| Wine type pills | Multi-select toggles | Instant filter on tap |
| Vintage year inputs | Numeric inputs | Apply on blur/change |
| Price inputs | Decimal inputs | Apply on blur/change |
| Region input | Text input | Partial match; apply on 300ms debounce |
| Storage input | Text input | Partial match; apply on 300ms debounce |
| Rating slider | Range slider | Instant filter on drag |
| Reset button | Destructive-light button | Clears all filters and search |
| Sort options | Radio list | Single-select; apply on tap; auto-closes sheet |

---

*Screen-03-filter-panel.md — WineApp UX Mockup*
---

## Screen 05 — Ready to Drink View

**Screen ID:** SCR-05
**Purpose:** Dedicated view showing all wines currently within their drinking window (status = Drink Now, quantity > 0). Sorted by urgency (drink window end year ascending). The "what should I open tonight?" screen.
**User Stories:** US-1.3, US-1.2, US-6.2

---

### Layout (Mobile)

```
┌─────────────────────────────────────┐
│  Ready to Drink             ⏰ 8    │  ← Title + count badge
├─────────────────────────────────────┤
│                                     │
│  Sorted by urgency — ends soonest   │  ← Subtitle / sort indicator
│  first                              │
│                                     │
│ ┌───────────────────────────────┐   │
│ │ Gevrey-Chambertin 1er Cru     │   │
│ │ Rossignol-Trapet · 2015 · Red │   │
│ │ ● DRINK NOW      [3 owned]    │   │
│ │ Window: 2021–2027  2 yrs left │   │  ← Years remaining (urgent!)
│ │ ★ 91 · Wine Fridge Shelf 2    │   │  ← Rating + storage location
│ └───────────────────────────────┘   │
│ ┌───────────────────────────────┐   │
│ │ Château Margaux               │   │
│ │ Château Margaux · 2016 · Red  │   │
│ │ ● DRINK NOW      [2 owned]    │   │
│ │ Window: 2022–2038  12 yrs left│   │
│ │ ★ 93 · Wine Fridge Shelf 1    │   │
│ └───────────────────────────────┘   │
│ ┌───────────────────────────────┐   │
│ │ Chablis Premier Cru           │   │
│ │ Domaine Raveneau · 2019 · Wht │   │
│ │ ● DRINK NOW      [4 owned]    │   │
│ │ Window: 2023–2031  5 yrs left │   │
│ │ ★ Not rated · Kitchen rack    │   │
│ └───────────────────────────────┘   │
│                                     │
│ ────────────────────────────────    │
│  Note: Special Occasion wines       │
│  are not shown here.                │  ← Informational note (subtle)
│                                     │
├─────────────────────────────────────┤
│  [🍷] [⏰] [  +  ] [📊] [🔍]        │
└─────────────────────────────────────┘
```

---

### Ready to Drink Card — Enhanced Format

Compared to the regular Wine List card, Ready to Drink cards show additional urgency context:

```
┌───────────────────────────────────────────────┐
│ Wine Name                                      │
│ Producer · Vintage · Type                      │
│ ●●● DRINK NOW              [N owned]           │
│ Window: YYYY – YYYY    ← N yrs left / ends YYYY│  ← Time remaining
│ ★ XX.X   ·   Storage location                 │  ← Rating + storage
└───────────────────────────────────────────────┘
```

**"Years left" urgency language:**
- ≤1 year left: "Ends this year — open soon!" (amber text)
- 2–3 years left: "2–3 yrs left" (normal text)
- 4+ years left: "X yrs left" (muted text)

---

### Empty State

```
┌───────────────────────────────────────────────┐
│                                               │
│              🍷                               │
│                                               │
│       No wines are ready to drink             │
│       right now.                              │
│                                               │
│  Your wines may be too young (Hold)           │
│  or have no drinking window set.              │
│                                               │
│  ┌──────────────────────────────────────┐    │
│  │  View Full Collection                │    │
│  └──────────────────────────────────────┘    │
│                                               │
└───────────────────────────────────────────────┘
```

---

### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Wine name + green Drink Now badge | Top of card |
| Primary | Years remaining in window | Below status — urgency signal |
| Secondary | Quantity owned | Right-aligned chip |
| Secondary | Storage location | Visible without tapping — enables retrieval |
| Tertiary | Rating | Below storage |
| Support | "Special Occasion wines not shown" note | Bottom of list — one-time info |

---

### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | List of Drink Now wines sorted by urgency | Count badge in header |
| Loading | Skeleton cards | Renders within 2 seconds |
| Empty (no drink-now wines) | Empty state illustration + explanatory text | Links to full collection |
| Single result | One card shown | Normal — no special state |
| Tap card | Navigates to Wine Detail | Filter state = "Drink Now" (preserved) |

---

### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Wine card | Tap target (min 44×44px) | Opens Wine Detail view |
| "View Full Collection" (empty state) | Button | Navigates to Collection view |
| Count badge in header | Display only | Not interactive |

---

*Screen-04-ready-to-drink.md — WineApp UX Mockup*
---

## Screen 06 — Tasting Notes Entry

**Screen ID:** SCR-06
**Purpose:** Record tasting impressions after opening a bottle. Designed for two modes: post-consume quick capture (tired, at 11pm) and deliberate journal entry (serious collector). All fields except date are optional to minimize friction.
**User Stories:** US-4.1, US-4.2, US-4.4, US-6.3

---

### Layout (Mobile — Full Form)

```
┌─────────────────────────────────────┐
│ ←  Tasting Note               Skip  │  ← Back + "Skip" (when from consume flow)
│    Château Margaux · 2016           │  ← Wine name (subtitle, not editable here)
├─────────────────────────────────────┤
│                                     │
│  Date Opened *                      │
│  ┌───────────────────────────────┐  │  ← Required; pre-filled if from consume
│  │ 21 May 2026                   │  │    Native date picker
│  └───────────────────────────────┘  │
│                                     │
│  My Rating  (1–100)                 │
│  ┌──────────────────────────────┐   │
│  │     [────────●──────] 88     │   │  ← Slider + numeric display; optional
│  └──────────────────────────────┘   │
│  (or type a number: [88])           │
│                                     │
│  Would Buy Again?                   │
│  [Yes]  [Maybe]  [No]              │  ← Segmented control; optional
│                                     │
│  Food Pairing                       │
│  ┌───────────────────────────────┐  │
│  │ e.g. Rack of lamb with herbs  │  │  ← 500 char; optional
│  └───────────────────────────────┘  │
│                                     │
│  Occasion                           │
│  ┌───────────────────────────────┐  │
│  │ e.g. Anniversary dinner       │  │  ← 255 char; optional
│  └───────────────────────────────┘  │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │  ▼ Detailed Tasting Notes       │ │  ← Collapsible accordion (optional)
│ └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐│
│  │        Save Note                ││  ← Fixed primary CTA
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

---

### Layout (Mobile — Detailed Notes Expanded)

```
┌─────────────────────────────────────┐
│ ←  Tasting Note               Skip  │
├─────────────────────────────────────┤
│  [Required + rating/pairing fields] │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │  ▲ Detailed Tasting Notes       │ │
│ └─────────────────────────────────┘ │
│                                     │
│  Appearance                         │
│  ┌───────────────────────────────┐  │
│  │ e.g. Deep ruby, clear, legs   │  │  ← Multi-line text; 2000 char
│  └───────────────────────────────┘  │
│                                     │
│  Aromas                             │
│  ┌───────────────────────────────┐  │
│  │ e.g. Dark cherry, cedar...    │  │
│  └───────────────────────────────┘  │
│                                     │
│  Flavours                           │
│  ┌───────────────────────────────┐  │
│  │ e.g. Full-bodied, grippy...   │  │
│  └───────────────────────────────┘  │
│                                     │
│  Finish                             │
│  ┌───────────────────────────────┐  │
│  │ e.g. Long, mineral finish     │  │
│  └───────────────────────────────┘  │
│                                     │
│  Overall Notes                      │
│  ┌───────────────────────────────┐  │
│  │ Free-form summary notes       │  │
│  └───────────────────────────────┘  │
│                                     │
│  Guest Feedback (optional)          │
│  ┌───────────────────────────────┐  │
│  │ What did others say?          │  │  ← 1000 char
│  └───────────────────────────────┘  │
│                                     │
│  ┌─────────────────────────────────┐│
│  │        Save Note                ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

---

### Quick-Capture Mode (Post-Consume)

When reached via "Mark as Consumed → Add Tasting Note" flow (F03 path), the form enters **Quick-Capture Mode** — optimized for tired post-dinner capture:

**Differences from full form:**
- "Skip" button visible in header (dismisses note entry; returns to Wine Detail)
- Date pre-filled from consumption event (not editable in quick mode — user can expand to change)
- Rating slider and Food Pairing field are front-and-center (the two highest-value quick-capture fields)
- Would Buy Again segmented control visible immediately
- "Detailed Tasting Notes" accordion is collapsed by default (available but not pushed)

**Design rationale (JRN-03.2 insight):** Daniel at 11pm only has 2 minutes. Rating + pairing is the key data to capture. The form must feel like a quick journal entry, not homework.

---

### Edit Tasting Note

- Screen title: "Edit Tasting Note"
- All fields pre-populated with saved values
- No "Skip" button
- "Save Changes" instead of "Save Note"
- Delete option accessible via overflow menu (⋮) in header

---

### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Date Opened | Required field at top |
| Primary | Rating (1–100) | Immediately below date — key metric |
| Primary | Would Buy Again | Segmented control — quick decision |
| Secondary | Food Pairing, Occasion | Mid-form — valuable but optional |
| Tertiary | Detailed sub-fields (Appearance, Aromas, Flavours, Finish, Overall) | Collapsed accordion |
| Tertiary | Guest Feedback | Last field in expanded section |

---

### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Date pre-filled or today; all else empty | Focus on rating slider |
| Quick-capture mode | "Skip" visible; date locked | Streamlined — rating + pairing prominent |
| Validation error | Red message under date if future | "Date cannot be in the future" |
| Submitting | "Save Note" shows spinner | Disabled during submit |
| Success | Navigate to Wine Detail | New note appears at top of list |
| Network error | Error banner; form preserved | "Save failed — check connection" |

---

### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Date Opened | Date input | Native date picker; required |
| Rating slider | Slider + numeric input | 1–100 range; optional |
| Would Buy Again | Segmented control (3 options) | Optional; tap to select |
| Food Pairing | Text input | 500 char max; optional |
| Occasion | Text input | 255 char max; optional |
| Detailed Notes | Accordion | Smooth expand; all fields optional |
| Save Note | Primary button | Full-width; fixed bottom |
| Skip (quick mode) | Secondary button | Dismisses without saving; returns to detail |

---

*Screen-05-tasting-notes.md — WineApp UX Mockup*
---

## Screen 07 — Collection Insights Dashboard

**Screen ID:** SCR-07
**Purpose:** At-a-glance command center for the collection. Surfaces key metrics, composition data, and surfaced highlights. Designed to give users a satisfying reason to open the app every visit.
**User Stories:** US-5.1, US-5.2, US-5.3, US-5.4, US-5.5

---

### Layout (Mobile — Full Scroll)

```
┌─────────────────────────────────────┐
│  My Collection                      │  ← Screen title
│  Last updated: just now             │  ← Live indicator (US-5.5, CP-05)
├─────────────────────────────────────┤
│                                     │
│  ── SUMMARY ─────────────────────   │
│  ┌──────────────┐ ┌──────────────┐  │
│  │  247          │ │  £ 18,450   │  │  ← Total bottles / Est. value
│  │  Bottles      │ │  Est. Value │  │
│  └──────────────┘ └──────────────┘  │
│  ┌──────────────┐ ┌──────────────┐  │
│  │   12          │ │     8        │  │  ← Drink Now / Approaching Peak
│  │  Drink Now    │ │  Approaching │  │
│  └──────────────┘ └──────────────┘  │
│  ┌──────────────┐ ┌──────────────┐  │
│  │  £ 74.75     │ │   89         │  │  ← Avg price / Total wine records
│  │  Avg Bottle  │ │  Wines       │  │
│  └──────────────┘ └──────────────┘  │
│                                     │
│  ── COLLECTION TYPE ─────────────   │
│  Red        ████████████████  62%   │
│  White      ████████          28%   │
│  Rosé       ██                 5%   │
│  Sparkling  █                  3%   │
│  Dessert    ·                  1%   │  ← Horizontal bar chart; 0% shown as "0"
│                                     │
│  ── TOP REGIONS ─────────────────   │
│  1. Burgundy        84 bottles  →   │  ← Tappable → filters collection
│  2. Bordeaux        61 bottles  →   │
│  3. Rhône Valley    32 bottles  →   │
│  4. Tuscany         18 bottles  →   │
│  5. Champagne       15 bottles  →   │
│                                     │
│  ── TOP GRAPES ──────────────────   │
│  1. Pinot Noir      91 bottles  →   │
│  2. Cabernet Sauv.  68 bottles  →   │
│  3. Chardonnay      47 bottles  →   │
│  4. Syrah            21 bottles →   │
│  5. Sangiovese       14 bottles →   │
│                                     │
│  ── HIGHEST RATED ───────────────   │
│  ┌───────────────────────────────┐  │
│  │ Romanée-Conti DRC 2012  ★ 98 │  │  ← Tappable wine row
│  │ Pétrus 2009             ★ 97 │  │
│  │ Barolo Monfortino 2016  ★ 96 │  │
│  │ Krug Grande Cuvée       ★ 95 │  │
│  │ Sassicaia 2015          ★ 94 │  │
│  └───────────────────────────────┘  │
│                                     │
│  ── RECENTLY ADDED ──────────────   │
│  ┌───────────────────────────────┐  │
│  │ Barolo Cannubi · 2020  6 btls │  │  ← Added 2 days ago
│  │ Côte de Nuits · 2019   2 btls │  │
│  │ Riesling Spätlese · 2021 3 b  │  │
│  └───────────────────────────────┘  │
│                                     │
│  ── RECENTLY CONSUMED ───────────   │
│  ┌───────────────────────────────┐  │
│  │ Rioja Reserva  14 May  📝 ✓  │  │  ← Date + tasting note indicator
│  │ Chablis 1er    10 May  📝 ✗  │  │
│  │ Champagne Pol  06 May  📝 ✗  │  │
│  └───────────────────────────────┘  │
│                                     │
├─────────────────────────────────────┤
│  [🍷] [⏰] [  +  ] [📊] [🔍]        │
└─────────────────────────────────────┘
```

---

### Dashboard (Desktop — 2-Column)

```
┌──────────────────────────────────────────────────────────────┐
│ WineApp                         My Collection  last: just now │
├────────────────────────────┬─────────────────────────────────┤
│  SUMMARY STATS             │  COLLECTION TYPE                │
│  247 Bottles   £18,450 val │  Red     ████████████  62%      │
│  12 Drink Now  8 Approach. │  White   █████         28%      │
│  £74.75 avg    89 wines    │  Rosé    ██             5%      │
│                            │  Sparkling █             3%     │
├────────────────────────────┤  Dessert   ·             1%     │
│  TOP REGIONS               ├─────────────────────────────────┤
│  1. Burgundy     84 btls → │  TOP GRAPES                     │
│  2. Bordeaux     61 btls → │  1. Pinot Noir    91 btls →     │
│  3. Rhône Valley 32 btls → │  2. Cab. Sauv.    68 btls →     │
│  4. Tuscany      18 btls → │  3. Chardonnay    47 btls →     │
│  5. Champagne    15 btls → │  4. Syrah         21 btls →     │
│                            │  5. Sangiovese    14 btls →     │
├────────────────────────────┴─────────────────────────────────┤
│  HIGHEST RATED        RECENTLY ADDED      RECENTLY CONSUMED  │
│  DRC 2012  ★ 98 →    Barolo '20  6b →   Rioja  14 May 📝✓ →│
│  Pétrus '09 ★ 97 →   Côte Nuits  2b →   Chablis 10 May   → │
│  Monfortino ★ 96 →   Riesling    3b →   Champagne 6 May → │
└──────────────────────────────────────────────────────────────┘
```

---

### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Total bottles, Drink Now count | Summary grid — top of screen |
| Primary | Estimated collection value | Summary grid |
| Secondary | Collection type breakdown | Horizontal bars — visual scan |
| Secondary | Top Regions / Top Grapes | Ranked lists with drill-down |
| Tertiary | Highest Rated wines | Cards — reward engagement |
| Tertiary | Recently Added | Cards — shows collection growing |
| Tertiary | Recently Consumed | Cards — shows activity |

---

### Summary Stats Grid (2×3)

```
┌─────────────────┬─────────────────┐
│  247            │  £ 18,450       │
│  Bottles Owned  │  Est. Value     │
├─────────────────┼─────────────────┤
│  12             │  8              │
│  ● Drink Now    │  ≈ Approaching  │
├─────────────────┼─────────────────┤
│  £ 74.75        │  89             │
│  Avg Bottle     │  Wine Records   │
└─────────────────┴─────────────────┘
```

**Edge cases handled:**
- No purchase prices set → Est. Value shows "Not available" (never "$0")
- No wines with drinking windows → Drink Now shows "0" with footnote "Add drinking windows to your wines"
- No wines in collection → All stats show "—" with "Add your first wine" CTA

---

### Loading State (Skeleton)

```
┌─────────────────────────────────────┐
│  My Collection                      │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                  │  ← Shimmering skeleton
│  ┌──────────────┐ ┌──────────────┐  │
│  │  ▓▓▓▓▓▓      │ │  ▓▓▓▓▓▓▓▓   │  │
│  └──────────────┘ └──────────────┘  │
│  ┌──────────────────────────────┐   │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

- Skeleton renders immediately on navigation (US-5.5)
- No blank screen ever shown
- Each section renders independently as its query completes

---

### Section Failure State

If one section fails to load:

```
┌──────────────────────────────────────┐
│  ── HIGHEST RATED ─────────────────  │
│                                      │
│  ⚠ Unable to load ratings           │
│    Tap to retry                      │
│                                      │
└──────────────────────────────────────┘
```

- Other sections unaffected
- Inline retry link
- Error does not block rest of dashboard

---

### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Loading | Skeleton per section | Renders immediately on tab tap |
| Default (data loaded) | All 7 sections rendered | "Last updated: just now" |
| Empty collection | All sections show "—" or empty state | "Add your first wine" CTA |
| No purchase prices | Est. Value = "Not available" | Footnote: "Add prices to wines to see value" |
| No ratings | Highest Rated = empty state message | "Open a bottle and rate it" |
| Section error | Per-section error with retry | Others sections not blocked |

---

### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Drink Now count tile | Tappable stat | Navigates to Ready to Drink view |
| Approaching count tile | Tappable stat | Navigates to Collection filtered by Approaching Peak |
| Top Region rows | Tappable list row | Navigates to Collection filtered by that region |
| Top Grape rows | Tappable list row | Navigates to Collection filtered by that grape |
| Highest Rated wine rows | Tappable | Navigates to Wine Detail |
| Recently Added wine rows | Tappable | Navigates to Wine Detail |
| Recently Consumed rows | Tappable | Navigates to Wine Detail |
| "📝 ✗" tasting note indicator | Visual only | Shows whether tasting note exists |
| Section retry links | Button | Re-fetches that section's data |

---

*Screen-06-dashboard.md — WineApp UX Mockup*
---

## Interaction Patterns

---

### Pattern 01 — Status Badge

**When to use:** Every wine card in Wine List, Ready to Drink, Dashboard sections. Every Wine Detail view header.
**Behavior:** Color-coded pill badge showing computed drinking status. Never manually set — always computed from window dates.

```
● Drink Now          (green bg, white text)
≈ Approaching Peak   (amber bg, white text)
⏸ Hold               (blue bg, white text)
⚠ Past Window        (red-orange bg, white text)
★ Special Occasion   (purple bg, white text)
○ No Window          (grey bg, dark text)
```

**Accessibility:** Badge includes visually hidden text label — never icon-only. Aria-label: "Drinking status: Drink Now."
**Examples:** SCR-01 wine cards, SCR-02 detail header, SCR-05 ready-to-drink cards.

---

### Pattern 02 — Confirmation Dialog

**When to use:** All destructive or irreversible actions: Delete Wine, Mark Consumed, Mark Gifted, Undo Event, Delete Tasting Note.
**Behavior:** Modal overlay dialog with clear action description, consequences stated, and two buttons (confirm + cancel). Destructive button is visually distinct (red). Cancel is the safe/left option.

```
┌──────────────────────────────────────┐
│ [Action Title]                       │
│ ─────────────────────────────────    │
│ [Consequence description]            │
│ [Optional metadata / date picker]    │
│                                      │
│ [Primary Action]    [Cancel]         │
└──────────────────────────────────────┘
```

**Positioning:** Cancel button on right is acceptable on desktop; on mobile, both buttons are full-width stacked (Cancel on top = safer thumb position).
**Examples:** Delete Wine (FLW-06), Mark as Consumed (FLW-03), Undo (FLW-06).

---

### Pattern 03 — Inline Form Validation

**When to use:** All form fields in Add/Edit Wine, Tasting Note forms.
**Behavior:** Validation runs on blur (field loses focus) and on submit attempt. Errors appear as red text directly beneath the invalid field. Field border turns red. No full-page reload.

```
  Wine Name *
  ┌──────────────────────────────────┐
  │ [empty]                          │  ← Red border
  └──────────────────────────────────┘
  ⚠ Wine name is required            ← Red inline message

  Vintage Year
  ┌──────────────────────────────────┐
  │ 1799                             │  ← Red border
  └──────────────────────────────────┘
  ⚠ Enter a year between 1800–2028   ← Field-specific message
```

**Focus management:** On submit with errors, focus moves to first invalid field automatically.
**Examples:** SCR-02 (Add/Edit Form), SCR-06 (Tasting Notes).

---

### Pattern 04 — Toast Notification

**When to use:** Non-blocking success and error feedback after actions complete.
**Behavior:** Appears at top of screen (below nav bar), auto-dismisses after 3 seconds, can be tapped to dismiss early.

```
[Mobile — top of screen]
┌──────────────────────────────────────┐
│ ✓ Château Margaux added              │  ← Success (green)
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ ✓ Bottle logged · 1 consumed         │  ← Success with context
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ ✕ Save failed — check connection     │  ← Error (persistent, no auto-dismiss)
└──────────────────────────────────────┘
```

**Persistence:** Error toasts do NOT auto-dismiss — they persist until user taps ✕.
**Position:** iOS: below the status bar, above content. Android: above bottom nav.
**Examples:** After Add Wine, Mark Consumed, Delete Wine, Undo.

---

### Pattern 05 — Bottom Sheet

**When to use:** Filter panel (mobile), sort options, quick action sheets.
**Behavior:** Slides up from bottom edge. Drag handle at top. Dismissible by swiping down or tapping the overlay.

```
[Off-screen initially]
    ↑ Slide up (200ms ease-out)

┌─────────────────────────────────────┐
│  ──── ●●● ────                      │  ← Drag handle
│  [Sheet content]                    │
└─────────────────────────────────────┘
[///// darkened overlay /////]
```

- Min tap target size inside sheet: 44×44px (US-6.4)
- Sheet max height: 85vh; scrollable if taller
- Filter sheet: no "Apply" button — filters apply on change
- Sort sheet: auto-closes after selection

---

### Pattern 06 — Skeleton Loading

**When to use:** Any view that loads data from the API: Wine List, Wine Detail, Dashboard, Ready to Drink.
**Behavior:** Grey shimmering rectangles match approximate content layout. Renders immediately. Data replaces skeleton as it arrives.

```
┌───────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓            │  ← Title skeleton
│ ▓▓▓▓▓▓▓▓  ▓▓▓▓                   │  ← Subtitle skeleton
│ ▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓           │
└───────────────────────────────────┘
```

- No spinner unless loading takes >2s (then add subtle progress bar at top)
- Dashboard: each section skeletons independently
- Never show a blank white screen (US-6.5)

---

### Pattern 07 — Last Bottle Alert

**When to use:** Wine Detail view when `quantity_owned = 1`.
**Behavior:** Passive amber alert bar shown between wine name/status and details section. Non-blocking — no confirmation required. Just visible context.

```
┌──────────────────────────────────────┐
│ ⚠ This is your last bottle of       │
│   this wine.                         │
└──────────────────────────────────────┘
```

- Appears passively on page load
- Disappears after consuming (quantity becomes 0)
- Also shown inside the Mark as Consumed confirmation dialog

---

### Pattern 08 — Empty State

**When to use:** Wine List (no wines), Ready to Drink (none ready), Tasting Notes section (no notes), Bottle History (no events), Dashboard sections (no data).
**Behavior:** Centered layout with contextual illustration/icon, explanatory text, and one primary CTA.

```
┌───────────────────────────────────────┐
│                                       │
│           [contextual icon]           │
│                                       │
│      [Short explanation]              │
│      [Supportive secondary text]      │
│                                       │
│   ┌──────────────────────────────┐   │
│   │  [Primary CTA Action]        │   │
│   └──────────────────────────────┘   │
│                                       │
└───────────────────────────────────────┘
```

**Examples per context:**
- Wine List empty: "Your cellar is empty" + "Add your first wine"
- Ready to Drink empty: "No wines ready to drink" + "View full collection"
- Tasting Notes empty: "No tasting notes yet" + "Add a note"
- Dashboard — no ratings: "No ratings yet. Open a bottle and add your first tasting note."

---

### Pattern 09 — Filter Chip (Quick Type Filter)

**When to use:** Wine List view — quick type filter chips above list.
**Behavior:** Horizontal scroll row of chips. Tapping a chip activates it (filled style). Only one type active at a time. "All" chip resets type filter.

```
Default:     [All ●] [Red] [White] [Rosé] [Sparkling]
Red active:  [All] [Red ●] [White] [Rosé] [Sparkling]
```

- Active chip: filled background, white text
- Inactive chip: outlined, neutral text
- "All" chip is always first

---

### Pattern 10 — Drill-Down Navigation

**When to use:** Dashboard (Top Regions / Top Grapes rows), Dashboard stat tiles (Drink Now count, Approaching count).
**Behavior:** Tapping a dashboard element navigates to Collection view with the relevant filter pre-applied.

```
Dashboard: "1. Burgundy  84 bottles →"
    ↓ Tap
Collection view with region filter = "Burgundy" pre-applied
Filter badge shows "Filters (1)"
"Clear ×" pill visible
```

**Back behavior:** Pressing back from filtered collection returns to Dashboard (not a fresh collection load).

---

*Y0-patterns.md — WineApp UX Mockup*
---

## Responsive Considerations

---

### Breakpoints

| Breakpoint | Width | Target | Layout Mode |
|------------|-------|--------|-------------|
| Mobile | 375px – 767px | Primary design target (phone, one-handed) | Single column; bottom nav |
| Tablet | 768px – 1023px | Secondary (iPad, landscape phone) | Single column; bottom nav or top nav |
| Desktop | ≥ 1024px | Responsive enhancement (laptop, desktop browser) | Multi-column; sidebar; top nav |

---

### Mobile (375px – 767px)

**Navigation:**
- Bottom navigation bar pinned to viewport bottom (5 tabs)
- "+" Add button: center slot, visually differentiated (larger, colored)
- All tap targets ≥ 44×44px throughout

**Wine List:**
- Single column; full-width wine cards
- Search bar full-width at top
- Type filter chips: horizontal scroll row
- "Filters" button: right of search bar
- Infinite scroll (no pagination buttons)

**Add/Edit Form:**
- Single-column form fields
- Required fields at top; optional in collapsible accordion
- "Save Wine" button: full-width, fixed to bottom of scroll area
- Numeric inputs → numeric keyboard
- Date inputs → native OS date picker
- Segmented controls for Wine Type, Would Buy Again

**Wine Detail:**
- Key-value pairs stacked vertically (no tables)
- Action buttons: side-by-side full-width pair (Consume / Gift)
- Tasting note cards: full-width, expandable
- Overflow menu (⋮) for Edit/Delete (not in thumb zone)

**Filter Panel:**
- Bottom sheet modal — slides up from bottom
- Dismissible by swipe down or overlay tap
- Filter controls: large tap targets

**Dashboard:**
- Summary stats: 2×3 grid of metric tiles
- Type breakdown: horizontal bars full-width
- Top Regions / Grapes: vertical list
- Highlights sections: vertical card list

---

### Tablet (768px – 1023px)

**Navigation:**
- Bottom nav bar retained (or optionally top nav if landscape layout)
- Content area wider — form fields can be 2-column

**Wine List:**
- Cards: 2-column grid possible at 768px+
- Search + filter controls: same as mobile

**Add/Edit Form:**
- Optional: 2-column layout for side-by-side fields (Vintage + Bottle Size; Purchase Price + Date)
- Still single-scroll form; accordion retained

**Dashboard:**
- Summary stats: 3×2 grid
- Type breakdown: wider bars
- Highlights: can show 2 sections side-by-side

**Filter Panel:**
- Still bottom sheet on tablet (or right-side drawer)

---

### Desktop (≥ 1024px)

**Navigation:**
- Top navigation bar (horizontal)
- No bottom nav bar
- "Add Wine" button: top-right header CTA

**Wine List:**
- Left sidebar: persistent filter panel (no bottom sheet)
- Content: 2–3 column card grid
- Sort controls in header bar

**Add/Edit Form:**
- 2-column form layout (label | input side-by-side)
- All fields visible without accordion (or accordion retained for cleanliness)
- Wider form container with comfortable margins

```
┌─────────────────────────────────────────────────────┐
│  Wine Name                 Wine Type                 │
│  ┌─────────────────────┐  [Red][White][Rosé][...]    │
│  │                     │                             │
│  └─────────────────────┘                             │
│                                                      │
│  Producer               Vintage Year                 │
│  ┌───────────────────┐  ┌──────────┐                 │
│  │                   │  │   2018   │                 │
│  └───────────────────┘  └──────────┘                 │
└─────────────────────────────────────────────────────┘
```

**Wine Detail:**
- Two-column layout: left = wine data; right = tasting notes + history

```
┌────────────────────────┬───────────────────────────┐
│  Wine Name             │  TASTING NOTES            │
│  Producer · 2016       │  ┌─────────────────────┐  │
│                        │  │ Note 1 · 14 Mar 2024│  │
│  ● Drink Now  2 owned  │  │ ★ 93 · Anniversary  │  │
│                        │  └─────────────────────┘  │
│  Details…              │  ┌─────────────────────┐  │
│  Storage…              │  │ Note 2 · 06 Jan 2024│  │
│  Actions…              │  └─────────────────────┘  │
│                        │  BOTTLE HISTORY            │
│                        │  Event 1 · Consumed        │
└────────────────────────┴───────────────────────────┘
```

**Dashboard:**
- 3-column grid for highlights sections
- Type breakdown: horizontal bar chart
- Top Regions/Grapes: 2-column layout

**Filter Panel:**
- Left sidebar (persistent, always visible)
- No bottom sheet on desktop

---

### No Horizontal Scroll Rule

Per US-6.1: No horizontal scrolling on any core screen at any supported viewport width.

- Wine names truncate with ellipsis on narrow screens
- Tables replaced by stacked key-value pairs on mobile
- Type filter chips: horizontal scroll row is intentional and thumb-friendly (not a violation)
- Dashboard bars: truncate label text, not chart bars

---

### Touch Target Minimums (US-6.1, US-6.4)

All interactive elements must meet **44×44px minimum** on mobile:

| Element | Mobile Min Size |
|---------|----------------|
| Nav bar icons | 44px height (bar provides natural height) |
| Wine card (tap target) | Full card width × min 64px height |
| Filter chips | 36px height min, padded to 44px touch area |
| Form inputs | 44px height |
| Dialog buttons | 44px height, full-width on mobile |
| ✕ Clear / close buttons | 44×44px min |
| Tasting note Edit/Delete | 44×44px min, placed right of card |

---

*Y1-responsive.md — WineApp UX Mockup*
---

## Accessibility Notes

**Standard:** WCAG 2.1 Level AA (US-6.6)

---

### Color Contrast

All text must meet WCAG AA contrast ratios:
- **Normal text (< 18pt):** Minimum 4.5:1 ratio against background
- **Large text (≥ 18pt or 14pt bold):** Minimum 3:1 ratio
- **UI components and icons (status badges, buttons, borders):** Minimum 3:1 ratio

**Drinking Status Badge Contrast Requirements:**

| Badge | Background | Text | Ratio Target |
|-------|-----------|------|--------------|
| Drink Now | `#2D6A4F` (deep green) | White `#FFFFFF` | ≥ 4.5:1 |
| Approaching Peak | `#D97706` (amber) | White `#FFFFFF` | ≥ 4.5:1 |
| Hold | `#1D4ED8` (blue) | White `#FFFFFF` | ≥ 4.5:1 |
| Past Window | `#B91C1C` (red) | White `#FFFFFF` | ≥ 4.5:1 |
| Special Occasion | `#6D28D9` (purple) | White `#FFFFFF` | ≥ 4.5:1 |
| No Window | `#6B7280` (grey) | White `#FFFFFF` | Check — adjust if needed |

**Critical rule:** Status information must NEVER be communicated by color alone. Each badge includes a text label (e.g., "Drink Now", "Hold"). Icons may supplement but not replace text.

---

### Keyboard Navigation

All interactions must be fully operable via keyboard:

| Component | Keyboard Behavior |
|-----------|------------------|
| Bottom nav tabs | Tab to focus; Enter/Space to activate |
| Wine cards (list) | Tab between cards; Enter to open detail |
| Buttons | Tab to focus; Enter/Space to activate |
| Segmented controls (Wine Type) | Arrow keys to navigate options |
| Accordion (More Details) | Enter/Space to expand/collapse |
| Filter sheet (open) | Trap focus inside sheet while open; Escape to close |
| Confirmation dialogs | Trap focus inside dialog; Escape = Cancel; Enter on focused button |
| Sliders (Rating) | Arrow keys to adjust value |
| Date inputs | Standard keyboard date navigation |

**Focus management:**
- On form errors: focus moves to first invalid field
- On dialog open: focus moves to first interactive element inside dialog
- On dialog close: focus returns to the triggering element
- On page navigation: focus moves to main content heading

---

### Screen Reader Support (ARIA)

**Wine List:**
- Page heading: `<h1>` "My Collection"
- Wine cards: `<article>` or `role="listitem"` with descriptive label
- Status badge: `aria-label="Drinking status: Drink Now"` (not icon-only)
- Quantity chip: `aria-label="2 bottles owned"`
- Result count: `aria-live="polite"` region — announces "8 wines found" when search updates

**Forms (Add/Edit Wine):**
- All inputs have visible `<label>` elements associated via `for` / `id`
- Required fields: `aria-required="true"` on input; asterisk (*) has `title="required"` or screen-reader-only text
- Error messages: `aria-describedby` links input to its error message; `role="alert"` on error container
- Accordion section: `aria-expanded` on trigger button; `aria-controls` references expanded panel

**Dialogs:**
- `role="dialog"` with `aria-modal="true"` and `aria-labelledby` pointing to dialog title
- Focus trapped inside dialog while open

**Dashboard:**
- Section headings: proper heading hierarchy (`<h2>` for sections)
- Type breakdown bars: `role="img"` with `aria-label` describing the data (e.g., "Red wine: 62% of collection, 153 bottles")
- Tappable rows: `role="button"` or `<a>` with descriptive label (e.g., "View Burgundy wines in collection")

**Bottom Navigation:**
- `<nav>` element with `aria-label="Main navigation"`
- Active tab: `aria-current="page"` on active link

---

### Form Input Accessibility

Per US-6.6: All form inputs have visible, associated label elements.

```html
<!-- Correct pattern -->
<label for="wine_name">Wine Name <span aria-hidden="true">*</span>
  <span class="sr-only">required</span>
</label>
<input id="wine_name" name="wine_name" type="text" aria-required="true"
  aria-describedby="wine_name_error" />
<span id="wine_name_error" role="alert" class="error-message">
  Wine name is required
</span>
```

**Placeholders:** Used as examples only, never as a substitute for a label. Placeholder text disappears on type — always pair with a visible label.

---

### Error Message Accessibility

Per US-6.6: Error messages are descriptive and associated with the relevant input.

Requirements:
- Error messages use `role="alert"` or appear in an `aria-live="assertive"` region
- Message text is descriptive — not just "Invalid" but "Vintage year must be between 1800 and 2028"
- Error messages are also announced on submit (summary at top for multi-error forms)
- Error state must also be communicated by border/icon, not color alone

---

### PWA & Mobile Accessibility

Per US-6.6: App must be installable as a PWA.

**Web App Manifest requirements:**
- `name`: "WineApp"
- `short_name`: "WineApp"
- `display`: "standalone"
- `icons`: Multiple sizes (192×192, 512×512 minimum)
- `theme_color`: App primary color
- `background_color`: Splash screen background

**iOS/Android accessibility:**
- Support OS-level text size scaling — layouts must not break at 200% font size
- Support OS Dark Mode (CSS `prefers-color-scheme: dark`) — status badge colors must maintain contrast in dark mode
- Support OS Reduce Motion (`prefers-reduced-motion`) — skip animations; disable skeleton shimmer

---

### Dimly-Lit / High-Glare Environments

Per US-6.6 rationale (Claire using app in a dim cellar):

- Status badge text is large enough to read at arm's length
- Wine name uses minimum 16px font on mobile (prevents squinting)
- Light-on-dark badge design (white text on colored background) chosen for dark environment readability
- High-contrast mode considerations: app should be testable with OS high-contrast mode enabled

---

### Summary Checklist

- [ ] All text meets WCAG AA contrast (4.5:1 normal, 3:1 large)
- [ ] Status badges never communicate information by color alone (always include text)
- [ ] All form inputs have visible associated `<label>` elements
- [ ] Error messages are descriptive, inline, and linked to their fields via `aria-describedby`
- [ ] Confirmation dialogs trap focus and support Escape to cancel
- [ ] Bottom sheet traps focus and supports swipe-down or Escape to dismiss
- [ ] All tap targets ≥ 44×44px on mobile
- [ ] Screen reader announces live search results (aria-live)
- [ ] Focus managed on navigation, dialog open/close, form error
- [ ] App installable as PWA with proper manifest
- [ ] OS Dark Mode tested for all colored components
- [ ] OS Reduce Motion respected (no mandatory animations)
- [ ] Keyboard navigation complete for all primary flows

---

*Y2-accessibility.md — WineApp UX Mockup*
