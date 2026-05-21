# User Journey Maps
## Personal Wine Collection Management Software
**Product Name:** WineApp
**Project Acronym:** WineApp
**Version:** 1.0
**Date:** 2026-05-21
**Status:** Draft
**Related Personas:** `project_specs/PERSONAS-WineApp.md`
**Related JTBD:** `project_specs/JTBD-WineApp.md`
**Related PRD:** `project_specs/PRD-WineApp.md`
**Related Project:** `.planning/PROJECT.md`

---

## Document Purpose

This document maps step-by-step user journeys for each WineApp persona across their highest-priority scenarios. Each journey captures the user's actions, touchpoints, internal thinking, emotional state, pain points, and product opportunities at every stage. Together, these maps validate usability and completeness of the PRD feature set, reveal cross-persona friction patterns, and feed directly into UX design and story mapping downstream.

---

## Journey Index

| Journey ID | Persona | Scenario | Key JTBD | Stages |
|---|---|---|---|---|
| JRN-01.1 | PER-01 Marcus | Add a Bottle — After a Wine Shop Purchase | JTBD-01.2 | 5 |
| JRN-01.2 | PER-01 Marcus | Find a Bottle — Checking Ownership at the Shop | JTBD-01.1 | 4 |
| JRN-02.1 | PER-02 Claire | Open a Bottle — Drinking Window Check and Tasting Note | JTBD-02.1, JTBD-02.2 | 6 |
| JRN-02.2 | PER-02 Claire | Plan Purchases — Identifying Collection Gaps | JTBD-02.3 | 5 |
| JRN-03.1 | PER-03 Daniel | Choose a Wine — Selecting Bottles for a Dinner Party | JTBD-03.1 | 5 |
| JRN-03.2 | PER-03 Daniel | Open a Bottle — Post-Dinner Inventory Update and Pairing Note | JTBD-03.2, JTBD-03.3 | 5 |
| JRN-04.1 | PER-04 Vivienne | Add a Bottle — Logging a High-Value Acquisition with Full Detail | JTBD-04.2 | 5 |
| JRN-04.2 | PER-04 Vivienne | Review Collection — Readiness and Composition Audit | JTBD-04.1, JTBD-04.3 | 6 |

---

## PER-01: Marcus — The Casual Collector

---

### JRN-01.1: Add a Bottle — After a Wine Shop Purchase

**Persona:** PER-01 (Marcus)
**Scenario:** Marcus has just returned home from a specialty wine shop with two new bottles he picked up on impulse. He wants to log them quickly before he forgets what he bought. He's standing in his kitchen with the bottles on the counter and his phone in hand. He needs the whole task done before dinner prep starts.
**Related Jobs:** JTBD-01.2

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| 1. Launch | Opens WineApp on his phone | Home screen / App launch (F6) | "Let me get these logged while I still have them in front of me" | Neutral, slightly motivated | Slight apprehension — will this take forever? | Fast launch (<3s); collection visible immediately with no loading skeleton |
| 2. Initiate Add | Taps "Add a Bottle" button | Add Bottle CTA (F0, F6) | "Okay, where's the button? Found it." | Calm | Can't find the add button if it's buried in a menu | Persistent floating "+" button visible from any screen; thumb-reachable on mobile |
| 3. Fill Form | Types wine name, producer, vintage, quantity; skips optional fields | Add Bottle form (F0, F6) | "What fields do I actually need to fill in? I don't know the appellation." | Mildly anxious — worried about leaving things blank | Unclear which fields are required vs. optional; might feel like he's doing it wrong | Required fields clearly marked; smart defaults (quantity = 1, type auto-suggested from name) |
| 4. Save | Taps Save; bottle appears in collection list | Collection list (F0) | "Done. That was fast — or was it?" | Relieved, mildly satisfied | No visible confirmation that it saved correctly | Inline success toast ("Bordeaux added to your collection"); new bottle highlighted in list |
| 5. Repeat | Picks up second bottle, taps Add again | Add Bottle form (F0, F6) | "Same process. I hope it pre-fills some stuff." | Routine | Starts fully blank every time — no memory of last entry | "Add another wine" shortcut pre-fills region/type from previous add; reduces repeat typing |

#### Key Moments
- **Decision Point (Stage 3):** Marcus decides whether to fill in optional fields — if he feels judged for skipping them, he'll abandon. Required-only must genuinely feel complete.
- **Risk of Abandonment (Stage 3):** If the form looks long or complex on mobile, Marcus will close the app and never log the bottle.
- **Delight Opportunity (Stage 4):** A brief, affirming confirmation message ("Your 43rd bottle!") makes the act feel rewarding rather than administrative.
- **Delight Opportunity (Stage 5):** Pre-filling region or type from the previous entry signals the app is learning his habits — builds trust.

