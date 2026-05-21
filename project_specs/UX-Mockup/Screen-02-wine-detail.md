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
