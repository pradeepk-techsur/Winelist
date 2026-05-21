---

## 5. Security Architecture

### 5.1 Authentication

WineApp v1 uses **stateful session-based authentication** for a single registered user.

**Login flow:**

```
Client                         Server                          Database
  │                               │                               │
  │  POST /api/auth/login          │                               │
  │  { email, password }          │                               │
  │──────────────────────────────▶│                               │
  │                               │  SELECT * FROM users          │
  │                               │  WHERE email = $1             │
  │                               │──────────────────────────────▶│
  │                               │◀──────────────────────────────│
  │                               │  bcrypt.compare(password,     │
  │                               │    password_hash)             │
  │                               │  → match                      │
  │                               │                               │
  │                               │  Generate secure random       │
  │                               │  token (128-bit, base64url)   │
  │                               │                               │
  │                               │  INSERT INTO sessions         │
  │                               │  (id, user_id, expires_at)    │
  │                               │──────────────────────────────▶│
  │                               │◀──────────────────────────────│
  │◀──────────────────────────────│                               │
  │  200 { token, expires_at }    │                               │
  │  Set-Cookie: session=<token>  │                               │
  │  HttpOnly; SameSite=Strict    │                               │
```

**Session validation middleware (every protected request):**

1. Extract token from `Authorization: Bearer <token>` header or `session` cookie
2. `SELECT * FROM sessions WHERE id = $1 AND expires_at > NOW()`
3. If not found or expired → `401 AUTH_REQUIRED`
4. Attach `req.user = { id: session.user_id }` for downstream handlers
5. Extend session expiry (rolling 30-day window): `UPDATE sessions SET expires_at = NOW() + '30 days'`

**Password security:**
- Passwords hashed with **bcrypt**, minimum cost factor **12**
- Plaintext passwords never stored, logged, or transmitted after hashing
- Password reset is out of scope for v1 (single-user personal instance)

**Session security:**
- Token is a cryptographically random 128-bit value, URL-safe base64 encoded
- Delivered as `httpOnly` cookie with `SameSite=Strict` to prevent CSRF and XSS token theft
- All session tokens transmitted exclusively over **HTTPS**
- Logout deletes the session row immediately (instant revocation)
- Expired sessions are purged at login time or by a lightweight cleanup job

---

### 5.2 Authorization

WineApp v1 has a simple ownership-based authorization model: **all resources belong to the authenticated user**.

**Rule:** Every database query for wines, bottle events, tasting notes, and sessions is scoped by `user_id`:

```sql
-- Example: wine ownership check embedded in every query
SELECT * FROM wines WHERE id = $1 AND user_id = $2;
```

If a record exists but belongs to a different user, the response is **404 WINE_NOT_FOUND** (not 403) — this avoids leaking the existence of records to potential future users.

**Authorization matrix:**

| Resource | Unauthenticated | Authenticated user |
|----------|-----------------|--------------------|
| `POST /api/auth/login` | Allowed | Allowed |
| `GET /api/auth/me` | 401 | Own profile only |
| Any `/api/wines/*` | 401 | Own wines only |
| Any `/api/tasting-notes/*` | 401 | Own notes only |
| Any `/api/events/*` | 401 | Own events only |
| `GET /api/dashboard` | 401 | Own data only |

---

### 5.3 Input Validation

All incoming request bodies and query parameters are validated by **Zod schemas** in the `validate.js` middleware before reaching controllers:

- Required fields presence check
- Type coercion (string → integer where appropriate)
- Enum membership validation
- Range and length constraints (matching FRD validation rules)
- Date format validation (`YYYY-MM-DD`; no future dates where prohibited)

Validation failures return `422` with the structured `fields` error map. Invalid inputs **never reach the database layer**.

---

### 5.4 SQL Injection Prevention

- All database queries use **parameterized statements** (no string interpolation of user values)
- Prisma's query builder automatically parameterizes all values
- Raw SQL queries (if any) use `$1, $2, ...` placeholders with the `pg` driver's parameterized query API
- The application never constructs SQL strings from user input

---

### 5.5 Transport Security

- All traffic is HTTPS-only (enforced by Vercel and Railway hosting)
- HTTP requests are redirected to HTTPS at the hosting layer
- Session tokens are never transmitted over HTTP
- CORS is configured to allow only the specific frontend origin (`CORS_ORIGIN` env var):

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN,  // e.g. "https://wineapp.vercel.app"
  credentials: true,                // allow cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));
```

---

### 5.6 Data Protection

**Sensitive data handling:**

| Data | Protection |
|------|-----------|
| Passwords | bcrypt hashed (cost 12); never stored or logged in plaintext |
| Session tokens | httpOnly cookie; never exposed in JS; not in logs |
| Wine data | Scoped to user_id in all queries; no cross-user data access possible |
| User IDs in logs | Server logs include `user_id` for error tracking but no PII (email, name) |

**No third-party data sharing:** WineApp v1 has no analytics, advertising, or external tracking integrations. All user data resides exclusively in the application's PostgreSQL database.

---

### 5.7 Error Handling and Information Leakage

- Server errors (`500`) return a generic message: "An unexpected error occurred" — no stack traces, SQL errors, or internal details in production responses
- `404 WINE_NOT_FOUND` is returned for both "not found" and "belongs to another user" cases (prevents existence probing)
- Error logging writes to server logs with `user_id`, request path, and error code — no PII, no full request bodies in logs

---

*04 — Security Architecture*
