# Story Map
## Personal Wine Collection Management Software
**Product Name:** WineApp
**Project Acronym:** WineApp
**Version:** 1.0
**Date:** 2026-05-21
**Status:** Draft
**Related Artifacts:**
- `project_specs/PERSONAS-WineApp.md`
- `project_specs/JOURNEYS-WineApp.md`
- `project_specs/JTBD-WineApp.md`
- `project_specs/UserStories-WineApp.md`
- `project_specs/PRD-WineApp.md`

---

## 1. Document Purpose

This Story Map organizes all 35 WineApp user stories into a two-dimensional grid: journey stages along the X-axis (when/where the job is performed) and activity depth along the Y-axis (from backbone activities down to individual stories). A **Natural Acceptance Criteria (NaC)** column accompanies each story, derived from the intersection of a specific JTBD outcome and the journey stage context. NaC bridge "what matters to the user" to "what we will test" — they are not invented; every NaC traces back to a named JTBD outcome.

**NaC Derivation Formula:**
> JTBD outcome (the "what matters") × Journey stage (the "when/where") → Testable NaC statement

**Story Map ID Convention:** `SM-{Epic}.{NN}` (e.g., SM-0.1 = first story mapped under Epic 0)

**Release Strategy:**
- **R1 (MVP Core):** All P0 stories — completes at least one end-to-end journey for every persona
- **R2 (MVP Complete):** All P1 stories — adds tasting journal and collection insights, fully completes all journeys

---

## 2. Journey Stage Reference

| Stage ID | Stage Name | Journeys | Key Personas |
|----------|-----------|----------|--------------|
| **S1** | Launch & Navigate | JRN-01.1/1.2, JRN-02.1, JRN-03.1, JRN-04.1/4.2 | All |
| **S2** | Add a Bottle | JRN-01.1 (Stages 2–5), JRN-04.1 (Stages 2–4) | PER-01, PER-04 |
| **S3** | Find / Browse Collection | JRN-01.2 (Stages 2–3), JRN-02.1 (Stage 2), JRN-03.1 (Stages 1–3) | All |
| **S4** | Check Drinking Readiness | JRN-02.1 (Stages 1–2), JRN-03.1 (Stage 2), JRN-04.2 (Stages 3–5) | PER-02, PER-03, PER-04 |
| **S5** | Open / Consume a Bottle | JRN-02.1 (Stages 4–5), JRN-03.2 (Stages 1–3), JRN-04.1 (Stage 4) | PER-01, PER-02, PER-03, PER-04 |
| **S6** | Record Tasting Note | JRN-02.1 (Stage 6), JRN-03.2 (Stage 3) | PER-02, PER-03, PER-04 |
| **S7** | Review Collection Insights | JRN-02.2 (Stages 1–2), JRN-04.1 (Stage 5), JRN-04.2 (Stages 1–2, 6) | PER-02, PER-04 |
| **S8** | Plan / Filter for Purchase | JRN-02.2 (Stages 3–4), JRN-04.2 (Stage 6) | PER-02, PER-04 |

---

## 3. Story Map Matrix

> **Reading guide:** Rows flow from backbone activities (bold) to individual stories. The NaC column derives from the JTBD most activated in that journey stage. Release column shows R1 (MVP Core) or R2 (MVP Complete).

### 3.1 Backbone: Launch & Navigate (S1)

| SM ID | Persona | Journey Stage | Activity | Epic | Story | NaC | Release |
|-------|---------|--------------|----------|------|-------|-----|---------|
| SM-6.1 | PER-01 Marcus | S1: Launch & Navigate | Open app on phone; reach any screen | Epic 6 (F6) | **US-6.1** Use App Comfortably on a Phone | JTBD-01.1: "Confirm ownership in <10s" → App renders correctly at 375px with no horizontal scroll; all tap targets ≥44px so Marcus can operate it single-handed in a shop | R1 |
| SM-6.2 | PER-03 Daniel | S1: Launch & Navigate | Navigate primary sections thumb-first | Epic 6 (F6) | **US-6.2** Navigate via Thumb-Friendly Bottom Bar | JTBD-03.1: "Pick the right bottle in seconds" → Any primary section reachable in ≤2 taps from the bottom nav bar; Add Wine CTA is most prominent element | R1 |
| SM-6.5 | PER-01 Marcus | S1: Launch & Navigate | App loads in time to be useful at a shop | Epic 6 (F6) | **US-6.5** Fast Load Times on Mobile Connection | JTBD-01.1: "Confirm ownership in <10s" → First meaningful paint ≤3s on 4G; wine list for ≤500 bottles loads ≤2s; skeleton shown on slow connections | R1 |
| SM-6.6 | PER-02 Claire | S1: Launch & Navigate | Read status badges in any lighting | Epic 6 (F6) | **US-6.6** Accessible, Readable Interface | JTBD-02.1: "Identify Drink Now wines in <5s" → All text meets WCAG AA 4.5:1; status badges include accessible text alternatives | R1 |

