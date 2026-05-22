# Phase 01: User Setup Required

**Generated:** 2026-05-22
**Phase:** 01-core-inventory
**Status:** Incomplete

Complete these items for the integration to function. Claude automated everything possible; these items require human access to external dashboards/accounts.

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

| Status | Variable | Source | Example Value |
|--------|----------|--------|---------------|
| [ ] | `TURSO_DATABASE_URL` | Turso CLI: `turso db show <db-name> --url` OR Turso Dashboard > Database > Connection URL | `libsql://wine-cellar-yourname.turso.io` |
| [ ] | `TURSO_AUTH_TOKEN` | Turso CLI: `turso db tokens create <db-name>` OR Turso Dashboard > Database > Generate Token | `eyJhbGciOiJFZERTQS...` |
| [ ] | `AUTH_USERNAME` | Choose your login username | `admin` |
| [ ] | `AUTH_PASSWORD` | Choose a strong password | `your-secure-password` |
| [ ] | `SESSION_SECRET` | Generate a random 32+ character string | `run: openssl rand -base64 32` |

## Account Setup

- [ ] **Create a Turso account** (if you don't have one)
  - URL: https://turso.tech/
  - Skip if: Already have a Turso account

- [ ] **Create a Turso database**
  - CLI: `turso db create wine-cellar`
  - OR: Turso Dashboard > New Database
  - Note the database name for the URL step

## Dashboard Configuration

- [ ] **Get the database connection URL**
  - CLI: `turso db show wine-cellar --url`
  - Copy the full `libsql://...` URL
  - Add to `.env.local` as `TURSO_DATABASE_URL`

- [ ] **Generate a database auth token**
  - CLI: `turso db tokens create wine-cellar`
  - Copy the token (it's only shown once)
  - Add to `.env.local` as `TURSO_AUTH_TOKEN`

## Local Dev Notes

After completing the above:

1. Create `.env.local` in the project root:
   ```
   TURSO_DATABASE_URL=libsql://your-db-name.turso.io
   TURSO_AUTH_TOKEN=your-auth-token-here
   AUTH_USERNAME=admin
   AUTH_PASSWORD=your-secure-password
   SESSION_SECRET=your-32-char-random-string
   ```

2. Run database migrations (Phase 1 schema will be defined in plan 01-02):
   ```bash
   pnpm db:migrate
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

## Verification Commands

```bash
# Test dev server starts
pnpm dev

# Visit in browser
open http://localhost:3000

# Should redirect to /login (auth guard working)
# Login with AUTH_USERNAME/AUTH_PASSWORD credentials
```

---
*Phase: 01-core-inventory*
*Generated: 2026-05-22*
