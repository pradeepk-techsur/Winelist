---

## F06: Mobile-First User Experience

**Priority:** P0 — Critical MVP constraint. Hard UX requirement defined by product vision.

**Description:** WineApp is designed to be used on a phone — at home, at a wine shop, at a restaurant, or while entertaining guests. Mobile-first is not a style preference; it is the primary design requirement. Every view, form, and interaction must be fully functional on a 375px-wide screen before desktop layout is considered. This feature specification defines the UX constraints, interaction patterns, and performance requirements that all other features must comply with. F06 is a cross-cutting quality requirement, not a discrete feature with its own endpoints — but it is listed as a feature to ensure its requirements are testable and tracked explicitly.

---

### Terminology

- **Mobile-First:** The primary design and development target is a phone screen (375px+); desktop is a responsive enhancement.
- **Thumb Zone:** The area of a phone screen reachable by the user's thumb in one-handed use; primary actions must land here.
- **Tap Target:** A tappable UI element (button, link, input); must be ≥ 44×44px to be finger-friendly.
- **Bottom Sheet:** A panel that slides up from the bottom of the screen — the mobile-native pattern for filter panels, action menus, and secondary forms.
- **PWA (Progressive Web App):** A web app that behaves app-like on mobile: installable, offline-capable (future phase), fast-loading.
- **Viewport Width Breakpoints:** sm ≥ 375px (phone), md ≥ 768px (tablet), lg ≥ 1024px (desktop).

---

### Sub-features

- **F06-A: Responsive Layout** — All views render correctly at 375px and above
- **F06-B: Thumb-Friendly Navigation** — Primary nav in bottom bar; key actions reachable one-handed
- **F06-C: Mobile-Optimized Forms** — Fast form completion with mobile-native input types
- **F06-D: Card-Based Wine List** — Vertical scrolling list with touch-optimized wine cards
- **F06-E: Mobile Filter Interface** — Bottom sheet or collapsible panel for search/filter controls
- **F06-F: No Horizontal Scroll** — All views fit within the viewport width
- **F06-G: Performance Budget** — Fast load times on mobile connections
- **F06-H: Accessibility Baseline** — Tap targets, contrast, labels throughout

---

### Requirements

#### F06-A: Responsive Layout
- All views are functional at viewport widths ≥ 375px.
- At 375px, no content is clipped or requires horizontal scrolling.
- Layouts stack vertically on small screens; multi-column layouts are reserved for ≥ 768px viewports.
- The Wine List, Wine Detail, Dashboard, and Add/Edit forms are all tested at 375px, 390px (iPhone 14), and 414px (iPhone Plus) widths.

#### F06-B: Thumb-Friendly Navigation
- Primary navigation (Wine List, Dashboard, Ready to Drink, Add Wine) is in a bottom navigation bar pinned to the bottom of the viewport.
- The "Add Wine" button (primary CTA) is a floating action button (FAB) or prominently placed in the bottom bar, always reachable.
- Destructive actions (Delete, Undo) are not placed in the thumb zone — they require intentional reach or confirmation.
- Navigation between sections requires ≤ 2 taps from any screen.

#### F06-C: Mobile-Optimized Forms
- The Add Wine form is completable in ≤ 60 seconds for a typical record (wine name, type, vintage, quantity).
- Required fields are marked visually and appear first in the form.
- Optional fields are grouped in a collapsible "More Details" section to reduce visual overwhelm.
- Input types use native mobile keyboards:
  - `vintage_year`, `quantity_owned`, `personal_rating` → `inputmode="numeric"` or `type="number"`
  - `purchase_date`, `date_opened` → `type="date"` (native date picker on iOS/Android)
  - `purchase_price` → `inputmode="decimal"`
  - `wine_type`, `bottle_size`, `would_buy_again` → native select or segmented control
  - All text fields → `type="text"` with autocapitalize as appropriate
- Form submission shows inline validation errors immediately (no full-page reload).
- After a successful submit, user is navigated to the Wine Detail view for the saved record.

#### F06-D: Card-Based Wine List
- The wine list uses a card-based or row-based layout with vertical scrolling.
- Each card shows: wine name, producer, vintage year, wine type, quantity owned, and drinking status badge.
- Cards are tappable (full-card tap area) with sufficient height to be finger-friendly (minimum 64px per card).
- No pagination buttons — the list uses infinite scroll or "Load more" to extend results.
- The list renders the first 20 records immediately; additional records load on scroll.

#### F06-E: Mobile Filter Interface
- Filter controls are accessed via a "Filters" button that opens a bottom sheet modal.
- The bottom sheet is dismissible by swiping down or tapping the overlay.
- Filter controls inside the sheet use large, finger-friendly input elements (minimum 44px tap targets).
- Active filter count is shown as a badge on the "Filters" button (e.g., "Filters (3)").
- The search bar remains visible in the main list view (not inside the bottom sheet).

#### F06-F: No Horizontal Scroll
- No core view produces horizontal scrolling at any viewport width ≥ 375px.
- Tables in detail views are replaced with stacked key-value pairs on small screens.
- Long text (tasting notes, wine names) wraps and does not overflow the viewport.

#### F06-G: Performance Budget
- Initial app load (first meaningful paint): ≤ 3 seconds on a 4G mobile connection.
- Wine list load (up to 500 records): ≤ 2 seconds.
- Search result update after keystroke: ≤ 500ms (with 300ms debounce).
- Add/edit form submission and confirmation: ≤ 1 second.
- Dashboard load: ≤ 2 seconds.

#### F06-H: Accessibility Baseline
- All text meets WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text).
- All form inputs have visible, associated `<label>` elements.
- Error messages are descriptive and associated with the relevant input field.
- All interactive elements have a minimum tap target of 44×44px.
- Status badges and icons include accessible text alternatives (not icon-only for critical information).

---

### Inputs

F06 defines UX constraints — no dedicated API inputs.

---

### Outputs

F06 defines UX constraints — no dedicated API outputs.

---

### Validation (UX Compliance Checklist)

The following are testable acceptance criteria for F06:

- [ ] Add Wine form completes in ≤ 60 seconds on a 375px phone screen
- [ ] No horizontal scroll at 375px on Wine List, Wine Detail, Dashboard, Add/Edit forms
- [ ] All tap targets ≥ 44×44px (verifiable with browser DevTools)
- [ ] Filter panel opens as bottom sheet on mobile
- [ ] Date fields trigger native mobile date picker
- [ ] Numeric fields trigger numeric keyboard
- [ ] Primary navigation accessible within 2 taps from any screen
- [ ] Wine list loads in ≤ 2 seconds (test collection of 500 records)
- [ ] Search updates in ≤ 500ms after keystroke
- [ ] Dashboard loads in ≤ 2 seconds

---

### Error States

| Scenario | Handling |
|----------|----------|
| App load exceeds 3s on slow connection | Show skeleton loading state; do not show blank screen |
| Form validation failure | Display inline error below the failing field; focus the first error field |
| Network error during form submit | Show persistent error banner: "Could not save. Check your connection and try again." Preserve form state. |
| No wines in collection | Wine List shows empty state illustration with "Add your first wine" CTA |

---

### API Surface (this feature)

F06 has no dedicated API endpoints. It defines client-side behavior and performance constraints.

---

### Schema Surface (this feature)

F06 has no dedicated database tables or columns.

---

*F06 — Mobile-First User Experience*
