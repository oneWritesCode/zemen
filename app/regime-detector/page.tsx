import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { RegimeDetectorContent } from "@/components/regime/regime-detector-content";
import { DASHBOARD_TOPICS } from "@/lib/fred/topics-config";
import { getRegimeAnalysis } from "@/lib/regime/get-analysis";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Regime detector",
  description:
    "Macro regime classification from FRED data using k-means clustering.",
};

export default async function RegimeDetectorPage() {
  const data = await getRegimeAnalysis();

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0b] text-zinc-100 lg:flex-row">
      <DashboardSidebar topics={DASHBOARD_TOPICS} />
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
        <RegimeDetectorContent data={data} />
      </main>
    </div>
  );
}
