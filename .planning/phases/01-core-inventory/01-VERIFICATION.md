---
phase: 01-core-inventory
verified: 2026-05-22T01:55:14Z
status: gaps_found
score: 4/5 must-haves verified
re_verification: false
gaps:
  - truth: "User can add a wine record with all fields (name, producer, vintage, country, region, appellation, wine type, grape variety, bottle size, quantity owned, storage location, purchase date, purchase source, purchase price, estimated value, drinking window start/end, notes) and it appears in their collection"
    status: partial
    reason: "The 'estimated value' field listed in SC1 does not exist in the schema, Dexie model, Zod form schema, WineForm UI, or Server Actions. All other 16 fields are fully implemented. Note: In the FRD, 'estimated_value' is a collection-level derived stat (sum of purchase prices for Phase 6 Insights), not a per-wine input field. The ROADMAP SC1 appears to have incorrectly included it as a per-wine field. However, because SC1 explicitly lists it as a required add field, this is a verified gap."
    artifacts:
      - path: "src/lib/validations/wine.ts"
        issue: "No estimatedValue field in WineFormSchema"
      - path: "src/lib/db/schema.ts"
        issue: "No estimated_value column in wines table"
      - path: "src/components/wine/WineForm.tsx"
        issue: "No estimated value input field rendered"
      - path: "src/app/actions/wines.ts"
        issue: "No estimatedValue in addWine input type"
    missing:
      - "Clarify intent: if 'estimated value' = user-entered per-bottle current market value (separate from purchase_price), add as nullable field to schema, Dexie, Zod, form, and server actions"
      - "If 'estimated value' is intended to be the same as purchase_price or a Phase 6 derived stat, update the ROADMAP SC1 to remove it from the per-wine add form field list"
human_verification:
  - test: "Open app, tap Add button, fill in wine form with optional details expanded, verify all fields accept input"
    expected: "Form renders name, producer, vintage, type (required) + region, country, varietal, appellation, storage location, purchase price, purchase date, purchase source, drink from, drink by, notes (optional), format — all accept input and submit successfully"
    why_human: "Form interaction and field visibility (optional fields behind toggle) cannot be verified programmatically"
  - test: "Add a wine, verify it appears in the list immediately (before any network response)"
    expected: "Wine appears in Cellar list within ~100ms of tapping 'Add to Cellar' (Dexie write triggers useLiveQuery update)"
    why_human: "Offline-first reactivity timing requires browser observation"
  - test: "Navigate to a wine detail, tap Edit, change a field, save — verify update is reflected immediately"
    expected: "WineDrawer opens pre-filled; after save, detail page shows updated value without page reload"
    why_human: "Edit flow end-to-end involves drawer state, useLiveQuery reactive update, and visual confirmation"
  - test: "Tap Delete on a wine detail page, verify confirmation dialog appears, confirm delete — wine disappears from list"
    expected: "AlertDialog shows wine name, Cancel/Remove buttons; after Remove, navigates to /cellar and wine is gone from list"
    why_human: "Delete confirmation flow and navigation require browser interaction"
---

# Phase 1: Core Inventory Verification Report

