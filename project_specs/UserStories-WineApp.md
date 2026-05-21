# User Stories
## Personal Wine Collection Management Software
**Project Acronym:** WineApp
**Version:** 1.0
**Date:** 2026-05-21
**Status:** Draft
**Based on:** PRD-WineApp v1.0, FRD-WineApp v1.0, PERSONAS-WineApp v1.0

---

## Personas Reference

| ID | Name | Role |
|----|------|------|
| PER-01 | Marcus | Casual Collector |
| PER-02 | Claire | Enthusiast |
| PER-03 | Daniel | Home Entertainer |
| PER-04 | Vivienne | Serious Collector |

---

## Priority Definitions

| Priority | Label | Description |
|----------|-------|-------------|
| P0 | Critical | Blocking MVP delivery — app cannot function without this |
| P1 | High | High value, ships in MVP but does not block minimum usability |
| P2 | Medium | Important but deferrable to a follow-up sprint |
| P3 | Low | Nice-to-have; deferred to a later phase |

---

## Epic 0: Wine Inventory Management (F0)

*The foundational feature. Users must be able to add, view, edit, and delete wine records. All other features depend on accurate inventory.*

---

### US-0.1: Add a New Wine to the Collection
**As a** Marcus (Casual Collector), **I want to** quickly add a new bottle I just purchased by filling out a simple form, **so that** my collection is always up to date without spending more than a minute on data entry.

**Acceptance Criteria:**
- [ ] "Add Wine" button is accessible from the main navigation in one tap
- [ ] Form presents required fields (wine name, wine type, quantity) prominently at the top
- [ ] Optional fields are grouped in a collapsible "More Details" section
- [ ] Form can be submitted successfully with only the three required fields populated
- [ ] On successful submission, the user is redirected to the Wine Detail view for the new record
- [ ] A new record appears at the top of the Wine List sorted by most recently added
- [ ] Form submission completes within 1 second

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.2: Add a Wine with Full Detail
**As a** Vivienne (Serious Collector), **I want to** record complete provenance and purchase information when adding a wine, **so that** every bottle in my collection has a full audit trail including storage location, purchase price, and drinking window.

**Acceptance Criteria:**
- [ ] Form accepts all optional fields: producer, vintage year, country, region, appellation, grape variety, bottle size, purchase price, purchase date, purchase source, storage location, freeform notes, drinking window start/end, and special occasion flag
- [ ] Vintage year validates as a 4-digit integer between 1800 and current year + 2
- [ ] Purchase price accepts a non-negative decimal with up to 2 decimal places
- [ ] Purchase date rejects future dates with a descriptive inline error
- [ ] Drink window end validates as ≥ drink window start; provides inline error if violated
- [ ] All optional fields can be left blank without causing validation errors

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.3: View the Complete Wine List
**As a** Marcus (Casual Collector), **I want to** see all my wines in a single scrollable list showing key information at a glance, **so that** I can quickly survey my collection without opening individual records.

**Acceptance Criteria:**
- [ ] Wine list is the default landing view after login
- [ ] Each wine card displays: wine name, producer, vintage year, wine type, quantity owned, and drinking status badge
- [ ] List is sorted by most recently added by default
- [ ] List loads within 2 seconds for collections up to 500 bottles
- [ ] List uses infinite scroll or "Load more" — no pagination buttons
- [ ] First 20 records render immediately; additional records load on scroll
- [ ] Empty state shows an illustration and "Add your first wine" CTA when no records exist

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.4: View a Wine's Full Detail
**As a** Claire (Enthusiast), **I want to** tap a wine in the list to see all its recorded details on a single screen, **so that** I can review provenance, drinking window, and past tasting notes before deciding whether to open it.

**Acceptance Criteria:**
- [ ] Tapping any wine card opens the Wine Detail view
- [ ] Detail view displays all stored fields including all optional fields that have values
- [ ] Detail view displays the computed drinking status prominently
- [ ] Detail view shows all associated tasting notes in a dedicated section, sorted most recent first
- [ ] Detail view includes action buttons: Edit, Delete, Mark as Consumed, Mark as Gifted
- [ ] Detail view fetches and renders within 1 second

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.5: Edit an Existing Wine Record
**As a** Vivienne (Serious Collector), **I want to** update any field of a wine record, **so that** I can correct mistakes, add missing details after the fact, or update quantity when I purchase additional bottles.

