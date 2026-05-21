# Requirements: Personal Wine Collection Management Software

**Defined:** 2026-05-21
**Core Value:** A wine collector can always know what they own, where it is stored, when to drink it, and which bottle best fits the moment — all from a single, elegant, mobile-friendly app.

## v1 Requirements

### Wine Inventory (F0)

- [ ] **INV-01**: User can add a wine record with full fields (name, producer, vintage, country, region, appellation, wine type, grape variety, bottle size, quantity owned, storage location, purchase date, purchase source, purchase price, estimated value, drinking window start/end, notes)
- [ ] **INV-02**: User can view the complete wine list with key details visible (name, producer, vintage, type, quantity, drinking status)
- [ ] **INV-03**: User can view a wine detail page showing all fields for a single wine
- [ ] **INV-04**: User can edit and update any field on an existing wine record
- [ ] **INV-05**: User can delete a wine record from the collection
- [ ] **INV-06**: System tracks quantity owned and quantity consumed separately per wine record

### Drinking Window & Readiness (F1)

- [ ] **DRK-01**: User can define a drinking window (start year and end year) per wine record
- [ ] **DRK-02**: System computes and displays a drinking status badge per wine (Drink Now / Hold / Approaching Peak / Past Recommended Window / Special Occasion Only)
- [ ] **DRK-03**: User can view a "Ready to Drink" filtered list showing all wines currently in their drinking window
- [ ] **DRK-04**: System displays a "Last Bottle" warning when quantity is 1 before user confirms a consume or gift action

### Search & Filter (F2)

- [ ] **SRH-01**: User can perform full-text search across wine name, producer, region, and notes fields
- [ ] **SRH-02**: User can filter the collection by wine type (Red, White, Rosé, Sparkling, Dessert, Fortified)
- [ ] **SRH-03**: User can filter by region, country, vintage year, and grape variety
- [ ] **SRH-04**: User can filter by drinking readiness status (e.g., show only "Drink Now" wines)
- [ ] **SRH-05**: User can filter by price range and personal rating
- [ ] **SRH-06**: User can filter by storage location
- [ ] **SRH-07**: User can sort the wine list by name, vintage, purchase date, rating, and drinking status
- [ ] **SRH-08**: User can clear all active filters and return to the full collection view

### Bottle Status Tracking (F3)

- [ ] **BTL-01**: User can mark a wine as consumed, which decrements the quantity owned by the specified amount and records a consumption event
- [ ] **BTL-02**: User can mark a wine as gifted, which decrements the quantity owned by 1 and records a gift event
- [ ] **BTL-03**: User can consume multiple bottles in one action using a quantity stepper (max = quantity owned)
- [ ] **BTL-04**: User can view the bottle status history (timeline of consume and gift events) on the wine detail page

### Tasting Notes & Ratings (F4)

- [ ] **TST-01**: User can add a tasting note to a wine, including date opened, appearance, aroma, flavor, finish, food pairing, occasion, personal rating (1–100), would-buy-again flag, and optional guest feedback
- [ ] **TST-02**: User can view all tasting notes for a wine on the wine detail page, including average rating computed across all notes
- [ ] **TST-03**: User can edit an existing tasting note
- [ ] **TST-04**: User can delete a tasting note

### Collection Insights Dashboard (F5)

- [ ] **INS-01**: User can view a summary dashboard showing total bottles owned and total estimated collection value
- [ ] **INS-02**: User can see counts of wines by readiness category (Drink Now, Approaching Peak, Hold, Past Window)
- [ ] **INS-03**: User can see collection composition breakdown by wine type, most common regions, and most common grape varieties
- [ ] **INS-04**: User can see highlights sections: highest-rated wines, recently added wines, recently consumed wines, and average purchase price

### Mobile-First UX (F6)

- [ ] **MOB-01**: Application layout is fully responsive and optimized for 375px mobile screens and up (tablet and desktop supported)
- [ ] **MOB-02**: User can add a wine to the collection in under 60 seconds on a mobile device (minimum required fields only, with optional sections collapsible)
- [ ] **MOB-03**: Application is installable as a Progressive Web App (PWA) with proper manifest, icons, and display mode

## v2 Requirements

### Data Import/Export

- **EXP-01**: User can export the wine collection to a CSV spreadsheet
- **EXP-02**: User can export the wine collection to a PDF report
- **EXP-03**: User can import wines from a CSV file

### Alerts & Reminders

- **ALT-01**: System sends notifications when wines enter their drinking window
- **ALT-02**: System sends alerts for wines approaching end of recommended drinking window

### Food Pairing & Occasions

- **OCC-01**: User can filter wines by food pairing type (steak, seafood, cheese, etc.)
- **OCC-02**: User can filter wines by occasion (casual dinner, special celebration, holiday, etc.)

### Shared Access

- **SHA-01**: User can invite a household member to access the same collection
- **SHA-02**: Multiple household members can view and update the shared collection

### AI & Automation

- **AI-01**: User can scan a bottle label with phone camera to auto-fill wine record fields
- **AI-02**: System generates AI-assisted tasting note summaries from structured fields
- **AI-03**: System provides personalized wine recommendations based on collection history and preferences
- **AI-04**: System identifies collection gaps and suggests wines to buy

## Out of Scope

| Feature | Reason |
|---------|--------|
| Restaurant wine list management | Commercial use case — explicitly excluded per business vision |
| Retail inventory management | Commercial use case — explicitly excluded per business vision |
| Point-of-sale integration | Commercial use case — not relevant to personal collection |
| Distributor ordering workflows | Commercial use case — not relevant to personal collection |
| Commercial compliance features | Commercial use case — not relevant to personal collection |
| Large-scale warehouse inventory | Commercial use case — not relevant to personal collection |
| Multi-user accounts (v1) | Adds auth complexity; personal use proven first; deferred to v2 |
| Wine valuation market data | Requires external API integration; deferred to future phase |
| Cellar map visualization | Complex spatial UI; deferred to future phase |
| Integration with wine databases | External data reliability concerns; deferred to future phase |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INV-01 | — | Pending |
| INV-02 | — | Pending |
| INV-03 | — | Pending |
| INV-04 | — | Pending |
| INV-05 | — | Pending |
| INV-06 | — | Pending |
| DRK-01 | — | Pending |
| DRK-02 | — | Pending |
| DRK-03 | — | Pending |
| DRK-04 | — | Pending |
| SRH-01 | — | Pending |
| SRH-02 | — | Pending |
| SRH-03 | — | Pending |
| SRH-04 | — | Pending |
| SRH-05 | — | Pending |
| SRH-06 | — | Pending |
| SRH-07 | — | Pending |
| SRH-08 | — | Pending |
| BTL-01 | — | Pending |
| BTL-02 | — | Pending |
| BTL-03 | — | Pending |
| BTL-04 | — | Pending |
| TST-01 | — | Pending |
| TST-02 | — | Pending |
| TST-03 | — | Pending |
| TST-04 | — | Pending |
| INS-01 | — | Pending |
| INS-02 | — | Pending |
| INS-03 | — | Pending |
| INS-04 | — | Pending |
| MOB-01 | — | Pending |
| MOB-02 | — | Pending |
| MOB-03 | — | Pending |

**Coverage:**
- v1 requirements: 33 total
- Mapped to phases: 0
- Unmapped: 33 ⚠️ (will be resolved during roadmap creation)

---
*Requirements defined: 2026-05-21*
*Last updated: 2026-05-21 after initial definition*
