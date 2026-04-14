import Link from "next/link";
import { Github, Twitter, Linkedin, Globe } from "lucide-react";

export function PresentationFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a] pt-12 pb-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-4">
            <p className="text-xl font-black tracking-widest text-[#FFD000]">ZEMEN</p>
            <p className="text-sm leading-relaxed text-zinc-400 max-w-xs">
              Macro Intelligence. The economy explained in one simple answer.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-zinc-100 mb-2">Sources & Info</p>
            <p className="text-sm text-zinc-400">Data from FRED — Federal Reserve</p>
            <p className="text-sm text-zinc-400">Built at Zerve AI Hackathon 2025</p>
            <p className="text-sm text-zinc-400 font-medium text-[#FFD000]/80">Not financial advice</p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-zinc-100 mb-2">Connect</p>
            <div className="flex gap-4">
              <a href="https://d33pak.space" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-[#FFD000] transition group p-2 hover:bg-[#FFD000]/10 rounded-full">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Portfolio</span>
              </a>
              <a href="https://x.com/triordeep" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-[#FFD000] transition group p-2 hover:bg-[#FFD000]/10 rounded-full">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">X (Twitter)</span>
              </a>
              <a href="https://github.com/onewritescode" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-[#FFD000] transition group p-2 hover:bg-[#FFD000]/10 rounded-full">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="https://linkedin.com/in/deepak-singh-27a17a321" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-[#FFD000] transition group p-2 hover:bg-[#FFD000]/10 rounded-full">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Zemen Intelligence. All rights reserved.</p>
          <p>Created by Deepak Singh</p>
        </div>
      </div>
    </footer>
  );
}