**Phase Goal:** Users can manage their complete wine collection — adding, viewing, editing, and deleting wine records — from a responsive mobile-friendly interface
**Verified:** 2026-05-22T01:55:14Z
**Status:** gaps_found — 1 SC gap (missing field); 4/5 success criteria fully verified
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | User can add a wine record with **all fields** (including estimated value) and it appears in their collection | ⚠️ PARTIAL | 16/17 fields implemented. `estimated value` is absent from schema, form, and validation. All other fields (name, producer, vintage, country, region, appellation, type, varietal, format/bottle size, quantity, storage location, purchase date, purchase source, purchase price, drink from/by, notes) are fully wired end-to-end. |
| 2 | User can view the wine list showing name, producer, vintage, type, quantity, and drinking status | ✓ VERIFIED | `WineCard.tsx` renders all 6 required fields: name (line 31), producer (line 33), vintage (line 45), type (line 56), quantity (line 49), and drinking status via `WineStatusBadge` (line 58). `useWines` filters `status = 'in_cellar'` only. |
| 3 | User can open a wine detail page and see all fields for a single wine record | ✓ VERIFIED | `/wine/[id]/page.tsx` renders: name, producer, type, vintage in header + 11 DetailRow fields (Grape Variety, Region, Appellation, Country, Quantity, Format, Storage Location, Purchase Price, Purchase Date, Source, Drink From, Drink By) + notes section. `useLiveQuery` reads from Dexie offline-first. |
| 4 | User can edit any field on an existing wine record and see the update reflected immediately | ✓ VERIFIED | Edit button calls `openDrawer(wine.id)` → `WineDrawer` reads `editingWineId` → loads wine via `useLiveQuery` → `WineForm` pre-filled → `editWine()` writes to Dexie first → `useLiveQuery` triggers immediate UI update → `updateWine` Server Action queued/sent asynchronously. Fully wired. |
| 5 | User can delete a wine record (with confirmation) and it no longer appears in the list; system tracks quantity owned and consumed separately | ✓ VERIFIED | AlertDialog confirmation wired in detail page. `removeWine()` soft-deletes (status='spoiled') in Dexie → `useWines` filters `status = 'in_cellar'` → wine disappears from list. `quantity` on `wines` table = owned bottles (decremented by consumption). `consumption_events` table = separate append-only history. |

**Score:** 4/5 truths verified (1 partial)

---

## Required Artifacts

