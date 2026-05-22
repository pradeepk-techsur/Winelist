import { dexieDb, type SyncQueueEntry } from "./db";

export async function enqueueOperation(
  entry: Omit<SyncQueueEntry, "id">
): Promise<void> {
  await dexieDb.syncQueue.add(entry);
}

export async function getQueuedOperations(): Promise<SyncQueueEntry[]> {
  return dexieDb.syncQueue.orderBy("createdAt").toArray();
}

export async function removeFromQueue(id: number): Promise<void> {
  await dexieDb.syncQueue.delete(id);
}

export async function incrementAttempts(id: number, current: number): Promise<void> {
  await dexieDb.syncQueue.update(id, { attempts: current + 1 });
}