**Acceptance Criteria:**
- [ ] Edit button is accessible from the Wine Detail view
- [ ] Edit form opens pre-populated with all current field values
- [ ] User can modify any field and re-submit
- [ ] Validation rules are identical to the add form
- [ ] On successful edit, user is redirected to the updated Wine Detail view
- [ ] `updated_at` timestamp is refreshed on each successful edit
- [ ] If validation fails, the form is returned with field-level error messages; existing data is not lost

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.6: Delete a Wine Record
**As a** Marcus (Casual Collector), **I want to** remove a wine record I no longer need, **so that** my collection list stays clean and accurate.

**Acceptance Criteria:**
- [ ] Delete button is accessible from the Wine Detail view
- [ ] Tapping Delete shows a confirmation dialog: "Delete [wine name]? This cannot be undone."
- [ ] User must explicitly confirm before the record is deleted
- [ ] Cancelling the dialog takes no action; the record is unchanged
- [ ] On confirmed deletion, the record and all its tasting notes are permanently removed
- [ ] User is navigated back to the Wine List view after deletion
- [ ] The deleted record no longer appears in the Wine List

**Priority:** P0 | **Feature Ref:** F0

---

## Epic 1: Drinking Window Tracking (F1)

*Automatically computes whether each wine is ready to drink, hold, approaching peak, or past its window — solving the most common and costly collector problem.*

---

### US-1.1: Define a Drinking Window for a Wine
**As a** Claire (Enthusiast), **I want to** set a start year and end year for when a wine is best to drink, **so that** the app can automatically tell me its current readiness without manual calculations.

**Acceptance Criteria:**
- [ ] Drinking window start year and end year fields are available on the Add and Edit wine forms
- [ ] Both fields are optional — a record can be saved without a drinking window
- [ ] A wine may have only a start year defined (open-ended window)
- [ ] If end year is provided without a start year, the system returns a descriptive validation error
- [ ] If end year is before start year, the system returns a descriptive inline error
- [ ] Saved window values are visible in the Wine Detail view

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.2: See Automatically Computed Drinking Status
**As a** Daniel (Home Entertainer), **I want to** see a clear readiness label on every wine — "Drink Now," "Hold," "Approaching Peak," or "Past Window" — **so that** I know instantly which bottles are suitable to open tonight without manually checking dates.

**Acceptance Criteria:**
- [ ] Every wine card in the list displays a color-coded drinking status badge
- [ ] Status is computed dynamically from today's date vs. the defined drinking window — never manually set
- [ ] Status values and colors: Drink Now (green), Approaching Peak (amber), Hold (blue), Past Window (red/orange), Special Occasion (purple), No Window (grey)
- [ ] Approaching Peak = within 2 years before the window start year
- [ ] Past Window = current year is after the end year
- [ ] Wines with no window defined display a neutral "No Window" grey badge
- [ ] Status updates automatically on each page load without requiring user action

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.3: View the "Ready to Drink" List
**As a** Claire (Enthusiast), **I want to** see a dedicated list of all wines currently in their drinking window, **so that** I can quickly identify what should be opened soon without filtering the full collection.

**Acceptance Criteria:**
- [ ] "Ready to Drink" section is accessible from the main navigation in one tap
- [ ] List shows all wines where drinking status is "Drink Now" AND quantity owned > 0
- [ ] List is sorted by drink window end year ascending — most urgent wines first
- [ ] Wine cards use the same format as the main Wine List
- [ ] If no wines are currently drink-ready, the view shows an appropriate empty state message
- [ ] Count of drink-now wines is visible on the dashboard summary (see F5)

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.4: Flag a Wine as Special Occasion Only
**As a** Vivienne (Serious Collector), **I want to** mark specific high-value bottles as "Special Occasion Only," **so that** they are set aside and excluded from my regular drink-now list regardless of their drinking window dates.