| Artifact | Status | Details |
|----------|--------|---------|
| `src/lib/validations/wine.ts` | ✓ VERIFIED | WineFormSchema with 16 fields, Zod validation, type exported |
| `src/lib/db/schema.ts` | ✓ VERIFIED | Drizzle `wines` table (21 cols including metadata/status) + `consumptionEvents` table |
| `src/lib/dexie/db.ts` | ✓ VERIFIED | `LocalWine` interface mirrors schema, `CellarDatabase` with indexed fields, singleton `dexieDb` |
| `src/app/actions/wines.ts` | ✓ VERIFIED | `addWine`, `updateWine`, `deleteWine` (soft-delete), `getWines` — all `'use server'`, Zod-validated |
| `src/app/actions/consumption.ts` | ✓ VERIFIED | `addConsumptionEvent` (append-only + MAX(0, qty-N) decrement), `getConsumptionEventsForWine` |
| `src/hooks/useWines.ts` | ✓ VERIFIED | `useLiveQuery` with 3-state handling (undefined/empty/data), filters `status='in_cellar'` |
| `src/hooks/useWineActions.ts` | ✓ VERIFIED | Offline-first: Dexie write → reachability probe → Server Action OR enqueue. All 3 operations (create/edit/remove) implemented. |
| `src/components/wine/WineCard.tsx` | ✓ VERIFIED | Renders name, producer, vintage, type (color-coded), quantity, WineStatusBadge. Links to `/wine/[id]`. |
| `src/components/wine/WineStatusBadge.tsx` | ✓ VERIFIED | Computes 5-state drinking status from drinkFrom/drinkBy. Fully rendered. |
| `src/components/wine/WineForm.tsx` | ⚠️ PARTIAL | 16/17 fields present. Missing `estimatedValue` field per SC1. All other fields render correctly with required/optional toggle. |
| `src/components/wine/WineDrawer.tsx` | ✓ VERIFIED | vaul bottom sheet, reads UIStore, loads editingWine via useLiveQuery, calls createWine/editWine on submit |
| `src/app/(app)/cellar/page.tsx` | ✓ VERIFIED | Skeleton/empty/data states, renders WineCard list from useWines |
| `src/app/(app)/wine/[id]/page.tsx` | ✓ VERIFIED | Full detail, loading/notfound states, AlertDialog delete, edit button → openDrawer |
| `src/app/(app)/layout.tsx` | ✓ VERIFIED | Server-side auth check, SyncProvider, OfflineBanner, MobileNav, WineDrawer all wired |
| `src/components/layout/MobileNav.tsx` | ✓ VERIFIED | 4-tab bottom nav (Cellar, Ready Now, Add, Insights), Add tap calls openDrawer() |
| `src/middleware.ts` | ✓ VERIFIED | Protects all routes, redirects to /login; public paths exempted |
| `src/lib/auth/session.ts` | ✓ VERIFIED | httpOnly JWT cookie with jose, createSession/destroySession/getSession |
| `src/app/login/page.tsx` | ✓ VERIFIED | Login form with useActionState, shadcn Card/Input/Button |
| `src/app/login/actions.ts` | ✓ VERIFIED | `'use server'`, validates against env vars, createSession on success |
| `src/app/manifest.ts` | ✓ VERIFIED | PWA manifest with maskable icon, wine-colored theme |
| `src/app/sw.ts` | ✓ VERIFIED | Serwist service worker with NetworkFirst/CacheFirst, offline fallback |
| `src/app/serwist/[...path]/route.ts` | ✓ VERIFIED | createSerwistRoute with Next.js 15 array-path fix + chrome96 target |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `MobileNav` Add button | `WineDrawer` | `openDrawer()` → `UIStore.isDrawerOpen` | ✓ WIRED | MobileNav calls `openDrawer()`, WineDrawer reads `isDrawerOpen` from UIStore |
| `WineDrawer` | `useWineActions.createWine` | `handleSubmit` → `createWine(data)` | ✓ WIRED | Line 33 in WineDrawer.tsx |
| `WineDrawer` | `useWineActions.editWine` | `handleSubmit` → `editWine(editingWineId, data)` | ✓ WIRED | Line 31 in WineDrawer.tsx |
| `useWineActions.createWine` | `addWine` Server Action | Dexie write → `addWine({...record, id})` | ✓ WIRED | Line 50 in useWineActions.ts |
| `useWineActions.editWine` | `updateWine` Server Action | Dexie update → `updateWine(id, data)` | ✓ WIRED | Line 89 in useWineActions.ts |
| `useWineActions.removeWine` | `deleteWine` Server Action | Dexie soft-delete → `deleteWine(id)` | ✓ WIRED | Line 126 in useWineActions.ts |
| `DetailPage` Edit button | `WineDrawer` (edit mode) | `openDrawer(wine.id)` → `editingWineId` | ✓ WIRED | Line 121 in detail page, WineDrawer checks `editingWineId` |
| `DetailPage` Delete button | `removeWine` | AlertDialogAction → `handleDelete()` → `removeWine(wine.id)` | ✓ WIRED | Lines 152-154 in detail page |
| `useWines` | Dexie `wines` table | `useLiveQuery` where status='in_cellar' | ✓ WIRED | Deleted wines (status='spoiled') excluded from list |
| `(app)/layout.tsx` | `getSession` | Server-side auth check before render | ✓ WIRED | Line 14-16 in app layout |
| `middleware.ts` | JWT verification | `jwtVerify()` for all non-public routes | ✓ WIRED | Lines 551-560 in middleware |
| `SyncProvider` | `hydrateDexie` + `flushSyncQueue` | `useSync` hook on mount/reconnect | ✓ WIRED | SyncProvider in app layout wraps all authenticated routes |

---

## Anti-Patterns Found

| File | Pattern | Severity | Impact |
|------|---------|----------|--------|
| None found | — | — | — |

No TODO/FIXME/placeholder/stub patterns detected in key files. All handlers make real calls; no `return null` stubs or empty implementations.

---

## Human Verification Required

### 1. Add Wine Form — All Fields Visible and Submittable

