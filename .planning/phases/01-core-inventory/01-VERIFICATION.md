---
phase: 01-core-inventory
verified: 2026-05-28T23:00:00Z
status: passed
score: 5/5 must-haves verified
re_verification:
  previous_status: gaps_found
  previous_score: 4/5
  gaps_closed:
    - "SC1 partial: 'estimated value' field re-assessed against FRD and ARCHITECTURE.md — confirmed as collection-level aggregation (F05 Insights Dashboard), not a per-wine input field. ROADMAP SC1 wording was incorrect; implementation is correct per FRD F00 and ARCHITECTURE.md. Marked VERIFIED."
    - "UAT gap: Logout button wired to MobileNav via <form action={logoutAction}>. logoutAction calls destroySession() + redirect('/login')."
    - "Edit drawer pre-fill bug: WineDrawer gates WineForm until useLiveQuery resolves (isLoading = isEdit && editingWine === undefined, line 41). WineForm uses controlled value= on Select (lines 179, 262) and useEffect+form.reset() for async defaultValues (lines 92-114)."
  gaps_remaining: []
  regressions: []
human_verification:
  - test: "Tap Edit on a wine with type 'White' and format '1.5L' — verify Select dropdowns show correct values"
    expected: "Type Select shows 'White', Format Select shows '1.5L'; optional section auto-expands if optional fields are set"
    why_human: "Controlled Select value behavior and optional section auto-expand require visual inspection in browser"
  - test: "Open app, tap Add button, fill in wine form with optional details expanded, verify all fields accept input"
    expected: "Form renders name, producer, vintage, type (required) + region, country, varietal, appellation, storage location, purchase price, purchase date, purchase source, drink from, drink by, notes, format — all accept input and submit successfully; wine appears in list within ~100ms"
    why_human: "Form interaction, optional fields behind toggle, and Dexie offline-first reactivity timing require browser observation"
  - test: "Tap the LogOut icon in the top-right corner of the bottom nav"
    expected: "Session is destroyed; browser redirects to /login. Navigating to /cellar directly redirects back to /login."
    why_human: "Session cookie destruction and auth redirect require browser environment"
  - test: "Tap Delete on a wine detail page, verify confirmation dialog appears, confirm delete"
    expected: "AlertDialog shows wine name, Cancel/Remove buttons; after Remove, navigates to /cellar and wine is absent from the list"
    why_human: "AlertDialog interaction and post-delete navigation require browser interaction"
  - test: "Add a wine while offline (DevTools Network → Offline), restore network"
    expected: "Wine appears in Cellar list immediately; SyncIndicator shows pending; on reconnect, wine syncs to Turso"
    why_human: "Real-time offline behavior requires browser environment and network simulation"
---

# Phase 1: Core Inventory Verification Report

**Phase Goal:** Users can manage their complete wine collection — adding, viewing, editing, and deleting wine records — from a responsive mobile-friendly interface
**Verified:** 2026-05-28T23:00:00Z
**Status:** PASSED — 5/5 success criteria verified
**Re-verification:** Yes — after gap closure (plans 01-07, 01-08) and estimated value re-assessment against FRD + ARCHITECTURE.md

---

## Re-Verification Summary

| Item                           | Previous Status          | Current Status | Change                                                                                                                                           |
| ------------------------------ | ------------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| SC1: Add wine with all fields  | ⚠️ PARTIAL (16/17)       | ✓ VERIFIED     | Gap closed: `estimated_value` confirmed as F05 collection stat, not a per-wine field. ROADMAP wording was inaccurate; implementation is correct. |
| SC2: View wine list            | ✓ VERIFIED               | ✓ VERIFIED     | No regression                                                                                                                                    |
| SC3: View wine detail          | ✓ VERIFIED               | ✓ VERIFIED     | No regression                                                                                                                                    |
| SC4: Edit any field (pre-fill) | ✓ VERIFIED (wiring only) | ✓ VERIFIED     | Bug fixed: WineDrawer gate + controlled Select + useEffect reset now ensure pre-fill works correctly at runtime                                  |
| SC5: Delete with confirmation  | ✓ VERIFIED               | ✓ VERIFIED     | No regression                                                                                                                                    |
| UAT: Logout redirect           | ✗ UNWIRED                | ✓ VERIFIED     | `logoutAction` now wired to MobileNav via `<form action={logoutAction}>`                                                                         |

