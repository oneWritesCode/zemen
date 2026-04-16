import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DASHBOARD_TOPICS } from "@/lib/fred/topics-config";

export default function SectorsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0b] text-zinc-100 lg:flex-row">
      <DashboardSidebar topics={DASHBOARD_TOPICS} />
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

