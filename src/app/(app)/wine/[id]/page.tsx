"use client";
import { use } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { dexieDb } from "@/lib/dexie/db";
import { useWineActions } from "@/hooks/useWineActions";
import { useUIStore } from "@/lib/stores/ui-store";
import { WineStatusBadge } from "@/components/wine/WineStatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface DetailRowProps {
  label: string;
  value: string | number | null | undefined;
}

function DetailRow({ label, value }: DetailRowProps) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex justify-between items-start py-3 border-b border-white/5">
      <span className="text-sm text-white/50">{label}</span>
      <span className="text-sm text-white font-medium text-right max-w-[60%]">
        {String(value)}
      </span>
    </div>
  );
}

export default function WineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { removeWine } = useWineActions();
  const { openDrawer } = useUIStore();

  // Read wine from Dexie — offline-first via useLiveQuery
  const wine = useLiveQuery(
    () => dexieDb.wines.get(id),
    [id]
  );

  const handleDelete = async () => {
    if (!wine) return;
    await removeWine(wine.id);
    router.push("/cellar");
  };

  if (wine === undefined) {
    // Loading state — useLiveQuery returns undefined while initial query is pending
    return (
      <div className="px-4 py-6 max-w-lg mx-auto space-y-4">
        <Skeleton className="h-8 w-3/4 bg-white/10" />
        <Skeleton className="h-4 w-1/2 bg-white/10" />
        <div className="space-y-3 mt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (!wine || wine.status === "spoiled") {
    // Wine not found or soft-deleted
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="text-4xl mb-3">🍷</div>
        <p className="text-white/50">Wine not found</p>
        <Button
          variant="ghost"
          onClick={() => router.push("/cellar")}
          className="mt-4 text-white/50 hover:text-white"
        >
          Back to Cellar
        </Button>
      </div>
    );
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    try {
      return format(new Date(dateStr), "MMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0d0605]/90 backdrop-blur-md px-4 pt-safe-top pb-4 border-b border-white/5">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-white/60 hover:text-white transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openDrawer(wine.id)}
              className="text-white/60 hover:text-white"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400/70 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#1a0a0a] border-white/10">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">
                    Remove this wine?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-white/60">
                    &quot;{wine.name}&quot; will be removed from your cellar. This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-white/20 text-white/70 hover:bg-white/5">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-800 hover:bg-red-700 text-white"
                  >
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6 max-w-lg mx-auto w-full">
        {/* Wine name and status */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">{wine.name}</h1>
          <p className="text-white/60 mb-3">{wine.producer}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm capitalize text-white/50 bg-white/5 px-2 py-1 rounded-full">
              {wine.type}
            </span>
            {wine.vintage && (
              <span className="text-sm text-white/50 bg-white/5 px-2 py-1 rounded-full">
                {wine.vintage}
              </span>
            )}
            <WineStatusBadge drinkFrom={wine.drinkFrom} drinkBy={wine.drinkBy} />
          </div>
        </div>

        {/* All fields grouped by category */}
        <div className="space-y-0">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-1">
            Classification
          </h2>
          <DetailRow label="Grape Variety" value={wine.varietal} />
          <DetailRow label="Region" value={wine.region} />
          <DetailRow label="Appellation" value={wine.appellation} />
          <DetailRow label="Country" value={wine.country} />

          <h2 className="text-xs font-semibold uppercase tracking-wider text-white/30 mt-5 mb-1">
            Inventory
          </h2>
          <DetailRow
            label="Quantity"
            value={`${wine.quantity} ${wine.quantity === 1 ? "bottle" : "bottles"}`}
          />
          <DetailRow label="Format" value={wine.format} />
          <DetailRow label="Storage Location" value={wine.storageLocation} />

          <h2 className="text-xs font-semibold uppercase tracking-wider text-white/30 mt-5 mb-1">
            Purchase
          </h2>
          <DetailRow
            label="Purchase Price"
            value={wine.purchasePrice ? `$${wine.purchasePrice.toFixed(2)}` : null}
          />
          <DetailRow label="Purchase Date" value={formatDate(wine.purchaseDate)} />
          <DetailRow label="Source" value={wine.purchaseSource} />

          <h2 className="text-xs font-semibold uppercase tracking-wider text-white/30 mt-5 mb-1">
            Drinking Window
          </h2>
          <DetailRow label="Drink From" value={formatDate(wine.drinkFrom)} />
          <DetailRow label="Drink By" value={formatDate(wine.drinkBy)} />

          {wine.notes && (
            <>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-white/30 mt-5 mb-1">
                Notes
              </h2>
              <p className="text-sm text-white/70 py-3">{wine.notes}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
