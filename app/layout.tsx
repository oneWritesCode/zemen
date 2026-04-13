import type { Metadata } from "next";
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
      <body className="min-h-full bg-[#0a0a0b] font-sans text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
