import { SidebarShell } from "@/components/site/sidebar-shell";
import { DashboardPersonaGate } from "@/components/dashboard/dashboard-persona-gate";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarShell>
      <DashboardPersonaGate>{children}</DashboardPersonaGate>
    </SidebarShell>
  );
}
