# Jobs-to-be-Done Document
## Personal Wine Collection Management Software
**Product Name:** WineApp
**Project Acronym:** WineApp
**Version:** 1.0
**Date:** 2026-05-21
**Status:** Draft
**Related Personas:** `project_specs/PERSONAS-WineApp.md`
**Related PRD:** `project_specs/PRD-WineApp.md`
**Related Project:** `.planning/PROJECT.md`

---

## Document Purpose

This document transforms the goals and pain points of each WineApp persona into outcome-driven job statements. Jobs are expressed in the "When / I want / So I can" format and scoped to their hiring persona (PER-XX). Hiring criteria define what would cause a persona to choose WineApp for that job; success measures are quantifiable outcomes. The Outcome-to-Feature Traceability and NaC Preview sections connect these jobs to PRD features and candidate acceptance criteria for downstream use in story mapping and verification.

---

## JTBD Summary Table

| JTBD ID | Persona | Job Statement (abbreviated) | Priority |
|---|---|---|---|
| JTBD-01.1 | PER-01 Marcus | Instantly know what I own when deciding what to open or buy | P0 |
| JTBD-01.2 | PER-01 Marcus | Keep my collection current with minimal effort after each bottle | P0 |
| JTBD-01.3 | PER-01 Marcus | Understand roughly what my collection is worth at a glance | P2 |
| JTBD-02.1 | PER-02 Claire | Know exactly which of my bottles I should be drinking right now | P0 |
| JTBD-02.2 | PER-02 Claire | Build a personal tasting journal I can consult to guide future purchases | P1 |
| JTBD-02.3 | PER-02 Claire | Understand my collection composition so I can identify buying gaps | P1 |
| JTBD-03.1 | PER-03 Daniel | Pick the right bottle for tonight's dinner before guests arrive | P0 |
| JTBD-03.2 | PER-03 Daniel | Keep inventory accurate so I never reach for a bottle that's already gone | P0 |
| JTBD-03.3 | PER-03 Daniel | Build a personal pairing reference from real dinners I've hosted | P1 |
| JTBD-04.1 | PER-04 Vivienne | Know which high-value bottles are approaching peak or at risk of going past it | P0 |
| JTBD-04.2 | PER-04 Vivienne | Maintain a complete, precise inventory across all storage locations | P0 |
| JTBD-04.3 | PER-04 Vivienne | Understand collection composition and estimated value to guide rebalancing | P0 |

---

## PER-01: Marcus — The Casual Collector

### JTBD-01.1: Know What I Own — Instantly

**Job Statement:**
When I'm standing in a wine shop or deciding what to open for dinner, I want to see my full collection at a glance and confirm whether I already own a particular bottle, so I can avoid buying duplicates and choose the right wine without searching through memory or a disorganized notes app.

**Current Alternatives:**
- Scrolls through a disorganized note in iPhone Notes app — rarely up to date
- Tries to recall from memory what he bought, often unsuccessfully
- Sometimes photographs bottle labels but can never find them when needed

**Hiring Criteria:**
- Shows the full wine list immediately on opening the app — no loading delay above 3 seconds on mobile
- Supports fast search by wine name or producer in under 10 seconds
- Works entirely on a phone without requiring a desktop to be useful
- Requires no setup beyond adding bottles — no complex preferences or configuration

**Success Measure:** Marcus can confirm whether he already owns a specific bottle in under 10 seconds while standing in a shop.

**Related Features:** F0, F2, F6
**Priority:** P0

---

### JTBD-01.2: Keep My Collection Current Without Friction

**Job Statement:**
When I open a bottle at home or buy a new wine, I want to update my collection in under a minute on my phone, so I can trust that my inventory is always accurate and I never waste time re-entering the same wines.

**Current Alternatives:**
- Rarely updates his notes app — backlogs pile up and the list becomes inaccurate
- Sometimes takes a photo of a label intending to log it later, but rarely does
- Accepts inaccuracy as a fact of life with his current system

