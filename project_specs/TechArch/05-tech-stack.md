---

## 6. Technology Stack

### 6.1 Stack Summary

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Frontend framework** | React | 18.x | SPA / PWA; component model; ecosystem |
| **Frontend build** | Vite | 5.x | Fast dev server; optimized production build; PWA plugin |
| **Frontend routing** | React Router | 6.x | Client-side navigation; URL-based filter state |
| **Server state** | TanStack Query (React Query) | 5.x | API caching, background refetch, loading/error states |
| **Form handling** | React Hook Form | 7.x | Performant forms; integrates with Zod validation |
| **Client validation** | Zod | 3.x | Schema validation shared between client and server |
| **Styling** | Tailwind CSS | 3.x | Utility-first; mobile-first responsive design |
| **UI components** | shadcn/ui | latest | Accessible, unstyled base components; Tailwind-compatible |
| **PWA** | vite-plugin-pwa | latest | Service worker; web app manifest generation |
| **Backend runtime** | Node.js | 20.x LTS | JavaScript runtime; widely supported on hosting platforms |
| **Backend framework** | Express.js | 4.x | Minimal REST API; middleware ecosystem |
| **ORM / Query builder** | Prisma | 5.x | Type-safe DB queries; migration management; schema-as-code |
| **Database** | PostgreSQL | 15.x | Full-text search (tsvector/GIN); ACID; managed cloud options |
| **DB driver** | pg (node-postgres) | 8.x | Low-level PostgreSQL driver; used by Prisma |
| **Password hashing** | bcryptjs | 2.x | bcrypt hashing; pure JS (no native bindings needed) |
| **Input validation** | Zod | 3.x | Server-side request validation; same schemas as client |
| **HTTP security** | helmet | 7.x | HTTP security headers (CSP, HSTS, etc.) |
| **CORS** | cors | 2.x | Cross-origin request control |
| **Logging** | pino | 8.x | Fast structured JSON logging |
| **Environment config** | dotenv | 16.x | `.env` file loading in development |
| **Testing (API)** | Vitest + supertest | latest | Unit and integration tests for API routes |
| **Testing (UI)** | Vitest + Testing Library | latest | Component and page tests |
| **Linting** | ESLint + Prettier | latest | Code quality and formatting |
| **Frontend hosting** | Vercel | — | Static SPA hosting; global CDN; auto-deploy from git |
| **Backend hosting** | Railway | — | Node.js process hosting; managed PostgreSQL |

---

### 6.2 Key Dependency Rationale

**React (not Vue):** React's larger ecosystem, wider hosting/tooling support, and stronger mobile PWA tooling make it the better fit. The team's likely React familiarity also reduces onboarding time.

**Prisma (not raw SQL or Knex):** Prisma's type-safe query API, excellent migration tooling (`prisma migrate`), and schema introspection reduce boilerplate and schema drift risk. For a personal-use app at this scale, Prisma's startup overhead is acceptable.

**PostgreSQL (not SQLite):** Full-text search with `tsvector`/GIN index is a first-class requirement (F02). PostgreSQL's managed cloud options (Railway, Supabase) have near-zero ops overhead. SQLite remains an acceptable local development alternative.

**TanStack Query:** Handles all server state caching, background refetch, and loading/error states — eliminates the need for Redux or custom fetch infrastructure. Particularly useful for the wine list with filters (query key includes filter state for automatic cache invalidation).

**Tailwind + shadcn/ui:** Tailwind's utility classes pair well with mobile-first development. shadcn/ui provides accessible base components (dialogs, bottom sheets, forms) that can be customized to the wine aesthetic without design system lock-in.

---

### 6.3 Development Tooling

| Tool | Purpose |
|------|---------|
| `pnpm` or `npm` | Package management |
| `prisma studio` | GUI for database inspection during development |
| `prisma migrate dev` | Apply schema migrations in development |
| `prisma migrate deploy` | Apply migrations in production (Railway build step) |
| ESLint | Code quality; catch common React and Node.js antipatterns |
| Prettier | Consistent code formatting |
| Vitest | Fast unit/integration tests (replaces Jest; Vite-native) |
| supertest | HTTP integration tests for API routes without a running server |

---

### 6.4 Project Structure Overview

```
wineapp/
├── client/           # React PWA (Vite)
│   ├── src/
│   ├── public/
│   └── package.json
├── server/           # Node.js REST API (Express)
│   ├── src/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── package.json
├── shared/           # (optional) Shared Zod schemas used by both client and server
│   └── schemas/
└── README.md
```

A monorepo layout (pnpm workspaces or Turborepo) is recommended to share Zod validation schemas between client and server, ensuring validation rules stay in sync.

---

*05 — Technology Stack*
