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
