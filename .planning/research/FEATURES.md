# Feature Research

**Domain:** Personal Wine Collection Management (Mobile App)
**Researched:** 2026-05-21
**Confidence:** HIGH — sourced directly from CellarTracker support docs, App Store listings for Vivino, InVintory, Oeni, CellarTracker (verified current 2026 versions), and user reviews

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Add bottles to collection (manual entry) | Core purpose of the app — without this, nothing works | LOW | Fields: wine name, producer, vintage, region, varietal, type (red/white/rosé/sparkling), quantity |
| View all bottles in a list | Users need to see what they own at a glance | LOW | Sortable, scrollable list with key info visible per row |
| Edit bottle records | Data changes: bottles consumed, notes added, details corrected | LOW | Inline editing of all bottle fields |
| Delete bottle records | Housekeeping; wrong entries need removal | LOW | With confirmation prompt |
| Track bottle quantity (owned/consumed) | Collectors need to know how many they have and how many they've opened | LOW | Increment/decrement per bottle; history of consumption events |
| Track wine type, vintage, region, producer, varietal | The core wine identity fields — all competitors have these | LOW | These 6 fields are the minimum wine identity data model |
| Track storage location per bottle | Users want to physically find bottles; essential for collections > 20 bottles | LOW | Free-text or named locations (e.g., "Cellar Rack A", "Fridge") |
| Track purchase price and purchase date | Users want cost tracking and collection value; expected from all cellar apps | LOW | Per-bottle or per-lot price entry |
| Drinking window (start/end dates per wine) | All major apps have this; users expect to know when to open bottles | MEDIUM | User-defined; shown relative to current date |
| Search and filter collection | Collections grow; browsing a flat list becomes unusable at 50+ bottles | MEDIUM | Filter by type, region, vintage, varietal; text search by name/producer |
| Mark bottles as consumed / gifted | Users need to remove bottles from inventory with context about what happened | LOW | Consumption events with optional note; status: consumed, gifted, sold, spoiled |
| Tasting notes and personal ratings | All major apps have this; users record impressions when they open a bottle | LOW | Free-text note + numeric or star rating |
| "Ready to drink now" view | A curated list of wines currently in their drinking window — every cellar app has this | MEDIUM | Filter collection where current date is within user-defined drinking window |
| Basic collection statistics | Users expect a summary: how many bottles, estimated value, top regions | LOW | Total count, total estimated value, breakdown by type/region |
| Mobile-friendly design | Primary use case is checking from a phone at home or a store | MEDIUM | Responsive layout, large tap targets, fast load |

---

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Elegant, premium-feeling UI | CellarTracker is functional but dated; Vivino is beautiful but not cellar-focused; a premium-feeling personal cellar app is a real gap | HIGH | Design investment pays off in retention; this is where a new entrant can win |
| Fast bottle entry flow | Adding bottles is the #1 friction point in all competitors (confirmed by user reviews); a streamlined 3-tap add flow beats every competitor | MEDIUM | Minimize fields required at add-time; allow enrichment later; "quick add" mode |
| Occasion/context-based wine selection | "I want a wine for dinner tonight with fish" — Oeni does this; CellarTracker does not well; Vivino's AI Sommelier just launched (2026) | HIGH | Filter by occasion + food + drinking status; shows bottles in window |
| Collection composition insights | Simple visual breakdown: regions you favor, varietals you own, spending over time | MEDIUM | Bar charts or donut charts; actionable (e.g., "You have 12 bottles past their drinking window") |
| Past-window alert | Show bottles aging past their optimal drinking window so collector doesn't miss them | LOW | Derive from drinking window data already collected |
| Personal consumption history | A log of every bottle opened: when, with whom (optional), what you thought | MEDIUM | Motivates continued data entry; provides personal "wine diary" value |
| Elegant empty state / onboarding | First-run experience that makes adding the first 5 bottles feel rewarding, not like data entry | MEDIUM | Guided add flow; welcoming illustration states; "Your cellar is ready" moment |
| "What to drink tonight" button | One-tap surface of the best bottle to open right now, based on drinking window + personal rating | LOW | Combines ready-to-drink logic + highest personal rating; fast decision tool |

