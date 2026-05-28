"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wine, GlassWater, PlusCircle, BarChart3, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/stores/ui-store";
import { logoutAction } from "@/app/login/actions";

const NAV_ITEMS = [
  { href: "/cellar", icon: Wine, label: "Cellar" },
  { href: "/ready", icon: GlassWater, label: "Ready Now" },
  { href: "/insights", icon: BarChart3, label: "Insights" },
];

export function MobileNav() {
  const pathname = usePathname();
  const { openDrawer } = useUIStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#1a0a0a]/95 backdrop-blur-md border-t border-white/10 safe-bottom">
      <div className="relative flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {/* Logout button — absolutely positioned top-right, does not disrupt 4-tab layout */}
        <form action={logoutAction} className="absolute top-2 right-2">
          <button
            type="submit"
            aria-label="Logout"
            className="p-1 rounded text-white/30 hover:text-white/60 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </form>
        {NAV_ITEMS.slice(0, 2).map(({ href, icon: Icon, label }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors",
                isActive
                  ? "text-[#C8573D]"
                  : "text-white/40 hover:text-white/70",
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}

        {/* Add button — opens WineDrawer */}
        <button
          onClick={() => openDrawer()}
          className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-white/40 hover:text-[#C8573D] transition-colors"
          aria-label="Add wine"
        >
          <PlusCircle className="w-7 h-7" />
          <span className="text-[10px] font-medium">Add</span>
        </button>

        {NAV_ITEMS.slice(2).map(({ href, icon: Icon, label }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors",
                isActive
                  ? "text-[#C8573D]"
                  : "text-white/40 hover:text-white/70",
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
