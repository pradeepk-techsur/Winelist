---
status: diagnosed
phase: 01-core-inventory
source: 01-01-SUMMARY.md, 01-02-SUMMARY.md, 01-03-SUMMARY.md, 01-04-SUMMARY.md, 01-05-SUMMARY.md, 01-06-SUMMARY.md
started: 2026-05-26T00:00:00Z
updated: 2026-05-26T00:45:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Login & Auth Guard

expected: Navigate to the app. Without being logged in, you should be redirected to /login. Enter valid credentials and submit — you should land on the cellar page.
result: issue
reported: "does not redirect"
severity: major

### 2. Wine List — Empty State

expected: On a fresh account with no wines added, the cellar page shows an empty state (e.g. a 🍾 icon or message indicating no wines yet) — not a blank screen or error.
result: pass

### 3. Add Wine — Required Fields Only

expected: Tap the Add (+) button in the bottom nav. A bottom drawer slides up with a wine form. Fill in only the required fields (name and wine type) and submit. The new wine appears in the cellar list.
result: pass

### 4. Add Wine — All Fields

expected: Open the Add drawer again. Fill in required fields plus expand the "Add more details" section and fill optional fields (vintage, producer, region, country, appellation, grape variety, bottle size, quantity, storage location, purchase date, source, price, estimated value, drinking window start/end, notes). Submit. Wine appears in the list.
result: pass

### 5. Wine List — Card Display

expected: Each wine card in the cellar list shows: name, producer, vintage, wine type (color-coded), quantity owned, and a drinking status badge.
result: pass

### 6. Wine Detail Page

expected: Tap a wine card. A detail page opens showing all fields for that wine — classification (name, producer, vintage, type, appellation, region, country, grape), inventory (quantity, bottle size, storage location), purchase info (date, source, price, estimated value), drinking window (start/end year), and notes.
result: pass

### 7. Edit Wine

expected: On the detail page, tap Edit. The wine drawer opens pre-filled with the wine's existing data. Change a field (e.g. update the notes or quantity) and save. The updated values are reflected immediately on the detail page and in the cellar list.
result: issue
reported: "many of the required fields were not pre filled"
severity: major

### 8. Delete Wine

expected: On a wine detail page, tap Delete. A confirmation dialog appears asking you to confirm. Confirm the deletion. The wine is removed from the cellar list and no longer appears.
result: pass

### 9. Bottom Navigation

expected: The bottom of the screen shows a tab bar with: Cellar, Ready Now, Add (+), and Insights. Tapping Cellar and Ready Now navigates between views. Tapping Add opens the wine drawer. Tapping Insights navigates to a placeholder page. No 404 errors on any tab.
result: pass

### 10. Drinking Status Badge

expected: A wine with a drinking window that includes the current year shows a "Drink Now" or "In Window" badge. A wine with a future start year shows "Hold" or "Not Yet". A wine with no drinking window set shows no badge or a neutral indicator.
result: pass

### 11. Offline Banner

expected: Disconnect your device from the internet (or disable network in dev tools). After ~3 seconds, an offline banner appears at the top of the screen. Reconnect — the banner disappears.
result: skipped

### 12. Logout

expected: There is a way to log out (e.g. a button in the app). After logging out, navigating to the app redirects back to /login.
result: skipped

## Summary

total: 12
passed: 8
issues: 2
pending: 0
skipped: 2

## Gaps

- truth: "Navigating to the app without being logged in redirects to /login"
  status: failed
  reason: "User reported: does not redirect"
  severity: major
  test: 1
  root_cause: "logoutAction is defined in actions.ts but never wired to any UI component — no logout button exists in MobileNav or anywhere in the app. The tester had a valid session cookie from a prior login and could not clear it, making auth guard appear broken."
  artifacts:
  - path: "src/app/login/actions.ts"
    issue: "logoutAction implemented but never exposed to the UI"
  - path: "src/components/layout/MobileNav.tsx"
    issue: "No logout button present"
    missing:
  - "Add a logout button to MobileNav or the app header that calls logoutAction"
    debug_session: ".planning/debug/auth-redirect-missing.md"

- truth: "Edit drawer opens pre-filled with all existing wine fields"
  status: failed
  reason: "User reported: many of the required fields were not pre filled"
  severity: major
  test: 7
  root_cause: "React Hook Form's defaultValues are only read once during useForm() initialization. WineDrawer renders WineForm before useLiveQuery resolves (undefined first), so the form initializes with empty fallbacks. When Dexie resolves with the real wine data, WineForm has no useEffect + form.reset() to re-initialize. Additionally, type and format Select components use uncontrolled defaultValue instead of controlled value, so they wouldn't update even if reset() were called."
  artifacts:
  - path: "src/components/wine/WineDrawer.tsx"
    issue: "Renders WineForm before useLiveQuery resolves, passing undefined as defaultValues on first render"
  - path: "src/components/wine/WineForm.tsx"
    issue: "No useEffect + form.reset() for async defaultValues; type and format selects use uncontrolled defaultValue instead of controlled value"
    missing:
  - "Add useEffect in WineForm that calls form.reset(defaultValues) when defaultValues changes from undefined to a real wine object (or gate WineForm mount in WineDrawer until editingWine resolves)"
  - "Change type and format Select components from defaultValue={field.value} to value={field.value}"
    debug_session: ".planning/debug/edit-form-prefill.md"