#### Success Outcome
Marcus adds both bottles in under 2 minutes total without reading any instructions (JTBD-01.2 success measure: add a bottle in <60 seconds on mobile).

#### Feature Touchpoints

| Stage | Features |
|---|---|
| 1. Launch | F6 (Mobile UX) |
| 2. Initiate Add | F0 (Inventory), F6 (Mobile UX) |
| 3. Fill Form | F0 (Inventory), F6 (Mobile UX) |
| 4. Save | F0 (Inventory) |
| 5. Repeat | F0 (Inventory), F6 (Mobile UX) |

---

### JRN-01.2: Find a Bottle — Checking Ownership at the Wine Shop

**Persona:** PER-01 (Marcus)
**Scenario:** Marcus is browsing a specialty wine shop and picks up a bottle of Côtes du Rhône he thinks he might already have at home. He pulls out his phone to check before buying a duplicate. He has about 30 seconds before the shop assistant comes back with another recommendation.
**Related Jobs:** JTBD-01.1

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| 1. Launch | Opens WineApp from home screen | App launch (F6) | "Let me just quickly check if I already have this" | Slightly pressured | If app is slow to open, he'll give up and guess | Sub-3-second load to showing the wine list; no mandatory login screen on return visit |
| 2. Search | Types the wine name into the search bar | Search (F2, F6) | "Is it under the producer name or the wine name? Let me try the wine name first." | Uncertain | Doesn't know which field to search — will his data be findable? | Universal search across wine name, producer, and region simultaneously; shows match as he types |
| 3. Review Result | Scans the search result showing wine name, producer, vintage, and quantity | Collection list (F2, F0) | "Yes! I have one. No wait, quantity shows 0 — did I already drink it?" | Briefly confused | Quantity of zero showing in results could mean consumed, not owned | Filter defaults to showing only owned bottles (qty > 0); consumed bottles excluded by default with option to show |
| 4. Decide | Puts bottle back or buys based on what he sees | (No in-app action) | "Great — I still have one at home. I'll skip this." | Confident, relieved | None at this stage if result is clear | Clear per-result quantity badge ("1 owned") so he doesn't misread the data |

#### Key Moments
- **Decision Point (Stage 3):** Whether he trusts the inventory data — if quantity is inaccurate due to a phantom bottle, he loses trust in the app.
- **Risk of Abandonment (Stage 1–2):** Any friction (login prompt, slow load, unclear search) causes him to pocket the phone and guess. He only has seconds.
- **Delight Opportunity (Stage 4):** Confident "I have 1 of this" answer — the app just saved him money and gave him a win. This is the moment that creates habit.

#### Success Outcome
Marcus confirms whether he owns the wine in under 10 seconds from unlocking his phone (JTBD-01.1 success measure).

#### Feature Touchpoints

| Stage | Features |
|---|---|
| 1. Launch | F6 (Mobile UX) |
| 2. Search | F2 (Search/Filter), F6 (Mobile UX) |
| 3. Review Result | F2 (Search/Filter), F0 (Inventory) |
| 4. Decide | — |

---

## PER-02: Claire — The Enthusiast

---

### JRN-02.1: Open a Bottle — Drinking Window Check and Tasting Note

**Persona:** PER-02 (Claire)
**Scenario:** Claire is planning her Wednesday evening at home and wants to open something meaningful from her cellar of 180 bottles. She starts by checking the "Drink Now" list, selects a 2016 Gevrey-Chambertin that's been waiting, opens it, and then records a detailed tasting note after dinner.
**Related Jobs:** JTBD-02.1, JTBD-02.2

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| 1. Check Drink Now | Opens app and navigates to the "Drink Now" list | Home screen → Drink Now (F1, F6) | "What's ready this week? Something interesting, not just the easy bottles." | Curious, slightly anticipatory | Has to navigate too many taps to reach the Drink Now list | "Drink Now" shortcut on home screen; count badge visible without entering the list |
| 2. Browse & Select | Scans the Drink Now list; taps the Gevrey-Chambertin to see its detail | Wine detail (F1, F2) | "How long has this been in the window? When does it peak? Should I wait or open now?" | Thoughtful, engaged | Drinking window displayed but no nuance — just "Drink Now" without time-in-window context | Show years remaining in window ("In window — 3 years left") and "Approaching Peak" warning if near end year |
| 3. Go to Cellar | Retrieves the bottle from her cellar | (Physical action) | "Was this in the upper rack or the lower rack?" | Focused | App doesn't help with physical location — this is a gap if she has many bottles | Storage location field visible on wine detail; if filled in, it removes the physical hunt |
| 4. Mark as Consumed | Returns with bottle, opens wine detail, taps "Mark as Consumed" | Wine detail → Consumed action (F3) | "I should log this properly. Not just mark it gone." | Methodical | Consumed action triggers the note form — she wants to fill it after drinking, not before | Offer "Add note now" and "Remind me later" options; don't force note at consume time |
| 5. Drink & Observe | Pours, tastes, forms impressions over dinner | (Physical action) | "Good structure but less fruit than I expected. I'd still buy it again at this price." | Evaluative, pleased | No in-app prompt to jog her memory; she might forget specific impressions | Optional: quick interim capture ("Save quick note now") before the full tasting form |
| 6. Record Tasting Note | After dinner, opens wine record, fills in structured tasting note form | Tasting note form (F4) | "Rating: 90. Aroma: earthy, dark cherry, cedar. Finish: long. Would buy again: yes." | Satisfied, accomplished | Form may feel limiting if structured sub-fields don't match her vocabulary | Hybrid form: structured fields (rating, pairing, would buy again) plus open free-text area for full notes |