**Test:** Open the app, authenticate, tap the + button in the bottom nav. Expand "Add more details" section. Fill in name, producer, type, then expand optional fields and fill in region, country, varietal, appellation, storage location, purchase price, purchase date, purchase source, drink from, drink by, notes.
**Expected:** All optional fields appear when toggle is clicked. Form submits and wine immediately appears in the Cellar list without a page reload.
**Why human:** Field toggle visibility and form submission reactivity require browser interaction.

### 2. Wine Appears in List Immediately (Offline-First)

**Test:** With DevTools Network throttled to "Offline", add a wine via the drawer.
**Expected:** Wine appears in Cellar list immediately (Dexie write). SyncIndicator shows pending state. When network is restored, wine syncs to Turso.
**Why human:** Real-time offline behavior requires browser environment and network simulation.

### 3. Edit Flow — Update Reflected Immediately

**Test:** Tap a wine card → open detail page → tap Edit → change the wine name → tap Save Changes.
**Expected:** WineDrawer opens pre-filled with current values. After save, the detail page (and cellar list) show the updated name within ~100ms.
**Why human:** Edit flow through drawer state, useLiveQuery reactive update, and immediate visual confirmation requires browser.

### 4. Delete With Confirmation

**Test:** Open a wine detail page → tap Delete → verify AlertDialog shows wine name → tap Remove.
**Expected:** AlertDialog shows "Remove this wine?" with the wine name. After confirming, navigates back to /cellar and wine is absent from the list.
**Why human:** AlertDialog interaction and post-delete navigation require browser.

---

## Gaps Summary

### Gap 1: `estimated value` Field Not in Wine Record (SC1 — Partial)

**What the success criterion says:** "User can add a wine record with all fields including **estimated value**"

**What exists:** 16 of 17 listed fields are implemented. `estimated value` is absent from:
- `src/lib/db/schema.ts` — not a column in `wines` table
- `src/lib/dexie/db.ts` — not in `LocalWine` interface
- `src/lib/validations/wine.ts` — not in `WineFormSchema`
- `src/components/wine/WineForm.tsx` — no input field rendered
- `src/app/actions/wines.ts` — not in `addWine` input type

**Context:** The ARCHITECTURE.md data model (the implementation source of truth) does not include `estimated_value` as a per-wine field. In the FRD and research docs, `estimated_value` appears exclusively as a **collection-level aggregated stat** (total collection value = sum of purchase prices), scoped to the Phase 6 Insights dashboard. The ROADMAP SC1 appears to have incorrectly included this as a per-wine input field.

**Resolution options:**
1. **If the intent is a user-entered per-bottle current market value** (separate from purchase price): Add `estimatedValue` as a nullable `real` column to schema, Dexie, Zod, WineForm, and Server Actions.
2. **If the intent is that purchase price serves as the per-bottle value estimate** (most likely): Update ROADMAP.md SC1 to remove "estimated value" from the per-wine field list (it's implemented in Phase 6 as a derived stat).
3. **If the intent is a separate "current value" field** for tracking appreciation: Add the field as described in option 1.

**Recommendation:** This is likely a ROADMAP wording issue — the implementation correctly follows ARCHITECTURE.md which excludes `estimated_value` from the wine record. Confirm intent and either add the field or update the success criterion.

---

## Summary

The Phase 1 implementation is **substantially complete and well-architected**. Five plans (01-01 through 01-06) delivered 50+ files covering the full CRUD lifecycle, offline-first sync infrastructure, PWA shell, authentication, and mobile-responsive layout. The code is clean — no stubs, no placeholder implementations, no disconnected wiring.

The single identified gap (SC1 partial) is a field discrepancy between the ROADMAP success criteria and the ARCHITECTURE.md data model. The implementation correctly follows ARCHITECTURE.md. The gap requires a **clarification decision** rather than a full implementation effort: either add the `estimatedValue` field (small schema/form change) or correct the ROADMAP wording to match the intended design.

All 4 other success criteria are fully verified at all three levels: artifacts exist, are substantive, and are wired end-to-end.

---

_Verified: 2026-05-22T01:55:14Z_
_Verifier: Claude (pivota_spec-verifier)_
