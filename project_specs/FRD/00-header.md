# Functional Requirements Document
## Personal Wine Collection Management Software
**Project Acronym:** WineApp
**FRD Version:** 1.0
**Date:** 2026-05-21
**Status:** Draft
**Based on:** PRD-WineApp v1.0

---

## Scope

This document provides detailed functional specifications for all features in WineApp v1 (Phase 1 MVP). It covers every PRD feature from F0 through F6, including inputs, outputs, validation rules, error states, API surface, and database schema. This document is the authoritative reference for development implementation. Non-functional requirements (performance, reliability, accessibility) supplement but do not replace this document.

---

## Conventions

- **Feature IDs** match PRD feature IDs (F0–F6). Each feature is documented in its own chunk file.
- **Field names** use `snake_case` matching database column and API field names.
- **HTTP methods** are uppercase (GET, POST, PUT, PATCH, DELETE).
- **Required fields** are marked *(required)* in Inputs sections; all others are optional.
- **Error codes** follow the pattern `DOMAIN_CONDITION` (e.g., `WINE_NOT_FOUND`).
- **Cross-references** use the pattern `see F03 §Process step 2` or `see Y0-schema.md §wines`.
- **Priority** levels: P0 = blocking MVP delivery; P1 = high value, MVP but not blocking.
- **Validation failure** responses always return HTTP 422 with structured error payload.

---

## Table of Contents

| Section | File | Description |
|---------|------|-------------|
| F00 | `F00-wine-inventory.md` | Wine Inventory Management (Core CRUD) |
| F01 | `F01-drinking-window.md` | Drinking Window Tracking |
| F02 | `F02-search-filter.md` | Search and Filter |
| F03 | `F03-bottle-status.md` | Bottle Status Tracking |
| F04 | `F04-tasting-notes.md` | Tasting Notes & Personal Ratings |
| F05 | `F05-insights-dashboard.md` | Collection Insights Dashboard |
| F06 | `F06-mobile-ux.md` | Mobile-First User Experience |
| Y0 | `Y0-schema.md` | Database Schema (full DDL) |
| Y1 | `Y1-api.md` | REST API Endpoints (full catalog) |
| Y2 | `Y2-errors.md` | Cross-Feature Error Catalog |
| Y3 | `Y3-integrations.md` | External Integration Points |

---

## Cross-Cutting Terminology

The following terms are used consistently across all feature specifications:

- **Wine Record:** A database entry representing a specific wine (label, vintage, producer). One wine record can track multiple bottles.
- **Bottle:** A single physical unit of wine. A wine record tracks how many bottles are owned and consumed.
- **Collection:** The complete set of all wine records owned by the user, excluding fully consumed/gifted bottles with zero quantity remaining.
- **Drinking Window:** A date range (start year → end year) indicating when a wine is at its best for drinking.
- **Drinking Status:** The computed readiness of a wine based on today's date vs. its drinking window. Values: `drink_now`, `hold`, `approaching_peak`, `past_window`, `special_occasion`.
- **Tasting Note:** A structured record of the user's impressions after opening and tasting a specific bottle.
- **Storage Location:** A user-defined label for where bottles are physically kept (e.g., "Wine Fridge", "Cellar Rack A", "Kitchen Counter").
- **Quantity Owned:** The number of bottles of a specific wine the user currently possesses (not yet consumed or gifted).
- **Quantity Consumed:** The cumulative number of bottles of a specific wine the user has opened and finished.
- **Estimated Value:** The sum of `purchase_price × quantity_owned` across all wine records. Not adjusted for market appreciation.
- **User:** The single authenticated owner of the WineApp instance. Multi-user is out of scope for v1.

---

## Authentication Model

WineApp v1 uses single-user authentication. All API endpoints require a valid session token (Bearer token or cookie-based session). Unauthenticated requests to any protected resource return HTTP 401. The auth mechanism itself (JWT, session cookie, etc.) is defined in `Y1-api.md §Authentication` and `Y3-integrations.md §Auth`.

---

*FRD-WineApp v1.0 — Header chunk*