### 3.2 Backbone: Add a Bottle (S2)

| SM ID | Persona | Journey Stage | Activity | Epic | Story | NaC | Release |
|-------|---------|--------------|----------|------|-------|-----|---------|
| SM-0.1 | PER-01 Marcus | S2: Add a Bottle | Fill minimal required fields, save quickly | Epic 0 (F0) | **US-0.1** Add a New Wine to the Collection | JTBD-01.2: "Add bottle in <60s" → Form submittable with 3 required fields only; submission completes in ≤1s; new record appears at top of list | R1 |
| SM-0.2 | PER-04 Vivienne | S2: Add a Bottle | Fill all detail fields including price, location, window | Epic 0 (F0) | **US-0.2** Add a Wine with Full Detail | JTBD-04.2: "Complete precise inventory" → All 12+ optional fields present; drinking window accepts free numeric year input; purchase price field is available | R1 |
| SM-1.1 | PER-02 Claire | S2: Add a Bottle | Define drinking window start/end year | Epic 1 (F1) | **US-1.1** Define a Drinking Window | JTBD-02.1: "Know which bottles to drink now" → Window start/end are free numeric year inputs; saved values visible on detail view; end-before-start rejected with inline error | R1 |
| SM-1.4 | PER-04 Vivienne | S2: Add a Bottle | Mark a bottle as Special Occasion Only | Epic 1 (F1) | **US-1.4** Flag Wine as Special Occasion Only | JTBD-04.1: "Protect high-value bottles" → Special Occasion toggle on add/edit form; purple badge shows regardless of window dates; excluded from Ready to Drink list | R1 |
| SM-6.3 | PER-03 Daniel | S2: Add a Bottle | Complete form in under 60s on phone | Epic 6 (F6) | **US-6.3** Add a Wine in Under 60 Seconds | JTBD-03.2: "Keep inventory accurate" → Add Wine form completable ≤60s on 375px screen; numeric keyboard for vintage/quantity; native date picker for purchase date | R1 |

### 3.3 Backbone: Find / Browse Collection (S3)

| SM ID | Persona | Journey Stage | Activity | Epic | Story | NaC | Release |
|-------|---------|--------------|----------|------|-------|-----|---------|
| SM-0.3 | PER-01 Marcus | S3: Find / Browse | Scan full collection list at a glance | Epic 0 (F0) | **US-0.3** View the Complete Wine List | JTBD-01.1: "Instantly know what I own" → Wine list is default landing view; each card shows name, producer, vintage, type, quantity, and drinking status badge; loads ≤2s for ≤500 bottles | R1 |
| SM-0.4 | PER-02 Claire | S3: Find / Browse | Review all detail for a single wine | Epic 0 (F0) | **US-0.4** View a Wine's Full Detail | JTBD-02.1: "Know which to drink now" → Detail view shows computed drinking status prominently; all optional fields shown if set; tasting notes listed; renders ≤1s | R1 |
| SM-0.5 | PER-04 Vivienne | S3: Find / Browse | Edit a field after initial entry | Epic 0 (F0) | **US-0.5** Edit an Existing Wine Record | JTBD-04.2: "Complete precise inventory" → Edit form pre-populated with all current values; all fields modifiable; updated_at refreshed; validation identical to add form | R1 |
| SM-0.6 | PER-01 Marcus | S3: Find / Browse | Remove a wine no longer in collection | Epic 0 (F0) | **US-0.6** Delete a Wine Record | JTBD-01.2: "Keep collection current" → Delete requires explicit confirmation dialog; confirmed deletion removes record and all tasting notes; user navigated to Wine List | R1 |
| SM-2.1 | PER-01 Marcus | S3: Find / Browse | Search by name/producer/region as user types | Epic 2 (F2) | **US-2.1** Search by Name, Producer, or Region | JTBD-01.1: "Confirm ownership in <10s at a shop" → Search bar persistently visible on Wine List; results update within 500ms; partial, case-insensitive matches across name, producer, region, notes | R1 |
| SM-2.2 | PER-03 Daniel | S3: Find / Browse | Filter by wine type and attributes for dinner | Epic 2 (F2) | **US-2.2** Filter by Wine Type and Attributes | JTBD-03.1: "Pick right bottle before guests arrive" → Type filter (Red/White/Rosé/Sparkling) accessible in one tap; all active filters apply immediately; badge shows active filter count | R1 |
| SM-2.3 | PER-02 Claire | S3: Find / Browse | Filter to a specific drinking status | Epic 2 (F2) | **US-2.3** Filter by Drinking Status | JTBD-02.1: "Identify bottles needing attention soon" → Drinking status multi-select in filter panel; "Approaching Peak" filter shows wines within 2 years of window start; filter state persists when navigating to detail | R1 |
| SM-2.4 | PER-01 Marcus | S3: Find / Browse | Reset all filters in one tap | Epic 2 (F2) | **US-2.4** Clear All Active Filters | JTBD-01.1: "Instantly know what I own" → "Clear Filters" visible whenever any filter or search is active; single tap resets all; full list shown immediately | R1 |
| SM-2.5 | PER-04 Vivienne | S3: Find / Browse | Sort by vintage, rating, or price | Epic 2 (F2) | **US-2.5** Sort the Collection | JTBD-04.2: "Complete precise inventory review" → Sort options include: Most Recently Added, Name A–Z, Vintage Oldest–Newest, Highest Rated, Price Low–High; applied immediately; state persists | R1 |
| SM-6.4 | PER-02 Claire | S3: Find / Browse | Open filter panel with large tap targets | Epic 6 (F6) | **US-6.4** Access Filters via Mobile-Friendly Panel | JTBD-02.3: "Filter collection quickly on mobile" → Filter panel is a bottom sheet modal; dismissible by swipe-down; all controls ≥44px; search bar stays visible in list | R1 |

