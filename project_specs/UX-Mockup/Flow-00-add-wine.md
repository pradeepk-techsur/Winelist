---

## Flow 01 — Add a Wine (Quick Path)

**Flow ID:** FLW-01
**Trigger:** User taps the "+" Add button from any screen
**User Stories:** US-0.1, US-0.2, US-6.3
**Persona:** Marcus (quick add), Vivienne (full detail)
**Journey:** JRN-01.1

```
[Any Screen]
    │
    ▼ Tap "+" (bottom nav center / FAB)
[Add Wine Form — Required Fields]
    │  wine_name, wine_type, quantity_owned (3 fields)
    │
    ├── Tap "More Details" ──▶ [Expanded Form — Optional Fields]
    │                              producer, vintage, region, country,
    │                              appellation, grape, bottle_size,
    │                              purchase_price, purchase_date,
    │                              purchase_source, storage_location,
    │                              drink_window_start, drink_window_end,
    │                              is_special_occasion toggle, notes
    │
    ├── Fill required only ──▶ Tap "Save Wine"
    │                              │
    │                              ├── Validation Pass ──▶ [Wine Detail View]
    │                              │                          Success toast:
    │                              │                          "Château X added!"
    │                              │
    │                              └── Validation Fail ──▶ [Form with inline errors]
    │                                                         Field-level red messages
    │                                                         Data preserved — no reset
    │
    └── Fill full detail ──▶ Tap "Save Wine"
                                 │
                                 └── Validation Pass ──▶ [Wine Detail View]
                                                            Success toast + collection
                                                            value update reflected
```

**Steps:**

1. **Entry:** User taps the "+" button (always visible, center of bottom nav bar). Navigates to Add Wine form.
2. **Required fields shown immediately:** Wine Name (text input, auto-focus), Wine Type (segmented control: Red / White / Rosé / Sparkling / Dessert), Quantity (numeric stepper, defaults to 1).
3. **Optional fields hidden:** A "More Details ▼" accordion sits below required fields. Tapping it reveals all optional fields in logical grouped sections (Provenance, Purchase, Storage, Drinking Window).
4. **Numeric keyboard triggers:** Vintage year, quantity, and purchase price fields open numeric keyboard automatically (US-6.3).
5. **Native date picker:** Purchase date triggers OS native date picker.
6. **Submit:** "Save Wine" button — full width, fixed at bottom of scroll area (always visible on mobile).
7. **Success:** Redirected to Wine Detail view for new record. Toast: "Added to your collection." New record appears at top of Wine List.
8. **Error:** Field-level inline red messages beneath each invalid field. No data lost. Focus auto-moves to first error.

**Edge Cases / States:**
- Empty form submit → inline required field errors (wine_name, wine_type)
- Drink window end < start → inline error on drink_window_end field
- Purchase date in future → inline error on purchase_date
- Network failure during submit → persistent banner "Save failed — check connection" + form preserved

---

*Flow-00-add-wine.md — WineApp UX Mockup*
