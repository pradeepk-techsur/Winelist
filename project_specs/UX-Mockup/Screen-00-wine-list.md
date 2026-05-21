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