### 3.4 Backbone: Check Drinking Readiness (S4)

| SM ID | Persona | Journey Stage | Activity | Epic | Story | NaC | Release |
|-------|---------|--------------|----------|------|-------|-----|---------|
| SM-1.2 | PER-03 Daniel | S4: Check Readiness | See readiness badge on every list card | Epic 1 (F1) | **US-1.2** See Automatically Computed Drinking Status | JTBD-03.1: "Know which bottles are ready tonight" → Drinking status badge on every wine card; computed dynamically from today's date; Drink Now = green, Approaching Peak = amber, Hold = blue, Past Window = red; no manual input required | R1 |
| SM-1.3 | PER-02 Claire | S4: Check Readiness | Reach "Ready to Drink" list in ≤2 taps | Epic 1 (F1) | **US-1.3** View the "Ready to Drink" List | JTBD-02.1: "Identify Drink Now wines in <5s from home" → "Ready to Drink" accessible from main nav in one tap; shows only wines with status Drink Now AND qty >0; sorted by window end year ascending | R1 |

### 3.5 Backbone: Open / Consume a Bottle (S5)

| SM ID | Persona | Journey Stage | Activity | Epic | Story | NaC | Release |
|-------|---------|--------------|----------|------|-------|-----|---------|
| SM-3.1 | PER-01 Marcus | S5: Consume a Bottle | Mark bottle consumed; quantity decrements | Epic 3 (F3) | **US-3.1** Mark a Bottle as Consumed | JTBD-01.2: "Keep collection current with minimal effort" → "Mark as Consumed" accessible from Wine Detail in one tap; confirmation dialog with today's date default; quantity owned decrements immediately; action rejected if qty = 0 | R1 |
| SM-3.2 | PER-03 Daniel | S5: Consume a Bottle | Mark bottle as gifted (distinct from consumed) | Epic 3 (F3) | **US-3.2** Mark a Bottle as Gifted | JTBD-03.2: "Inventory accurate — no phantom bottles" → "Mark as Gifted" is a distinct action from "Mark as Consumed"; qty owned decrements; qty consumed does NOT increment; recipient name optional | R1 |
| SM-3.3 | PER-04 Vivienne | S5: Consume a Bottle | View chronological history of all events | Epic 3 (F3) | **US-3.3** View Bottle History | JTBD-04.2: "Maintain complete precise inventory" → Bottle History section on Wine Detail shows all consumed/gifted events with type, date, and note indicator; sorted most recent first; loads with detail view | R1 |
| SM-3.4 | PER-01 Marcus | S5: Consume a Bottle | Undo an incorrectly logged event | Epic 3 (F3) | **US-3.4** Undo an Incorrectly Logged Status Event | JTBD-01.2: "Keep collection current — correct mistakes" → Undo available on each event in history; restores qty owned; qty consumed decremented if event was "consumed"; linked tasting note NOT auto-deleted | R1 |

### 3.6 Backbone: Record Tasting Note (S6)

| SM ID | Persona | Journey Stage | Activity | Epic | Story | NaC | Release |
|-------|---------|--------------|----------|------|-------|-----|---------|
| SM-4.1 | PER-02 Claire | S6: Record Tasting Note | Log impressions immediately after consumption | Epic 4 (F4) | **US-4.1** Record a Tasting Note When Opening | JTBD-02.2: "Build tasting journal on consumption" → After Mark as Consumed, "Add Tasting Note" shortcut offered; date opened pre-filled; form includes rating 1–100, aroma/flavor/finish notes, food pairing, occasion, would-buy-again; all optional except date | R2 |
| SM-4.2 | PER-04 Vivienne | S6: Record Tasting Note | Add a note independently at any time | Epic 4 (F4) | **US-4.2** Add a Tasting Note Independently | JTBD-02.2 / JTBD-04.1: "Build journal for buying decisions" → "Add Tasting Note" available on Wine Detail at any time; not required to link to a consumption event; multiple notes per wine allowed | R2 |
| SM-4.3 | PER-03 Daniel | S6: Record Tasting Note | Review past pairings before opening another bottle | Epic 4 (F4) | **US-4.3** View All Tasting Notes for a Wine | JTBD-03.3: "Build personal pairing reference" → Tasting Notes section on Wine Detail shows all notes sorted most-recent first; each note shows date, rating, pairing, would-buy-again, and text preview; "No notes yet" + Add shortcut if empty | R2 |
| SM-4.4 | PER-02 Claire | S6: Record Tasting Note | Correct an incorrectly recorded note | Epic 4 (F4) | **US-4.4** Edit or Delete a Tasting Note | JTBD-02.2: "Keep wine journal accurate" → Edit opens note form pre-populated; Delete requires confirmation; average rating recalculated after deletion; deleting note does NOT undo bottle status event | R2 |
| SM-4.5 | PER-04 Vivienne | S6: Record Tasting Note | See aggregated rating at a glance | Epic 4 (F4) | **US-4.5** See Average Rating and Would-Buy-Again | JTBD-04.1: "Guide buying decisions from personal history" → Average rating shown on wine card and detail view; rounds to 1 decimal; "Not yet rated" shown (not "0") when no notes with rating exist; most recent would-buy-again flag visible on detail | R2 |