**Acceptance Criteria:**
- [ ] A "Special Occasion Only" toggle is available on the Add and Edit wine form
- [ ] When enabled, the wine's drinking status is displayed as "Special Occasion" (purple badge) regardless of the window dates
- [ ] Special Occasion wines do not appear in the "Ready to Drink" list
- [ ] User can unset the flag at any time to restore the computed status
- [ ] The flag setting is preserved across edits to other fields

**Priority:** P0 | **Feature Ref:** F1

---

## Epic 2: Search and Filter (F2)

*Fast, flexible search and filtering so users can find the right bottle in seconds — at home, in a shop, or while planning a menu.*

---

### US-2.1: Search for a Wine by Name, Producer, or Region
**As a** Marcus (Casual Collector), **I want to** type a wine name, producer, or region into a search bar and see results instantly, **so that** I can check whether I already own a specific wine while standing in a wine shop.

**Acceptance Criteria:**
- [ ] A search bar is persistently visible at the top of the Wine List view
- [ ] Search queries against wine name, producer, region, and notes fields simultaneously
- [ ] Search is case-insensitive and matches partial strings
- [ ] Results update in real time as the user types, debounced to trigger after 300ms of inactivity
- [ ] Result count is displayed (e.g., "8 wines found")
- [ ] If no results match, the view displays "No wines found" with a suggestion to clear filters
- [ ] Search results update within 500ms of the user's keystroke

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.2: Filter Collection by Wine Type and Attributes
**As a** Daniel (Home Entertainer), **I want to** filter my collection by wine type (red, white, rosé), region, and vintage year, **so that** I can quickly narrow to wines suitable for a specific meal I'm preparing.

**Acceptance Criteria:**
- [ ] A "Filters" button opens a bottom sheet panel on mobile
- [ ] Filter panel offers: wine type (multi-select), producer, country, region, vintage year range, grape variety, storage location, drinking status, price range, minimum personal rating
- [ ] Multiple filters can be active simultaneously; results satisfy ALL active filters (AND logic)
- [ ] Filters apply immediately when changed — no separate "Apply" button required
- [ ] Active filter count is shown as a badge on the "Filters" button (e.g., "Filters (3)")
- [ ] Bottom sheet is dismissible by swiping down or tapping the overlay

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.3: Filter by Drinking Status
**As a** Claire (Enthusiast), **I want to** filter my collection to show only wines with a specific drinking status (e.g., "Approaching Peak"), **so that** I can identify bottles that need attention soon and plan my upcoming openings.

**Acceptance Criteria:**
- [ ] Drinking status is available as a multi-select filter in the filter panel
- [ ] Selecting "Approaching Peak" shows only wines within 2 years of their window start
- [ ] Multiple drinking status values can be combined (e.g., "Drink Now" + "Approaching Peak")
- [ ] Filtered results correctly reflect the computed status for today's date
- [ ] Filter state persists when navigating to a wine detail and returning to the list

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.4: Clear All Active Filters
**As a** Marcus (Casual Collector), **I want to** reset all active filters and search terms in one tap, **so that** I can return to seeing my full collection without manually undoing each filter.

**Acceptance Criteria:**
- [ ] A "Clear Filters" or "Reset" button is visible whenever any filters or search query are active
- [ ] Tapping it resets all filter values to defaults and clears the search query
- [ ] The full wine list is shown immediately after clearing
- [ ] Filter state is also cleared when the user navigates away to a different main section (Dashboard, Ready to Drink)

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.5: Sort the Collection
**As a** Vivienne (Serious Collector), **I want to** sort my wine list by name, vintage year, personal rating, or price, **so that** I can review the collection in a meaningful order for purchase planning and cellar reviews.

**Acceptance Criteria:**
- [ ] Sort options are accessible from the Wine List view
- [ ] Available sort options: Most Recently Added (default), Name A→Z, Name Z→A, Vintage Oldest→Newest, Vintage Newest→Oldest, Highest Rated, Price Low→High, Price High→Low
- [ ] Selected sort order is applied immediately without page reload
- [ ] Sort state persists while the user browses the sorted list

**Priority:** P0 | **Feature Ref:** F2

---

## Epic 3: Bottle Status Tracking (F3)

*Closes the lifecycle loop. Users update bottle status as they consume or gift bottles, keeping inventory accurate and building a history of what was drunk and when.*

