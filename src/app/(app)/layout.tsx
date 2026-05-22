import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { MobileNav } from "@/components/layout/MobileNav";
import { OfflineBanner } from "@/components/layout/OfflineBanner";
import { SyncProvider } from "@/components/providers/SyncProvider";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth check — redirect if not authenticated
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <SyncProvider>
      <div className="flex flex-col min-h-screen bg-[#0d0605]">
        <OfflineBanner />
        <main className="flex-1 pb-20 overflow-y-auto">{children}</main>
        <MobileNav />
      </div>
    </SyncProvider>
  );
}