### 3.7 Backbone: Review Collection Insights (S7)

| SM ID | Persona | Journey Stage | Activity | Epic | Story | NaC | Release |
|-------|---------|--------------|----------|------|-------|-----|---------|
| SM-5.1 | PER-01 Marcus | S7: Review Insights | See total bottles and estimated value at a glance | Epic 5 (F5) | **US-5.1** View Collection Summary Stats | JTBD-01.3: "Know collection size and value in <10s" → Dashboard accessible from main nav in one tap; shows total bottles owned, estimated value, ready-to-drink count, approaching maturity count, avg purchase price; "Not available" if no prices set | R2 |
| SM-5.2 | PER-04 Vivienne | S7: Review Insights | See composition breakdown by type, region, grape | Epic 5 (F5) | **US-5.2** View Collection Composition Breakdown | JTBD-04.3: "Understand composition to guide rebalancing" → Dashboard shows type breakdown (all 5 types even at 0), top 5 regions by qty, top 5 grape varieties; reflects live owned bottle counts | R2 |
| SM-5.3 | PER-02 Claire | S7: Review Insights | See highest-rated wines and recent additions | Epic 5 (F5) | **US-5.3** See Highest-Rated and Recently Added Wines | JTBD-02.3: "Surface insights that drive buying decisions" → Dashboard "Highest Rated" shows top 5 wines by avg rating; "Recently Added" shows last 5 sorted by created_at desc; each entry shows name, producer, vintage | R2 |
| SM-5.4 | PER-03 Daniel | S7: Review Insights | See recent consumptions to recall decisions | Epic 5 (F5) | **US-5.4** See Recently Consumed Wines | JTBD-03.2: "Track what was opened and when" → "Recently Consumed" on dashboard shows last 5 events sorted by event date desc; includes wine name, date, tasting note indicator; tap navigates to wine detail | R2 |
| SM-5.5 | PER-04 Vivienne | S7: Review Insights | Dashboard always reflects live data | Epic 5 (F5) | **US-5.5** Dashboard Loads Fresh Data Every Visit | JTBD-04.3: "Trust dashboard for purchase decisions" → Queries execute fresh on every nav to Dashboard; skeleton shown while loading; individual section failures are graceful; full load ≤2s | R2 |

---

## 4. NaC Derivation Table

Full traceability: JTBD outcome → Journey stage → NaC statement → User Story