#### Key Moments
- **Decision Point (Stage 2):** Whether to open the Gevrey or hold it — the app's window detail is the deciding input. If data is thin, she falls back to her spreadsheet.
- **Risk of Abandonment (Stage 4):** If the consume-and-note workflow feels like a two-step interruption, Claire will skip the note and record it in her paper notebook instead.
- **Delight Opportunity (Stage 6):** Completing a detailed tasting note and seeing it attached to the wine record creates the sense of building something lasting — her personal wine journal.
- **Critical Moment (Stage 1):** Finding "Drink Now" in ≤2 taps is a hard success criterion. If this requires deep navigation, Claire questions the app's value.

#### Success Outcome
Claire identifies her drink-now wines in under 5 seconds from home screen and records a complete tasting note within one post-dinner session (JTBD-02.1 and JTBD-02.2 success measures).

#### Feature Touchpoints

| Stage | Features |
|---|---|
| 1. Check Drink Now | F1 (Drinking Window), F6 (Mobile UX) |
| 2. Browse & Select | F1 (Drinking Window), F2 (Search/Filter) |
| 3. Go to Cellar | F0 (Inventory — storage location field) |
| 4. Mark as Consumed | F3 (Bottle Status) |
| 5. Drink & Observe | — |
| 6. Record Tasting Note | F4 (Tasting Notes) |

---

### JRN-02.2: Plan Purchases — Identifying Collection Gaps

**Persona:** PER-02 (Claire)
**Scenario:** Claire is home on a Sunday afternoon reviewing an allocation email from a Burgundy importer. She wants to decide whether to buy any of the offered bottles by checking what she already has, where her collection is over-represented, and which regions or vintages she needs more of.
**Related Jobs:** JTBD-02.3

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| 1. Open Insights | Opens the Collection Insights dashboard | Insights dashboard (F5) | "Let me see where I'm stacked up before I commit to this allocation." | Analytical, deliberate | Dashboard takes more than a tap to reach — she's interrupted from the purchase flow | Insights accessible from main nav tab in one tap; loads within 3 seconds |
| 2. Review Composition | Reads breakdown by region: Burgundy is 38%, Rhône 22%, Bordeaux 15%... | Insights — Region breakdown (F5) | "I'm very Burgundy-heavy. But these are Chambolle village wines — I may want them anyway." | Thoughtful | Breakdown shows regions but not sub-regions or appellations — her analysis needs more granularity | Drill-down: tap a region to filter the collection list to that region immediately |
| 3. Filter by Vintage | Switches to collection list; filters by vintage year 2018–2020 | Collection list → Filter (F2) | "I'm thin on 2019s. If there's a good 2019 in this offer, I'll take it." | Focused, purposeful | Filter requires multiple taps to set a vintage range on mobile | Fast vintage range filter; pre-set shortcut "Recent vintages (2018–2023)" |
| 4. Cross-Reference Offer | Reads allocation list, cross-references against the filter results in the app | Collection list (F2), external email | "They're offering a 2019 Gevrey. I only have one 2019 Burgundy. This makes sense." | Confident | Bouncing between email and app is clunky on one device | No in-app fix needed here — the speed of filter response is what matters most |
| 5. Decide and Close | Makes buying decision; closes app | (No in-app action) | "I'll take two bottles. Collection is balanced enough." | Satisfied | No way to bookmark a buying decision or wishlist in the app (v1 gap) | Future: "Want to buy" list or wishlist placeholder per wine — deferred to Phase 2 |

