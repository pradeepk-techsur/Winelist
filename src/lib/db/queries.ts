import "server-only";
import { db } from "./index";
import { wines, consumptionEvents } from "./schema";
import { eq, desc } from "drizzle-orm";

export async function getAllWines() {
  return db.select().from(wines).orderBy(desc(wines.createdAt));
}

export async function getWineById(id: string) {
  const result = await db.select().from(wines).where(eq(wines.id, id)).limit(1);
  return result[0] ?? null;
}

export async function getConsumptionEventsForWine(wineId: string) {
  return db
    .select()
    .from(consumptionEvents)
    .where(eq(consumptionEvents.wineId, wineId))
    .orderBy(desc(consumptionEvents.consumedAt));
}