| JTBD ID | Outcome Statement | Journey Stage | Derived NaC | Story |
|---------|------------------|--------------|-------------|-------|
| JTBD-01.1 | Confirm ownership in <10s at point of purchase | S3: Find / Browse (JRN-01.2, Stage 2) | Search bar always visible on Wine List; results appear within 500ms; partial, case-insensitive match on name, producer, region | US-2.1 |
| JTBD-01.1 | Instantly know what I own from the list | S3: Find / Browse (JRN-01.2, Stage 3) | Wine list is default landing view; each card shows name, producer, vintage, type, quantity, and status badge; loads ≤2s | US-0.3 |
| JTBD-01.1 | App works on phone without friction | S1: Launch & Navigate (JRN-01.2, Stage 1) | Renders at 375px with no horizontal scroll; all tap targets ≥44px; first meaningful paint ≤3s | US-6.1, US-6.5 |
| JTBD-01.2 | Add a bottle in <60s with minimal fields | S2: Add a Bottle (JRN-01.1, Stage 3) | Form submittable with 3 required fields; smart defaults applied; submission ≤1s; new record appears at top of list | US-0.1 |
| JTBD-01.2 | Mark consumed in <15s with one tap | S5: Consume a Bottle (JRN-01.1, Stage 4) | "Mark as Consumed" accessible from Wine Detail; qty decrements immediately; action rejected if qty = 0 | US-3.1 |
| JTBD-01.2 | Keep collection current — correct mistakes | S5: Consume a Bottle (JRN-03.2, Stage 2) | Undo available on each bottle history event; restores qty owned; qty consumed decremented; linked note not auto-deleted | US-3.4 |
| JTBD-01.3 | View total bottles and estimated value in <10s | S7: Review Insights (JRN-04.2, Stage 2) | Dashboard accessible from main nav in one tap; total bottles, estimated value shown; "Not available" if no prices set | US-5.1 |
| JTBD-02.1 | Identify "Drink Now" wines in <5s from home | S4: Check Readiness (JRN-02.1, Stage 1) | "Ready to Drink" accessible from main nav in one tap; shows only Drink Now + qty >0; sorted by end year asc | US-1.3 |
| JTBD-02.1 | Drinking status computed automatically | S4: Check Readiness (JRN-02.1, Stage 2; JRN-03.1, Stage 2) | Status badge on every wine card; computed from today's date vs. window; never manually set; updates on every page load | US-1.2 |
| JTBD-02.1 | Define window with precise year input | S2: Add a Bottle (JRN-04.1, Stage 3) | Window start/end as free numeric year inputs; end < start rejected with inline error | US-1.1 |
| JTBD-02.2 | Record tasting note immediately after consumption | S6: Record Tasting Note (JRN-02.1, Stage 6) | "Add Tasting Note" shortcut after Mark as Consumed; date pre-filled; rating, aroma/flavor/finish, food pairing, would-buy-again all available | US-4.1 |
| JTBD-02.2 | Keep wine journal accurate and editable | S6: Record Tasting Note (JRN-02.1, Stage 6) | Edit opens form pre-populated; Delete requires confirmation; avg rating recalculated; note deletion does not undo status event | US-4.4 |
| JTBD-02.3 | Identify composition gaps in <60s | S7: Review Insights (JRN-02.2, Stage 2) | Dashboard shows type breakdown, top 5 regions, top 5 grape varieties; reflects live owned counts | US-5.2 |
| JTBD-02.3 | Filter by vintage range quickly on mobile | S8: Plan / Filter (JRN-02.2, Stage 3) | Vintage year range filter in filter panel; applies immediately; filter panel is a bottom sheet with ≥44px controls | US-2.2, US-6.4 |
| JTBD-03.1 | Filter to red wines in one tap before dinner | S3: Find / Browse (JRN-03.1, Stage 1) | Wine type filter chips (Red/White/Rosé/Sparkling) pinned above list; active filters apply immediately; badge shows count | US-2.2 |
| JTBD-03.1 | See drinking status on list without opening records | S4: Check Readiness (JRN-03.1, Stage 2) | Drinking status badge displayed on each card; color-coded; Drink Now = green visible at a glance | US-1.2 |
| JTBD-03.2 | Zero phantom bottles — inventory always accurate | S5: Consume a Bottle (JRN-03.2, Stage 2) | Mark as Gifted is a distinct status from consumed; qty owned decrements; undo restores qty | US-3.2, US-3.4 |
| JTBD-03.3 | Build pairing reference from real dinners | S6: Record Tasting Note (JRN-03.2, Stage 3) | Food pairing field on tasting note form; notes viewable on Wine Detail with pairing visible in preview | US-4.1, US-4.3 |
| JTBD-04.1 | Zero high-value bottles past peak window | S4: Check Readiness (JRN-04.2, Stage 3–5) | "Approaching Peak" and "Past Window" are first-class status filter options; filter results accurate to current date | US-2.3 |
| JTBD-04.1 | Protect special bottles from routine drinking | S2: Add a Bottle (JRN-04.1, Stage 2) | "Special Occasion Only" toggle on add/edit form; purple badge; excluded from Ready to Drink list | US-1.4 |
| JTBD-04.2 | Complete precise record with storage + price | S2: Add a Bottle (JRN-04.1, Stage 2) | All 12+ fields present in add form; none hidden behind advanced toggles; storage location and purchase price are standard fields | US-0.2 |
| JTBD-04.2 | Edit any field at any time — no locked records | S3: Find / Browse (JRN-04.1, Stage 4) | Edit accessible from Wine Detail; all fields editable; updated_at refreshed; validation identical to add | US-0.5 |
| JTBD-04.3 | Collection value and composition on dashboard | S7: Review Insights (JRN-04.2, Stages 1–2, 6) | Dashboard shows estimated value (live), type + region + grape breakdown; loads ≤2s; fresh data on every visit | US-5.2, US-5.5 |

---

## 5. Release Planning

### R1: MVP Core — "A Collector Always Knows What They Own"

**Theme:** Every persona can perform their most critical job end-to-end. A user with an existing collection can log bottles, find any wine, understand its readiness, and keep inventory accurate — entirely on mobile.

**Stories:** 26 stories (all P0)

**Persona Journey Completion in R1:**
- **PER-01 Marcus:** Complete — can add, search, view, consume, and delete bottles
- **PER-02 Claire:** Core complete — can define drinking windows, view Ready to Drink, filter by status; tasting journal deferred to R2
- **PER-03 Daniel:** Complete — can filter by type, see readiness badges, consume/gift bottles; pairing notes deferred to R2
- **PER-04 Vivienne:** Core complete — full detail entry, sort/filter, bottle history; insights dashboard deferred to R2