**Hiring Criteria:**
- "Add a bottle" form completes in under 60 seconds including required fields
- "Mark as consumed" is a single tap from the wine detail view — no multi-step workflow
- App uses smart defaults (e.g., quantity = 1) to minimize keystrokes
- Optional fields are visually distinct from required fields so he doesn't feel obligated to fill everything

**Success Measure:** Marcus adds a new bottle in under 60 seconds and marks a bottle consumed in under 15 seconds, on his phone, without instructions.

**Related Features:** F0, F3, F6
**Priority:** P0

---

### JTBD-01.3: Get a Sense of What My Collection Is Worth

**Job Statement:**
When I'm curious about the scale and value of what I've accumulated, I want to see a simple summary of my collection size and estimated value, so I can feel good about what I've built and share it with friends.

**Current Alternatives:**
- Has no idea what his collection is worth — never calculated it
- Occasionally counts bottles physically but doesn't track purchase prices anywhere

**Hiring Criteria:**
- Collection insights dashboard shows total bottles and estimated value on a single screen
- Estimated value is computed automatically from purchase prices entered per record
- No manual calculation required — the number is always current

**Success Measure:** Marcus can read off his total bottle count and estimated collection value within 10 seconds of opening the app.

**Related Features:** F5
**Priority:** P2

---

## PER-02: Claire — The Enthusiast

### JTBD-02.1: Know Which Bottles I Should Be Drinking Right Now

**Job Statement:**
When I'm planning what to open this week, I want to see all my wines that are currently in their drinking window — and identify any that are approaching peak or at risk of being held too long — so I can drink my bottles at their best and never waste a wine by opening it too late.

**Current Alternatives:**
- Manually calculates drinking readiness from her spreadsheet against the current year — tedious and error-prone
- Relies on a physical notebook of drinking window notes that is rarely cross-referenced
- Sometimes asks a wine merchant friend, which is impractical for routine decisions

**Hiring Criteria:**
- Drinking status (Drink Now / Hold / Approaching Peak / Past Window) is computed automatically from today's date — no manual calculation
- A dedicated "Drink Now" list is accessible from the home screen in under 2 taps
- Supports "Approaching Peak" status so she can plan 1–2 years ahead
- Drinking status updates live without requiring manual refresh

**Success Measure:** Claire can identify all "Drink Now" wines in under 5 seconds from the home screen, with no manual calculation required.

**Related Features:** F1, F2
**Priority:** P0

---

### JTBD-02.2: Build a Tasting Journal That Informs Future Buying

**Job Statement:**
When I open a significant bottle, I want to record my tasting impressions — aroma, flavor, finish, and whether I'd buy it again — so I can build a personal reference I can consult months later to guide future purchases and avoid repeating mistakes.

**Current Alternatives:**
- Keeps tasting notes in a physical notebook that is rarely consulted and never searchable
- Writes brief notes in her spreadsheet's comments column — limited space and no structured fields
- Relies on memory, which degrades quickly for bottles consumed months ago

**Hiring Criteria:**
- Tasting note form includes structured fields: date opened, rating, free-text notes, food pairing, occasion, and "would buy again"
- Tasting notes are attached to the wine record and visible in the wine detail view
- A wine can have multiple tasting notes across different bottles or dates
- Collection can be filtered and sorted by personal rating

**Success Measure:** At least 80% of Claire's consumed bottles have a tasting note recorded within 30 days of adoption, measured against her total consumption rate.

**Related Features:** F4, F3
**Priority:** P1

---

### JTBD-02.3: Understand My Collection Composition to Plan Future Purchases

**Job Statement:**
When I'm planning a buying trip or reviewing a merchant's allocation list, I want to see a breakdown of my collection by region, grape, and vintage, so I can identify where I'm over-indexed and which gaps in my cellar I should be filling.

**Current Alternatives:**
- Manually counts rows in her spreadsheet grouped by region — time-consuming and error-prone
- Relies on intuition about what she has too much or too little of
- Occasionally lays out bottles physically to mentally survey the collection

**Hiring Criteria:**
- Collection insights dashboard shows breakdown by wine type, region, and grape variety
- Breakdown reflects live data — updates automatically when bottles are added or consumed
- Filtering collection by region or vintage is fast enough to use while on a merchant's website

