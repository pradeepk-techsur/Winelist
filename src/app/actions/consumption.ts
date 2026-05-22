"use server";
import { db } from "@/lib/db";
import { wines, consumptionEvents } from "@/lib/db/schema";
import {
  ConsumeEventSchema,
  type ConsumeEventValues,
} from "@/lib/validations/consumption";
import { eq, sql } from "drizzle-orm";

type AddConsumptionEventInput = ConsumeEventValues & {
  id: string; // Client-generated CUID2 for the event
  quantityConsumed?: number; // How many bottles consumed (default: 1)
};

export async function addConsumptionEvent(
  input: AddConsumptionEventInput
): Promise<{ success: true } | { success: false; error: string | object }> {
  const result = ConsumeEventSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.flatten() };
  }

  if (!input.id || typeof input.id !== "string" || input.id.length < 10) {
    return { success: false, error: "Invalid event ID" };
  }

  const quantityConsumed = Math.max(1, input.quantityConsumed ?? 1);

  try {
    const now = new Date().toISOString();

    // Insert consumption event (append-only)
    await db.insert(consumptionEvents).values({
      id: input.id,
      wineId: result.data.wineId,
      consumedAt: result.data.consumedAt,
      occasion: result.data.occasion ?? null,
      rating: result.data.rating ?? null,
      tastingNote: result.data.tastingNote ?? null,
      createdAt: now,
    });

    // Decrement quantity on wine record (quantity cannot go below 0)
    await db
      .update(wines)
      .set({
        quantity: sql`MAX(0, quantity - ${quantityConsumed})`,
        updatedAt: now,
      })
      .where(eq(wines.id, result.data.wineId));

    return { success: true };
  } catch (err) {
    console.error("[addConsumptionEvent] Database error:", err);
    return { success: false, error: "Failed to record consumption event" };
  }
}

export async function getConsumptionEventsForWine(wineId: string): Promise<
  | {
      success: true;
      events: Array<{
        id: string;
        wineId: string;
        consumedAt: string;
        occasion: string | null;
        rating: number | null;
        tastingNote: string | null;
        createdAt: string;
      }>;
    }
  | { success: false; error: string }
> {
  if (!wineId || typeof wineId !== "string") {
    return { success: false, error: "Invalid wine ID" };
  }

  try {
    const events = await db
      .select()
      .from(consumptionEvents)
      .where(eq(consumptionEvents.wineId, wineId));
    return { success: true, events };
  } catch (err) {
    console.error("[getConsumptionEventsForWine] Database error:", err);
    return { success: false, error: "Failed to fetch consumption events" };
  }
}