---

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Label scanning / camera-based bottle entry | Users don't want to type; scanning seems magical | Requires significant ML/computer vision infrastructure, unreliable for small-producer wines (confirmed: InVintory reports ~25% failure rate), adds a major dependency in v1; turns a simple app into a complex system | Manual entry with smart autocomplete; add scanning in Phase 3 when core is stable |
| Real-time market valuation | Users want to know what their collection is worth; CellarTracker and InVintory offer this | Requires a paid wine pricing data API (Wine Market Journal, Wine-Searcher), ongoing subscription cost, complex market data integration; adds complexity and cost before value is proven | Show user-entered purchase price as "estimated value"; offer real market value in a future premium tier |
| 3D cellar visualization | Visually compelling feature (InVintory VinLocate™, Oeni) that screenshots beautifully | Complex to build, maintenance-heavy (each fridge model template), offers limited functional value for small collections; users love it in screenshots but reviews indicate it's not the reason they keep using the app | Named storage locations (text-based bins) with a clear "where is this bottle?" lookup; 3D visualization is a future premium feature |
| Social / community features | Every big wine app has community ratings and social feeds (Vivino has 70M users; CellarTracker has 13M reviews) | Building a community requires a critical mass of users that a new personal app won't have; trying to replicate this competes with Vivino's moat; adds UGC moderation overhead | Stay personal-first; integrate community ratings from CellarTracker/Vivino by linking to existing sources, rather than building a competing database |
| Wine database integration / autocomplete from external sources | Users want to search a wine database and auto-fill details without typing | Requires API partnership or licensed data; creates legal and data-maintenance complexity; out-of-scope for v1 | Provide smart form UX with sensible defaults and field completion; focus on accurate user-owned data, not community discovery |
| Push notification alerts for drinking windows | "This bottle opens in 7 days" notifications seem useful | In practice, notifications for non-urgent personal apps create uninstalls; users ignore them; complex to implement correctly with scheduled reminders | Show "opening soon" and "past window" prominently in-app; let users check rather than push to them |
| AI-powered sommelier chat | CellarTracker CellarChat (July 2025) and Vivino AI Sommelier (2026) added this; users find it impressive | Requires LLM API integration with user's cellar data, complex prompt engineering, significant ongoing cost; not a good first feature | Defer to v3+; focus on simple, reliable "ready to drink" and filtering features that work without AI |
| Multi-user / family sharing | Home Entertainer and Family personas will request this | Adds authentication complexity, data conflict resolution, permission model, and dramatically expands scope; every shared state feature doubles complexity | v1 is personal/single-user; shared access is a post-PMF feature |
| Import from spreadsheet / CellarTracker export | Users coming from other apps want to bring data over | Complex: every source has different formats; mapping errors corrupt inventory data; v1 needs to prove the experience before worrying about migration | Offer clear manual entry; create an import feature in v2 after the data model is stable |

---

## Feature Dependencies

```
[Track wine metadata: type, vintage, region, producer, varietal]
    └──required by──> [Add bottles to collection]
                          └──required by──> [View collection list]
                          └──required by──> [Track bottle quantity]
                          └──required by──> [Search and filter]
                          └──required by──> [Mark as consumed / gifted]

[Drinking window (start/end dates)]
    └──required by──> [Ready-to-drink view]
    └──required by──> [Past-window alerts]
    └──required by──> ["What to drink tonight" button]

[Tasting notes and ratings]
    └──enhances──> [Personal consumption history]
    └──enhances──> ["What to drink tonight" (prioritize highest-rated)]

[Mark as consumed]
    └──enhances──> [Personal consumption history]
    └──enables──> [Collection statistics (bottles consumed over time)]

[Track purchase price]
    └──enables──> [Collection statistics (estimated value)]

[Storage location]
    └──enables──> [Search by location: "What's in Fridge A?"]

[Collection statistics]
    └──requires──> [All bottle metadata + quantity + purchase price]
```

### Dependency Notes

- **Ready-to-drink view requires drinking window:** A bottle cannot appear in "ready to drink" without a user-defined start and end drinking date. This must be enforced at the data model level — drinking window is optional at add-time but the ready-to-drink feature only works for bottles that have it.
- **Consumption history requires mark-as-consumed:** Logging a tasting note at consumption time requires the mark-as-consumed event as the trigger moment.
- **"What to drink tonight" enhances but doesn't require rating:** The button should surface in-window bottles ordered by rating if available, falling back to most recently purchased or oldest vintage.

---

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the personal cellar concept.

