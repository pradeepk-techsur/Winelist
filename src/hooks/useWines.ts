"use client";
import { useLiveQuery } from "dexie-react-hooks";
import { dexieDb } from "@/lib/dexie/db";
import { useCellarStore } from "@/lib/stores/cellar-store";
import type { LocalWine } from "@/lib/dexie/db";

export function useWines() {
  const { filterType, filterRegion, filterCountry, sortField, sortDirection } =
    useCellarStore();

  // useLiveQuery returns:
  //   undefined = still loading (show skeleton)
  //   []        = loaded, genuinely empty collection
  //   LocalWine[] = loaded with data
  // NEVER use `wines ?? []` — that collapses loading and empty into the same state.
  // Per PITFALLS.md Pitfall 3.
  const wines = useLiveQuery(
    () => {
      return dexieDb.wines
        .where("status")
        .equals("in_cellar")
        .toArray()
        .then((allWines) => {
          // Apply filters in memory (Dexie compound where requires indexed fields)
          return allWines
            .filter((w) => !filterType || w.type === filterType)
            .filter((w) => !filterRegion || w.region === filterRegion)
            .filter((w) => !filterCountry || w.country === filterCountry)
            .sort((a, b) => {
              const dir = sortDirection === "asc" ? 1 : -1;
              if (sortField === "vintage") {
                return ((a.vintage ?? 0) - (b.vintage ?? 0)) * dir;
              }
              if (sortField === "name") {
                return a.name.localeCompare(b.name) * dir;
              }
              if (sortField === "quantity") {
                return (a.quantity - b.quantity) * dir;
              }
              // createdAt default — newest first
              return (
                (new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()) *
                dir
              );
            });
        });
    },
    [filterType, filterRegion, filterCountry, sortField, sortDirection]
  );

  return {
    wines,
    isLoading: wines === undefined,
    isEmpty: wines !== undefined && wines.length === 0,
  };
}

// Re-export LocalWine for consumers
export type { LocalWine };
