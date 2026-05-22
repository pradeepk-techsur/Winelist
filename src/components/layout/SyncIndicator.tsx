"use client";
import { useEffect, useState } from "react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { dexieDb } from "@/lib/dexie/db";
import { useLiveQuery } from "dexie-react-hooks";

type SyncState = "synced" | "pending" | "syncing" | "offline";

export function SyncIndicator() {
  const { isOnline } = useNetworkStatus();
  const [syncState, setSyncState] = useState<SyncState>("synced");

  // Watch sync queue for pending items
  const pendingCount = useLiveQuery(
    () => dexieDb.syncQueue.count(),
    [],
    0
  );

  useEffect(() => {
    if (!isOnline) {
      setSyncState("offline");
    } else if (pendingCount === undefined) {
      setSyncState("syncing");
    } else if (pendingCount > 0) {
      setSyncState("pending");
    } else {
      setSyncState("synced");
    }
  }, [isOnline, pendingCount]);

  const stateConfig = {
    synced: { color: "bg-green-500", label: "Synced" },
    pending: { color: "bg-amber-500 animate-pulse", label: "Pending sync" },
    syncing: { color: "bg-blue-500 animate-pulse", label: "Syncing…" },
    offline: { color: "bg-gray-500", label: "Offline" },
  };

  const { color, label } = stateConfig[syncState];

  return (
    <div
      className="flex items-center gap-1.5"
      title={label}
      aria-label={label}
    >
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-xs text-white/50 hidden sm:inline">{label}</span>
    </div>
  );
}
