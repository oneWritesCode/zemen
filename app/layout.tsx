import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { AskZemenChat } from "@/components/global/ask-zemen-chat";
import { PersonaProvider } from "@/components/global/persona-provider";
import { RegimeAlertBanner } from "@/components/global/regime-alert-banner";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

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
      <body className={`min-h-full bg-[#0a0a0a] ${openSans.className} text-zinc-100 antialiased`}>
        <RegimeAlertBanner />
        <PersonaProvider>
          <div className="pt-12">{children}</div>
          <AskZemenChat />
        </PersonaProvider>
      </body>
    </html>
  );
}