#### Key Moments
- **Decision Point (Stage 2):** Does the composition breakdown show enough to make a real buying argument? If it's too coarse (just red/white/rosé), Claire will pull up her spreadsheet instead.
- **Risk of Abandonment (Stage 3):** If vintage filtering is slow or awkward on mobile, she'll abandon the app and rely on memory.
- **Delight Opportunity (Stage 2 → 3):** Seamless tap-to-drill from the composition chart into the filtered collection list is a power-user delight moment — it rewards her investment in maintaining detailed records.

#### Success Outcome
Claire identifies her top over-represented region and most significant vintage gap in under 60 seconds from the insights dashboard (JTBD-02.3 success measure).

#### Feature Touchpoints

| Stage | Features |
|---|---|
| 1. Open Insights | F5 (Collection Insights) |
| 2. Review Composition | F5 (Collection Insights — region breakdown) |
| 3. Filter by Vintage | F2 (Search/Filter) |
| 4. Cross-Reference Offer | F2 (Search/Filter) |
| 5. Decide and Close | — |

---

## PER-03: Daniel — The Home Entertainer

---

### JRN-03.1: Choose a Wine — Selecting Bottles for a Dinner Party

**Persona:** PER-03 (Daniel)
**Scenario:** Daniel is hosting 8 people for dinner on Saturday. He's in the kitchen at 5:30pm, one hour before guests arrive, finishing prep for a rack of lamb. He needs to pick two red bottles that are drinking well now and appropriate for the food. His phone is propped on the counter.
**Related Jobs:** JTBD-03.1

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| 1. Launch and Filter | Opens app; taps the Red wine filter | Collection list → Type filter (F2, F6) | "I want reds. Let me filter everything else out." | Purposeful, slightly rushed | If filter is hidden behind a panel, he'll skip it and just scroll | Single-tap type filter chips (Red / White / Rosé / Sparkling) pinned above the collection list |
| 2. Check Readiness | Scans filtered list for Drink Now status badges | Collection list with status badges (F1, F2) | "Which of these are actually ready right now and not just guesswork?" | Focused | No readiness indicator on list view — must open each wine to check | Drinking status badge displayed on each card in the list view — "Drink Now" in green |
| 3. Identify Candidates | Spots two Drink Now reds that fit the occasion; taps each to view detail | Wine detail (F0, F1) | "The Rioja and the Barolo. Are they heavy enough for lamb? Let me check my notes." | Growing confidence | No food pairing data on most records — he hasn't built his reference yet | If a prior tasting note with a food pairing exists, surface it in the wine detail |
| 4. Confirm Availability | Checks quantity on each; confirms 2+ bottles of each in stock | Wine detail (F0) | "Two Riojas and one Barolo. The Barolo is my last bottle — is it worth opening tonight?" | Slightly hesitant | Nothing flags when he's about to open his last bottle of a wine | "Last bottle" alert on detail view: "This is your last bottle of this wine" |
| 5. Select and Go | Decides on the Rioja; closes app; heads to cellar | (Physical action) | "Rioja it is. Party of 8, two bottles, sorted." | Confident, relieved | Sometimes retrieves the wrong bottle if storage location isn't recorded | Storage location shown prominently on detail view for quick retrieval |

#### Key Moments
- **Decision Point (Stage 4):** Whether to open the last bottle of a special wine — this is a high-stakes micro-decision. A gentle alert adds enormous value without adding friction.
- **Risk of Abandonment (Stage 1–2):** If the filter-to-result flow takes more than 15 seconds, Daniel will walk to the cellar and start physically browsing bottles instead. Speed is everything.
- **Delight Opportunity (Stage 3):** Seeing his own prior tasting note with a food pairing is the "aha" moment that converts Daniel from occasional to habitual user — the app just paid off.

#### Success Outcome
Daniel selects an appropriate bottle for dinner in under 60 seconds using filter and status badges, without opening a past-window bottle (JTBD-03.1 success measure).

#### Feature Touchpoints

| Stage | Features |
|---|---|
| 1. Launch and Filter | F2 (Search/Filter), F6 (Mobile UX) |
| 2. Check Readiness | F1 (Drinking Window), F2 (Search/Filter) |
| 3. Identify Candidates | F0 (Inventory), F1 (Drinking Window) |
| 4. Confirm Availability | F0 (Inventory) |
| 5. Select and Go | F0 (Inventory — storage location) |

---

### JRN-03.2: Open a Bottle — Post-Dinner Inventory Update and Pairing Note

