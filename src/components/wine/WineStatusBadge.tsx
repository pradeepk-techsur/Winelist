import type { DrinkingStatus } from "@/types/wine";
import { cn } from "@/lib/utils";

function computeDrinkingStatus(
  drinkFrom: string | null,
  drinkBy: string | null
): DrinkingStatus {
  if (!drinkFrom || !drinkBy) return "no_window";

  const today = new Date().toISOString().slice(0, 10);
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
  const approaching = sixMonthsFromNow.toISOString().slice(0, 10);

  if (today > drinkBy) return "past_window";
  if (today >= drinkFrom) return "in_window";
  if (drinkFrom <= approaching) return "approaching";
  return "not_yet";
}

const STATUS_CONFIG: Record<
  DrinkingStatus,
  { label: string; className: string }
> = {
  in_window: {
    label: "Drink Now",
    className: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  approaching: {
    label: "Approaching",
    className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  not_yet: {
    label: "Hold",
    className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  past_window: {
    label: "Past Window",
    className: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  no_window: {
    label: "",
    className: "",
  },
};

interface WineStatusBadgeProps {
  drinkFrom: string | null;
  drinkBy: string | null;
  className?: string;
}

export function WineStatusBadge({
  drinkFrom,
  drinkBy,
  className,
}: WineStatusBadgeProps) {
  const status = computeDrinkingStatus(drinkFrom, drinkBy);
  if (status === "no_window") return null;

  const { label, className: statusClass } = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        statusClass,
        className
      )}
    >
      {label}
    </span>
  );
}
