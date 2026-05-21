# Architecture Research

**Domain:** Personal wine collection management — mobile-first PWA, offline-first, single-user
**Researched:** 2026-05-21
**Confidence:** HIGH (data model, storage architecture, sync patterns) — all based on verified official docs

---

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Browser (Mobile / Desktop)                   │
├───────────────────────────────┬─────────────────────────────────────┤
│      React UI Layer           │      Service Worker (Serwist)        │
│  ┌─────────┐  ┌─────────┐    │  ┌────────────────────────────────┐  │
│  │ Pages   │  │  shadcn │    │  │ Precache: JS/CSS/HTML chunks   │  │
│  │ /cellar │  │  /ui    │    │  │ Runtime: NetworkFirst API      │  │
│  │ /wine/  │  │ Drawer  │    │  │ Fallback: /~offline page       │  │
│  │ [id]    │  │ Sheet   │    │  └────────────────────────────────┘  │
│  └────┬────┘  └─────────┘    │                                      │
│       │  (useLiveQuery)       │                                      │
├───────┼───────────────────────┴─────────────────────────────────────┤
│       ↓                                                              │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                   Dexie.js (IndexedDB)                       │    │
│  │  wines | consumption_events | sync_queue                     │    │
│  │  Local read layer — always available, zero latency           │    │
│  └───────────────────────┬─────────────────────────────────────┘    │
│                           │ (sync service, online only)              │
└───────────────────────────┼─────────────────────────────────────────┘
                            │  HTTPS
