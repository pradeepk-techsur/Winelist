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
