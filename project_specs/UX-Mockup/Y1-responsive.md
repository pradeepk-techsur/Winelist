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