---

## Goal Achievement

### Observable Truths

| #   | Truth                                                                                                                                                                                                                                                                                                     | Status     | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                             |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | User can add a wine record with all per-wine fields (name, producer, vintage, country, region, appellation, wine type, grape variety, bottle size, quantity owned, storage location, purchase date, purchase source, purchase price, drinking window start/end, notes) and it appears in their collection | ✓ VERIFIED | All 16 per-wine fields implemented. `estimated_value` is NOT a per-wine input field — confirmed by FRD §Cross-Cutting Terminology (line 61: "sum of purchase_price × quantity_owned"), FRD F00 Inputs (no `estimated_value` in per-wine field list), and FRD F05 (appears only as Insights Dashboard metric). ARCHITECTURE.md schema has no `estimated_value` column. ROADMAP SC1 contained a wording error.                         |
| 2   | User can view the wine list showing name, producer, vintage, type, quantity, and drinking status                                                                                                                                                                                                          | ✓ VERIFIED | `WineCard.tsx` renders all 6 required fields: name, producer, vintage, type (color-coded), quantity, and drinking status via `WineStatusBadge`. `useWines` filters `status = 'in_cellar'` only. No regression.                                                                                                                                                                                                                       |
| 3   | User can open a wine detail page and see all fields                                                                                                                                                                                                                                                       | ✓ VERIFIED | `/wine/[id]/page.tsx` renders full detail via DetailRow components plus notes section. `useLiveQuery` reads from Dexie offline-first. No regression.                                                                                                                                                                                                                                                                                 |
| 4   | User can edit any field on an existing wine record and see the update reflected immediately                                                                                                                                                                                                               | ✓ VERIFIED | **Bug fixed (01-08):** WineDrawer gates WineForm until `editingWine !== undefined` (line 41: `isLoading = isEdit && editingWine === undefined`). WineForm uses controlled `value=` on type Select (line 179) and format Select (line 262) so `form.reset()` updates them. `useEffect + form.reset()` added (lines 92-114) for async defaultValues. `editWine()` writes to Dexie first → `useLiveQuery` triggers immediate UI update. |
| 5   | User can delete a wine record (with confirmation) and it no longer appears in the list                                                                                                                                                                                                                    | ✓ VERIFIED | AlertDialog confirmation wired in detail page. `removeWine()` soft-deletes (status='spoiled') in Dexie → `useWines` filters `status = 'in_cellar'` → wine disappears from list immediately. No regression.                                                                                                                                                                                                                           |

**Score:** 5/5 truths verified

---

## Estimated Value — Definitive Re-Assessment

### FRD Evidence

**FRD §Cross-Cutting Terminology (line 61):**

> "**Estimated Value:** The sum of `purchase_price × quantity_owned` across all wine records. Not adjusted for market appreciation."

This defines Estimated Value as a **computed aggregate** over the entire collection — not a per-wine field.

**FRD F00 §Inputs (per-wine fields for Add/Edit form):**
The complete list of optional fields for adding a wine does **not** include `estimated_value`. Financial fields are: `purchase_price`, `purchase_date`, `purchase_source` only.

**FRD F05 §Collection Insights Dashboard:**
`estimated_value` appears exclusively in F05 as: `SUM(purchase_price * quantity_owned)` where price is not null. This is a dashboard-level aggregation metric, scoped entirely to Phase 6.

### ARCHITECTURE.md Evidence