**Success Measure:** Claire can identify her top 3 over-represented regions and her most significant vintage gap in under 60 seconds from the insights dashboard.

**Related Features:** F5, F2
**Priority:** P1

---

## PER-03: Daniel — The Home Entertainer

### JTBD-03.1: Pick the Right Bottle for Tonight's Dinner

**Job Statement:**
When I'm in the kitchen an hour before guests arrive and need to decide which bottles to open, I want to filter my collection by wine type and drinking readiness in seconds, so I can confidently select bottles that are at their best and appropriate for the food I'm serving — without guessing.

**Current Alternatives:**
- Walks to the cellar and physically looks at bottles, relying on memory and label reading
- Opens wines that turn out to be past their window because he has no readiness tracking
- Calls or texts a wine-savvy friend for a second opinion, which is not always available

**Hiring Criteria:**
- Can filter collection by wine type (red / white / rosé / sparkling) in a single tap
- Drinking status is computed automatically and visible on the wine list without opening individual records
- Filter results appear instantly — no page reload or significant loading delay
- Mobile interface is operable one-handed while standing in a kitchen

**Success Measure:** Daniel selects an appropriate bottle for dinner in under 60 seconds using search and filter, without opening a single bottle that is outside its drinking window.

**Related Features:** F1, F2, F6
**Priority:** P0

---

### JTBD-03.2: Keep Inventory Accurate So I Never Reach for a Phantom Bottle

**Job Statement:**
When a dinner party ends and bottles have been opened or gifted, I want to mark them as consumed or given away quickly, so I can trust that my collection view always reflects what's actually on the rack — and I never plan a menu around a bottle that no longer exists.

**Current Alternatives:**
- Frequently forgets to update any record — inventory drifts from reality over weeks
- Discovers "phantom bottles" only when physically reaching for them before an event
- Has no gifting tracking — bottles given to guests disappear from memory entirely

**Hiring Criteria:**
- Mark-as-consumed is accessible directly from the wine detail view in one tap
- Mark-as-gifted is a distinct status option to differentiate from consumed
- Quantity owned decrements automatically — no manual count adjustment needed
- Ability to undo a status update if logged in error

**Success Measure:** Zero phantom bottle incidents — Daniel's inventory is always accurate before a hosting event, measured by no cases of planned bottles being absent from the rack.

**Related Features:** F3, F0
**Priority:** P0

---

### JTBD-03.3: Build a Personal Pairing Reference From Real Dinners

**Job Statement:**
When I've just had a successful wine-and-food pairing at a dinner, I want to record what worked — what I served, what I thought of the wine, and whether I'd repeat the combination — so I can build a personal reference that helps me make better pairing decisions for future dinners without starting from scratch each time.

**Current Alternatives:**
- Has no record of past pairings — relies entirely on memory, which fades quickly
- Googles generic pairing suggestions that don't reflect his personal experience or guests' tastes
- Occasionally emails himself a note about a pairing but never consolidates them

**Hiring Criteria:**
- Tasting note form includes a food pairing field attached to each consumed bottle record
- Tasting notes are searchable and filterable so he can find pairing records by wine type or region
- Entry is quick enough to do post-dinner without it feeling like a chore — under 2 minutes

**Success Measure:** Daniel builds at least 10 food pairing notes within 60 days of adoption, each attached to a consumed bottle record.

**Related Features:** F4, F3
**Priority:** P1

---

## PER-04: Vivienne — The Serious Collector

### JTBD-04.1: Know Which High-Value Bottles Are Approaching Peak or at Risk

**Job Statement:**
When I'm planning near-term openings or reviewing my cellar's readiness, I want to see which bottles are in their drinking window, which are approaching peak in the next 1–2 years, and which have gone past their window, so I can protect the value of my collection by drinking every significant bottle at its best — and never discover a missed window too late.

