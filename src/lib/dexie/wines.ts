import { dexieDb, type LocalWine } from "./db";

/** Get all in-cellar wines, sorted by most recently added */
export async function getLocalWines(): Promise<LocalWine[]> {
  return dexieDb.wines
    .where("status")
    .equals("in_cellar")
    .reverse()
    .sortBy("createdAt");
}

/** Get a single wine by id */
export async function getLocalWineById(id: string): Promise<LocalWine | undefined> {
  return dexieDb.wines.get(id);
}

/** Upsert a wine record (put replaces if exists) */
export async function putLocalWine(wine: LocalWine): Promise<void> {
  await dexieDb.wines.put(wine);
}

/** Update specific fields on a wine */
export async function updateLocalWine(
  id: string,
  updates: Partial<LocalWine>
): Promise<void> {
  await dexieDb.wines.update(id, { ...updates, updatedAt: new Date().toISOString() });
}
