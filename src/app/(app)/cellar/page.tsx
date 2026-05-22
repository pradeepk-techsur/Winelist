"use client";
import { useWines } from "@/hooks/useWines";
import { WineCard } from "@/components/wine/WineCard";
import { SyncIndicator } from "@/components/layout/SyncIndicator";
import { Skeleton } from "@/components/ui/skeleton";

function WineCardSkeleton() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
      <Skeleton className="h-5 w-3/4 bg-white/10" />
      <Skeleton className="h-4 w-1/2 bg-white/10" />
      <Skeleton className="h-3 w-1/3 bg-white/10" />
    </div>
  );
}

export default function CellarPage() {
  const { wines, isLoading, isEmpty } = useWines();

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0d0605]/90 backdrop-blur-md px-4 pt-safe-top pb-4 border-b border-white/5">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <h1 className="text-xl font-bold text-white">My Cellar</h1>
            {!isLoading && !isEmpty && (
              <p className="text-xs text-white/40 mt-0.5">
                {wines!.length} {wines!.length === 1 ? "wine" : "wines"}
              </p>
            )}
          </div>
          <SyncIndicator />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 py-4 max-w-lg mx-auto w-full">
        {/* Loading state — show skeletons, never empty state while loading */}
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <WineCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">🍾</div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Your cellar is empty
            </h2>
            <p className="text-sm text-white/50 max-w-xs">
              Tap the + button below to add your first wine
            </p>
          </div>
        )}

        {/* Wine list */}
        {!isLoading && wines && wines.length > 0 && (
          <div className="space-y-3">
            {wines.map((wine) => (
              <WineCard key={wine.id} wine={wine} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
