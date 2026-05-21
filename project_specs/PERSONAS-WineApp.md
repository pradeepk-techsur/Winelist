# Persona Profiles
## Personal Wine Collection Management Software
**Project Acronym:** WineApp
**Version:** 1.0
**Date:** 2026-05-21
**Status:** Draft
**Related PRD:** `project_specs/PRD-WineApp.md`
**Related Project:** `.planning/PROJECT.md`

---

## Document Purpose

This document expands the four primary target user archetypes identified in the WineApp PRD (Section 2.2 / PROJECT.md) into rich, first-class persona profiles. Each persona drives downstream JTBD definitions, user journey design, user story authorship, and UX decision-making. The four personas were selected from five business vision candidates — the Family Household User persona is deferred because shared/multi-user access is explicitly out of scope for v1 MVP.

---

## Persona Summary Table

| Persona ID | Name | Role | Primary Goal |
|---|---|---|---|
| PER-01 | Marcus | Casual Collector | Track a growing collection simply and find the right bottle fast |
| PER-02 | Claire | Enthusiast | Record tasting impressions and stay on top of drinking windows |
| PER-03 | Daniel | Home Entertainer | Quickly pick the right bottle for a dinner or occasion |
| PER-04 | Vivienne | Serious Collector | Manage a high-value collection with full readiness and composition visibility |

---

## PER-01: Marcus — The Casual Collector

**Role & Context:**
Marcus is a 38-year-old marketing manager who has gradually built a wine collection of around 40–60 bottles over the past three years. He buys wine at specialty retail shops and occasionally at winery visits, storing bottles in a temperature-controlled unit in his dining room. He enjoys wine with dinner a few nights a week but does not consider himself an expert. His current tracking system is a mix of memory and an ad-hoc note in his phone's Notes app — which he rarely updates. He reaches for the app on his phone while standing in the kitchen deciding what to open, or at the wine shop trying to remember if he already has a particular bottle.

**Goals:**
- Know at a glance what he owns without scrolling through an unstructured notes list (F0, F2)
- Avoid buying duplicate bottles he already has in stock (F0, F2)
- Find a suitable bottle for tonight's dinner in under 30 seconds (F2, F3)
- Keep the collection current — mark bottles as consumed without friction (F3)
- Understand roughly what his collection is worth (F5)

**Pain Points:**
- Forgets what he bought, especially when he purchased from multiple shops at different times (PRD §2)
- Has no single view of his full collection when standing in a wine shop (PRD §2)
- Opening bottles past their ideal window without knowing it (PRD §2)
- Dreads setup — any app that requires more than a few minutes to enter his existing collection will be abandoned (PRD §8)

**Technical Expertise:** Comfortable with smartphone apps; uses mobile banking, social media, and delivery apps daily. Not a power user — he will not configure complex preferences. Expects the app to be as simple as a shopping list app.

**Top Tasks:**
1. Add a new bottle after a wine shop purchase (frequent — 1–2×/week, critical path)
2. Check what he has before buying at a wine shop (frequent — weekly, high value)
3. Mark a bottle as consumed after opening it (frequent — several times/week, moderate friction today)
4. Browse collection to pick a wine for dinner (several times/week, must be fast)
5. Check total collection size and estimated value (occasional, satisfying)

**Success Criteria:**
- Adds a new bottle in under 60 seconds on his phone
- Can answer "do I already own this?" in under 10 seconds while standing in a shop
- No duplicate purchases within the first 30 days of active use
- Returns to the app at least once per week over the first month

---

## PER-02: Claire — The Enthusiast

**Role & Context:**
Claire is a 44-year-old architect who has been seriously collecting wine for seven years. Her cellar holds approximately 180 bottles spanning multiple regions, producers, and vintages — primarily Old World reds with a growing section of natural wines. She buys wine intentionally and methodically, follows several wine writers, and tracks producer and vintage ratings. She drinks wine 4–5 nights a week and takes genuine pleasure in noticing how a wine has evolved over time. Claire currently uses a spreadsheet to track her collection, and while it is functional, it is tedious to update on her phone and offers no insight into drinking readiness. She is the persona most likely to engage deeply with all features of the app — she will fill in every field if the form allows it.

**Goals:**
- Track drinking windows carefully so that no bottle is opened too early or left too long (F1)
- Build a personal tasting journal she can look back on to inform future purchases (F4)
- Know which bottles are drink-now vs. hold, with the status computed automatically (F1)
- Filter her collection quickly by region, grape, or vintage to support purchase decisions (F2)
- See collection composition at a glance — what regions and grapes dominate (F5)

