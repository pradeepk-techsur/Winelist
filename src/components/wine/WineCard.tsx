import type { LocalWine } from "@/lib/dexie/db";
import { WineStatusBadge } from "./WineStatusBadge";
import { Wine, MapPin } from "lucide-react";
import Link from "next/link";

const WINE_TYPE_COLORS: Record<string, string> = {
  red: "text-red-400",
  white: "text-amber-300",
  rosé: "text-pink-400",
  sparkling: "text-sky-300",
  dessert: "text-orange-300",
  fortified: "text-purple-400",
};

interface WineCardProps {
  wine: LocalWine;
}

export function WineCard({ wine }: WineCardProps) {
  const typeColor = WINE_TYPE_COLORS[wine.type] ?? "text-white/60";

  return (
    <Link
      href={`/wine/${wine.id}`}
      className="block bg-white/5 hover:bg-white/8 border border-white/10 rounded-xl p-4 transition-colors active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Wine className={`w-4 h-4 flex-shrink-0 ${typeColor}`} />
            <h3 className="font-semibold text-white truncate">{wine.name}</h3>
          </div>
          <p className="text-sm text-white/60 truncate">{wine.producer}</p>
          {wine.region && (
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-white/30 flex-shrink-0" />
              <p className="text-xs text-white/40 truncate">{wine.region}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {wine.vintage && (
            <span className="text-sm font-mono text-white/70">
              {wine.vintage}
            </span>
          )}
          <span className="text-xs text-white/50">
            {wine.quantity} {wine.quantity === 1 ? "bottle" : "bottles"}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className={`text-xs capitalize font-medium ${typeColor}`}>
          {wine.type}
        </span>
        <WineStatusBadge drinkFrom={wine.drinkFrom} drinkBy={wine.drinkBy} />
      </div>
    </Link>
  );
}
