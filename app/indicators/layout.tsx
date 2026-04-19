import { SidebarShell } from "@/components/site/sidebar-shell";

export default function IndicatorsLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarShell>
      {children}
    </SidebarShell>
  );
}
