import { getRegimeAnalysis } from "@/lib/regime/get-analysis";
import { SidebarShell } from "@/components/site/sidebar-shell";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { BackButton } from "@/components/ui/back-button";
import { REGIME_BY_ID } from "@/lib/regime/types";
import { HistoricalPlaybookTable } from "@/components/regime/historical-playbook-table";

export const dynamic = "force-dynamic";

export default async function RegimePlaybookPage() {
  const data = await getRegimeAnalysis();
  const meta = REGIME_BY_ID[data.current.regime];

  return (
    <SidebarShell>
      <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb 
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Regime Detector', href: '/regime' },
            { label: 'Historical Playbook', href: null }
          ]} 
        />
        <BackButton href="/regime" label="Back to Detector" />
        
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Historical Playbook
          </h1>
          <p className="mt-3 max-w-2xl text-zinc-400 text-base leading-relaxed">
            Forward returns for major asset classes following months identified in the current regime.
          </p>
        </div>

        {data.historicalPlaybook ? (
          <HistoricalPlaybookTable
            playbook={data.historicalPlaybook}
            regimeMeta={meta}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-white/[0.10] bg-white/[0.01] p-12 text-center text-zinc-500">
            Playbook data unavailable.
          </div>
        )}
      </div>
    </SidebarShell>
  );
}
