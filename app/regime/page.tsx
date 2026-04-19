import { getRegimeAnalysis } from "@/lib/regime/get-analysis";
import { SidebarShell } from "@/components/site/sidebar-shell";
import { RegimeDetectorContent } from "@/components/regime/regime-detector-content";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const dynamic = "force-dynamic";

export default async function RegimeDetectorPage() {
  const data = await getRegimeAnalysis();

  return (
    <SidebarShell>
      <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb 
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Regime Detector', href: null }
          ]} 
        />
        <RegimeDetectorContent data={data} />
      </div>
    </SidebarShell>
  );
}