**Persona:** PER-03 (Daniel)
**Scenario:** Daniel's dinner party is winding down. Three bottles were opened tonight — two Riojas and a Champagne someone brought as a gift. He wants to log the consumed bottles and capture a quick note about the Rioja pairing before he forgets. It's 11pm; he's tired but knows if he doesn't do it now, he never will.
**Related Jobs:** JTBD-03.2, JTBD-03.3

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| 1. Open Consumed Wine | Searches for the Rioja; opens wine detail | Search (F2), Wine detail (F0) | "Quick search for the Rioja. I opened two so I need to mark two consumed." | Tired, functional | Has to navigate to each wine individually to mark consumed | Multi-consume: from detail view, "Mark X as consumed" with quantity picker (1 or 2) |
| 2. Mark as Consumed | Taps "Mark as Consumed" twice for the Rioja (qty: 2) | Bottle status action (F3) | "Done. Quantity should drop from 4 to 2." | Satisfied | One tap per bottle — tedious if he opened 3+ bottles tonight | Quantity-based consume: single tap on "Consumed" triggers a "How many?" stepper |
| 3. Add Pairing Note | Immediately taps "Add tasting note" from the consume confirmation | Tasting note form (F4) | "Lamb, Rioja, worked really well. Rating: 88. Food pairing: rack of lamb with herbs." | Engaged but brief | Full tasting note form might feel heavy at 11pm — he wants quick capture | Quick-note mode: just rating + food pairing field + free-text in one scrollable screen |
| 4. Handle Gift Bottle | Tries to log the Champagne a guest brought; it's not in his collection | Search returns no results (F2) | "It's not in here. I'd have to add it first just to mark it consumed. Is that worth it?" | Mildly frustrated | Adding a wine just to immediately mark it consumed is a clunky two-step | "Log a consumed wine not in your collection" shortcut: add-and-immediately-consume in one flow |
| 5. Close and Sleep | Gives up on logging the Champagne; closes app | — | "I'll do it tomorrow. Probably won't." | Slightly defeated | Friction on step 4 means gift bottles rarely get logged | Gift bottle quick-add: minimal fields (name, type, date), auto-marked consumed on save |

#### Key Moments
- **Decision Point (Stage 3):** Whether the tasting note form feels light enough to complete at 11pm — if it looks like homework, he'll skip it and the pairing reference never gets built.
- **Risk of Abandonment (Stage 4):** The gift bottle scenario is a known failure mode. If adding an unlisted wine requires the full add form, the data never gets captured.
- **Delight Opportunity (Stage 2):** Seeing quantity drop from 4 to 2 instantly and accurately — the app just proved it keeps the inventory honest.
- **Critical Moment (Stage 3):** This is where the pairing reference is either built or not. The design of the quick-note form is one of the most consequential UX decisions for Daniel's long-term value.

#### Success Outcome
Daniel marks both bottles consumed and records one food pairing note in under 3 minutes at end of evening (JTBD-03.2 zero phantom bottles; JTBD-03.3 builds pairing reference).

#### Feature Touchpoints

| Stage | Features |
|---|---|
| 1. Open Consumed Wine | F2 (Search/Filter), F0 (Inventory) |
| 2. Mark as Consumed | F3 (Bottle Status) |
| 3. Add Pairing Note | F4 (Tasting Notes) |
| 4. Handle Gift Bottle | F0 (Inventory), F3 (Bottle Status) |
| 5. Close and Sleep | — |

---

## PER-04: Vivienne — The Serious Collector

---

### JRN-04.1: Add a Bottle — Logging a High-Value Acquisition with Full Detail

**Persona:** PER-04 (Vivienne)
**Scenario:** Vivienne has just taken delivery of 6 bottles of 2020 Barolo from a producer she follows in Piedmont. She purchased them as a futures allocation at £120/bottle. She wants to log all 6 immediately with full detail — producer, vintage, storage location (Cave B, rack 3), purchase price, purchase source, and drinking window (2027–2042). She's at her kitchen table with her laptop.
**Related Jobs:** JTBD-04.2

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| 1. Open on Desktop | Navigates to WineApp in her laptop browser | Desktop / responsive web (F0, F6) | "Six bottles, all identical records. Can I add them as one entry with quantity 6?" | Systematic, efficient | Mobile-first app may have awkward layout on desktop; form may be narrow | Responsive layout adapts to desktop: wider form, more fields visible at once; quantity field prominent |
| 2. Fill Full Record | Enters all fields: producer, vintage, country, region, appellation, grape, storage location, purchase price, purchase date, purchase source, quantity | Add Bottle form (F0) | "I want every field filled. I need storage location and purchase price especially — the app must have both." | Detail-oriented, precise | Missing a field she considers essential (e.g., purchase source) would be a dealbreaker | All 12+ fields present in the form; none hidden behind "advanced" toggles for her use case |
| 3. Set Drinking Window | Enters drinking window: start year 2027, end year 2042 | Drinking window fields (F1) | "2027 to 2042. That's a 15-year window. Needs to be exact — not a dropdown." | Exacting | Dropdowns or pre-set ranges force approximation she doesn't want | Free numeric entry for both start and end year; no forced rounding or pre-set windows |
| 4. Save and Verify | Saves the record; reviews it in the collection list | Collection list (F0, F2) | "Six bottles, Cave B Rack 3, Hold status — perfect. Let me just confirm it all looks right." | Satisfied, focused | No way to preview the record before committing or to see a summary of what was saved | Post-save confirmation shows all entered data as a read-only summary; one tap to edit if wrong |
| 5. Verify Insights Updated | Navigates to collection insights to confirm total value and bottle count updated | Insights dashboard (F5) | "My collection value should have gone up by £720. Let me check the dashboard reflects that." | Methodical | If dashboard doesn't update immediately, she questions data reliability | Dashboard live-updates; value delta shown ("Collection value +£720") on the insights screen |

