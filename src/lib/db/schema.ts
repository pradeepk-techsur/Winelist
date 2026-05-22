import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const wines = sqliteTable("wines", {
  // Identity
  id:              text("id").primaryKey(),            // CUID2 generated client-side
  name:            text("name").notNull(),              // "Château Margaux 2015"
  producer:        text("producer").notNull(),          // "Château Margaux"
  vintage:         integer("vintage"),                  // 2015 — nullable (NV wines)

  // Classification
  type:            text("type", {
                     enum: ["red", "white", "rosé", "sparkling", "dessert", "fortified"],
                   }).notNull(),
  varietal:        text("varietal"),                   // "Cabernet Sauvignon", "Blend"
  region:          text("region"),                     // "Bordeaux, France"
  appellation:     text("appellation"),                // "Margaux AOC"
  country:         text("country"),                    // "France"

  // Inventory
  quantity:        integer("quantity").notNull().default(1),
  format:          text("format").default("750ml"),    // "750ml", "1.5L", "3L"
  storageLocation: text("storage_location"),           // Free-text location

  // Financial
  purchasePrice:   real("purchase_price"),             // Per bottle price
  purchaseDate:    text("purchase_date"),              // ISO date string "2024-06-15"
  purchaseSource:  text("purchase_source"),            // "Total Wine"

  // Drinking window (ISO date strings "YYYY-MM-DD")
  drinkFrom:       text("drink_from"),
  drinkBy:         text("drink_by"),

  // Notes
  notes:           text("notes"),

  // Metadata
  createdAt:       text("created_at").notNull(),
  updatedAt:       text("updated_at").notNull(),

  // Status — soft delete (wines are never physically deleted per CONTEXT.md)
  status:          text("status", {
                     enum: ["in_cellar", "consumed", "gifted", "sold", "spoiled"],
                   }).notNull().default("in_cellar"),
});

export const consumptionEvents = sqliteTable("consumption_events", {
  id:          text("id").primaryKey(),              // CUID2
  wineId:      text("wine_id").notNull().references(() => wines.id),

  // When and context
  consumedAt:  text("consumed_at").notNull(),        // ISO datetime
  occasion:    text("occasion"),                     // "Dinner", "Birthday"

  // Tasting note (rating lives here per CONTEXT.md, not on wine record)
  rating:      integer("rating"),                    // 1–100
  tastingNote: text("tasting_note"),

  // Metadata
  createdAt:   text("created_at").notNull(),
});
