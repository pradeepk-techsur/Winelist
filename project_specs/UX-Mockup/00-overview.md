# UX Mockup — WineApp
**Project:** Personal Wine Collection Management Software
**Generated:** 2026-05-21
**Based on:** UserStories-WineApp.md, PRD-WineApp.md, FRD-WineApp.md, JOURNEYS-WineApp.md
**Version:** 1.0

---

## UX Approach & Design Principles

### Vision
WineApp must feel like a *premium personal lifestyle app* — not an inventory system. Every screen should evoke the pleasure of wine collecting: unhurried, elegant, trustworthy. Users should feel in control of something they love, not burdened by administration.

### Core UX Mandate
> Simple to use. Fast to update. Visually clean. Mobile-first. Search-driven. Personalized. Helpful without being complicated.

### Design Principles

| # | Principle | What it means in practice |
|---|-----------|---------------------------|
| P1 | **Speed first** | App load ≤3s; search results ≤500ms; form submit ≤1s. Every interaction feels instant. |
| P2 | **Thumb-zone native** | All primary actions reachable one-handed at 375px. Destructive actions intentionally placed out of thumb zone. |
| P3 | **Progressive disclosure** | Required fields first, always. Optional detail hidden behind collapsible "More Details." Never overwhelm with fields. |
| P4 | **Status at a glance** | Drinking status badges on every wine card — never force a tap-in to answer "is this ready?" |
| P5 | **Graceful trust** | Data completeness indicators; live dashboard updates; "last bottle" alerts. The app earns trust through accuracy. |
| P6 | **Reward engagement** | Quick add is fast, but full detail is celebrated. Tasting note completion, collection milestones, and dashboard value updates feel satisfying. |
| P7 | **Mobile-first, desktop-responsive** | Design target: 375px phone. Desktop is a responsive enhancement — wider forms, more fields visible at once. |

---

### Color Palette (Drinking Status)

| Status | Color | Code |
|--------|-------|------|
| Drink Now | Green | `#2D6A4F` (or similar deep green) |
| Approaching Peak | Amber | `#D97706` |
| Hold | Blue | `#2563EB` |
| Past Window | Red-Orange | `#DC2626` |
| Special Occasion | Purple | `#7C3AED` |
| No Window | Grey | `#6B7280` |

---

### Navigation Architecture

```
┌──────────────────────────────────┐
│          Bottom Nav Bar          │
│  [Collection] [Drink Now] [+Add] │
│  [Dashboard]  [Search]           │
└──────────────────────────────────┘
```

**Primary Navigation (Bottom Bar — 5 items):**
1. **Collection** — Wine list (default landing)
2. **Drink Now** — Ready to drink filtered view
3. **+ Add** — Floating action / prominent CTA (center slot)
4. **Dashboard** — Collection insights
5. **Search** — Quick access to search/filter (or persistent search bar in Collection)

> Per US-6.2: Bottom nav pinned to viewport bottom. "Add Wine" is most prominent CTA — center slot with differentiated styling. Any section reachable in ≤2 taps.

---

### Screen Inventory

| Screen ID | Screen Name | Primary User Stories |
|-----------|-------------|----------------------|
| SCR-01 | Wine List / Collection View | US-0.3, US-2.1, US-2.2, US-2.4, US-2.5 |
| SCR-02 | Add / Edit Wine Form | US-0.1, US-0.2, US-0.5, US-1.1, US-1.4, US-6.3 |
| SCR-03 | Wine Detail View | US-0.4, US-0.6, US-3.1, US-3.2, US-3.3, US-4.2, US-4.3 |
| SCR-04 | Search & Filter Panel | US-2.1, US-2.2, US-2.3, US-2.4, US-6.4 |
| SCR-05 | Ready to Drink View | US-1.3, US-1.2 |
| SCR-06 | Tasting Notes Entry | US-4.1, US-4.2, US-4.4 |
| SCR-07 | Collection Insights Dashboard | US-5.1, US-5.2, US-5.3, US-5.4, US-5.5 |

---

### Flow Inventory

| Flow ID | Flow Name | Primary Journeys |
|---------|-----------|-----------------|
| FLW-01 | Add a Wine (Quick Path) | JRN-01.1 |
| FLW-02 | Find a Bottle (Search) | JRN-01.2 |
| FLW-03 | Open a Bottle (Consume + Tasting Note) | JRN-02.1, JRN-03.2 |
| FLW-04 | Choose a Wine for Dinner (Filter + Status) | JRN-03.1 |
| FLW-05 | Review Collection (Dashboard) | JRN-04.2, JRN-02.2 |
| FLW-06 | Delete Wine / Undo Status Event | US-0.6, US-3.4 |

---

*00-overview.md — WineApp UX Mockup*