---

### US-3.1: Mark a Bottle as Consumed
**As a** Marcus (Casual Collector), **I want to** mark a bottle as consumed after I open it, **so that** my quantity count stays accurate and I never reach for a bottle I've already finished.

**Acceptance Criteria:**
- [ ] "Mark as Consumed" action is accessible from the Wine Detail view
- [ ] A confirmation dialog appears with date consumed defaulting to today (user can change)
- [ ] Dialog offers an optional shortcut: "Add Tasting Note" (navigates to tasting note form if selected)
- [ ] On confirmation, quantity owned decrements by 1 and quantity consumed increments by 1
- [ ] The system rejects the action if quantity owned is already 0, with message "No bottles remaining"
- [ ] Event date cannot be set to a future date
- [ ] Updated quantities are reflected in the Wine Detail view immediately after confirmation

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.2: Mark a Bottle as Gifted
**As a** Daniel (Home Entertainer), **I want to** record when I give a bottle as a gift, **so that** my inventory stays accurate and I have a record of which wines I've shared with others.

**Acceptance Criteria:**
- [ ] "Mark as Gifted" action is accessible from the Wine Detail view
- [ ] A confirmation dialog appears with date gifted defaulting to today and an optional recipient name field
- [ ] On confirmation, quantity owned decrements by 1; quantity consumed does NOT increment
- [ ] A gifted event is recorded in the bottle history with event type "gifted"
- [ ] The system rejects the action if quantity owned is already 0
- [ ] Event date cannot be set to a future date

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.3: View Bottle History for a Wine
**As a** Vivienne (Serious Collector), **I want to** see a chronological history of all consumed and gifted events for a specific wine, **so that** I have a complete record of how and when bottles from a purchase have been used.

**Acceptance Criteria:**
- [ ] A "History" section on the Wine Detail view shows all status events for that wine
- [ ] Each event displays: type (consumed/gifted), date, and any metadata (recipient name, linked tasting note indicator)
- [ ] Events are sorted by date descending (most recent first)
- [ ] If no events exist yet, the section shows a neutral "No history yet" state
- [ ] History loads as part of the Wine Detail view without a separate navigation step

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.4: Undo an Incorrectly Logged Status Event
**As a** Marcus (Casual Collector), **I want to** reverse a consumed or gifted event I logged by mistake, **so that** my quantity counts and history remain accurate.

**Acceptance Criteria:**
- [ ] An "Undo" option is available on each event in the bottle history section
- [ ] Tapping Undo shows a confirmation: "Undo this [consumed/gifted] event? Quantities will be restored."
- [ ] On confirmation, the event record is deleted and quantity owned is incremented by 1
- [ ] If the event was "consumed," quantity consumed is also decremented by 1
- [ ] Any linked tasting note is NOT automatically deleted — user must delete it separately
- [ ] Quantity counts in the Wine Detail view update immediately after the undo

**Priority:** P0 | **Feature Ref:** F3

---

## Epic 4: Tasting Notes and Personal Ratings (F4)

*Builds a personal wine journal. After opening a bottle, users record impressions and ratings that inform future buying and drinking decisions.*

---

### US-4.1: Record a Tasting Note When Opening a Bottle
**As a** Claire (Enthusiast), **I want to** immediately log my tasting impressions right after marking a bottle as consumed, **so that** my memory of the wine is captured while it is fresh.

**Acceptance Criteria:**
- [ ] After tapping "Mark as Consumed," a shortcut "Add Tasting Note" option is presented
- [ ] Selecting it navigates to the tasting note form with date opened pre-filled from the consumption event
- [ ] Form includes: personal rating (1–100), appearance notes, aroma notes, flavor notes, finish notes, overall notes, food pairing, occasion, would-buy-again (yes/no/maybe), and guest feedback
- [ ] All fields except date opened are optional — form can be submitted with only the date
- [ ] On successful save, the user is returned to the Wine Detail view showing the new note
- [ ] The new tasting note is immediately visible in the wine's tasting notes section

**Priority:** P1 | **Feature Ref:** F4

---