| Story | Title | Stage | JTBD |
|-------|-------|-------|------|
| US-0.1 | Add a New Wine | S2 | JTBD-01.2 |
| US-0.2 | Add with Full Detail | S2 | JTBD-04.2 |
| US-0.3 | View Wine List | S3 | JTBD-01.1 |
| US-0.4 | View Wine Detail | S3 | JTBD-02.1 |
| US-0.5 | Edit Wine Record | S3 | JTBD-04.2 |
| US-0.6 | Delete Wine Record | S3 | JTBD-01.2 |
| US-1.1 | Define Drinking Window | S2 | JTBD-02.1 |
| US-1.2 | Auto-Computed Drinking Status | S4 | JTBD-03.1 |
| US-1.3 | Ready to Drink List | S4 | JTBD-02.1 |
| US-1.4 | Special Occasion Flag | S2 | JTBD-04.1 |
| US-2.1 | Search by Name/Producer/Region | S3 | JTBD-01.1 |
| US-2.2 | Filter by Wine Type & Attributes | S3 | JTBD-03.1 |
| US-2.3 | Filter by Drinking Status | S3 | JTBD-02.1 |
| US-2.4 | Clear All Filters | S3 | JTBD-01.1 |
| US-2.5 | Sort the Collection | S3 | JTBD-04.2 |
| US-3.1 | Mark as Consumed | S5 | JTBD-01.2 |
| US-3.2 | Mark as Gifted | S5 | JTBD-03.2 |
| US-3.3 | View Bottle History | S5 | JTBD-04.2 |
| US-3.4 | Undo Status Event | S5 | JTBD-01.2 |
| US-6.1 | App on Phone | S1 | JTBD-01.1 |
| US-6.2 | Thumb-Friendly Bottom Bar | S1 | JTBD-03.1 |
| US-6.3 | Add Wine in Under 60s | S2 | JTBD-03.2 |
| US-6.4 | Mobile-Friendly Filter Panel | S3 | JTBD-02.3 |
| US-6.5 | Fast Load Times | S1 | JTBD-01.1 |
| US-6.6 | Accessible Interface | S1 | JTBD-02.1 |

**JTBD Fully Addressed in R1:** JTBD-01.1, JTBD-01.2, JTBD-02.1 (partial — no tasting journal), JTBD-03.1, JTBD-03.2, JTBD-04.1 (partial — no drill-down insights), JTBD-04.2

---

### R2: MVP Complete — "A Collector Learns and Plans"

**Theme:** Every persona can record and consult their personal wine history, and power users can analyze collection composition for buying decisions. R2 completes the tasting journal and insights dashboard, fulfilling the remaining JTBD outcomes for all four personas.

**Stories:** 9 stories (all P1)

**Persona Journey Completion in R2:**
- **PER-01 Marcus:** Collection insights adds satisfying value metric (JTBD-01.3)
- **PER-02 Claire:** Tasting journal + composition insights complete all 3 of Claire's JTBDs
- **PER-03 Daniel:** Pairing reference and recently consumed dashboard complete Daniel's JTBDs
- **PER-04 Vivienne:** Full composition + value dashboard with live data completes JTBD-04.3

| Story | Title | Stage | JTBD |
|-------|-------|-------|------|
| US-4.1 | Tasting Note on Consumption | S6 | JTBD-02.2, JTBD-03.3 |
| US-4.2 | Add Tasting Note Independently | S6 | JTBD-02.2, JTBD-04.1 |
| US-4.3 | View All Tasting Notes | S6 | JTBD-03.3 |
| US-4.4 | Edit or Delete Tasting Note | S6 | JTBD-02.2 |
| US-4.5 | Average Rating & Would-Buy-Again | S6 | JTBD-04.1 |
| US-5.1 | Collection Summary Stats | S7 | JTBD-01.3, JTBD-04.3 |
| US-5.2 | Collection Composition Breakdown | S7 | JTBD-02.3, JTBD-04.3 |
| US-5.3 | Highest-Rated and Recently Added | S7 | JTBD-02.3 |
| US-5.4 | Recently Consumed Wines | S7 | JTBD-03.2 |
| US-5.5 | Dashboard Loads Fresh Data | S7 | JTBD-04.3 |

**JTBD Newly Completed in R2:** JTBD-01.3, JTBD-02.2, JTBD-02.3, JTBD-03.3, JTBD-04.3

---

## 6. Coverage Analysis

### 6.1 Persona Coverage Per Release

