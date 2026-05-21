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