### US-4.2: Add a Tasting Note Independently
**As a** Vivienne (Serious Collector), **I want to** add a tasting note to a wine at any time — not only when marking a bottle as consumed — **so that** I can record notes for older events or update my impressions after reflection.

**Acceptance Criteria:**
- [ ] An "Add Tasting Note" button is available on the Wine Detail view at any time
- [ ] The tasting note form opens with date opened defaulting to today; user can change it
- [ ] The note is not required to be linked to a specific consumption event
- [ ] Multiple tasting notes can exist for the same wine across different dates
- [ ] Date opened cannot be set to a future date

**Priority:** P1 | **Feature Ref:** F4

---

### US-4.3: View All Tasting Notes for a Wine
**As a** Daniel (Home Entertainer), **I want to** review past tasting notes and food pairings for a wine before opening another bottle, **so that** I can confidently describe the wine to guests and repeat successful pairings.

**Acceptance Criteria:**
- [ ] All tasting notes for a wine are displayed in the Wine Detail view under a "Tasting Notes" section
- [ ] Notes are sorted by date opened descending (most recent first)
- [ ] Each note shows: date, personal rating, occasion, food pairing, would-buy-again flag, and a preview of the tasting text
- [ ] User can tap a note to expand it and see all fields
- [ ] If no tasting notes exist, the section shows "No tasting notes yet" with an "Add Note" shortcut

**Priority:** P1 | **Feature Ref:** F4

---

### US-4.4: Edit or Delete a Tasting Note
**As a** Claire (Enthusiast), **I want to** correct or remove a tasting note I recorded incorrectly, **so that** my wine journal remains accurate and trustworthy.

**Acceptance Criteria:**
- [ ] Each tasting note in the detail view has "Edit" and "Delete" options
- [ ] Tapping Edit opens the tasting note form pre-populated with existing values
- [ ] User can modify any field and re-save; the note's `updated_at` timestamp is refreshed
- [ ] Tapping Delete shows a confirmation dialog before permanently removing the note
- [ ] After deletion, the average rating displayed for the wine is recalculated
- [ ] Deleting a tasting note does NOT undo the associated bottle status event

**Priority:** P1 | **Feature Ref:** F4

---

### US-4.5: See Average Rating and Would-Buy-Again Status
**As a** Vivienne (Serious Collector), **I want to** see a wine's average personal rating computed across all my tasting notes, **so that** I can compare wines at a glance and make more confident repurchase decisions.

**Acceptance Criteria:**
- [ ] Average rating is computed as the mean of all personal_rating values across a wine's tasting notes
- [ ] Average rating is displayed on the wine card in the list view and on the Wine Detail view
- [ ] If only one tasting note with a rating exists, it is displayed as the rating (no average needed)
- [ ] If no tasting notes have a rating, the wine displays "Not yet rated" — not "0"
- [ ] Average rating rounds to 1 decimal place
- [ ] The most recent would-buy-again flag is visible on the wine detail view

**Priority:** P1 | **Feature Ref:** F4

---

## Epic 5: Collection Insights Dashboard (F5)

*An at-a-glance command center giving users a live overview of their collection's size, value, readiness, and composition.*

---

### US-5.1: View Collection Summary Stats
**As a** Marcus (Casual Collector), **I want to** see at a glance how many bottles I own and roughly what my collection is worth, **so that** I have a satisfying and motivating overview of my cellar without digging through individual records.

**Acceptance Criteria:**
- [ ] Dashboard is accessible from the main navigation in one tap
- [ ] Summary panel displays: total bottles owned, total wine records, estimated total collection value, wines ready to drink count, wines approaching maturity count, and average purchase price
- [ ] Estimated value = sum of (purchase price × quantity owned) for all wines with a price set
- [ ] If no wines have a purchase price, estimated value and average price show "Not available" — not "$0"
- [ ] Ready to drink and approaching maturity counts are based on live computed drinking status
- [ ] All metrics reflect current data — no manual refresh required

**Priority:** P1 | **Feature Ref:** F5

---

### US-5.2: View Collection Composition Breakdown
**As a** Vivienne (Serious Collector), **I want to** see how my collection is distributed across wine types, regions, and grape varieties, **so that** I can identify imbalances and make more intentional purchases to fill gaps.

