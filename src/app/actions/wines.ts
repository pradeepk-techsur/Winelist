"use server";
import { db } from "@/lib/db";
import { wines } from "@/lib/db/schema";
import { WineFormSchema, type WineFormValues } from "@/lib/validations/wine";
import { eq } from "drizzle-orm";

// Input type for addWine — includes the client-generated CUID2 id
type AddWineInput = WineFormValues & {
  id: string;
  createdAt?: string;
};

export async function addWine(
  input: AddWineInput
): Promise<{ success: true } | { success: false; error: string | object }> {
  const result = WineFormSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.flatten() };
  }

  // Validate CUID2 id format (basic check: non-empty string, reasonable length)
  if (!input.id || typeof input.id !== "string" || input.id.length < 10) {
    return { success: false, error: "Invalid record ID" };
  }

  try {
    const now = new Date().toISOString();
    await db.insert(wines).values({
      id: input.id,
      name: result.data.name,
      producer: result.data.producer,
      vintage: result.data.vintage ?? null,
      type: result.data.type,
      varietal: result.data.varietal ?? null,
      region: result.data.region ?? null,
      appellation: result.data.appellation ?? null,
      country: result.data.country ?? null,
      quantity: result.data.quantity ?? 1,
      format: result.data.format ?? "750ml",
      storageLocation: result.data.storageLocation ?? null,
      purchasePrice: result.data.purchasePrice ?? null,
      purchaseDate: result.data.purchaseDate ?? null,
      purchaseSource: result.data.purchaseSource ?? null,
      drinkFrom: result.data.drinkFrom ?? null,
      drinkBy: result.data.drinkBy ?? null,
      notes: result.data.notes ?? null,
      createdAt: input.createdAt ?? now,
      updatedAt: now,
      status: "in_cellar",
    });
    return { success: true };
  } catch (err) {
    // Log full error server-side, return generic message to client
    console.error("[addWine] Database error:", err);
    return { success: false, error: "Failed to save wine record" };
  }
}

export async function updateWine(
  id: string,
  input: Partial<WineFormValues>
): Promise<{ success: true } | { success: false; error: string | object }> {
  if (!id || typeof id !== "string") {
    return { success: false, error: "Invalid record ID" };
  }

  // Validate the partial update — use partial() to allow any subset of fields
  const partialSchema = WineFormSchema.partial();
  const result = partialSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.flatten() };
  }

  try {
    await db
      .update(wines)
      .set({
        ...result.data,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(wines.id, id));
    return { success: true };
  } catch (err) {
    console.error("[updateWine] Database error:", err);
    return { success: false, error: "Failed to update wine record" };
  }
}

// Soft delete: set status to 'spoiled' (wines are never physically removed)
// Per CONTEXT.md: status enum includes 'spoiled' for user-deleted wines
export async function deleteWine(
  id: string
): Promise<{ success: true } | { success: false; error: string }> {
  if (!id || typeof id !== "string") {
    return { success: false, error: "Invalid record ID" };
  }

  try {
    await db
      .update(wines)
      .set({
        status: "spoiled",
        updatedAt: new Date().toISOString(),
      })
      .where(eq(wines.id, id));
    return { success: true };
  } catch (err) {
    console.error("[deleteWine] Database error:", err);
    return { success: false, error: "Failed to delete wine record" };
  }
}

// Fetch all wines for initial sync hydration
// Returns plain objects safe to pass to client components
export async function getWines(options?: {
  since?: string | null;
}): Promise<
  | {
      success: true;
      wines: Array<{
        id: string;
        name: string;
        producer: string;
        vintage: number | null;
        type: string;
        varietal: string | null;
        region: string | null;
        appellation: string | null;
        country: string | null;
        quantity: number;
        format: string | null;
        storageLocation: string | null;
        purchasePrice: number | null;
        purchaseDate: string | null;
        purchaseSource: string | null;
        drinkFrom: string | null;
        drinkBy: string | null;
        notes: string | null;
        createdAt: string;
        updatedAt: string;
        status: string;
      }>;
    }
  | { success: false; error: string }
> {
  try {
    const allWines = await db.select().from(wines);
    return { success: true, wines: allWines };
  } catch (err) {
    console.error("[getWines] Database error:", err);
    return { success: false, error: "Failed to fetch wines" };
  }
}