**Current Alternatives:**
- Manually calculates drinking readiness from her spreadsheet, cross-referencing each row against the current year — highly error-prone at 400+ bottles
- Keeps a separate physical cellar book that is always running behind her actual collection
- Relies on producer release notes and critic guidance, which do not account for her specific storage conditions or stock

**Hiring Criteria:**
- Drinking status (Drink Now / Hold / Approaching Peak / Past Window) is computed automatically from defined windows — no manual calculation at any scale
- A dedicated "Drink Now" list and "Approaching Peak" view are available from primary navigation
- Filter collection by drinking status to isolate at-risk bottles
- Drinking window fields accept start and end year with precision; no forced approximation

**Success Measure:** Zero high-value bottles are opened past their peak window within 12 months of adoption; Vivienne can identify all "Approaching Peak" bottles in under 10 seconds.

**Related Features:** F1, F2
**Priority:** P0

---

### JTBD-04.2: Maintain a Complete, Precise Inventory Across All Storage Locations

**Job Statement:**
When I acquire new bottles or move wine between storage locations, I want to record every detail — producer, vintage, storage location, purchase price, and quantity — so I can maintain a single authoritative source of truth for my entire collection that I can trust for both operational decisions and financial tracking.

**Current Alternatives:**
- Maintains two parallel systems: a spreadsheet and a physical cellar book — both perpetually behind reality
- Storage location is tracked informally in the cellar book only, which is not portable
- Purchase prices are scattered across email receipts, not linked to bottle records
- Regularly discovers bottles she didn't know she still had because they are buried in the spreadsheet

**Hiring Criteria:**
- Wine record supports storage location, purchase price, purchase date, and purchase source as first-class fields
- All fields are editable after initial entry — no locked records
- Collection view is searchable and filterable by storage location, producer, and vintage
- App is usable on desktop as well as phone for bulk review sessions

**Success Measure:** 100% of Vivienne's bottles have storage location, drinking window, and purchase price recorded within 60 days of adoption; she never discovers an "unknown" bottle she forgot she owned.

**Related Features:** F0, F2, F6
**Priority:** P0

---

### JTBD-04.3: Understand Collection Composition and Value to Guide Rebalancing

**Job Statement:**
When I'm reviewing my cellar or considering a significant purchase, I want to see a clear breakdown of my collection by region, grape, and vintage alongside an estimated total value, so I can make data-informed decisions about where to add to the collection and ensure I am not over-exposed in any single area.

**Current Alternatives:**
- Manually counts and groups spreadsheet rows by region and grape — takes 30–45 minutes for a full review
- Total collection value has never been calculated — she estimates it mentally from memory
- No visual summary of composition — she must build pivot tables in Excel to get any breakdown

**Hiring Criteria:**
- Collection insights dashboard shows breakdown by wine type, region, and grape variety — all computed automatically
- Estimated total collection value is displayed and updates live as bottles are added or consumed
- Breakdown reflects current owned quantity (not historical records) — consumed bottles removed from counts
- Dashboard is accessible in one tap from primary navigation and loads within 3 seconds

**Success Measure:** Vivienne can answer "What is my collection worth today?" and identify her top 3 over-represented regions in under 10 seconds from the insights dashboard.

**Related Features:** F5, F0
**Priority:** P0

---

## Outcome-to-Feature Traceability

| JTBD ID | Related Feature(s) | Expected Outcome |
|---|---|---|
| JTBD-01.1 | F0, F2, F6 | Marcus confirms bottle ownership in <10 seconds at point of purchase |
| JTBD-01.2 | F0, F3, F6 | Marcus adds a bottle in <60 seconds; marks consumed in <15 seconds on mobile |
| JTBD-01.3 | F5 | Marcus reads total bottle count and estimated value in <10 seconds |
| JTBD-02.1 | F1, F2 | Claire identifies all "Drink Now" wines in <5 seconds from home screen |
| JTBD-02.2 | F4, F3 | ≥80% of Claire's consumed bottles have a tasting note recorded |
| JTBD-02.3 | F5, F2 | Claire identifies composition gaps in <60 seconds from insights dashboard |
| JTBD-03.1 | F1, F2, F6 | Daniel selects a dinner bottle in <60 seconds; no past-window bottles selected |
| JTBD-03.2 | F3, F0 | Zero phantom bottle incidents; inventory accurate before every hosting event |
| JTBD-03.3 | F4, F3 | Daniel builds ≥10 pairing notes within 60 days of adoption |
| JTBD-04.1 | F1, F2 | Zero high-value bottles past peak window; "Approaching Peak" visible in <10 seconds |
| JTBD-04.2 | F0, F2, F6 | 100% of Vivienne's bottles have location, window, and price; no unknown bottles |
| JTBD-04.3 | F5, F0 | Collection value and top-3 over-represented regions readable in <10 seconds |