- [ ] **Add bottles (manual entry)** — without this, nothing else works; minimum fields: name, producer, vintage, type, varietal, region, quantity
- [ ] **View collection list** — sortable, filterable by type and region at minimum; the "home base" of the app
- [ ] **Edit and delete bottle records** — users make mistakes; this is essential for data quality
- [ ] **Track bottle quantity + mark as consumed/gifted** — the most common cellar action: decrementing a bottle when opened
- [ ] **Storage location per bottle** — text-based named locations; critical for collections beyond 20 bottles
- [ ] **Purchase price + purchase date** — required for estimated value calculation
- [ ] **Drinking window definition** — start and end dates; powers the ready-to-drink view
- [ ] **Search and filter collection** — text search + filter by type, region, vintage, varietal
- [ ] **Ready-to-drink view** — bottles currently within their drinking window; the single most-used feature in cellar apps after the main list
- [ ] **Tasting notes and personal rating** — recorded when a bottle is consumed; optional but expected
- [ ] **Basic collection statistics** — total bottles, estimated value, breakdown by type; homepage summary
- [ ] **Mobile-first design** — responsive, fast, elegant; this IS a key differentiator given CellarTracker's dated UX

### Add After Validation (v1.x)

Features to add once core is working and user patterns emerge.

- [ ] **Past-window alert / overdue view** — bottles that have aged past their drinking window; high value once users have drinking windows defined
- [ ] **"What to drink tonight" smart pick** — one-tap best-bottle recommendation from in-window bottles; very fast to build from existing data
- [ ] **Consumption history log** — timeline of every bottle opened; satisfies the "wine journal" use case
- [ ] **Occasion/context filter** — filter collection by food type or occasion; confirmed user desire from Oeni/CellarTracker data

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] **Label scanning / camera entry** — highly requested but adds significant complexity; defer until v1 data model is stable
- [ ] **Market valuation integration** — wine pricing API; adds cost and complexity before value is proven
- [ ] **Export (CSV/PDF)** — useful but not needed to validate core value
- [ ] **Import from CellarTracker / spreadsheet** — reduces onboarding friction; low priority until user acquisition matters
- [ ] **Multi-user / household sharing** — complex auth/data model; post-PMF
- [ ] **3D cellar visualization** — impressive but not functionally necessary; premium future feature
- [ ] **AI sommelier / chatbot** — latest trend (CellarTracker July 2025, Vivino 2026); defer until core data model is rich enough to make it useful
- [ ] **Push notification drinking window alerts** — deferred; in-app surfacing is sufficient for v1

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Add bottles (manual entry) | HIGH | LOW | P1 |
| View collection list with sort/filter | HIGH | LOW | P1 |
| Edit and delete bottles | HIGH | LOW | P1 |
| Track quantity + mark consumed | HIGH | LOW | P1 |
| Storage location | HIGH | LOW | P1 |
| Purchase price + date | MEDIUM | LOW | P1 |
| Drinking window definition | HIGH | LOW | P1 |
| Search and filter | HIGH | MEDIUM | P1 |
| Ready-to-drink view | HIGH | LOW | P1 |
| Tasting notes + personal rating | HIGH | LOW | P1 |
| Basic collection stats (count, value, breakdown) | MEDIUM | LOW | P1 |
| Mobile-first, premium design | HIGH | HIGH | P1 |
| Past-window alert / overdue bottles | HIGH | LOW | P2 |
| "What to drink tonight" smart pick | HIGH | LOW | P2 |
| Consumption history log | MEDIUM | MEDIUM | P2 |
| Occasion/context-based filter | MEDIUM | MEDIUM | P2 |
| Label scanning | HIGH | HIGH | P3 |
| Market valuation | MEDIUM | HIGH | P3 |
| Export (CSV/PDF) | LOW | MEDIUM | P3 |
| Import from CellarTracker/Vivino | MEDIUM | HIGH | P3 |
| Multi-user household sharing | MEDIUM | HIGH | P3 |
| 3D cellar visualization | LOW | HIGH | P3 |
| AI sommelier / chatbot | MEDIUM | HIGH | P3 |

**Priority key:**
- P1: Must have for launch (v1)
- P2: Should have; add when core is validated
- P3: Nice to have; future consideration

---

## Competitor Feature Analysis

