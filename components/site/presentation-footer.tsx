import Link from "next/link";
import { Github, Twitter, Linkedin, Globe } from "lucide-react";

const footerLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Briefing", href: "/briefing" },
  { label: "Regimes", href: "/regimes" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Indicators", href: "/indicators" },
];

const socialLinks = [
  { href: "https://d33pak.space", icon: Globe, label: "Portfolio" },
  { href: "https://x.com/triordeep", icon: Twitter, label: "X (Twitter)" },
  { href: "https://github.com/onewritescode", icon: Github, label: "GitHub" },
  { href: "https://linkedin.com/in/deepak-singh-27a17a321", icon: Linkedin, label: "LinkedIn" },
];

export function PresentationFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#09090b]">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <p className="text-base font-bold tracking-[0.12em] text-zinc-100">ZEMEN</p>
            <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
              Macro intelligence. The economy explained in one simple answer.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Pages</p>
            <div className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-zinc-400 hover:text-zinc-100 transition w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social + credits */}
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Connect</p>
            <div className="flex gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-100 hover:bg-white/[0.06] transition"
                >
                  <s.icon className="h-4 w-4" />
                  <span className="sr-only">{s.label}</span>
                </a>
              ))}
            </div>
            <div className="space-y-1 text-xs text-zinc-600">
              <p>Data from FRED — Federal Reserve</p>
              <p>Built at Zerve AI Hackathon 2025</p>
              <p className="text-zinc-500">Not financial advice</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.06] mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-zinc-600">
          <p>© {new Date().getFullYear()} Zemen Intelligence</p>
          <p>Created by Deepak Singh</p>
        </div>
      </div>
    </footer>
  );
}