**Acceptance Criteria:**
- [ ] Dashboard displays a type breakdown: bottle count per wine type (red, white, rosé, sparkling, dessert)
- [ ] All five wine types are shown — zero-count types display as "0" rather than being hidden
- [ ] Dashboard displays top 5 regions by bottle count (SUM of quantity owned grouped by region)
- [ ] Dashboard displays top 5 grape varieties by bottle count
- [ ] Wines without a region or grape variety set are excluded from those breakdowns
- [ ] If fewer than 5 distinct regions/grapes exist, only the available entries are shown

**Priority:** P1 | **Feature Ref:** F5

---

### US-5.3: See Highest-Rated and Recently Added Wines
**As a** Claire (Enthusiast), **I want to** see my highest-rated wines and recently added bottles on the dashboard, **so that** the app surfaces useful information every time I open it and gives me a reason to return.

**Acceptance Criteria:**
- [ ] Dashboard "Highest Rated" section shows top 5 wines by average personal rating
- [ ] Each entry shows: wine name, producer, vintage year, average rating
- [ ] Only wines with at least one tasting note rating are included
- [ ] If no wines are rated yet, the section shows: "No ratings yet. Open a bottle and add your first tasting note."
- [ ] Dashboard "Recently Added" section shows last 5 wines added, sorted by created_at descending
- [ ] Each recently added entry shows: wine name, producer, vintage year, date added, quantity owned

**Priority:** P1 | **Feature Ref:** F5

---

### US-5.4: See Recently Consumed Wines
**As a** Daniel (Home Entertainer), **I want to** see the last few bottles I've opened on the dashboard, **so that** I can quickly recall recent decisions and notice if I've been drinking from a particular wine too fast.

**Acceptance Criteria:**
- [ ] Dashboard "Recently Consumed" section shows last 5 consumed bottle events, sorted by event date descending
- [ ] Each entry shows: wine name, date consumed, and whether a tasting note exists (yes/no indicator)
- [ ] Tapping a recently consumed entry navigates to that wine's detail view
- [ ] If no bottles have been consumed yet, the section shows a neutral empty state

**Priority:** P1 | **Feature Ref:** F5

---

### US-5.5: Dashboard Loads Fresh Data Every Visit
**As a** Vivienne (Serious Collector), **I want to** see up-to-date collection data every time I open the dashboard, **so that** the numbers I rely on for purchase decisions always reflect my actual cellar state.

**Acceptance Criteria:**
- [ ] Dashboard queries are executed fresh every time the user navigates to the Dashboard view
- [ ] No manual "Refresh" button is required — navigation to the view triggers a fresh load
- [ ] Dashboard shows a loading skeleton or spinner while queries execute
- [ ] If an individual section fails to load, it shows a graceful error message without blocking other sections
- [ ] Dashboard fully loads within 2 seconds

**Priority:** P1 | **Feature Ref:** F5

---

## Epic 6: Mobile-First User Experience (F6)

*The app is designed to be used on a phone. Every interaction must be fully functional and effortless at 375px width before desktop layouts are considered.*

---

### US-6.1: Use the App Comfortably on a Phone
**As a** Marcus (Casual Collector), **I want to** use the app one-handed on my phone, **so that** I can check my collection or add a new bottle quickly while standing in a wine shop without needing to be at a desk.

**Acceptance Criteria:**
- [ ] All views are fully functional and visually clean on screens 375px wide and above
- [ ] No horizontal scrolling occurs on any core screen at any supported viewport width
- [ ] All tap targets are a minimum of 44×44px throughout
- [ ] Long wine names and tasting notes wrap within the viewport rather than overflowing
- [ ] Tables in detail views are replaced with stacked key-value pairs on small screens

**Priority:** P0 | **Feature Ref:** F6

---

### US-6.2: Navigate the App Using a Thumb-Friendly Bottom Bar
**As a** Daniel (Home Entertainer), **I want to** reach every primary section of the app without stretching my thumb, **so that** I can navigate quickly while standing in the kitchen with one hand occupied.

