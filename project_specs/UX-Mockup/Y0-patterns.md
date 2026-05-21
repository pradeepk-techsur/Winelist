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