#### Key Moments
- **Decision Point (Stage 2):** If any of Vivienne's required fields (especially storage location, purchase price, or drinking window) are missing or hidden, she will not adopt the app — she needs these fields to replace her spreadsheet.
- **Risk of Abandonment (Stage 1):** If the responsive web layout is a cramped mobile layout stretched to desktop, she'll find the experience unsatisfying and stick to her spreadsheet.
- **Delight Opportunity (Stage 5):** Seeing collection value update in real time after adding an acquisition is viscerally satisfying — it makes her collection feel like a managed asset, not just a list.
- **Critical Moment (Stage 3):** The precision of the drinking window input defines whether she trusts the system. Forced approximation is a dealbreaker.

#### Success Outcome
Vivienne logs 6 bottles with complete detail in a single session; all fields (storage, price, window) are recorded; collection dashboard updates immediately (JTBD-04.2 success measure).

#### Feature Touchpoints

| Stage | Features |
|---|---|
| 1. Open on Desktop | F0 (Inventory), F6 (Mobile UX — responsive) |
| 2. Fill Full Record | F0 (Inventory) |
| 3. Set Drinking Window | F1 (Drinking Window) |
| 4. Save and Verify | F0 (Inventory), F2 (Search/Filter) |
| 5. Verify Insights Updated | F5 (Collection Insights) |

---

### JRN-04.2: Review Collection — Readiness and Composition Audit

**Persona:** PER-04 (Vivienne)
**Scenario:** It's the first Sunday of the month. Vivienne sits down with her laptop and a notebook to review her cellar. She wants to: (1) identify any bottles approaching their peak window in the next 12–18 months, (2) check if any past-window bottles have been missed, and (3) understand her current collection composition to inform a Burgundy auction decision she is considering.
**Related Jobs:** JTBD-04.1, JTBD-04.3

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| 1. Open Insights Dashboard | Navigates to the Insights dashboard from main nav | Insights dashboard (F5) | "Let me start with the big picture. What does the collection look like today?" | Composed, analytical | Dashboard might load slowly or not reflect recent additions | Dashboard loads in <3 seconds and reflects live data including last week's additions |
| 2. Check Collection Value and Count | Reads total bottles, estimated value, and composition summary | Insights — summary metrics (F5) | "498 bottles, £87,400 estimated value. That looks right. Let me dig into readiness." | Methodical | Estimated value is only as good as purchase price data completeness | Show data completeness indicator: "Value estimate based on 94% of records with purchase price" |
| 3. Filter Approaching Peak | Navigates to collection list; filters by "Approaching Peak" status | Collection list → Status filter (F1, F2) | "Who's peaking in the next 1–2 years? That's my priority list for the next buying and opening cycle." | Focused, task-driven | "Approaching Peak" filter might not exist or might be buried | "Approaching Peak" is a first-class filter option accessible from the status filter menu |
| 4. Scan At-Risk Wines | Reviews the filtered list; spots two 2008 Barolo bottles flagged "Approaching Peak" | Filtered list (F1, F2, F0) | "The 2008 Barolos are peaking next year. I need to plan at least two dinners around these." | Slightly alarmed, then decisive | No way to mark a wine for "planned opening" or annotate it with a reminder | Allow adding a private note per wine record: "Plan to open Q1 2027 — dinner with Carla" |
| 5. Check Past Window | Changes filter to "Past Window" status | Collection list → Status filter (F1, F2) | "Please let this be empty. Oh — one 2002 Rioja I forgot about. That's unfortunate." | Resigned, then resolved | No alert was sent before it passed its window | Future: drinking window alerts (Phase 2). For now, monthly dashboard review catches these |
| 6. Review Composition for Auction | Returns to Insights; studies region breakdown to assess Burgundy weighting | Insights — region breakdown (F5) | "Burgundy is 31% of my collection. If I win these cases at auction, it becomes 37%. Is that too concentrated?" | Deliberate | Composition breakdown can't show "what-if" scenarios (too advanced for v1) | Drill-down tap from region chart to collection list filtered by region, so she can scan what's in Burgundy |

