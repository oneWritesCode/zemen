import { getRegimeAnalysis } from "@/lib/regime/get-analysis";
import { SidebarShell } from "@/components/site/sidebar-shell";
import { RegimeDetectorContent } from "@/components/regime/regime-detector-content";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const dynamic = "force-dynamic";

export default async function RegimeDetectorPage() {
  const data = await getRegimeAnalysis();

  return (
    <SidebarShell>
      <div className="mx-auto max-w-[1400px] px-10 py-8 pt-10">
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
