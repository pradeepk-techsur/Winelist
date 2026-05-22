// All types derived from Zod schemas (safe to import in client components)
// Do NOT use InferSelectModel from drizzle-orm here — that would leak server-only imports
export type { WineFormValues } from "@/lib/validations/wine";
export type { ConsumeEventValues } from "@/lib/validations/consumption";

// Re-export the LocalWine type from Dexie (safe — Dexie is client-only)
export type { LocalWine, LocalConsumptionEvent, SyncQueueEntry } from "@/lib/dexie/db";

// Drinking status — computed at read time, never stored
export type DrinkingStatus =
  | "in_window"        // drinkFrom <= today <= drinkBy
  | "not_yet"          // today < drinkFrom
  | "approaching"      // drinkFrom within 6 months
  | "past_window"      // today > drinkBy
  | "no_window";       // drinkFrom/drinkBy not set

export type WineStatus = "in_cellar" | "consumed" | "gifted" | "sold" | "spoiled";
export type WineType = "red" | "white" | "rosé" | "sparkling" | "dessert" | "fortified";
