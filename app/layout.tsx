import type { Metadata } from "next";
import { AskZemenChat } from "@/components/global/ask-zemen-chat";
import { PersonaProvider } from "@/components/global/persona-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Zemen — Macro regime detector",
    template: "%s · Zemen",
  },
  description:
    "Macro intelligence: FRED-powered dashboards and regime detection for markets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#09090b] text-zinc-100 antialiased">
        <PersonaProvider>
          {children}
          <AskZemenChat />
        </PersonaProvider>
      </body>
    </html>
  );
}