#### Key Moments
- **Decision Point (Stage 3):** The "Approaching Peak" filter must exist and be accurate — this is Vivienne's primary protection against wasting high-value bottles. Inaccuracy here is a trust-destroying failure.
- **Critical Moment (Stage 5):** Discovering a past-window bottle is a real pain, but finding it in the app (rather than physically) is better than not knowing. The monthly review habit depends on the Insights + filter loop being fast enough to be worth doing.
- **Risk of Abandonment (Stage 6):** If the composition breakdown is too coarse (just red/white/rosé), Vivienne will find it useless for auction decisions and fall back to her spreadsheet pivot tables.
- **Delight Opportunity (Stage 3 → 4):** A concise "Approaching Peak" list that is accurate and actionable is the feature that makes Vivienne say "this app is worth it" — it replaces 45 minutes of spreadsheet work with 30 seconds.

#### Success Outcome
Vivienne identifies all Approaching Peak bottles and confirms no missed past-window wines in under 10 minutes; composition breakdown informs her auction decision (JTBD-04.1 and JTBD-04.3 success measures).

#### Feature Touchpoints

| Stage | Features |
|---|---|
| 1. Open Insights Dashboard | F5 (Collection Insights) |
| 2. Check Collection Value and Count | F5 (Collection Insights) |
| 3. Filter Approaching Peak | F1 (Drinking Window), F2 (Search/Filter) |
| 4. Scan At-Risk Wines | F1 (Drinking Window), F2 (Search/Filter), F0 (Inventory) |
| 5. Check Past Window | F1 (Drinking Window), F2 (Search/Filter) |
| 6. Review Composition for Auction | F5 (Collection Insights) |

---

## Cross-Journey Patterns

### CP-01: The Speed-of-Find Problem (All Personas)
**Appears in:** JRN-01.2, JRN-02.1, JRN-03.1, JRN-04.2
**Pattern:** Every persona reaches a moment of urgency — in a wine shop, before guests arrive, during a monthly review — where the app must return a result in seconds or the user abandons to a physical alternative (memory, spreadsheet, walking to the cellar). App launch time and search response speed are load-bearing for all four personas, not just Marcus. The 3-second load time and 500ms search response are not aspirational — they are retention requirements.
**Shared Opportunity:** Progressive load (show cached last-viewed collection immediately; update in background); search as you type with instant results.

---

### CP-02: The Drinking Status Visibility Gap (PER-02, PER-03, PER-04)
**Appears in:** JRN-02.1, JRN-03.1, JRN-04.2
**Pattern:** Claire, Daniel, and Vivienne all need drinking status visible without drilling into individual wine records. For Claire it's weekly planning; for Daniel it's pre-dinner triage; for Vivienne it's monthly audit. All three hit friction when status is only shown on the wine detail view, not the list.
**Shared Opportunity:** Drinking status badges on the wine list card (color-coded: green = Drink Now, yellow = Approaching Peak, grey = Hold, red = Past Window). This single change unblocks three journeys.

---

### CP-03: The Post-Event Logging Fatigue Problem (PER-01, PER-03)
**Appears in:** JRN-01.1 (Step 5), JRN-03.2 (Steps 3–4)
**Pattern:** Both Marcus and Daniel experience logging fatigue — they are motivated to log at the moment of purchase or event but the form is heavier than the moment deserves. This is the primary driver of inventory drift. The window for capture is narrow (5–10 minutes); if the app doesn't capture in that window, the data is often lost.
**Shared Opportunity:** A "Quick Add" mode — minimal required fields, smart defaults, single screen. Full detail can be added later. The quick add result appears in the collection as a draft with a prompt to complete it.

---

### CP-04: The Gift Bottle / Unlisted Wine Gap (PER-03)
**Appears in:** JRN-03.2 (Stage 4)
**Pattern:** Wines that arrive as gifts or are consumed without being previously logged cannot be tracked without adding them first. This creates a two-step barrier that most users abandon. Daniel is the most affected persona but Marcus would also encounter this.
**Shared Opportunity:** "Log a consumed bottle not in your collection" — a shortcut that creates the record and marks it consumed in one combined flow, with minimal required fields (name, type, date).

---