The ARCHITECTURE.md Drizzle schema for the `wines` table has no `estimated_value` column. Financial per-wine fields are: `purchasePrice`, `purchaseDate`, `purchaseSource`. This exactly matches FRD F00.

### Conclusion

**The implementation is correct.** All 16 per-wine fields defined in FRD F00 and ARCHITECTURE.md are implemented. The ROADMAP SC1 wording was erroneous in listing "estimated value" as a per-wine add-form field. SC1 is VERIFIED.

**Recommended action:** Update ROADMAP.md SC1 to remove "estimated value" from the per-wine field list, or add a note clarifying it is a Phase 6 collection-level derived stat.

---

## Gap Closure Verification

### Gap 1 (Closed): Logout Button in MobileNav (plan 01-07)

**Verified in `src/components/layout/MobileNav.tsx`:**

```
Line 4:  import { ..., LogOut } from "lucide-react";
Line 7:  import { logoutAction } from "@/app/login/actions";
Lines 23-31: <form action={logoutAction} className="absolute top-2 right-2">
               <button type="submit" aria-label="Logout">
                 <LogOut className="w-4 h-4" />
               </button>
             </form>
```

**Verified in `src/app/login/actions.ts`:**

```
Line 22: export async function logoutAction(): Promise<void>
Line 23:   await destroySession();
Line 24:   redirect("/login");
```

Pattern: `<form action={serverAction}>` correctly routes through Next.js 15 server-side execution, enabling `redirect()` calls that would fail inside client-side `onClick` handlers.

**Status: ✓ WIRED**

---

### Gap 2 (Closed): Edit Drawer Pre-Fill Bug (plan 01-08)

**Verified in `src/components/wine/WineDrawer.tsx`:**

```
Line 21-27: useLiveQuery<LocalWine | undefined>(() =>
              editingWineId ? dexieDb.wines.get(editingWineId) : Promise.resolve(undefined),
              [editingWineId])
Line 29: const isEdit = Boolean(editingWineId);
Line 41: const isLoading = isEdit && editingWine === undefined;   ← gate
Lines 52-63: {isLoading ? <Loading /> : <WineForm defaultValues={editingWine ?? undefined} />}
```

**Verified in `src/components/wine/WineForm.tsx`:**

```
Lines 92-114: useEffect(() => {
                if (defaultValues) { form.reset({ name: defaultValues.name ?? "", ... }) }
              }, [defaultValues]);   ← re-initializes on late-arriving async data
Line 179: <Select onValueChange={field.onChange} value={field.value}>   ← controlled type
Line 262: <Select onValueChange={field.onChange} value={field.value ?? "750ml"}>   ← controlled format
Lines 49-64: useState(() => !!(defaultValues?.region || ... ))   ← lazy auto-expand
```

Gate pattern: `isLoading = isEdit && editingWine === undefined` correctly distinguishes between:

- Add mode: `editingWineId = null`, `isEdit = false`, `isLoading = false` → WineForm mounts immediately (blank)
- Edit mode loading: `editingWineId = "abc"`, `editingWine = undefined` (Dexie resolving), `isLoading = true` → Loading state
- Edit mode ready: `editingWineId = "abc"`, `editingWine = { name: "..." }`, `isLoading = false` → WineForm mounts with data

**Status: ✓ IMPLEMENTED AND WIRED**

---

## Key Link Verification (Regression Check)

