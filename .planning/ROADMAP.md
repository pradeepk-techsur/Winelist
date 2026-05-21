# Roadmap: Personal Wine Collection Management Software

## Overview

Six phases that build a complete personal wine cellar app from the data foundation up. Phase 1 establishes core inventory CRUD and responsive layout. Phase 2 adds the primary differentiator — drinking window intelligence and readiness status. Phase 3 closes the bottle lifecycle loop with consume/gift tracking and price/location filtering. Phase 4 completes the search and discovery layer. Phase 5 builds the personal wine journal (tasting notes and ratings). Phase 6 delivers the collection insights dashboard and PWA installability — completing the full MVP.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Core Inventory** - Wine record CRUD, data model, auth, and responsive layout foundation
- [ ] **Phase 2: Drinking Windows & Status** - Readiness intelligence, status badges, Ready to Drink list, and status-based filtering/sorting
- [ ] **Phase 3: Bottle Lifecycle** - Consume/gift tracking, quantity management, price/location filters, and clear filters
- [ ] **Phase 4: Search & Discovery** - Full-text search, wine type filter, and attribute filters (region, country, vintage, grape)
- [ ] **Phase 5: Tasting Notes & Ratings** - Personal wine journal, structured tasting notes, ratings, CRUD
- [ ] **Phase 6: Insights & PWA** - Collection dashboard, analytics, fast-add UX optimization, and PWA install

## Phase Details

### Phase 1: Core Inventory
**Status**: In Progress
**Goal**: Users can manage their complete wine collection — adding, viewing, editing, and deleting wine records — from a responsive mobile-friendly interface
**Depends on**: Nothing (first phase)
**Requirements**: INV-01, INV-02, INV-03, INV-04, INV-05, INV-06, MOB-01
**Success Criteria** (what must be TRUE):
  1. User can add a wine record with all fields (name, producer, vintage, country, region, appellation, wine type, grape variety, bottle size, quantity owned, storage location, purchase date, purchase source, purchase price, estimated value, drinking window start/end, notes) and it appears in their collection
  2. User can view the wine list showing name, producer, vintage, type, quantity, and drinking status for each wine
  3. User can open a wine detail page and see all fields for a single wine record
  4. User can edit any field on an existing wine record and see the update reflected immediately
  5. User can delete a wine record (with confirmation) and it no longer appears in the list; system tracks quantity owned and consumed separately per wine
**Plans**: 6 plans

Plans:
- [ ] 01-01-PLAN.md — Bootstrap Next.js 15 + Turbopack, Serwist PWA scaffold, auth (httpOnly cookie), offline fallback page
- [ ] 01-02-PLAN.md — Drizzle schema + Turso migration, Dexie local schema, Zod validation schemas, shared types
- [ ] 01-03-PLAN.md — Server Actions: addWine, updateWine, deleteWine, getWines, addConsumptionEvent
- [ ] 01-04-PLAN.md — Offline sync infrastructure: sync service, useNetworkStatus, /api/ping, OfflineBanner, SyncIndicator, SyncProvider
- [ ] 01-05-PLAN.md — App layout + bottom nav + useWines hook + WineCard + WineStatusBadge + cellar page
- [ ] 01-06-PLAN.md — WineForm + WineDrawer + useWineActions (offline-first) + wine detail page + delete with confirmation

### Phase 2: Drinking Windows & Status
**Goal**: Users can understand at a glance when each wine in their collection is best to drink, and see a dedicated list of wines ready to enjoy right now
**Depends on**: Phase 1
**Requirements**: DRK-01, DRK-02, DRK-03, DRK-04, SRH-04, SRH-07
**Success Criteria** (what must be TRUE):
  1. User can set a drinking window (start year and end year) on any wine record
  2. Every wine in the list and detail view shows a color-coded status badge (Drink Now / Hold / Approaching Peak / Past Window / Special Occasion Only) computed from today's date
  3. User can navigate to a "Ready to Drink" view and see only wines currently within their drinking window
  4. When only 1 bottle remains, the app displays a "Last Bottle" warning before the user confirms a consume or gift action
  5. User can filter the wine list by drinking readiness status, and sort by name, vintage, purchase date, rating, and drinking status
**Plans**: TBD

### Phase 3: Bottle Lifecycle
**Goal**: Users can record when bottles are consumed or gifted, keeping their inventory accurate and maintaining a history of what they've drunk
**Depends on**: Phase 2
**Requirements**: BTL-01, BTL-02, BTL-03, BTL-04, SRH-05, SRH-06, SRH-08
**Success Criteria** (what must be TRUE):
  1. User can mark a wine as consumed (with quantity stepper up to quantity owned), which decrements quantity owned and records a timestamped consumption event
  2. User can mark a wine as gifted, which decrements quantity owned by 1 and records a gift event
  3. User can view a bottle status history (timeline of consume and gift events) on the wine detail page
  4. User can filter the wine list by price range, personal rating, and storage location
  5. User can clear all active filters and return to the full collection view
**Plans**: TBD

### Phase 4: Search & Discovery
**Goal**: Users can find any wine in their collection in seconds using free-text search and attribute filters
**Depends on**: Phase 3
**Requirements**: SRH-01, SRH-02, SRH-03
**Success Criteria** (what must be TRUE):
  1. User can type in a search box and instantly see matching wines filtered by name, producer, region, and notes
  2. User can filter the collection by wine type (Red, White, Rosé, Sparkling, Dessert, Fortified)
  3. User can filter by region, country, vintage year, and grape variety, with results updating immediately without a page reload
**Plans**: TBD

### Phase 5: Tasting Notes & Ratings
**Goal**: Users can record and review their personal tasting experiences for any wine, building a private wine journal over time
**Depends on**: Phase 4
**Requirements**: TST-01, TST-02, TST-03, TST-04
**Success Criteria** (what must be TRUE):
  1. User can add a tasting note to a wine including date opened, appearance, aroma, flavor, finish, food pairing, occasion, personal rating (1–100), would-buy-again flag, and optional guest feedback
  2. User can view all tasting notes for a wine on the wine detail page, with average rating computed across all notes
  3. User can edit an existing tasting note and see the update reflected
  4. User can delete a tasting note with confirmation
**Plans**: TBD

### Phase 6: Insights & PWA
**Goal**: Users have a live collection command center showing key metrics at a glance, can add a wine in under 60 seconds on mobile, and can install the app to their phone home screen
**Depends on**: Phase 5
**Requirements**: INS-01, INS-02, INS-03, INS-04, MOB-02, MOB-03
**Success Criteria** (what must be TRUE):
  1. User can view a summary dashboard showing total bottles owned and total estimated collection value
  2. User can see counts of wines by readiness category (Drink Now, Approaching Peak, Hold, Past Window) and collection composition breakdown by wine type, most common regions, and most common grape varieties
  3. User can see highlights: highest-rated wines, recently added wines, recently consumed wines, and average purchase price
  4. User can add a wine to the collection in under 60 seconds on a mobile device using minimum required fields with optional sections collapsible
  5. Application is installable as a PWA with proper manifest, icons, and standalone display mode
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Core Inventory | 0/6 | Not started | - |
| 2. Drinking Windows & Status | 0/TBD | Not started | - |
| 3. Bottle Lifecycle | 0/TBD | Not started | - |
| 4. Search & Discovery | 0/TBD | Not started | - |
| 5. Tasting Notes & Ratings | 0/TBD | Not started | - |
| 6. Insights & PWA | 0/TBD | Not started | - |