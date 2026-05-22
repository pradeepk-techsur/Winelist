"use client";
import { dexieDb } from "@/lib/dexie/db";
import type { LocalWine } from "@/lib/dexie/db";
import { getWines, addWine, updateWine, deleteWine } from "@/app/actions/wines";

/**
 * Hydrate Dexie from Turso on app load.
 * Full fetch for MVP — incremental sync (since) deferred to Phase 6.
 * Per ARCHITECTURE.md Pattern 4.
 */
export async function hydrateDexie(): Promise<void> {
  try {
    const result = await getWines();
    if (!result.success) {
      console.error("[sync] Failed to hydrate from server:", result.error);
      return;
    }

    if (result.wines.length === 0) return;

    const now = new Date().toISOString();

    // bulkPut: upsert all wines (add or replace existing)
    await dexieDb.wines.bulkPut(
      result.wines.map((w) => ({
        id: w.id,
        name: w.name,
        producer: w.producer,
        vintage: w.vintage ?? null,
        type: w.type as LocalWine["type"],
        varietal: w.varietal ?? null,
        region: w.region ?? null,
        appellation: w.appellation ?? null,
        country: w.country ?? null,
        quantity: w.quantity,
        format: w.format ?? "750ml",
        storageLocation: w.storageLocation ?? null,
        purchasePrice: w.purchasePrice ?? null,
        purchaseDate: w.purchaseDate ?? null,
        purchaseSource: w.purchaseSource ?? null,
        drinkFrom: w.drinkFrom ?? null,
        drinkBy: w.drinkBy ?? null,
        notes: w.notes ?? null,
        createdAt: w.createdAt,
        updatedAt: w.updatedAt,
        status: w.status as LocalWine["status"],
        _syncedAt: now,
      }))
    );

    localStorage.setItem("last_sync_at", now);
  } catch (err) {
    console.error("[sync] hydrateDexie error:", err);
  }
}

/**
 * Flush the offline sync queue to Turso.
 * Called when connectivity is restored (after checkReachability probe succeeds).
 *
 * CRITICAL: Dexie operations and Server Action calls MUST NOT be inside a
 * db.transaction() scope together. Sequence them separately to avoid
 * TransactionInactiveError (PITFALLS.md Pitfall 1).
 */
export async function flushSyncQueue(): Promise<void> {
  const queue = await dexieDb.syncQueue.orderBy("createdAt").toArray();
  if (queue.length === 0) return;

  for (const entry of queue) {
    // Stop retrying entries that have failed too many times
    if (entry.attempts >= 5) {
      console.error("[sync] Queue entry failed 5 times, skipping:", entry);
      continue;
    }

    try {
      const payload = JSON.parse(entry.payload);
      let result: { success: boolean; error?: unknown };

      if (entry.table === "wines") {
        if (entry.operation === "create") {
          result = await addWine(payload);
        } else if (entry.operation === "update") {
          result = await updateWine(payload.id, payload);
        } else if (entry.operation === "delete") {
          result = await deleteWine(payload.id);
        } else {
          continue;
        }

        if (result.success) {
          // Step A: Remove from sync queue (Dexie write)
          // Step B: Update _syncedAt (Dexie write)
          // BOTH happen AFTER the Server Action (network call) — never mixed in a transaction
          await dexieDb.syncQueue.delete(entry.id!);
          await dexieDb.wines.update(entry.recordId, {
            _syncedAt: new Date().toISOString(),
          });
        } else {
          // Increment attempts; will retry next flush cycle
          await dexieDb.syncQueue.update(entry.id!, {
            attempts: entry.attempts + 1,
          });
        }
      }
    } catch (err) {
      console.error("[sync] Queue entry error:", err, entry);
      // Increment attempts without crashing the whole flush
      if (entry.id !== undefined) {
        await dexieDb.syncQueue.update(entry.id, {
          attempts: entry.attempts + 1,
        });
      }
    }
  }
}