### CP-05: The Data Trust Dependency (PER-04, PER-02)
**Appears in:** JRN-04.1 (Stage 4–5), JRN-04.2 (Stage 2), JRN-02.2 (Stage 2)
**Pattern:** Both Vivienne and Claire's most important decisions (auction bids, allocation purchases, bottle openings) depend on the collection data being accurate and the app's computed values being trustworthy. Any perceived inaccuracy — a stale value, a dashboard that doesn't update, a status that seems wrong — causes these power users to revert to their spreadsheet. Trust is built slowly and lost instantly.
**Shared Opportunity:** Real-time dashboard updates; data completeness indicators; visible "last updated" timestamps on computed values; ability to edit any field at any time without restriction.

---

### CP-06: The "Last Bottle" Risk (PER-03, PER-04)
**Appears in:** JRN-03.1 (Stage 4), JRN-04.2 (Stage 4)
**Pattern:** Both Daniel and Vivienne risk opening significant wines without realizing it's the last bottle. For Daniel it's a social hosting decision; for Vivienne it's a financial and sentimental one. Neither would make the same decision with full information.
**Shared Opportunity:** "Last bottle" alert on the wine detail view — passive, non-blocking, visible when quantity = 1. No notification required; just a visible signal at the moment of decision.

---

## Journey-to-JTBD Traceability

| Journey ID | Stage | JTBD ID | Expected Outcome |
|---|---|---|---|
| JRN-01.1 | Stage 3: Fill Form | JTBD-01.2 | Marcus adds a bottle in <60 seconds; optional vs. required fields clearly distinct |
| JRN-01.1 | Stage 4: Save | JTBD-01.2 | Bottle appears in collection immediately on save; success feedback shown |
| JRN-01.1 | Stage 5: Repeat | JTBD-01.2 | Second bottle added faster than first due to smart defaults or pre-fill |
| JRN-01.2 | Stage 2: Search | JTBD-01.1 | Search returns matching results as Marcus types; results within 10 seconds of opening app |
| JRN-01.2 | Stage 3: Review Result | JTBD-01.1 | Quantity owned shown clearly; consumed bottles excluded from default results |
| JRN-02.1 | Stage 1: Check Drink Now | JTBD-02.1 | Drink Now list reachable in ≤2 taps from home screen; count visible on home |
| JRN-02.1 | Stage 2: Browse & Select | JTBD-02.1 | Time remaining in window displayed; Approaching Peak warning surfaced |
| JRN-02.1 | Stage 6: Record Tasting Note | JTBD-02.2 | Structured tasting note form with rating, pairing, free-text, would buy again |
| JRN-02.2 | Stage 2: Review Composition | JTBD-02.3 | Breakdown by region and grape variety; reflects live owned bottle counts |
| JRN-02.2 | Stage 3: Filter by Vintage | JTBD-02.3 | Vintage range filter available; results update immediately on mobile |
| JRN-03.1 | Stage 1: Launch and Filter | JTBD-03.1 | Type filter (Red/White/Rosé/Sparkling) accessible in one tap on collection list |
| JRN-03.1 | Stage 2: Check Readiness | JTBD-03.1 | Drinking status badge visible on wine list card without opening individual records |
| JRN-03.1 | Stage 4: Confirm Availability | JTBD-03.1 | Quantity shown on detail view; "last bottle" alert at quantity = 1 |
| JRN-03.2 | Stage 2: Mark as Consumed | JTBD-03.2 | Mark consumed with quantity picker from detail view; quantity decrements immediately |
| JRN-03.2 | Stage 3: Add Pairing Note | JTBD-03.3 | Tasting note form includes food pairing field; quick-capture mode for post-dinner use |
| JRN-03.2 | Stage 4: Handle Gift Bottle | JTBD-03.2 | Add-and-consume flow for unlisted wines; minimal fields required |
| JRN-04.1 | Stage 2: Fill Full Record | JTBD-04.2 | All required fields present (storage location, purchase price, purchase source, drinking window) |
| JRN-04.1 | Stage 3: Set Drinking Window | JTBD-04.2 | Free numeric input for start/end year; no forced rounding or dropdown approximation |
| JRN-04.1 | Stage 5: Verify Insights Updated | JTBD-04.2 | Collection value updates immediately after save; reflects new acquisition |
| JRN-04.2 | Stage 3: Filter Approaching Peak | JTBD-04.1 | "Approaching Peak" is a first-class status filter; results accurate to current date |
| JRN-04.2 | Stage 5: Check Past Window | JTBD-04.1 | "Past Window" filter surfaces bottles whose end year has passed; list is complete |
| JRN-04.2 | Stage 6: Review Composition | JTBD-04.3 | Region breakdown by count and percentage; drill-down to filtered list per region |
| JRN-04.2 | Stage 2: Check Value and Count | JTBD-04.3 | Estimated value and total bottle count on dashboard; data completeness indicator shown |

---

*JOURNEYS-WineApp v1.0 — Generated 2026-05-21*
