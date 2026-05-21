---

## Screen 06 — Tasting Notes Entry

**Screen ID:** SCR-06
**Purpose:** Record tasting impressions after opening a bottle. Designed for two modes: post-consume quick capture (tired, at 11pm) and deliberate journal entry (serious collector). All fields except date are optional to minimize friction.
**User Stories:** US-4.1, US-4.2, US-4.4, US-6.3

---

### Layout (Mobile — Full Form)

```
┌─────────────────────────────────────┐
│ ←  Tasting Note               Skip  │  ← Back + "Skip" (when from consume flow)
│    Château Margaux · 2016           │  ← Wine name (subtitle, not editable here)
├─────────────────────────────────────┤
│                                     │
│  Date Opened *                      │
│  ┌───────────────────────────────┐  │  ← Required; pre-filled if from consume
│  │ 21 May 2026                   │  │    Native date picker
│  └───────────────────────────────┘  │
│                                     │
│  My Rating  (1–100)                 │
│  ┌──────────────────────────────┐   │
│  │     [────────●──────] 88     │   │  ← Slider + numeric display; optional
│  └──────────────────────────────┘   │
│  (or type a number: [88])           │
│                                     │
│  Would Buy Again?                   │
│  [Yes]  [Maybe]  [No]              │  ← Segmented control; optional
│                                     │
│  Food Pairing                       │
│  ┌───────────────────────────────┐  │
│  │ e.g. Rack of lamb with herbs  │  │  ← 500 char; optional
│  └───────────────────────────────┘  │
│                                     │
│  Occasion                           │
│  ┌───────────────────────────────┐  │
│  │ e.g. Anniversary dinner       │  │  ← 255 char; optional
│  └───────────────────────────────┘  │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │  ▼ Detailed Tasting Notes       │ │  ← Collapsible accordion (optional)
│ └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐│
│  │        Save Note                ││  ← Fixed primary CTA
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

---

### Layout (Mobile — Detailed Notes Expanded)

```
┌─────────────────────────────────────┐
│ ←  Tasting Note               Skip  │
├─────────────────────────────────────┤
│  [Required + rating/pairing fields] │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │  ▲ Detailed Tasting Notes       │ │
│ └─────────────────────────────────┘ │
│                                     │
│  Appearance                         │
│  ┌───────────────────────────────┐  │
│  │ e.g. Deep ruby, clear, legs   │  │  ← Multi-line text; 2000 char
│  └───────────────────────────────┘  │
│                                     │
│  Aromas                             │
│  ┌───────────────────────────────┐  │
│  │ e.g. Dark cherry, cedar...    │  │
│  └───────────────────────────────┘  │
│                                     │
│  Flavours                           │
│  ┌───────────────────────────────┐  │
│  │ e.g. Full-bodied, grippy...   │  │
│  └───────────────────────────────┘  │
│                                     │
│  Finish                             │
│  ┌───────────────────────────────┐  │
│  │ e.g. Long, mineral finish     │  │
│  └───────────────────────────────┘  │
│                                     │
│  Overall Notes                      │
│  ┌───────────────────────────────┐  │
│  │ Free-form summary notes       │  │
│  └───────────────────────────────┘  │
│                                     │
│  Guest Feedback (optional)          │
│  ┌───────────────────────────────┐  │
│  │ What did others say?          │  │  ← 1000 char
│  └───────────────────────────────┘  │
│                                     │
│  ┌─────────────────────────────────┐│
│  │        Save Note                ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

---

### Quick-Capture Mode (Post-Consume)

When reached via "Mark as Consumed → Add Tasting Note" flow (F03 path), the form enters **Quick-Capture Mode** — optimized for tired post-dinner capture:

**Differences from full form:**
- "Skip" button visible in header (dismisses note entry; returns to Wine Detail)
- Date pre-filled from consumption event (not editable in quick mode — user can expand to change)
- Rating slider and Food Pairing field are front-and-center (the two highest-value quick-capture fields)
- Would Buy Again segmented control visible immediately
- "Detailed Tasting Notes" accordion is collapsed by default (available but not pushed)

**Design rationale (JRN-03.2 insight):** Daniel at 11pm only has 2 minutes. Rating + pairing is the key data to capture. The form must feel like a quick journal entry, not homework.

---

### Edit Tasting Note

- Screen title: "Edit Tasting Note"
- All fields pre-populated with saved values
- No "Skip" button
- "Save Changes" instead of "Save Note"
- Delete option accessible via overflow menu (⋮) in header

---

### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Date Opened | Required field at top |
| Primary | Rating (1–100) | Immediately below date — key metric |
| Primary | Would Buy Again | Segmented control — quick decision |
| Secondary | Food Pairing, Occasion | Mid-form — valuable but optional |
| Tertiary | Detailed sub-fields (Appearance, Aromas, Flavours, Finish, Overall) | Collapsed accordion |
| Tertiary | Guest Feedback | Last field in expanded section |

---

### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Date pre-filled or today; all else empty | Focus on rating slider |
| Quick-capture mode | "Skip" visible; date locked | Streamlined — rating + pairing prominent |
| Validation error | Red message under date if future | "Date cannot be in the future" |
| Submitting | "Save Note" shows spinner | Disabled during submit |
| Success | Navigate to Wine Detail | New note appears at top of list |
| Network error | Error banner; form preserved | "Save failed — check connection" |

---

### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Date Opened | Date input | Native date picker; required |
| Rating slider | Slider + numeric input | 1–100 range; optional |
| Would Buy Again | Segmented control (3 options) | Optional; tap to select |
| Food Pairing | Text input | 500 char max; optional |
| Occasion | Text input | 255 char max; optional |
| Detailed Notes | Accordion | Smooth expand; all fields optional |
| Save Note | Primary button | Full-width; fixed bottom |
| Skip (quick mode) | Secondary button | Dismisses without saving; returns to detail |

---

*Screen-05-tasting-notes.md — WineApp UX Mockup*