| Feature | CellarTracker | Vivino | InVintory | Oeni | Our Approach |
|---------|--------------|--------|-----------|------|--------------|
| Manual bottle entry | Yes (complex form) | Yes (via label scan or search) | Yes (scan or search) | Yes | Yes — streamlined 3-field fast entry + enrich later |
| Bottle quantity tracking | Yes | Limited | Yes | Yes | Yes — quantity + per-event consumption log |
| Drinking windows | Yes (sophisticated algorithm; subscription required for report) | Basic | Yes | Yes (maturity phases) | Yes — simple user-defined start/end; ready-to-drink view free |
| Ready-to-drink view | Yes (subscription) | Basic | Yes | Yes | Yes — free tier feature, prominent on home |
| Storage location | Yes (bins, racks, multiple cellars) | No | Yes (3D visual, rack/bin) | Yes (3D visual) | Yes — text-based named locations; no 3D complexity in v1 |
| Tasting notes + ratings | Yes (100-point scale, public) | Yes (1-5 stars, community) | Yes | Yes | Yes — personal, private, simple rating scale |
| Collection analytics/stats | Yes (subscription for full reports) | No (personal collection only) | Yes | Yes | Yes — basic stats free; detailed analytics in later version |
| Label scanning | Yes (barcode scanning) | Yes (label photo recognition; best-in-class) | Yes (~75% hit rate) | Yes | No in v1 — deferred; manual entry with clean UX |
| Market valuation | Yes (Wine Market Journal, subscription) | No (shows purchase price only) | Yes (subscription) | Yes (monthly refresh) | No in v1 — show user-entered purchase price only |
| Search and filter | Yes (powerful but complex) | Yes (discover-focused) | Yes | Yes | Yes — simplified, fast; multi-criteria filters |
| Mobile UX quality | Medium (functional, dated) | HIGH (beautiful, commerce-focused) | HIGH | HIGH | Target HIGH — this is our primary differentiator |
| AI assistant | Yes (CellarChat, 2025 launch; subscription) | Yes (AI Sommelier, 2026 launch) | Yes (Vincent) | No | No in v1 — defer |
| Community features | Massive (13M reviews, forums) | Massive (70M users) | None | Limited (reviews tab, friends) | None in v1 — personal app, not social |
| Food pairings | Yes (tags per wine) | Yes (discover-focused) | Yes (AI pairing) | Yes (5,400+ dishes) | Deferred — interesting v2 feature for Home Entertainer persona |

---

## Key Insights from Competitor Research

**What users love (from App Store reviews, 2024-2026):**
- Knowing exactly what they have and where it is stored
- The drinking window / ready-to-drink concept (every app has it; users use it heavily)
- Seeing their collection value
- Fast label scanning (reduces friction for new bottle entry — Vivino best-in-class)
- Clean, modern UI (InVintory and Oeni win praise for design; CellarTracker criticized for dated UX)

**What users complain about (from App Store reviews):**
- Paywalls on core features (CellarTracker locks Ready-to-Drink behind subscription; user frustration confirmed)
- Missing or incorrect wine database entries requiring manual correction (25% of bottles not found by scan — InVintory review)
- Poor database coverage for non-European wines (Oeni criticism; French-built, European-biased database)
- Complex UI / learning curve (CellarTracker "requires commitment to learn")
- Delivery/purchase tracking bugs and incompleteness (InVintory)
- Social features adding noise to a personal app (users want personal cellar, not community)

**The gap this product can fill:**
A wine cellar app that is personal-first (no social noise), mobile-first with a premium UX (vs CellarTracker's dated interface), free on core features (drinking windows, ready-to-drink, collection stats), and built for the casual-to-enthusiast collector — not the power user who needs CellarTracker's database depth. Manual entry with an elegant, fast flow beats scan-but-fail at 25%.

---

## Sources

- CellarTracker official documentation: https://support.cellartracker.com (Sept 2024, verified 2026)
- CellarTracker "What you can track": https://support.cellartracker.com/article/32-what-can-be-tracked
- CellarTracker "Ready to Drink Report": https://support.cellartracker.com/article/28-ready-to-drink-report
- CellarTracker "Add via Receipt" feature (Jan 2025): https://mobileapp.cellartracker.com/post/wine-cellar-management-automate-wine-inventory-tracking-with-purchase-receipts
- CellarTracker "CellarChat AI" (Jul 2025): https://mobileapp.cellartracker.com/post/chat-with-my-cellar
- Vivino App Store listing (version 2026.20.0, current): https://apps.apple.com/us/app/vivino-drink-the-right-wine/id414461255
- InVintory App Store listing (version 6.18.0, current): https://apps.apple.com/us/app/invintory-wine-cellar-manager/id1434754695
- Oeni App Store listing (version 4.5.2, current): https://apps.apple.com/us/app/oeni-1-wine-cellar-manager/id6445827140
- User reviews for CellarTracker, Vivino, InVintory, Oeni (App Store, 2020-2026)

---
*Feature research for: Personal Wine Collection Management App*
*Researched: 2026-05-21*