| From                        | To                                      | Via                                              | Status                           |
| --------------------------- | --------------------------------------- | ------------------------------------------------ | -------------------------------- |
| `MobileNav` logout form     | `logoutAction`                          | `<form action={logoutAction}>`                   | ✓ WIRED — verified line 23       |
| `MobileNav` Add button      | `WineDrawer`                            | `openDrawer()` → `UIStore.isDrawerOpen`          | ✓ WIRED — no regression          |
| `WineDrawer`                | `WineForm`                              | Gate: `!isLoading` → mount with `defaultValues`  | ✓ WIRED — line 52                |
| `WineForm` Select (type)    | `form.reset()`                          | `value={field.value}` controlled                 | ✓ WIRED — line 179               |
| `WineForm` Select (format)  | `form.reset()`                          | `value={field.value ?? "750ml"}` controlled      | ✓ WIRED — line 262               |
| `WineDrawer`                | `useWineActions.editWine`               | `handleSubmit` → `editWine(editingWineId, data)` | ✓ WIRED — line 33                |
| `WineDrawer`                | `useWineActions.createWine`             | `handleSubmit` → `createWine(data)`              | ✓ WIRED — line 35                |
| `useWineActions.createWine` | `addWine` Server Action                 | Dexie write → `addWine({...record, id})`         | ✓ WIRED — no regression          |
| `useWineActions.editWine`   | `updateWine` Server Action              | Dexie update → `updateWine(id, data)`            | ✓ WIRED — no regression          |
| `useWineActions.removeWine` | `deleteWine` Server Action              | Dexie soft-delete → `deleteWine(id)`             | ✓ WIRED — no regression          |
| `DetailPage` Edit button    | `WineDrawer` (edit mode)                | `openDrawer(wine.id)` → `editingWineId`          | ✓ WIRED — no regression          |
| `DetailPage` Delete button  | `removeWine`                            | AlertDialogAction → `handleDelete()`             | ✓ WIRED — no regression          |
| `logoutAction`              | `destroySession` + `redirect("/login")` | Server action body                               | ✓ WIRED — actions.ts lines 22-24 |

---

## Anti-Patterns Found

| File       | Pattern | Severity | Impact |
| ---------- | ------- | -------- | ------ |
| None found | —       | —        | —      |

No TODO/FIXME/placeholder/stub patterns in any gap-closure files. `placeholder=` strings in WineForm.tsx are HTML input placeholder attributes (UI hint text), not code stubs. All handlers make real calls.

---

## Human Verification Required

### 1. Edit Drawer — Select Dropdowns Pre-Filled Correctly

**Test:** Create a wine with Type = "White" and Format = "1.5L". Navigate to its detail page. Tap Edit.
**Expected:** WineDrawer opens with "Edit Wine" header. Name and producer fields are pre-filled. Type Select shows "White" (not the "Red" default). Format Select shows "1.5L" (not "750ml" default). Optional section auto-expands since optional fields are set.
**Why human:** Controlled Select value behavior (value= vs defaultValue=) and optional section auto-expand require visual inspection in browser. The code fix is verified programmatically; the runtime rendering needs human confirmation.

### 2. Add Wine — All Fields Visible and Submittable

**Test:** Tap the + button in the bottom nav. Fill required fields. Toggle "Add more details". Fill all optional fields. Submit.
**Expected:** All 16 fields accept input. Wine appears in Cellar list within ~100ms of submission (Dexie offline-first write triggers useLiveQuery update).
**Why human:** Field toggle visibility and real-time Dexie reactivity require browser observation.

### 3. Logout Flow — Session Cleared and Auth Guard Active

**Test:** While authenticated, tap the small LogOut icon (top-right corner of bottom nav, `aria-label="Logout"`).
**Expected:** Session cookie destroyed; browser redirects to `/login`. Navigating to `/cellar` via URL bar redirects back to `/login` without showing collection data.
**Why human:** Session cookie destruction and auth redirect flow require browser environment.

### 4. Delete With Confirmation

**Test:** Open a wine detail page → tap Delete → confirm dialog appears → tap Remove.
**Expected:** AlertDialog shows wine name. After Remove, navigates to /cellar; wine is absent from list.
**Why human:** AlertDialog interaction and post-delete navigation require browser.

### 5. Offline Add and Sync

**Test:** With DevTools Network set to "Offline", add a wine via the drawer. Restore network.
**Expected:** Wine appears in Cellar list immediately. SyncIndicator shows pending state. On reconnect, wine syncs to Turso.
**Why human:** Real-time offline behavior requires browser environment and network simulation.

