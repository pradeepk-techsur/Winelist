"use client";
import { useSync } from "@/hooks/useSync";

export function SyncProvider({ children }: { children: React.ReactNode }) {
  useSync();
  return <>{children}</>;
}
