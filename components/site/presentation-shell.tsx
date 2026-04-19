import { PresentationFooter } from "@/components/site/presentation-footer";
import { PresentationNavbar } from "@/components/site/presentation-navbar";
import { PageWrapper } from "@/components/ui/animations";

type PresentationShellProps = {
  children: React.ReactNode;
};

export function PresentationShell({ children }: PresentationShellProps) {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      <PresentationNavbar />
      <main className="pt-14">
        <PageWrapper>{children}</PageWrapper>
      </main>
      <PresentationFooter />
    </div>
  );
}