**Pain Points:**
- Current spreadsheet doesn't compute drinking status; she must calculate it manually each time (PRD §2)
- No structured place to capture tasting notes — she keeps them in a separate notebook that rarely gets consulted (PRD §2)
- Cannot quickly answer "which of my bottles are peaking soon?" — a critical question for her (PRD §2)
- Buying wines she already has because the spreadsheet isn't open at the point of purchase (PRD §2)

**Technical Expertise:** High — fluent with complex apps, spreadsheets, and cloud tools. Will explore settings and optional fields. Expects precision: data she enters should behave predictably, sort correctly, and filter accurately.

**Top Tasks:**
1. Check the "Drink Now" list to identify what should be opened this week (weekly, high priority)
2. Log a tasting note immediately after opening a bottle (several times/week, central habit)
3. Review wines approaching their drinking window to plan upcoming openings (weekly)
4. Filter collection by region or vintage when planning a dinner menu (several times/week)
5. View collection insights to identify gaps for future buying (monthly, purchase-planning trigger)

**Success Criteria:**
- 100% of wines in her collection have a drinking window defined within 30 days of adoption
- At least 80% of consumed bottles have a tasting note recorded
- Can identify all "drink now" wines in under 5 seconds from the home screen
- Reports the app fully replaces her spreadsheet within 60 days

---

## PER-03: Daniel — The Home Entertainer

**Role & Context:**
Daniel is a 51-year-old sales director who hosts dinner parties, wine nights, and family gatherings 2–3 times per month. He has a cellar of 80–120 bottles that he manages primarily as a resource for entertaining. He is a knowledgeable wine buyer but not a rigorous tracker — he cares less about vintage data and more about knowing what's on hand and what pairs well with a particular meal. His critical moment is the hour before guests arrive, when he's in the kitchen wondering which bottles to open and whether the wine he has is appropriate for the food he's serving. He is a mobile-first user: the app is opened on the kitchen counter while cooking.

**Goals:**
- Quickly identify which wines are ready to drink for tonight's dinner (F1, F2)
- Filter his collection by wine type and region when planning a menu (F2)
- Keep bottle inventory current so he never reaches for a bottle that's already been consumed (F3, F0)
- Note food pairings when recording tasting notes, so he builds a personal pairing reference (F4)
- Confidently tell guests about the wines he's opening based on his own notes (F4)

**Pain Points:**
- Opens bottles that turn out to be past their window because he has no readiness tracking (PRD §2)
- Frequently "loses" bottles — has wine he forgot he owned, especially gifts or special occasion bottles (PRD §2)
- Has no record of what pairings worked well, so he can't repeat successful combinations (PRD §2)
- Reaches for a bottle in the rack and finds it already consumed because inventory is inaccurate (PRD §2)

**Technical Expertise:** Moderate — comfortable with apps and smartphones but prefers simplicity and speed over depth. Will not spend more than 2 minutes entering a wine record. Wants the app to feel like a well-organized drawer he can open and immediately find what he needs.

**Top Tasks:**
1. Scan collection by wine type to find a red or white suitable for tonight's meal (several times/month, high value)
2. Check which wines are currently in their drinking window before selecting bottles (pre-dinner, high priority)
3. Mark bottles as consumed after a dinner party (post-event, maintenance task)
4. Record a quick pairing note after a successful wine-and-food match (post-dinner, builds reference)
5. Search for a specific bottle to confirm it's still in stock before planning a menu around it (pre-event)

**Success Criteria:**
- Selects tonight's wine in under 60 seconds using search and filter
- Zero "phantom bottle" incidents — collection is always accurate before an event
- Builds at least 10 food pairing notes within the first 60 days
- Reports noticeably fewer past-window openings compared to pre-app behavior

---

## PER-04: Vivienne — The Serious Collector

**Role & Context:**
Vivienne is a 58-year-old private equity partner with a wine cellar of 400–600 bottles, spanning Bordeaux futures, Burgundy premiers crus, Italian verticals, and a growing section of aged California Cabernets. Her collection represents significant financial value and she manages it with the seriousness of any other asset class. She uses a combination of spreadsheets and a physical cellar book today — both are falling behind reality. She thinks in terms of readiness timelines (which bottles are approaching peak?), composition balance (am I over-indexed in one region?), and collection value. She accesses the app both on her phone and occasionally on her laptop when reviewing the collection holistically. She expects the data to be precise, the interface to be elegant, and the insights to reflect her collection accurately.

**Goals:**
- Maintain a complete, accurate inventory of every bottle across multiple storage locations (F0)
- Know which high-value bottles are approaching their drinking window or at risk of going past it (F1)
- Understand collection composition by region, grape, and vintage so she can rebalance purchases (F5)
- Track purchase price per bottle to maintain an estimate of collection value (F0, F5)
- Search by producer or vintage with precision when making opening or gifting decisions (F2)
- Record detailed tasting notes that support her buying decisions over time (F4)