**Acceptance Criteria:**
- [ ] Primary navigation (Wine List, Dashboard, Ready to Drink, Add Wine) is in a bottom navigation bar pinned to the viewport bottom
- [ ] The "Add Wine" action is the most prominent CTA — a floating action button or a primary slot in the bottom bar
- [ ] Any primary section is reachable within 2 taps from any screen
- [ ] Destructive actions (Delete, Undo) are NOT in the thumb zone — they require intentional reach or a confirmation dialog

**Priority:** P0 | **Feature Ref:** F6

---

### US-6.3: Add a Wine in Under 60 Seconds
**As a** Daniel (Home Entertainer), **I want to** complete the add-wine form quickly on my phone, **so that** data entry never feels like a burden that interrupts the flow of a dinner party.

**Acceptance Criteria:**
- [ ] The Add Wine form is completable in ≤ 60 seconds for a typical record on a 375px screen
- [ ] Required fields are visually marked and appear first in the form
- [ ] Optional fields are grouped in a collapsible "More Details" section to reduce visual overwhelm
- [ ] Vintage year, quantity, and personal rating fields trigger a numeric keyboard
- [ ] Purchase date and date opened fields trigger the native mobile date picker
- [ ] Wine type, bottle size, and would-buy-again use native select or segmented controls
- [ ] Form submission shows inline validation errors immediately without a full page reload
- [ ] After a successful submit, user is navigated to the Wine Detail view for the saved record

**Priority:** P0 | **Feature Ref:** F6

---

### US-6.4: Access Filters via a Mobile-Friendly Panel
**As a** Claire (Enthusiast), **I want to** open a finger-friendly filter panel from the bottom of my screen, **so that** I can narrow my collection with large, easy-to-tap controls while holding my phone.

**Acceptance Criteria:**
- [ ] The filter panel opens as a bottom sheet modal on mobile — sliding up from the bottom
- [ ] Bottom sheet is dismissible by swiping down or tapping the background overlay
- [ ] All filter controls inside the sheet have minimum 44px tap targets
- [ ] The search bar remains visible in the main list view — it is not inside the bottom sheet
- [ ] Active filter count is shown as a badge on the "Filters" button

**Priority:** P0 | **Feature Ref:** F6

---

### US-6.5: Experience Fast Load Times on a Mobile Connection
**As a** Marcus (Casual Collector), **I want to** open the app and see my wine list within 3 seconds even on a typical mobile connection, **so that** the app feels responsive and I'm not waiting around when I need a quick answer at a shop.

**Acceptance Criteria:**
- [ ] Initial app load (first meaningful paint) completes in ≤ 3 seconds on a 4G mobile connection
- [ ] Wine list load for up to 500 bottles completes in ≤ 2 seconds
- [ ] Search results update within 500ms after user keystroke (with 300ms debounce)
- [ ] Add/edit form submission and confirmation completes in ≤ 1 second
- [ ] Dashboard fully loads within 2 seconds
- [ ] On slow connection, app shows a skeleton loading state — never a blank screen
- [ ] Network errors during form submit show a persistent banner and preserve all form state

**Priority:** P0 | **Feature Ref:** F6

---

### US-6.6: Experience Accessible, Readable Interface
**As a** Claire (Enthusiast), **I want to** read wine names, status badges, and tasting notes clearly in any lighting condition, **so that** the app is just as usable in a dimly lit cellar or restaurant as it is in bright daylight.

**Acceptance Criteria:**
- [ ] All text meets WCAG AA contrast ratio: 4.5:1 for normal text, 3:1 for large text
- [ ] All form inputs have visible, associated label elements
- [ ] Error messages are descriptive and associated with the relevant input field
- [ ] Status badges and icons include accessible text alternatives — critical information is never icon-only
- [ ] The app is installable as a PWA with a proper web app manifest (name, icons, display: standalone)

**Priority:** P0 | **Feature Ref:** F6

---

## Story Index