┌───────────────────────────┼─────────────────────────────────────────┐
│         Next.js 15 Server  │                                          │
│  ┌────────────────────────┴────────────────────────────────────┐    │
│  │            Server Actions  (app/actions/*.ts)                │    │
│  │  addWine | updateWine | deleteWine | addConsumptionEvent     │    │
│  └────────────────────────┬────────────────────────────────────┘    │
│                            │                                          │
│  ┌─────────────────────────┴──────────────────────────────────┐     │
│  │                  Drizzle ORM (libSQL)                        │     │
│  └─────────────────────────┬──────────────────────────────────┘     │
└────────────────────────────┼────────────────────────────────────────┘
                             │  libSQL protocol (HTTPS)
┌────────────────────────────┼────────────────────────────────────────┐
│  Turso Cloud (libSQL/SQLite)│                                        │
│  ┌──────────────────────────┴─────────────────────────────────┐     │
│  │  wines | consumption_events  (source of truth)              │     │
│  └────────────────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Next.js App Router | Page routing, Server-Side Rendering for initial load, serves PWA shell | `app/` directory with layout.tsx + page.tsx per route |
| Server Actions | CRUD mutations against Turso; validate input with Zod; return typed results | `app/actions/wines.ts`, `app/actions/consumption.ts` |
| Drizzle ORM | Type-safe SQL against Turso libSQL; schema declaration; `drizzle-kit push` for migrations | `lib/db/schema.ts`, `lib/db/index.ts` |
| Turso (libSQL) | Cloud SQLite database; source of truth; cross-device access | External service, accessed via `@libsql/client/web` |
| Dexie.js (IndexedDB) | Local read cache and write buffer; powers offline mode; `useLiveQuery` for reactive UI | `lib/dexie/db.ts`, mirrors Turso schema for wines + sync_queue |
| Sync Service | Hydrates Dexie from Turso on first load; flushes offline queue on reconnect | `lib/sync/sync-service.ts` as a client-side singleton |
| Serwist Service Worker | Precaches app shell; runtime caches API routes; provides `/~offline` fallback | `app/sw.ts` compiled to `public/sw.js` |
| shadcn/ui | Mobile-first component kit; Drawer for add/edit flows, Command for search | Components copied to `components/ui/` via shadcn CLI |
| Zustand | UI state: active filters, selected wine ID, sort order, sheet/drawer open state | `lib/stores/cellar-store.ts`, `lib/stores/filter-store.ts` |

---

## Recommended Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout: PWA metadata, providers
│   ├── page.tsx                # Dashboard: stats + ready-to-drink hero
│   ├── cellar/
│   │   └── page.tsx            # Wine list with search/filter
│   ├── wine/
│   │   ├── [id]/
│   │   │   └── page.tsx        # Wine detail: edit, consume, tasting notes
│   │   └── new/
│   │       └── page.tsx        # Add wine form
│   ├── ~offline/
│   │   └── page.tsx            # Offline fallback page (Serwist)
│   ├── sw.ts                   # Service worker source (compiled by Serwist)
│   ├── manifest.json           # PWA web app manifest
│   └── actions/                # Server Actions (CRUD)
│       ├── wines.ts            # addWine, updateWine, deleteWine, getWines
│       └── consumption.ts      # addConsumptionEvent, getTastingNotes
├── components/
│   ├── ui/                     # shadcn/ui components (owned, copied in)
│   ├── wine/
│   │   ├── WineCard.tsx        # Single wine item in list
│   │   ├── WineListItem.tsx    # Compact list row
│   │   ├── WineForm.tsx        # Add/Edit wine form (React Hook Form + Zod)
│   │   ├── WineDrawer.tsx      # Mobile bottom sheet: add/edit via vaul
│   │   ├── ConsumeDialog.tsx   # Mark-as-consumed flow with tasting note
│   │   └── WineStatusBadge.tsx # Ready/Aging/Past-window status pill
│   ├── cellar/
│   │   ├── CellarSearch.tsx    # Command palette search (cmdk)
│   │   ├── CellarFilters.tsx   # Filter chips: type, region, vintage
│   │   ├── ReadyToDrink.tsx    # "Ready now" section / full page
│   │   └── CollectionStats.tsx # Dashboard stat cards
│   └── layout/
│       ├── MobileNav.tsx       # Bottom tab navigation
│       ├── OfflineBanner.tsx   # "You're offline, showing cached data"
│       └── SyncIndicator.tsx   # Sync status indicator
├── lib/
│   ├── db/
│   │   ├── schema.ts           # Drizzle schema: wines, consumption_events
│   │   ├── index.ts            # Drizzle client factory (Turso connection)
│   │   └── queries.ts          # Reusable Drizzle query functions
│   ├── dexie/
│   │   ├── db.ts               # Dexie database declaration (mirrors schema)
│   │   ├── wines.ts            # Dexie query helpers for wine table
│   │   └── sync-queue.ts       # Offline write queue operations
│   ├── sync/
│   │   └── sync-service.ts     # Hydrate Dexie from server; flush queue
│   ├── stores/
│   │   ├── cellar-store.ts     # Zustand: filter state, sort, selected wine
│   │   └── ui-store.ts         # Zustand: drawer open state, sheet state
│   └── validations/
│       ├── wine.ts             # Zod schema for wine form + Server Action validation
│       └── consumption.ts      # Zod schema for tasting note / consumption event
├── hooks/
│   ├── useWines.ts             # useLiveQuery wrapper for wine list
│   ├── useWineDetail.ts        # Single wine live query by id
│   ├── useReadyToDrink.ts      # useLiveQuery: wines in drinking window today
│   ├── useNetworkStatus.ts     # Online/offline detection (navigator.onLine + events)
│   └── useSync.ts              # Trigger sync on reconnect
└── types/
    └── wine.ts                 # Shared types: Wine, ConsumptionEvent, DrinkingWindow
```

### Structure Rationale

- **`app/actions/`:** All mutations go here as Server Actions with `'use server'` — they run on the server and call Drizzle → Turso. This is the only place that writes to the cloud database.
- **`lib/db/`:** Drizzle schema and client are server-side only. Never import into client components.
- **`lib/dexie/`:** Dexie is client-side only. Never import into Server Components or Server Actions.
- **`lib/sync/`:** Sync logic is a client-side concern; it bridges Dexie and the server actions.
- **`components/wine/`:** Wine-specific components are grouped by domain, not by type (not a flat `components/` folder).

---

## Data Models

### Core Wine Record

The primary entity. One record per wine (not per bottle — multiple bottles of the same wine share one record, tracked by `quantity`).

**Turso / Drizzle schema (`lib/db/schema.ts`):**

```typescript
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const wines = sqliteTable('wines', {
  // Identity
  id:             text('id').primaryKey(),           // CUID2 generated client-side
  name:           text('name').notNull(),             // "Château Margaux 2015"
  producer:       text('producer').notNull(),         // "Château Margaux"
  vintage:        integer('vintage'),                 // 2015 — nullable (NV wines)
  
  // Classification
  type:           text('type', {
                    enum: ['red', 'white', 'rosé', 'sparkling', 'dessert', 'fortified']
                  }).notNull(),
  varietal:       text('varietal'),                  // "Cabernet Sauvignon", "Blend"
  region:         text('region'),                    // "Bordeaux, France"
  appellation:    text('appellation'),               // "Margaux AOC" (optional, more specific)
  country:        text('country'),                   // "France"
  
  // Inventory
  quantity:       integer('quantity').notNull().default(1),   // Bottles on hand
  format:         text('format').default('750ml'),            // "750ml", "1.5L", "3L"
  storageLocation: text('storage_location'),         // "Cellar Rack A, Row 2, Bin 4"
  
  // Financial
  purchasePrice:  real('purchase_price'),             // Per bottle price, USD
  purchaseDate:   text('purchase_date'),              // ISO date string "2024-06-15"
  purchaseSource: text('purchase_source'),            // "Total Wine", "Winery direct"
  
  // Drinking window
  drinkFrom:      text('drink_from'),                // ISO date "2026-01-01" — start drinking
  drinkBy:        text('drink_by'),                  // ISO date "2035-12-31" — last date
  
  // Notes
  notes:          text('notes'),                     // General notes (not tasting notes)
  
  // Metadata
  createdAt:      text('created_at').notNull(),       // ISO datetime
  updatedAt:      text('updated_at').notNull(),       // ISO datetime
  
  // Status — soft-delete approach
  status:         text('status', {
                    enum: ['in_cellar', 'consumed', 'gifted', 'sold', 'spoiled']
                  }).notNull().default('in_cellar'),
});
```

**Key modeling decisions:**
- `id` is a client-generated CUID2 (not auto-increment) so Dexie can write it offline and the server just accepts it — no ID collisions.
- `vintage` is `INTEGER` nullable — allows NV (non-vintage) sparkling wines.
- `drinkFrom` / `drinkBy` stored as ISO date strings (not integers) — readable in SQL, easy to compare with `new Date().toISOString().slice(0,10)`.
- `storageLocation` is free text — named text locations are far simpler than a bin/rack integer coordinate system and sufficient for personal use.
- `quantity` on the wine record tracks current stock — decreased when a consumption event is logged.
- `status` defaults to `in_cellar`; wines are never deleted, only marked as consumed/gifted.

---

### Consumption Events

One record per bottle opened. Captures tasting notes and consumption context.

```typescript
export const consumptionEvents = sqliteTable('consumption_events', {
  id:         text('id').primaryKey(),              // CUID2
  wineId:     text('wine_id').notNull()
              .references(() => wines.id),
  
  // When and context
  consumedAt: text('consumed_at').notNull(),        // ISO datetime
  occasion:   text('occasion'),                     // "Dinner", "Birthday", "Tuesday"
  
  // Tasting note
  rating:     integer('rating'),                    // 1–100 (or 1–10 — configurable)
  tastingNote: text('tasting_note'),                // Free-text tasting notes
  
  // Metadata
  createdAt:  text('created_at').notNull(),
});
```

**Key modeling decisions:**
- Consumption events are **append-only** — never update, never delete. Each opened bottle creates a new event.
- This enables a "consumption history" timeline without complex state tracking.
- `rating` on the consumption event (not on the wine record) — allows tracking taste evolution across vintages and years.
- `wineId` foreign key: one wine can have many consumption events.

---

### Dexie Local Schema (IndexedDB mirror)

Mirrors Turso schema but with Dexie indexes for query performance:

```typescript
// lib/dexie/db.ts
import Dexie, { Table } from 'dexie';

export interface LocalWine {
  id: string;
  name: string;
  producer: string;
  vintage: number | null;
  type: 'red' | 'white' | 'rosé' | 'sparkling' | 'dessert' | 'fortified';
  varietal: string | null;
  region: string | null;
  appellation: string | null;
  country: string | null;
  quantity: number;
  format: string;
  storageLocation: string | null;
  purchasePrice: number | null;
  purchaseDate: string | null;
  purchaseSource: string | null;
  drinkFrom: string | null;
  drinkBy: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  status: 'in_cellar' | 'consumed' | 'gifted' | 'sold' | 'spoiled';
  _syncedAt: string | null;      // Last sync timestamp; null = pending sync
}

export interface LocalConsumptionEvent {
  id: string;
  wineId: string;
  consumedAt: string;
  occasion: string | null;
  rating: number | null;
  tastingNote: string | null;
  createdAt: string;
  _syncedAt: string | null;
}

export interface SyncQueueEntry {
  id: string;                    // Auto-increment (Dexie manages)
  operation: 'create' | 'update' | 'delete';
  table: 'wines' | 'consumption_events';
  recordId: string;
  payload: string;               // JSON stringified record
  createdAt: string;
  attempts: number;
}

class CellarDatabase extends Dexie {
  wines!: Table<LocalWine, string>;
  consumptionEvents!: Table<LocalConsumptionEvent, string>;
  syncQueue!: Table<SyncQueueEntry, number>;

  constructor() {
    super('wine-cellar-v1');
    this.version(1).stores({
      wines: [
        'id',            // Primary key
        'status',        // Filter: in_cellar, consumed
        'type',          // Filter: red, white, etc.
        'region',        // Filter by region
        'vintage',       // Sort/filter by year
        'drinkFrom',     // Range query: ready to drink
        'drinkBy',       // Range query: drink by date
        'producer',      // Search
        'updatedAt',     // Sync ordering
      ].join(', '),
      consumptionEvents: 'id, wineId, consumedAt',
      syncQueue: '++id, table, recordId, createdAt',
    });
  }
}

export const dexieDb = new CellarDatabase();
```

**Key decisions:**
- Dexie schema is **identical to Turso schema** with the addition of `_syncedAt` — makes comparing "what changed" trivial.
- Indexes on `status`, `type`, `region`, `drinkFrom`, `drinkBy` power all filter operations **without hitting the network**.
- `syncQueue` table stores operations that haven't been sent to Turso yet (offline writes).

---

### Derived Types (Zod)

Single Zod schema used for both form validation and Server Action input validation:

```typescript
// lib/validations/wine.ts
import { z } from 'zod';

export const WineFormSchema = z.object({
  name:             z.string().min(1, 'Name is required').max(200),
  producer:         z.string().min(1, 'Producer is required').max(200),
  vintage:          z.number().int().min(1800).max(new Date().getFullYear() + 1).nullable(),
  type:             z.enum(['red', 'white', 'rosé', 'sparkling', 'dessert', 'fortified']),
  varietal:         z.string().max(200).nullable().optional(),
  region:           z.string().max(200).nullable().optional(),
  appellation:      z.string().max(200).nullable().optional(),
  country:          z.string().max(100).nullable().optional(),
  quantity:         z.number().int().min(0).max(9999).default(1),
  format:           z.string().default('750ml'),
  storageLocation:  z.string().max(500).nullable().optional(),
  purchasePrice:    z.number().min(0).max(999999).nullable().optional(),
  purchaseDate:     z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  purchaseSource:   z.string().max(200).nullable().optional(),
  drinkFrom:        z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  drinkBy:          z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  notes:            z.string().max(5000).nullable().optional(),
});

export type WineFormValues = z.infer<typeof WineFormSchema>;

export const ConsumeEventSchema = z.object({
  wineId:     z.string().cuid2(),
  consumedAt: z.string().datetime(),
  occasion:   z.string().max(200).nullable().optional(),
  rating:     z.number().int().min(1).max(100).nullable().optional(),
  tastingNote: z.string().max(5000).nullable().optional(),
});
```

---

## Architectural Patterns

### Pattern 1: Offline-First with Sync Queue

**What:** All writes go to Dexie (IndexedDB) first. If online, the same write is immediately forwarded to Turso via Server Action. If offline, the write is queued in `syncQueue` and flushed when connectivity is restored.

**When to use:** Every write operation in the app (add wine, consume bottle, add tasting note).

**Trade-offs:**
- Pro: UI never blocks on network; instant feedback even offline
- Pro: Full offline functionality for the primary personal use case (at the dinner table)
- Con: Adds complexity — two writes per mutation; must handle sync failures
- Con: No conflict resolution needed for single-user, but must handle retries

**Example:**
```typescript
// hooks/useWineActions.ts
'use client';
import { dexieDb } from '@/lib/dexie/db';
import { addWine } from '@/app/actions/wines';
import { useNetworkStatus } from './useNetworkStatus';
import { createId } from '@paralleldrive/cuid2';

export function useWineActions() {
  const isOnline = useNetworkStatus();

  async function createWine(data: WineFormValues) {
    const id = createId();              // Generate ID client-side
    const now = new Date().toISOString();
    const record = { ...data, id, createdAt: now, updatedAt: now, 
                     status: 'in_cellar', _syncedAt: null };

    // 1. Write to Dexie immediately (instant UI update via useLiveQuery)
    await dexieDb.wines.put(record);

    if (isOnline) {
      // 2a. Online: forward to server directly
      const result = await addWine(record);
      if (result.success) {
        await dexieDb.wines.update(id, { _syncedAt: new Date().toISOString() });
      }
    } else {
      // 2b. Offline: queue the write for later sync
      await dexieDb.syncQueue.add({
        operation: 'create', table: 'wines', recordId: id,
        payload: JSON.stringify(record),
        createdAt: now, attempts: 0
      });
    }
  }

  return { createWine };
}
```

---

### Pattern 2: useLiveQuery for Reactive Wine Lists

**What:** All read operations use Dexie's `useLiveQuery` — components automatically re-render when the underlying IndexedDB data changes, whether from a local write or a sync that just completed.

**When to use:** Every component that displays wine data (list, detail, stats, ready-to-drink).

**Trade-offs:**
- Pro: Zero loading spinners for reads — data is always local
- Pro: Works offline identically to online
- Con: Requires data to be in Dexie first (initial sync needed on first load)

**Example:**
```typescript
// hooks/useWines.ts
'use client';
import { useLiveQuery } from 'dexie-react-hooks';
import { dexieDb } from '@/lib/dexie/db';
import { useCellarStore } from '@/lib/stores/cellar-store';

export function useWines() {
  const { filterType, filterRegion, sortField } = useCellarStore();

  const wines = useLiveQuery(
    () => {
      let query = dexieDb.wines
        .where('status').equals('in_cellar');

      // Chain filters from Zustand store
      // Note: Dexie compound where() requires ordering by indexed field
      return query.toArray().then(wines => {
        return wines
          .filter(w => !filterType || w.type === filterType)
          .filter(w => !filterRegion || w.region === filterRegion)
          .sort((a, b) => {
            if (sortField === 'vintage') return (b.vintage ?? 0) - (a.vintage ?? 0);
            if (sortField === 'name') return a.name.localeCompare(b.name);
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
      });
    },
    [filterType, filterRegion, sortField]
  );

  return wines ?? [];
}

// hooks/useReadyToDrink.ts
export function useReadyToDrink() {
  const today = new Date().toISOString().slice(0, 10);

  return useLiveQuery(
    () => dexieDb.wines
      .where('status').equals('in_cellar')
      .and(wine =>
        wine.drinkFrom !== null &&
        wine.drinkBy !== null &&
        wine.drinkFrom <= today &&
        wine.drinkBy >= today
      )
      .toArray(),
    [today]
  );
}
```

---

### Pattern 3: Server Actions as the Cloud Write Layer

**What:** Server Actions are the only code path that writes to Turso. They validate with Zod, write with Drizzle, and return typed success/error results.

**When to use:** Called from the sync service (online path) and from the sync flush routine (queue drain).

**Trade-offs:**
- Pro: All cloud writes are validated server-side — no direct client access to database
- Pro: Clean separation: Dexie for local, Server Actions for cloud
- Con: Server Actions add 1 network round trip on the online write path (acceptable — UI has already updated via Dexie)

**Example:**
```typescript
// app/actions/wines.ts
'use server';
import { db } from '@/lib/db';
import { wines } from '@/lib/db/schema';
import { WineFormSchema } from '@/lib/validations/wine';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

export async function addWine(input: unknown) {
  const result = WineFormSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.flatten() };
  }

  try {
    await db.insert(wines).values({
      ...result.data,
      id: (input as any).id,   // Accept client-generated CUID2
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'in_cellar',
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Database error' };
  }
}
```

---

### Pattern 4: Sync Service — Hydration and Queue Flush

**What:** On app mount, the sync service fetches all wines from Turso and writes them to Dexie. On reconnect, it flushes the sync queue.

**When to use:** Called once in the root layout (or a `SyncProvider` component) on client-side mount.

**Trade-offs:**
- Pro: App works instantly on subsequent loads (Dexie has data from last session)
- Pro: Offline writes are safely queued and replayed
- Con: Full-collection sync on every page load is naive — needs "sync since last updated_at" optimization at scale (fine for 99% of personal collections)

```typescript
// lib/sync/sync-service.ts
'use client';
import { dexieDb } from '@/lib/dexie/db';
import { getWines, addWine, updateWine, deleteWine } from '@/app/actions/wines';

export async function hydrateDexie() {
  // Fetch last sync time from local state
  const lastSync = localStorage.getItem('last_sync_at');
  
  // Fetch all wines from server (MVP: full fetch; optimize later with ?since= param)
  const { wines } = await getWines({ since: lastSync });
  
  if (wines && wines.length > 0) {
    await dexieDb.wines.bulkPut(
      wines.map(w => ({ ...w, _syncedAt: new Date().toISOString() }))
    );
  }
  
  localStorage.setItem('last_sync_at', new Date().toISOString());
}

export async function flushSyncQueue() {
  const queue = await dexieDb.syncQueue.orderBy('createdAt').toArray();
  
  for (const entry of queue) {
    try {
      const payload = JSON.parse(entry.payload);
      
      if (entry.table === 'wines') {
        if (entry.operation === 'create') await addWine(payload);
        if (entry.operation === 'update') await updateWine(payload.id, payload);
        if (entry.operation === 'delete') await deleteWine(payload.id);
      }
      
      // Remove from queue on success
      await dexieDb.syncQueue.delete(entry.id!);
    } catch (err) {
      // Increment attempts; stop retrying after 5 failures
      await dexieDb.syncQueue.update(entry.id!, { attempts: entry.attempts + 1 });
      if (entry.attempts >= 5) {
        // Move to dead letter (log error, alert user)
        console.error('Sync queue entry failed 5 times:', entry);
      }
    }
  }
}
```

---

### Pattern 5: Search Architecture — Dexie Full-Scan with Text Match

**What:** For the collection size of a personal cellar (typical: 20–500 bottles; extreme: ~2,000), client-side full-scan filtering in Dexie is entirely sufficient. No dedicated search index needed.

**When to use:** Text search on name, producer, region, varietal.

**Trade-offs:**
- Pro: No additional dependencies (no Fuse.js, no MeiliSearch)
- Pro: Works offline
- Con: O(n) scan — acceptable at 2,000 records; insufficient at 100,000
- Con: No fuzzy matching (typo tolerance) — must use `includes()` check

```typescript
// hooks/useWineSearch.ts
export function useWineSearch(query: string) {
  const normalizedQuery = query.toLowerCase().trim();

  return useLiveQuery(
    () => {
      if (!normalizedQuery) {
        return dexieDb.wines.where('status').equals('in_cellar').toArray();
      }
      
      return dexieDb.wines
        .where('status').equals('in_cellar')
        .and(wine =>
          wine.name.toLowerCase().includes(normalizedQuery) ||
          wine.producer.toLowerCase().includes(normalizedQuery) ||
          (wine.region ?? '').toLowerCase().includes(normalizedQuery) ||
          (wine.varietal ?? '').toLowerCase().includes(normalizedQuery)
        )
        .toArray();
    },
    [normalizedQuery]
  );
}
```

**Note:** If search needs grow (>2,000 bottles, typo tolerance), add Fuse.js on top of the Dexie array result. For the v1 personal use case, the above is correct and sufficient.

---

## Data Flow

### Online Write Flow (Add Bottle)

```
User fills WineForm
  ↓
React Hook Form validates against Zod WineFormSchema (client)
  ↓
useWineActions.createWine(data) called
  ↓
Generate CUID2 id client-side
  ↓
Write to Dexie (IndexedDB) — instant
  ↓                                         ↓ useLiveQuery triggers
                                       WineList re-renders with new bottle
  ↓
isOnline? YES
  ↓
addWine() Server Action called (Next.js POST)
  ↓
Zod validates on server
  ↓
Drizzle inserts into Turso
  ↓
Server returns { success: true }
  ↓
Update _syncedAt in Dexie record
```

### Offline Write Flow

```
User fills WineForm (no network)
  ↓
Write to Dexie — instant
  ↓                                         ↓ useLiveQuery triggers
                                       WineList re-renders immediately
  ↓
isOnline? NO
  ↓
Push to syncQueue in Dexie
  ↓
OfflineBanner shows "Changes will sync when online"
  ↓
[Later: network restored]
  ↓
useNetworkStatus → online event fires
  ↓
flushSyncQueue() runs
  ↓
Queue entries sent as Server Actions in sequence
  ↓
SyncIndicator shows "Synced"
```

### Initial App Load Flow

```
User opens app URL
  ↓
Next.js serves HTML shell + hydrates React
  ↓
Service Worker activates (if installed)
  ↓
SyncProvider mounts on client
  ↓
Check: Dexie has data? YES → show immediately from Dexie
                       NO  → show skeleton UI
  ↓
hydrateDexie() runs in background
  ↓
Turso fetch via getWines() Server Action
  ↓
bulkPut into Dexie
  ↓
useLiveQuery detects change → components re-render with fresh data
```

### Drinking Window Computation

```
Today's date (runtime)
  ↓
Dexie query: status = 'in_cellar' AND drinkFrom <= today AND drinkBy >= today
  ↓
Ready-to-drink list (sorted by: drinkBy ASC to surface most urgent first)
```

---

## Mobile-First PWA Architecture

### Web App Manifest (`app/manifest.json`)

```json
{
  "name": "Wine Cellar",
  "short_name": "Cellar",
  "description": "Your personal wine collection",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "theme_color": "#1a0a0a",
  "background_color": "#0d0605",
  "display": "standalone",
  "orientation": "portrait",
  "start_url": "/",
  "scope": "/"
}
```

### Service Worker Caching Strategy (Serwist)

```typescript
// app/sw.ts
import { defaultCache } from '@serwist/next/worker';
import { Serwist, NetworkFirst, CacheFirst } from 'serwist';

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,    // App shell: JS, CSS, HTML
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: ({ request }) => request.destination === 'document',
      handler: new NetworkFirst({ cacheName: 'pages' }),  // Navigation: try network, fall to cache
    },
    {
      matcher: ({ url }) => url.pathname.startsWith('/api/'),
      handler: new NetworkFirst({ cacheName: 'api', networkTimeoutSeconds: 3 }),
    },
    {
      matcher: ({ request }) => ['style', 'script', 'image'].includes(request.destination),
      handler: new CacheFirst({ cacheName: 'assets' }),   // Static assets: cache-first
    },
  ],
  fallbacks: {
    entries: [{
      url: '/~offline',
      matcher({ request }) { return request.destination === 'document'; },
    }],
  },
});

serwist.addEventListeners();
```

### Mobile Navigation Architecture

Use a **bottom tab bar** — not a hamburger menu or side drawer. Bottom navigation is the standard mobile pattern; users reach it with thumbs.

```
Bottom Nav Tabs:
  [Cellar]  [Ready Now]  [Add Bottle]  [Insights]
     📦        🍷            ➕           📊
```

- **Cellar**: Main wine list with search/filter
- **Ready Now**: Full-screen ready-to-drink list
- **Add Bottle**: Taps open a bottom Drawer (vaul) immediately — no full page transition needed
- **Insights**: Collection stats and charts

The **Add Bottle** flow uses a `<Drawer>` (shadcn/ui + vaul) sliding from the bottom — this is the dominant mobile pattern for creation flows. No full-page navigation for adding a wine; it should feel like a sheet that comes up instantly.

---

## Single-User Data Isolation

For the v1 personal use case, there is **no authentication**. The app trusts the browser as the user. Single-user isolation is achieved by:

1. **One Turso database per deployment** — no shared database; the entire Turso database belongs to one user's collection.
2. **No user_id columns** in the schema — they are unnecessary and would complicate queries with no benefit for single-user.
3. **Auth token secured server-side** — `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are environment variables only accessible to Next.js Server Actions, never exposed to the client.
4. **Dexie is per-origin** — IndexedDB data is isolated to the domain by the browser.

**When adding multi-user (future):** Add `user_id` to all tables, add Clerk or Auth.js, scope all Drizzle queries with `.where(eq(wines.userId, session.userId))`. The schema is designed to make this straightforward — just adding a column.

---

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Personal use (1 user, 500 wines) | Current architecture is correct. Full-collection sync on every load is fine. No optimization needed. |
| Personal + family (2–5 users) | Add auth (Clerk), add `user_id` to schema, scope all queries. Keep Turso — free tier handles this easily. |
| Small app (1k users) | Single Turso instance per user (Turso free tier: 500 databases). Or one shared Turso database with `user_id` isolation. Add rate limiting on Server Actions. |
| Medium app (10k users) | Move to shared Turso instance with `user_id` isolation. Add caching layer (e.g., `revalidateTag`). Consider Turso Edge deployment for latency. |
| Large app (100k+ users) | Turso scales horizontally with edge SQLite. Add read replicas. Re-evaluate Dexie sync approach — add incremental sync with `since` timestamp to reduce payload. |

### Scaling Priorities

1. **First bottleneck (if this becomes multi-user):** Full-collection sync on every load sends too much data. Fix with `GET /api/wines?since={lastSyncAt}` — incremental sync. Add `updatedAt` index to Turso table.
2. **Second bottleneck:** Concurrent write contention in shared Turso. Fix with per-user Turso databases (Turso supports 500 free databases). Each user gets their own SQLite file.

---

## Anti-Patterns

### Anti-Pattern 1: Server-Only Architecture (No Dexie)

**What people do:** Use TanStack Query to fetch from Next.js API routes with `staleTime`, hoping it approximates offline.

**Why it's wrong:** TanStack Query cache is in-memory only — cleared on page reload. The user loses all data when closing the browser. The app requires network on every load. At the dinner table with no WiFi, the app shows loading spinners.

**Do this instead:** Use Dexie as the read layer always. TanStack Query's `useMutation` can still be used for Server Action calls (it provides optimistic update patterns), but the canonical data is in Dexie, not the query cache.

---

### Anti-Pattern 2: Client-Only Architecture (No Turso)

**What people do:** Use Dexie/IndexedDB only, no backend, thinking it's simpler.

**Why it's wrong:** Data lives in one browser. If the user switches from phone to laptop, they see no data. If the browser storage is cleared (privacy settings, device wipe, new phone), all wine data is permanently lost. For a collection someone has built over years, this is unacceptable data loss risk.

**Do this instead:** Two-layer architecture. Turso is the source of truth. Dexie is the offline cache. Both are needed.

---

### Anti-Pattern 3: Drizzle Schema Without CUID2 Primary Keys

**What people do:** Use SQLite `INTEGER PRIMARY KEY AUTOINCREMENT` for IDs.

**Why it's wrong:** Auto-increment IDs require a database round-trip before you can reference the new record. For offline-first, this means you can't write to Dexie with a real ID until the server responds — breaking the offline write pattern.

**Do this instead:** Generate client-side CUID2 IDs. The server accepts the client-provided ID. No round-trip needed. IDs are globally unique and safe for offline generation.

---

### Anti-Pattern 4: One SQLite Table Per "Bottle" (Not Per "Wine")

**What people do:** Create a `bottles` table where each row is one physical bottle, storing wine metadata on every row.

**Why it's wrong:** A collector with 6 bottles of the same wine gets 6 identical rows with duplicated name, producer, vintage, region. Updating the notes requires 6 updates. Collection stats are expensive aggregations.

**Do this instead:** One `wines` row per wine, with `quantity` as an integer. Consumption events decrement the quantity. This is how all major cellar apps model inventory.

---

### Anti-Pattern 5: Putting Drinking Window Logic in the UI

**What people do:** Compute "is this wine ready to drink?" with `new Date()` comparisons scattered in component render functions.

**Why it's wrong:** Logic is duplicated across components. Timezone edge cases appear. Server and client compute differently.

**Do this instead:** Centralize all drinking window queries in `useReadyToDrink()` hook backed by a Dexie query with indexed `drinkFrom`/`drinkBy` fields. The query is the single definition of "ready to drink."

---

### Anti-Pattern 6: Storing Vintage as a String

**What people do:** Store `vintage` as `text("2015")` for flexibility.

**Why it's wrong:** Cannot sort numerically. Cannot do range queries (`vintage > 2010`). Requires parsing everywhere.

**Do this instead:** Store `vintage` as `INTEGER` nullable. Non-vintage wines get `null`. Sorting and range filtering work natively in SQLite and Dexie.

---

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Turso Cloud | `drizzle-orm/libsql/web` → Server Actions only | Auth token never sent to browser; only callable server-side |
| Serwist CDN | `public/sw.js` registered via `<meta>` in layout | Must set `Content-Type: application/javascript` for service worker scope |
| Vercel (deploy target) | `next build` → static + serverless functions | Server Actions become Vercel Functions; Turso connect is edge-compatible |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| React Components ↔ Dexie | `useLiveQuery()` from `dexie-react-hooks` | Reactive; never use `useEffect` + `db.wines.toArray()` |
| Sync Service ↔ Server Actions | Direct function call (client-side import) | Server Actions are imported as async functions, not HTTP endpoints |
| Drizzle ↔ Turso | `drizzle-orm/libsql/web` client | Use `@libsql/client/web` in Next.js — handles SSR/Edge correctly |
| Zustand ↔ Components | `useCellarStore()` hook | Filter/sort state; never put wine data in Zustand — that's Dexie's job |
| React Hook Form ↔ Zod | `zodResolver(WineFormSchema)` from `@hookform/resolvers/zod` | Same Zod schema used in both form and Server Action |

---

## Sources

- **Dexie.js official docs — useLiveQuery**: https://dexie.org/docs/dexie-react-hooks/useLiveQuery() (verified: reactive IndexedDB, fine-grained observation, service worker support)
- **Drizzle ORM — Turso connection**: https://orm.drizzle.team/docs/connect-turso (verified: `@libsql/client/web` for Next.js; `drizzle-orm/libsql/web` import)
- **Drizzle ORM — SQLite get-started**: https://orm.drizzle.team/docs/get-started-sqlite (verified: libSQL vs better-sqlite3 differences)
- **@serwist/next getting started**: https://serwist.pages.dev/docs/next/getting-started (verified: webpack and Turbopack support, manifest structure, offline fallback pattern)
- **Next.js 15 — Server Actions and Mutations**: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations (verified: `'use server'`, `revalidatePath`, action patterns)
- **CUID2 library**: https://github.com/paralleldrive/cuid2 (client-side collision-resistant ID generation)
- **CellarTracker data model analysis**: https://support.cellartracker.com/article/32-what-can-be-tracked (wine fields, consumption events, drinking windows)

---
*Architecture research for: Personal wine collection management — mobile-first PWA*
*Researched: 2026-05-21*
