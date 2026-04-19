import { SidebarShell } from "@/components/site/sidebar-shell";

export default function SectorsLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarShell>
      {children}
    </SidebarShell>
  );
}