| Story ID | Title | Persona | Priority | Feature |
|----------|-------|---------|----------|---------|
| US-0.1 | Add a New Wine to the Collection | Marcus | P0 | F0 |
| US-0.2 | Add a Wine with Full Detail | Vivienne | P0 | F0 |
| US-0.3 | View the Complete Wine List | Marcus | P0 | F0 |
| US-0.4 | View a Wine's Full Detail | Claire | P0 | F0 |
| US-0.5 | Edit an Existing Wine Record | Vivienne | P0 | F0 |
| US-0.6 | Delete a Wine Record | Marcus | P0 | F0 |
| US-1.1 | Define a Drinking Window for a Wine | Claire | P0 | F1 |
| US-1.2 | See Automatically Computed Drinking Status | Daniel | P0 | F1 |
| US-1.3 | View the "Ready to Drink" List | Claire | P0 | F1 |
| US-1.4 | Flag a Wine as Special Occasion Only | Vivienne | P0 | F1 |
| US-2.1 | Search for a Wine by Name, Producer, or Region | Marcus | P0 | F2 |
| US-2.2 | Filter Collection by Wine Type and Attributes | Daniel | P0 | F2 |
| US-2.3 | Filter by Drinking Status | Claire | P0 | F2 |
| US-2.4 | Clear All Active Filters | Marcus | P0 | F2 |
| US-2.5 | Sort the Collection | Vivienne | P0 | F2 |
| US-3.1 | Mark a Bottle as Consumed | Marcus | P0 | F3 |
| US-3.2 | Mark a Bottle as Gifted | Daniel | P0 | F3 |
| US-3.3 | View Bottle History for a Wine | Vivienne | P0 | F3 |
| US-3.4 | Undo an Incorrectly Logged Status Event | Marcus | P0 | F3 |
| US-4.1 | Record a Tasting Note When Opening a Bottle | Claire | P1 | F4 |
| US-4.2 | Add a Tasting Note Independently | Vivienne | P1 | F4 |
| US-4.3 | View All Tasting Notes for a Wine | Daniel | P1 | F4 |
| US-4.4 | Edit or Delete a Tasting Note | Claire | P1 | F4 |
| US-4.5 | See Average Rating and Would-Buy-Again Status | Vivienne | P1 | F4 |
| US-5.1 | View Collection Summary Stats | Marcus | P1 | F5 |
| US-5.2 | View Collection Composition Breakdown | Vivienne | P1 | F5 |
| US-5.3 | See Highest-Rated and Recently Added Wines | Claire | P1 | F5 |
| US-5.4 | See Recently Consumed Wines | Daniel | P1 | F5 |
| US-5.5 | Dashboard Loads Fresh Data Every Visit | Vivienne | P1 | F5 |
| US-6.1 | Use the App Comfortably on a Phone | Marcus | P0 | F6 |
| US-6.2 | Navigate the App Using a Thumb-Friendly Bottom Bar | Daniel | P0 | F6 |
| US-6.3 | Add a Wine in Under 60 Seconds | Daniel | P0 | F6 |
| US-6.4 | Access Filters via a Mobile-Friendly Panel | Claire | P0 | F6 |
| US-6.5 | Experience Fast Load Times on a Mobile Connection | Marcus | P0 | F6 |
| US-6.6 | Experience Accessible, Readable Interface | Claire | P0 | F6 |

---

## Priority Summary

| Priority | Count | Stories |
|----------|-------|---------|
| P0 — Critical | 26 | US-0.1 through US-0.6, US-1.1 through US-1.4, US-2.1 through US-2.5, US-3.1 through US-3.4, US-6.1 through US-6.6 |
| P1 — High | 9 | US-4.1 through US-4.5, US-5.1 through US-5.5 |
| **Total** | **35** | |

---

## Feature Coverage

| Feature | Stories | All PRD Capabilities Covered? |
|---------|---------|-------------------------------|
| F0 — Wine Inventory Management | US-0.1 – US-0.6 | Yes |
| F1 — Drinking Window Tracking | US-1.1 – US-1.4 | Yes |
| F2 — Search and Filter | US-2.1 – US-2.5 | Yes |
| F3 — Bottle Status Tracking | US-3.1 – US-3.4 | Yes |
| F4 — Tasting Notes and Personal Ratings | US-4.1 – US-4.5 | Yes |
| F5 — Collection Insights Dashboard | US-5.1 – US-5.5 | Yes |
| F6 — Mobile-First User Experience | US-6.1 – US-6.6 | Yes |

---

*UserStories-WineApp v1.0 — Generated 2026-05-21*
