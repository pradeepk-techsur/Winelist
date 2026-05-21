# Personal Wine Collection Management Software

## What This Is

A personal digital wine cellar application that helps individual wine collectors organize, track, and enjoy their private wine collections. The software allows users to manage bottle inventory, track storage locations, record tasting notes, identify wines that are ready to drink, and select the right wine for specific meals, guests, or occasions. It is designed for personal use — more structured than a spreadsheet, but far simpler than commercial restaurant or retail wine systems.

## Core Value

A wine collector can always know what they own, where it is stored, when to drink it, and which bottle best fits the moment — all from a single, elegant, mobile-friendly app.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] User can add new wine records to the collection
- [ ] User can view the complete wine list
- [ ] User can modify or update existing wine records
- [ ] User can delete wine records
- [ ] User can track bottle quantity (owned and consumed)
- [ ] User can track wine type, vintage, region, producer, and grape variety
- [ ] User can track storage location per bottle
- [ ] User can track purchase price and purchase date
- [ ] User can define and view drinking windows per wine
- [ ] User can search and filter the collection by key attributes
- [ ] User can mark bottles as opened, gifted, or consumed
- [ ] User can add tasting notes and personal ratings
- [ ] User can view a list of wines that are ready to drink now
- [ ] User can view basic collection insights (total bottles, estimated value, common regions/grapes)
- [ ] Application is mobile-friendly and usable from a phone

### Out of Scope

- Export to spreadsheet/PDF — lower priority, deferred to v2
- Label scanning via camera — requires AI/camera integration, future phase
- AI-assisted bottle entry — future phase
- Food pairing suggestions — future scope
- Occasion-based recommendations — future scope
- Wine valuation support — future scope
- Cellar map or storage visualization — future scope
- Import from spreadsheets — future scope
- Alerts and reminders for drinking windows — future scope
- Shared household/multi-user access — future scope
- Integration with external wine data sources — future scope
- AI-based personal wine recommendation engine — future scope
- Restaurant wine list management — explicitly out of scope (commercial use)
- Retail inventory management — explicitly out of scope (commercial use)
- Point-of-sale integration — explicitly out of scope
- Distributor ordering workflows — explicitly out of scope
- Commercial compliance features — explicitly out of scope
- Large-scale warehouse inventory management — explicitly out of scope

## Context

The market gap this product addresses: personal wine collectors today rely on memory, paper notes, photos, or informal spreadsheets. As collections grow, these methods fail — bottles get forgotten, drinking windows are missed, duplicates are purchased, and collection value is invisible.

**Target user personas:**

| Persona | Description | Primary Need |
|---|---|---|
| Casual Collector | Owns a small but growing wine collection | Simple tracking and easy wine selection |
| Enthusiast | Regularly buys and drinks wine, tracks preferences | Tasting notes, drinking windows, insights |
| Home Entertainer | Hosts dinners and gatherings | Pairing and occasion-based recommendations |
| Serious Collector | Owns higher-value bottles across vintages and regions | Storage, valuation, readiness, collection analytics |
| Family Household User | Shares wine decisions with spouse or family | Shared access and simple bottle status tracking |

**Key user journeys:**
- Add a Bottle — user adds a new bottle after purchase
- Find a Bottle — user searches for a wine by region, vintage, or producer
- Choose a Wine — user selects a bottle for dinner or an occasion
- Open a Bottle — user marks a bottle as consumed and adds tasting notes
- Review Collection — user views insights on collection value, readiness, and composition
- Plan Purchases — user identifies gaps or favorites to guide future buying

**UX principles:** Simple to use, fast to update, visually clean, mobile-first, search-driven, personalized, elegant. The experience should feel like a premium personal lifestyle app — not a complex inventory system.

**Business vision document:** `project_specs/ref_docs/Wine Collection Software Business Vision.pdf`

## Constraints

- **UX/Design**: Mobile-first — application must work well on phone screens. Elegance matters.
- **Scope**: Personal use MVP first — no multi-user, no commercial features until core workflow is proven.
- **Complexity**: Must be simple enough for non-technical wine enthusiasts without deep wine expertise.
- **Data**: Wine data entry is manual for v1 — no camera scanning or AI auto-fill yet.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Build MVP first before commercializing | Validate personal use case before adding complexity | — Pending |
| Mobile-first UX | Primary users will look up and update wines on their phone | — Pending |
| Manual data entry for v1 | Keeps scope tight; camera/AI can be added in Phase 3 | — Pending |
| Personal use only for v1 | Multi-user adds auth complexity; prove core value first | — Pending |

---
*Last updated: 2026-05-21 after initialization*