| Persona | R1 Journeys Covered | R1 Complete? | R2 Journeys Added | R2 Complete? |
|---------|--------------------|--------------|--------------------|-------------|
| PER-01 Marcus | JRN-01.1, JRN-01.2 | ✅ Yes | JRN-02.2 (insights partial) | ✅ Yes |
| PER-02 Claire | JRN-02.1 (window+list), JRN-02.2 (filter only) | Partial | JRN-02.1 (tasting note), JRN-02.2 (insights) | ✅ Yes |
| PER-03 Daniel | JRN-03.1, JRN-03.2 (consume/gift) | Partial | JRN-03.2 (pairing note), JRN dashboard | ✅ Yes |
| PER-04 Vivienne | JRN-04.1 (add + status), JRN-04.2 (filter/readiness) | Partial | JRN-04.1 (insights update), JRN-04.2 (composition) | ✅ Yes |

### 6.2 JTBD Coverage Per Release

| JTBD ID | Persona | Priority | R1 | R2 |
|---------|---------|----------|----|----|
| JTBD-01.1 | PER-01 Marcus | P0 | ✅ | — |
| JTBD-01.2 | PER-01 Marcus | P0 | ✅ | — |
| JTBD-01.3 | PER-01 Marcus | P2 | — | ✅ |
| JTBD-02.1 | PER-02 Claire | P0 | ✅ | — |
| JTBD-02.2 | PER-02 Claire | P1 | — | ✅ |
| JTBD-02.3 | PER-02 Claire | P1 | — | ✅ |
| JTBD-03.1 | PER-03 Daniel | P0 | ✅ | — |
| JTBD-03.2 | PER-03 Daniel | P0 | ✅ | — |
| JTBD-03.3 | PER-03 Daniel | P1 | — | ✅ |
| JTBD-04.1 | PER-04 Vivienne | P0 | ✅ (partial) | ✅ (complete) |
| JTBD-04.2 | PER-04 Vivienne | P0 | ✅ | — |
| JTBD-04.3 | PER-04 Vivienne | P0 | — | ✅ |

> **Note:** JTBD-04.1 is marked partial in R1 — the Approaching Peak filter and Special Occasion flag ship in R1, but the average rating signal that guards against opening past peak relies on US-4.5 (R2). JTBD-04.3 is fully addressed in R2 via US-5.1, US-5.2, and US-5.5.

### 6.3 Journey Stage Coverage

| Stage | R1 Coverage | R2 Coverage | Gaps |
|-------|-------------|-------------|------|
| S1: Launch & Navigate | US-6.1, 6.2, 6.5, 6.6 | — | None |
| S2: Add a Bottle | US-0.1, 0.2, 1.1, 1.4, 6.3 | — | None |
| S3: Find / Browse | US-0.3, 0.4, 0.5, 0.6, 2.1–2.5, 6.4 | — | None |
| S4: Check Readiness | US-1.2, 1.3 | — | None |
| S5: Consume a Bottle | US-3.1–3.4 | — | None |
| S6: Record Tasting Note | — | US-4.1–4.5 | R1 has no tasting note capture; users can mark consumed but not record impressions until R2 |
| S7: Review Insights | — | US-5.1–5.5 | R1 has no dashboard; users must browse list for count/composition |
| S8: Plan / Filter for Purchase | US-2.2, 2.3, 6.4 (filter infra) | US-5.2, 5.3 (insights) | Wishlist / buying intent deferred to Phase 2 per JRN-02.2 Stage 5 |

### 6.4 Gap Analysis

**Identified Gaps (by design — deferred):**
- **Tasting note capture in R1:** Users who open bottles in R1 cannot record impressions until R2 ships. Mitigation: the consumption event is logged; notes can be added retroactively via US-4.2 (Add Tasting Note Independently) once R2 ships.
- **Collection value visibility in R1:** Marcus and Vivienne cannot see estimated collection value until R2. Mitigation: individual wine purchase prices are captured in R1 via US-0.2; value is computed and surfaced when US-5.1 ships.
- **Wishlist / buying intent:** JRN-02.2 Stage 5 notes the absence of a "want to buy" list. This is not addressed in either release — it is explicitly deferred to Phase 2 per PRD §9.
- **Drinking window alerts:** JRN-04.2 Stage 5 notes that pro-active alerts for approaching peak windows are not in scope. Monthly dashboard review (R2) is the mitigating workflow.
- **Gift bottle quick-add (CP-04):** The "add-and-immediately-consume" shortcut for unlisted gift bottles (identified in JRN-03.2 Stage 4 as a known failure mode) is not directly addressed by any current story. The closest coverage is US-0.1 + US-3.1 in sequence. This is a **UX gap to flag** for the next sprint planning cycle.

**Orphan Stories:** None. All 35 stories are mapped to at least one journey stage.

**Journey Stages Without Stories:** None. All 8 stages have at least one story in R1 or R2.

**JTBD Without Derived NaC:** None. All 12 JTBD outcomes have at least one NaC in the derivation table.

---

## 7. NaC-to-Acceptance-Criteria Alignment Check

Spot-check verifying that NaC statements are consistent with the formal acceptance criteria in UserStories-WineApp.md:

| SM ID | Story | NaC Statement | UserStory AC Alignment | Status |
|-------|-------|--------------|----------------------|--------|
| SM-2.1 | US-2.1 | Search results appear within 500ms; partial case-insensitive match across name, producer, region | AC: "Results update in real time...debounced to 300ms...within 500ms of keystroke" | ✅ Aligned |
| SM-1.2 | US-1.2 | Status badge on every card; Drink Now = green; computed from today's date | AC: "Color-coded...Drink Now green...computed dynamically...never manually set" | ✅ Aligned |
| SM-1.3 | US-1.3 | Ready to Drink accessible in one tap; shows Drink Now + qty >0; sorted by end year asc | AC: "Accessible from main navigation in one tap...Drink Now AND qty > 0...sorted by end year ascending" | ✅ Aligned |
| SM-3.1 | US-3.1 | One tap from Wine Detail; qty decrements immediately; rejected if qty = 0 | AC: "Accessible from Wine Detail...qty owned decrements by 1...rejects if qty owned is 0" | ✅ Aligned |
| SM-0.1 | US-0.1 | Submittable with 3 required fields; submission ≤1s | AC: "Form can be submitted with only three required fields...submission completes within 1 second" | ✅ Aligned |
| SM-5.1 | US-5.1 | Total bottles, estimated value on dashboard in one tap; "Not available" if no prices | AC: "Accessible from main nav in one tap...estimated value = sum of purchase price × qty...Not available if no prices" | ✅ Aligned |
| SM-4.1 | US-4.1 | "Add Tasting Note" shortcut after consumption; all note fields available; date pre-filled | AC: "After tapping Mark as Consumed, Add Tasting Note shortcut presented...date opened pre-filled from consumption event" | ✅ Aligned |
| SM-1.4 | US-1.4 | Special Occasion toggle; purple badge; excluded from Ready to Drink | AC: "Special Occasion Only toggle...status displayed as Special Occasion (purple badge)...do not appear in Ready to Drink list" | ✅ Aligned |

**Verdict:** All NaC statements sampled align with formal acceptance criteria in UserStories-WineApp.md. No contradictions found.

---

## 8. Story Map Quick Reference

| Story | Title | Stage | Persona | Release |
|-------|-------|-------|---------|---------|
| US-0.1 | Add a New Wine | S2 | Marcus | R1 |
| US-0.2 | Add with Full Detail | S2 | Vivienne | R1 |
| US-0.3 | View Wine List | S3 | Marcus | R1 |
| US-0.4 | View Wine Detail | S3 | Claire | R1 |
| US-0.5 | Edit Wine Record | S3 | Vivienne | R1 |
| US-0.6 | Delete Wine Record | S3 | Marcus | R1 |
| US-1.1 | Define Drinking Window | S2 | Claire | R1 |
| US-1.2 | Auto-Computed Status Badges | S4 | Daniel | R1 |
| US-1.3 | Ready to Drink List | S4 | Claire | R1 |
| US-1.4 | Special Occasion Flag | S2 | Vivienne | R1 |
| US-2.1 | Search by Name/Producer/Region | S3 | Marcus | R1 |
| US-2.2 | Filter by Wine Type & Attributes | S3 | Daniel | R1 |
| US-2.3 | Filter by Drinking Status | S3 | Claire | R1 |
| US-2.4 | Clear All Filters | S3 | Marcus | R1 |
| US-2.5 | Sort the Collection | S3 | Vivienne | R1 |
| US-3.1 | Mark as Consumed | S5 | Marcus | R1 |
| US-3.2 | Mark as Gifted | S5 | Daniel | R1 |
| US-3.3 | View Bottle History | S5 | Vivienne | R1 |
| US-3.4 | Undo Status Event | S5 | Marcus | R1 |
| US-4.1 | Tasting Note on Consumption | S6 | Claire | R2 |
| US-4.2 | Add Tasting Note Independently | S6 | Vivienne | R2 |
| US-4.3 | View All Tasting Notes | S6 | Daniel | R2 |
| US-4.4 | Edit or Delete Tasting Note | S6 | Claire | R2 |
| US-4.5 | Average Rating & Would-Buy-Again | S6 | Vivienne | R2 |
| US-5.1 | Collection Summary Stats | S7 | Marcus | R2 |
| US-5.2 | Collection Composition Breakdown | S7 | Vivienne | R2 |
| US-5.3 | Highest-Rated & Recently Added | S7 | Claire | R2 |
| US-5.4 | Recently Consumed Wines | S7 | Daniel | R2 |
| US-5.5 | Dashboard Loads Fresh Data | S7 | Vivienne | R2 |
| US-6.1 | App Comfortable on Phone | S1 | Marcus | R1 |
| US-6.2 | Thumb-Friendly Bottom Bar | S1 | Daniel | R1 |
| US-6.3 | Add Wine in Under 60s | S2 | Daniel | R1 |
| US-6.4 | Mobile-Friendly Filter Panel | S3 | Claire | R1 |
| US-6.5 | Fast Load Times | S1 | Marcus | R1 |
| US-6.6 | Accessible Interface | S1 | Claire | R1 |

---

*STORY-MAP-WineApp v1.0 — Generated 2026-05-21*
