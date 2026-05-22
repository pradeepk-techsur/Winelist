"use client";
import { createId } from "@paralleldrive/cuid2";
import { dexieDb } from "@/lib/dexie/db";
import type { LocalWine } from "@/lib/dexie/db";
import { enqueueOperation } from "@/lib/dexie/sync-queue";
import { addWine, updateWine, deleteWine } from "@/app/actions/wines";
import { useNetworkStatus } from "./useNetworkStatus";
import type { WineFormValues } from "@/types/wine";
import { toast } from "sonner";

export function useWineActions() {
  const { checkReachability } = useNetworkStatus();

  async function createWine(data: WineFormValues): Promise<void> {
    const id = createId();
    const now = new Date().toISOString();

    const record: LocalWine = {
      id,
      name: data.name,
      producer: data.producer,
      vintage: data.vintage ?? null,
      type: data.type,
      varietal: data.varietal ?? null,
      region: data.region ?? null,
      appellation: data.appellation ?? null,
      country: data.country ?? null,
      quantity: data.quantity ?? 1,
      format: data.format ?? "750ml",
      storageLocation: data.storageLocation ?? null,
      purchasePrice: data.purchasePrice ?? null,
      purchaseDate: data.purchaseDate ?? null,
      purchaseSource: data.purchaseSource ?? null,
      drinkFrom: data.drinkFrom ?? null,
      drinkBy: data.drinkBy ?? null,
      notes: data.notes ?? null,
      createdAt: now,
      updatedAt: now,
      status: "in_cellar",
      _syncedAt: null,
    };

    // Step 1: Write to Dexie immediately — useLiveQuery triggers UI update
    await dexieDb.wines.put(record);

    // Step 2: Network call AFTER Dexie write — NEVER inside a transaction
    const isReachable = await checkReachability();

    if (isReachable) {
      const result = await addWine({ ...record, id });
      if (result.success) {
        await dexieDb.wines.update(id, { _syncedAt: new Date().toISOString() });
      } else {
        // Server rejected — queue for retry
        await enqueueOperation({
          operation: "create",
          table: "wines",
          recordId: id,
          payload: JSON.stringify(record),
          createdAt: now,
          attempts: 0,
        });
      }
    } else {
      // Offline — queue for later sync
      await enqueueOperation({
        operation: "create",
        table: "wines",
        recordId: id,
        payload: JSON.stringify(record),
        createdAt: now,
        attempts: 0,
      });
    }

    toast.success("Wine added to your cellar");
  }

  async function editWine(id: string, data: Partial<WineFormValues>): Promise<void> {
    const now = new Date().toISOString();

    // Step 1: Update Dexie immediately
    await dexieDb.wines.update(id, { ...data, updatedAt: now });

    // Step 2: Network call after Dexie update
    const isReachable = await checkReachability();

    if (isReachable) {
      const result = await updateWine(id, data);
      if (result.success) {
        await dexieDb.wines.update(id, { _syncedAt: new Date().toISOString() });
      } else {
        await enqueueOperation({
          operation: "update",
          table: "wines",
          recordId: id,
          payload: JSON.stringify({ id, ...data, updatedAt: now }),
          createdAt: now,
          attempts: 0,
        });
      }
    } else {
      await enqueueOperation({
        operation: "update",
        table: "wines",
        recordId: id,
        payload: JSON.stringify({ id, ...data, updatedAt: now }),
        createdAt: now,
        attempts: 0,
      });
    }

    toast.success("Wine updated");
  }

  async function removeWine(id: string): Promise<void> {
    const now = new Date().toISOString();

    // Step 1: Mark as spoiled in Dexie immediately (soft delete)
    await dexieDb.wines.update(id, { status: "spoiled", updatedAt: now });

    // Step 2: Call Server Action after Dexie update
    const isReachable = await checkReachability();

    if (isReachable) {
      const result = await deleteWine(id);
      if (result.success) {
        await dexieDb.wines.update(id, { _syncedAt: new Date().toISOString() });
      } else {
        await enqueueOperation({
          operation: "delete",
          table: "wines",
          recordId: id,
          payload: JSON.stringify({ id }),
          createdAt: now,
          attempts: 0,
        });
      }
    } else {
      await enqueueOperation({
        operation: "delete",
        table: "wines",
        recordId: id,
        payload: JSON.stringify({ id }),
        createdAt: now,
        attempts: 0,
      });
    }

    toast.success("Wine removed from cellar");
  }

  return { createWine, editWine, removeWine };
}
