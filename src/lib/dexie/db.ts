import Dexie, { type Table } from "dexie";

// Mirror of Drizzle wines table, with _syncedAt for sync tracking
export interface LocalWine {
  id: string;
  name: string;
  producer: string;
  vintage: number | null;
  type: "red" | "white" | "rosé" | "sparkling" | "dessert" | "fortified";
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
  status: "in_cellar" | "consumed" | "gifted" | "sold" | "spoiled";
  _syncedAt: string | null; // null = pending sync
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
  id?: number;                    // Auto-increment (Dexie manages)
  operation: "create" | "update" | "delete";
  table: "wines" | "consumption_events";
  recordId: string;
  payload: string;                // JSON stringified record
  createdAt: string;
  attempts: number;
}

class CellarDatabase extends Dexie {
  wines!: Table<LocalWine, string>;
  consumptionEvents!: Table<LocalConsumptionEvent, string>;
  syncQueue!: Table<SyncQueueEntry, number>;

  constructor() {
    super("wine-cellar-v1");

    // Version 1: initial schema
    // IMPORTANT: Every schema change requires a version bump (PITFALLS.md Pitfall 5)
    this.version(1).stores({
      wines: [
        "id",            // Primary key
        "status",        // Filter: in_cellar, consumed
        "type",          // Filter: red, white, etc.
        "region",        // Filter by region
        "vintage",       // Sort/filter by year
        "drinkFrom",     // Range query: ready to drink
        "drinkBy",       // Range query: drink by date
        "producer",      // Search
        "updatedAt",     // Sync ordering
      ].join(", "),
      consumptionEvents: "id, wineId, consumedAt",
      syncQueue: "++id, table, recordId, createdAt",
    });
  }
}

// Singleton — safe in client-only context
export const dexieDb = new CellarDatabase();
