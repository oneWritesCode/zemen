import { LearnSidebar } from "@/components/learn/learn-sidebar";
import { AskZemenChat } from "@/components/global/ask-zemen-chat";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-black lg:flex-row">
      <LearnSidebar />
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
      <AskZemenChat />
    </div>
  );
}