---

## NaC Preview

Natural Acceptance Criteria previews for each job. These will be refined into full NaC statements during story mapping (STORY-MAP).

| JTBD ID | Outcome | Candidate Natural Acceptance Criterion |
|---|---|---|
| JTBD-01.1 | Confirm ownership in <10 seconds | Given Marcus searches for a wine by name, the matching record appears within 10 seconds of opening the app on a mobile device |
| JTBD-01.2 | Add bottle in <60 seconds | Given Marcus completes the "Add a Bottle" form on mobile with required fields only, the bottle appears in his collection list within 60 seconds of starting the form |
| JTBD-01.2 | Mark consumed in <15 seconds | Given Marcus opens a wine record, he can mark it as consumed in a single tap and the quantity decrements immediately |
| JTBD-01.3 | View collection value in <10 seconds | Given Marcus opens the insights dashboard, total bottle count and estimated value are displayed without any additional navigation |
| JTBD-02.1 | "Drink Now" list in <5 seconds | Given Claire opens the app, she can reach the "Drink Now" list in 2 taps or fewer, and the list shows only wines currently within their defined drinking window |
| JTBD-02.1 | Drinking status auto-computed | Given a wine record with a drinking window defined, the app displays the correct drinking status (Drink Now / Hold / Approaching Peak / Past Window) without any manual input from the user |
| JTBD-02.2 | Tasting note recorded on consumption | Given Claire marks a bottle as consumed, she can attach a tasting note with rating, free-text, food pairing, and "would buy again" in the same workflow |
| JTBD-02.3 | Composition breakdown available | Given Claire opens the insights dashboard, she sees a breakdown of her collection by region and grape variety reflecting current owned bottles |
| JTBD-03.1 | Filter by type in one tap | Given Daniel is on the wine list, he can filter to show only red wines (or any single type) in one tap, with results updating immediately |
| JTBD-03.1 | Drinking status visible on list | Given Daniel views the filtered wine list, the drinking status of each wine is visible without opening the individual record |
| JTBD-03.2 | Mark gifted is distinct from consumed | Given Daniel opens a wine record, he can mark it as "gifted" as a status distinct from "consumed," and the quantity decrements accordingly |
| JTBD-03.2 | Undo status update | Given Daniel marks a bottle as consumed in error, he can undo the action and restore the original quantity |
| JTBD-03.3 | Food pairing field on tasting note | Given Daniel records a tasting note, a food pairing field is available to capture what was served with the wine |
| JTBD-04.1 | "Approaching Peak" filter | Given Vivienne views her collection, she can filter to show only wines where drinking status is "Approaching Peak" and the results are accurate to the current date |
| JTBD-04.2 | Storage location per record | Given Vivienne adds a bottle, she can specify a storage location as a required or optional field, and the collection can be filtered by that location |
| JTBD-04.2 | Purchase price per record | Given Vivienne adds a bottle, she can record a purchase price that is then included in the estimated collection value calculation |
| JTBD-04.3 | Collection value on dashboard | Given Vivienne opens the insights dashboard, the estimated total collection value is shown and reflects only currently owned bottles (not consumed) |
| JTBD-04.3 | Composition by region | Given Vivienne opens the insights dashboard, a breakdown by region shows the count and percentage of bottles per region, current to the most recent add or consume action |

---

*JTBD-WineApp v1.0 — Generated 2026-05-21*
