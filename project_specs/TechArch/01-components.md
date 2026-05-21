---

## 2. Component Architecture

### 2.1 Backend Components

The Node.js API is structured as a standard Express.js application with a layered architecture: routes → controllers → services → database layer.

```
server/
├── app.js                    # Express app setup, middleware registration
├── server.js                 # HTTP server entry point
├── config/
│   └── db.js                 # Database connection pool / Prisma client
├── middleware/
│   ├── auth.js               # Session token validation; attaches req.user
│   ├── validate.js           # Zod schema validation wrapper
│   └── errorHandler.js       # Global error handler; formats error envelope
├── routes/
│   ├── auth.js               # POST /auth/login, POST /auth/logout, GET /auth/me
│   ├── wines.js              # GET/POST /wines, GET/PUT/PATCH/DELETE /wines/:id
│   ├── wineActions.js        # POST /wines/:id/consume, POST /wines/:id/gift
│   │                         # GET /wines/:id/history, GET /wines/ready-to-drink
│   │                         # GET /wines/filter-options
│   ├── tastingNotes.js       # GET/POST /wines/:id/tasting-notes
│   │                         # GET/PUT/PATCH/DELETE /tasting-notes/:note_id
│   ├── events.js             # DELETE /events/:event_id (undo)
│   └── dashboard.js          # GET /dashboard
├── controllers/
│   ├── authController.js
│   ├── winesController.js
│   ├── tastingNotesController.js
│   ├── eventsController.js
│   └── dashboardController.js
├── services/
│   ├── drinkingStatusService.js   # Pure function: computeDrinkingStatus(wine, currentYear)
│   ├── searchService.js           # Builds parameterized search/filter queries
│   └── dashboardService.js        # Aggregation queries for F05
├── db/
│   ├── migrations/               # Prisma or node-pg-migrate migration files
│   └── schema.prisma             # (if using Prisma) schema definition
└── utils/
    ├── pagination.js             # Pagination helper (page, per_page, total_pages)
    └── errors.js                 # Error code constants and AppError class
```

**Component responsibilities:**

| Component | Responsibility |
|-----------|---------------|
| `auth.js` middleware | Validates session token from cookie or Authorization header; rejects with 401 if invalid/expired; attaches `req.user = { id, email }` |
| `validate.js` middleware | Wraps Zod schemas; returns 422 with structured `fields` error object on failure |
| `errorHandler.js` | Catches all thrown errors; formats them into the standard response envelope; logs server errors |
| `drinkingStatusService.js` | Stateless function `computeDrinkingStatus(wine)` — applies F01 logic to return one of 6 status codes; called after every wine record fetch |
| `searchService.js` | Translates query params (q, wine_type, vintage_year_min, etc.) into a parameterized SQL WHERE clause + tsvector query; handles sorting and pagination |
| `dashboardService.js` | Runs F05 aggregate queries in parallel (Promise.all); returns the full dashboard payload |
| `winesController.js` | Handles all wine CRUD; calls `computeDrinkingStatus` before returning each wine record or list item |
| `eventsController.js` | Handles consume/gift/undo operations inside a database transaction |

---

### 2.2 Frontend Components

The React PWA is structured as a standard Vite + React SPA with React Router for navigation, React Query for server state management, and a component library (Tailwind CSS + shadcn/ui or equivalent).

```
client/
├── index.html                # Root HTML; includes viewport meta, manifest link
├── vite.config.js
├── public/
│   ├── manifest.json         # PWA manifest: name, icons, display: standalone
│   └── icons/                # App icons: 192px, 512px
├── src/
│   ├── main.jsx              # React root; QueryClientProvider, Router
│   ├── App.jsx               # Route definitions; bottom navigation shell
│   ├── api/
│   │   ├── client.js         # Fetch wrapper; attaches auth header; handles 401 redirect
│   │   ├── wines.js          # API calls for wine CRUD, actions, filter-options
│   │   ├── tastingNotes.js   # API calls for tasting notes
│   │   └── dashboard.js      # API call for dashboard
│   ├── pages/
│   │   ├── WineListPage.jsx       # F00-B: scrollable wine list with search bar (F02)
│   │   ├── WineDetailPage.jsx     # F00-C: full wine record + history + tasting notes
│   │   ├── AddWinePage.jsx        # F00-A: add wine form
│   │   ├── EditWinePage.jsx       # F00-D: edit wine form (pre-populated)
│   │   ├── ReadyToDrinkPage.jsx   # F01-D: wines with drink_now status
│   │   ├── DashboardPage.jsx      # F05: collection insights
│   │   ├── TastingNoteFormPage.jsx # F04-A/C: create or edit tasting note
│   │   └── LoginPage.jsx          # Auth: email + password login
│   ├── components/
│   │   ├── WineCard.jsx           # Wine list card: name, producer, vintage, status badge
│   │   ├── DrinkingStatusBadge.jsx # Color-coded status pill component
│   │   ├── WineForm.jsx           # Shared add/edit form with mobile-optimized inputs
│   │   ├── TastingNoteCard.jsx    # Single tasting note display
│   │   ├── FilterSheet.jsx        # Bottom-sheet filter panel (F06-E)
│   │   ├── SearchBar.jsx          # Search input with 300ms debounce
│   │   ├── BottomNav.jsx          # Fixed bottom navigation bar (F06-B)
│   │   ├── ConsumeDialog.jsx      # Consume bottle confirmation dialog (F03-A)
│   │   ├── GiftDialog.jsx         # Gift bottle dialog (F03-B)
│   │   └── DashboardCard.jsx      # Individual stat card for dashboard
│   ├── hooks/
│   │   ├── useWines.js            # React Query hooks for wine list + detail
│   │   ├── useDashboard.js        # React Query hook for dashboard data
│   │   └── useAuth.js             # Auth state; login/logout mutations
│   └── utils/
│       ├── drinkingStatus.js      # Client-side status label + color mapping
│       └── formatters.js          # Currency, date, rating display formatters
```

**Key frontend patterns:**

| Pattern | Implementation | Purpose |
|---------|---------------|---------|
| Server state | React Query (`@tanstack/react-query`) | Caching, background refetch, loading/error states |
| Filter state | React state + URL query params | Persists across detail ↔ list navigation; shareable |
| Form validation | React Hook Form + Zod | Client-side validation matching server rules |
| Debounced search | `useDebounce` hook (300ms) | Triggers search after user stops typing |
| Bottom nav | Fixed-position `BottomNav` component | Thumb-friendly; always accessible (F06-B) |
| PWA install | `manifest.json` + service worker | Installable to phone home screen (F06) |
| Error boundaries | React ErrorBoundary at page level | Graceful fallback on unhandled errors (F06-H) |

---

### 2.3 Database Layer

PostgreSQL 15+ accessed via:
- **Prisma** (preferred): Schema-as-code, type-safe queries, built-in migration management
- **Alternative**: `knex` with `node-pg-migrate` if Prisma's overhead is undesirable for this scale

Connection pool: `pg` library or Prisma's built-in pool, size 5–10 connections.

All queries are **parameterized** — no string interpolation of user input into SQL.

---

*01 — Component Architecture*
