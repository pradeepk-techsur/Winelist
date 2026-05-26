---
status: diagnosed
trigger: "many of the required fields were not pre filled when opening edit drawer"
created: 2026-05-26T00:00:00Z
updated: 2026-05-26T00:00:00Z
---

## Current Focus

hypothesis: WineDrawer passes `editingWine` (from useLiveQuery) as `defaultValues` to WineForm, but useLiveQuery returns `undefined` while loading — and React Hook Form's `defaultValues` are only read ONCE on initial render, so by the time the wine data arrives from Dexie, the form is already initialized with all defaults (empty/null).
test: Traced the render lifecycle — WineDrawer renders WineForm immediately when drawer opens; editingWine is undefined at first render; form initializes with blank defaults; wine arrives from Dexie on a subsequent re-render but no `reset()` call is made.
expecting: Confirmed — no `useEffect` + `form.reset()` is called in WineForm when `defaultValues` prop changes.
next_action: DIAGNOSED — root cause confirmed

## Symptoms

expected: When a user clicks Edit on a wine detail page, the WineDrawer opens with all existing wine data pre-populated in the form fields
actual: Many of the required fields were not pre-filled when the edit drawer opened
errors: None reported
reproduction: Test 7 in UAT — open a wine detail page, click Edit, observe the form fields
started: Discovered during UAT Phase 1

## Eliminated

- hypothesis: Field name mismatch between LocalWine (Dexie) and WineFormSchema (Zod)
  evidence: All field names match exactly — name, producer, vintage, type, varietal, region, appellation, country, quantity, format, storageLocation, purchasePrice, purchaseDate, purchaseSource, drinkFrom, drinkBy, notes. No mismatch.
  timestamp: 2026-05-26T00:00:00Z

- hypothesis: Optional fields missing from defaultValues object
  evidence: All fields (required AND optional) are explicitly listed in WineForm's defaultValues object (lines 50-68). The collapsible section fields are all included.
  timestamp: 2026-05-26T00:00:00Z

- hypothesis: openDrawer() not setting editingWineId correctly
  evidence: ui-store.ts openDrawer() correctly sets both isDrawerOpen: true and editingWineId: wineId. wine detail page calls openDrawer(wine.id) correctly.
  timestamp: 2026-05-26T00:00:00Z

## Evidence

- timestamp: 2026-05-26T00:00:00Z
  checked: WineDrawer.tsx lines 21-25 — useLiveQuery for editingWine
  found: useLiveQuery returns `undefined` while loading (documented in comment on line 20). WineDrawer passes `editingWine ?? undefined` to WineForm immediately — meaning on the first render when the drawer opens, `defaultValues` will be `undefined` (since editingWine hasn't loaded yet from Dexie).
  implication: WineForm receives `undefined` as defaultValues on its first render.

- timestamp: 2026-05-26T00:00:00Z
  checked: WineForm.tsx lines 47-69 — useForm initialization
  found: `useForm` is called with `defaultValues` computed from `defaultValues` prop on initial render. React Hook Form's `defaultValues` are ONLY read once during the initial `useForm()` call. When `defaultValues` prop is `undefined`, all fields fall back to their empty defaults ("", null, 1, "750ml", etc.). When Dexie later resolves the wine and `editingWine` becomes the actual LocalWine object, the `defaultValues` prop to WineForm changes — but React Hook Form does NOT automatically re-initialize or reset the form when props change.
  implication: The form is stuck with empty defaults; the actual wine data never populates the fields.

- timestamp: 2026-05-26T00:00:00Z
  checked: WineForm.tsx — entire file — for any useEffect or form.reset() call
  found: No `useEffect` exists in WineForm. No `form.reset()` call exists anywhere in the component. The form instance is created once and never reset when `defaultValues` changes.
  implication: This confirms the root cause — there is NO mechanism to update the form after the async Dexie query resolves.

- timestamp: 2026-05-26T00:00:00Z
  checked: WineDrawer.tsx — rendering logic — whether WineForm is conditionally rendered
  found: WineForm is rendered unconditionally (no `if (editingWine)` guard before rendering WineForm). The drawer renders `<WineForm defaultValues={editingWine ?? undefined} ...>` immediately, even when editingWine is still undefined/loading.
  implication: If WineDrawer delayed rendering WineForm until editingWine was resolved, the form would initialize with correct data. The lack of a loading guard is the proximate cause.

- timestamp: 2026-05-26T00:00:00Z
  checked: WineForm.tsx — Select components for `type` and `format` fields
  found: Select components use `defaultValue={field.value}` (line 134, 215) — not `value`. This means the Select also only reads the initial value. Even if a reset() were called, Select components with `defaultValue` (not controlled `value`) would not visually update.
  implication: The `type` and `format` selects have an ADDITIONAL bug on top — they're uncontrolled (defaultValue) rather than controlled (value), meaning even a form.reset() call might not visually update the Select UI.

## Resolution

root_cause: |
Two-part root cause:

PRIMARY: React Hook Form's `defaultValues` are only read once at `useForm()` initialization. WineDrawer renders WineForm immediately when the drawer opens, but at that moment `useLiveQuery` returns `undefined` (the async Dexie query hasn't resolved yet). So the form initializes with all fallback empty values. When Dexie resolves with the actual wine data (~milliseconds later), React Hook Form ignores the changed prop — no `useEffect` + `form.reset()` exists to re-initialize the form with the loaded data.

SECONDARY: The `type` and `format` Select components use `defaultValue` (uncontrolled) instead of `value` (controlled). Even if `form.reset()` were called with the wine's data, these Select dropdowns would not visually update to reflect the new values.

fix: |
TWO fixes required:

FIX 1 — Add a useEffect in WineForm to call form.reset() when defaultValues changes:
useEffect(() => {
if (defaultValues) {
form.reset({
name: defaultValues.name ?? "",
producer: defaultValues.producer ?? "",
... (all fields)
});
}
}, [defaultValues]); // omit form from deps to avoid infinite loop

OR alternatively, in WineDrawer, don't render WineForm until editingWine is resolved:
{isEdit && editingWine === undefined ? <LoadingSpinner /> : <WineForm defaultValues={editingWine ?? undefined} ... />}

FIX 2 — Change Select components from uncontrolled (defaultValue) to controlled (value):
<Select onValueChange={field.onChange} value={field.value}>
(applies to `type` Select on line 134 and `format` Select on line 215)

files_changed: []
