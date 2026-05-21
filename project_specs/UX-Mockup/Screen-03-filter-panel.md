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
