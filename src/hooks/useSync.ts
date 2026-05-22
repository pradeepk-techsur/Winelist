"use client";
import { useEffect, useRef } from "react";
import { useNetworkStatus } from "./useNetworkStatus";
import { hydrateDexie, flushSyncQueue } from "@/lib/sync/sync-service";

export function useSync() {
  const { isOnline, checkReachability } = useNetworkStatus();
  const hasHydrated = useRef(false);

  // Initial hydration on mount
  useEffect(() => {
    if (!hasHydrated.current) {
      hasHydrated.current = true;
      hydrateDexie().catch(console.error);
    }
  }, []);

  // Flush sync queue when network is restored
  useEffect(() => {
    if (!isOnline) return;

    const tryFlush = async () => {
      const reachable = await checkReachability();
      if (reachable) {
        await flushSyncQueue();
      }
    };

    tryFlush().catch(console.error);
  }, [isOnline, checkReachability]);
}
