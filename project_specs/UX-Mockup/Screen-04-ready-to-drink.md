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
