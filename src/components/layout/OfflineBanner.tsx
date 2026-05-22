"use client";
import { useEffect, useState } from "react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { WifiOff } from "lucide-react";

export function OfflineBanner() {
  const { isOnline } = useNetworkStatus();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (!isOnline) {
      // Delay banner to avoid flicker on brief disconnects
      // Per PITFALLS.md UX section: only show after 3s offline
      timer = setTimeout(() => setShowBanner(true), 3000);
    } else {
      setShowBanner(false);
    }
    return () => clearTimeout(timer);
  }, [isOnline]);

  if (!showBanner) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-600/90 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium">
      <WifiOff className="w-4 h-4" />
      <span>You&apos;re offline — changes will sync when you reconnect</span>
    </div>
  );
}