---

## Full Artifact Status

| Artifact                              | Status     | Notes                                                                                      |
| ------------------------------------- | ---------- | ------------------------------------------------------------------------------------------ |
| `src/components/layout/MobileNav.tsx` | ✓ VERIFIED | logoutAction wired via form; LogOut icon; 4-tab layout intact                              |
| `src/components/wine/WineDrawer.tsx`  | ✓ VERIFIED | isLoading gate; WineForm only mounts after useLiveQuery resolves                           |
| `src/components/wine/WineForm.tsx`    | ✓ VERIFIED | useEffect+form.reset(), controlled value= on both Selects, 16 fields, lazy optional expand |
| `src/app/login/actions.ts`            | ✓ VERIFIED | logoutAction: destroySession() + redirect("/login")                                        |
| `src/lib/validations/wine.ts`         | ✓ VERIFIED | 16-field WineFormSchema; no estimated_value (correct per FRD F00)                          |
| `src/lib/db/schema.ts`                | ✓ VERIFIED | No estimated_value column (correct per ARCHITECTURE.md)                                    |
| `src/hooks/useWineActions.ts`         | ✓ VERIFIED | createWine/editWine/removeWine all offline-first; no regression                            |
| `src/hooks/useWines.ts`               | ✓ VERIFIED | useLiveQuery, status='in_cellar' filter; no regression                                     |
| `src/components/wine/WineCard.tsx`    | ✓ VERIFIED | name, producer, vintage, type, quantity, WineStatusBadge; no regression                    |
| `src/app/(app)/cellar/page.tsx`       | ✓ VERIFIED | Skeleton/empty/data states, WineCard list; no regression                                   |
| `src/app/(app)/wine/[id]/page.tsx`    | ✓ VERIFIED | Full detail, edit → openDrawer(wine.id), delete AlertDialog; no regression                 |
| `src/app/(app)/layout.tsx`            | ✓ VERIFIED | Auth check, SyncProvider, OfflineBanner, MobileNav, WineDrawer; no regression              |
| `src/middleware.ts`                   | ✓ VERIFIED | Protects all routes, redirects to /login; no regression                                    |

---

## Summary

Phase 1 goal is **fully achieved**. All five success criteria verified at all three levels (exists, substantive, wired end-to-end). No regressions detected.

**Gap closures confirmed:**

**01-07 (Logout):** The `logoutAction` server action is wired to MobileNav via `<form action={logoutAction}>` with an absolutely-positioned `LogOut` icon button. The form-submission pattern is correct for Next.js 15 — server actions that call `redirect()` must be invoked via form actions, not client-side `onClick` handlers. `logoutAction` correctly calls `destroySession()` then `redirect("/login")`.

**01-08 (Edit Pre-Fill):** WineDrawer now gates WineForm mount on `editingWine !== undefined` (not just `editingWineId !== null`), preventing the form from initializing with empty defaults before the Dexie `useLiveQuery` resolves. WineForm uses controlled `value=` on both Select components so `form.reset()` correctly updates them. A defensive `useEffect + form.reset()` ensures re-initialization whenever `defaultValues` changes asynchronously.

**Estimated Value (ROADMAP wording error):** The FRD unambiguously defines "Estimated Value" as a collection-level aggregate (`SUM(purchase_price × quantity_owned)`) in F05 (Insights Dashboard), not a per-wine input field. The F00 §Inputs specification has no `estimated_value` field. ARCHITECTURE.md schema has no such column. The implementation is correct; ROADMAP SC1 should be updated to remove "estimated value" from its per-wine field list.

Five human verification items remain (edit pre-fill visual, add form, logout flow, delete, offline sync) — all requiring browser interaction, none blocking automated goal verification.

---

_Verified: 2026-05-28T23:00:00Z_
_Verifier: Claude (pivota_spec-verifier)_
_Re-verification: Yes (previous status: gaps_found, score: 4/5 → current status: passed, score: 5/5)_
