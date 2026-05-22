"use client";
import { useEffect, useState, useCallback } from "react";

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [isReachable, setIsReachable] = useState<boolean | null>(null);

  // navigator.onLine is reliable for "definitely offline" detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setIsReachable(false);
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Probe actual reachability before sync (navigator.onLine is not enough)
  // Per PITFALLS.md Pitfall 6: navigator.onLine is unreliable (captive portals, hotel WiFi)
  const checkReachability = useCallback(async (): Promise<boolean> => {
    if (!navigator.onLine) return false;
    try {
      await fetch("/api/ping", {
        method: "HEAD",
        signal: AbortSignal.timeout(3000),
        cache: "no-store",
      });
      setIsReachable(true);
      return true;
    } catch {
      setIsReachable(false);
      return false;
    }
  }, []);

  return { isOnline, isReachable, checkReachability };
}