**Pain Points:**
- Current spreadsheet cannot compute drinking readiness — she must calculate it manually (PRD §2)
- Missing bottles she forgot she owned because they are buried in the spreadsheet (PRD §2)
- No single view of collection value across all storage locations (PRD §2)
- No record of tasting history she can query systematically — notes scattered across multiple notebooks (PRD §2)
- Cannot see at a glance which regions she is over- or under-represented in (PRD §2)

**Technical Expertise:** High — very comfortable with data-driven tools and expects precision. Familiar with spreadsheets and financial dashboards. Values information density but not at the expense of elegance. Will use every field and every filter available to her.

**Top Tasks:**
1. Review the "Drink Now" and "Approaching Peak" lists to plan near-term openings (weekly)
2. Add newly acquired bottles with full detail — location, price, drinking window (post-purchase, critical path)
3. View collection insights dashboard to check composition by region and estimated value (monthly)
4. Search and filter by producer or vintage when selecting a bottle for a specific occasion (as-needed)
5. Record a detailed tasting note after opening a significant bottle (post-opening, important habit)

**Success Criteria:**
- 100% of bottles have storage location, drinking window, and purchase price recorded
- Can answer "what is my collection worth today?" from the dashboard in under 10 seconds
- Zero high-value bottles opened past their peak window within 12 months of adoption
- Collection composition breakdown is always current — reflects purchases and consumptions live

---

## Persona Relationships

| Persona | Interacts With | Nature of Interaction |
|---|---|---|
| PER-01 Marcus (Casual) | PER-03 Daniel (Entertainer) | Both select wines for social occasions; casual collector aspires toward entertainer habits |
| PER-02 Claire (Enthusiast) | PER-04 Vivienne (Serious) | Shared focus on drinking windows and tasting notes; Vivienne extends Claire's depth toward collection value |
| PER-03 Daniel (Entertainer) | PER-01 Marcus (Casual) | Entertainer's use of pairing notes and occasion tracking can inform casual collector's habit formation |
| PER-04 Vivienne (Serious) | PER-02 Claire (Enthusiast) | Vivienne needs all features Claire needs, plus collection insights and multi-location storage |

> **Note:** In v1 MVP, all personas are single-user. The Family Household User persona (shared access between spouses) is deferred to Phase 4 along with multi-user features.

---

## Feature-Persona Matrix

| Feature | Description | PER-01 Marcus (Casual) | PER-02 Claire (Enthusiast) | PER-03 Daniel (Entertainer) | PER-04 Vivienne (Serious) |
|---|---|---|---|---|---|
| **F0** | Wine Inventory Management | **Primary** | **Primary** | **Primary** | **Primary** |
| **F1** | Drinking Window Tracking | Secondary | **Primary** | **Primary** | **Primary** |
| **F2** | Search and Filter | **Primary** | **Primary** | **Primary** | **Primary** |
| **F3** | Bottle Status Tracking | **Primary** | **Primary** | **Primary** | **Primary** |
| **F4** | Tasting Notes and Ratings | Secondary | **Primary** | Secondary | **Primary** |
| **F5** | Collection Insights Dashboard | Secondary | Secondary | None | **Primary** |
| **F6** | Mobile-First UX | **Primary** | **Primary** | **Primary** | Secondary |

**Legend:**
- **Primary** — This feature is central to this persona's core job-to-be-done; it must work excellently for them
- **Secondary** — This persona will use the feature but it is not their primary driver
- **None** — This feature has minimal relevance or value for this persona in v1

---

## Persona Coverage Notes

- **F0 (Inventory)** is universal — all four personas require it as the foundational capability
- **F1 (Drinking Window)** is critical for PER-02, PER-03, and PER-04; PER-01 (Casual) benefits but is less likely to define windows for every bottle
- **F2 (Search/Filter)** is critical for all personas — the "find a bottle" journey is universal
- **F3 (Bottle Status)** is critical for all personas — keeping inventory accurate is table-stakes
- **F4 (Tasting Notes)** is highest priority for PER-02 and PER-04; PER-03 uses it for pairing reference; PER-01 is unlikely to record detailed notes in v1
- **F5 (Insights Dashboard)** is highest priority for PER-04; secondary for PER-02; PER-03 doesn't need it; PER-01 finds it satisfying but not critical
- **F6 (Mobile UX)** is most critical for PER-01, PER-02, PER-03 who primarily use the app on their phone; PER-04 may occasionally prefer desktop

---

*PERSONAS-WineApp v1.0 — Generated 2026-05-21*
