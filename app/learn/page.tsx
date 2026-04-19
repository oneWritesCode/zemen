"use client";

import Link from "next/link";
import { Brain, Gamepad2, BookOpen, ArrowRight } from "lucide-react";
import { SidebarShell } from "@/components/site/sidebar-shell";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { motion } from "framer-motion";

export default function LearnHubPage() {
  return (
    <SidebarShell>
      <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb 
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Learn Hub', href: null }
          ]} 
        />
        
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Learn Hub
          </h1>
          <p className="mt-3 max-w-2xl text-zinc-400 text-base leading-relaxed">
            Master the fundamentals of macroeconomics and test your knowledge through interactive challenges.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              href: "/learn/quiz",
              title: "Macro IQ Quiz",
              description: "Test your economic knowledge with our interactive quiz. Earn points and level up your expertise.",
              icon: Brain,
              cta: "Start Quiz",
              color: "text-white",
            },
            {
              href: "/learn/challenge",
              title: "Portfolio Challenge",
              description: "Simulate investing ₹10L across different historical regimes. See how your strategy performs.",
              icon: Gamepad2,
              cta: "Try Challenge",
              color: "text-blue-500",
            },
            {
              href: "/learn/guide",
              title: "Beginner's Guide",
              description: "New to economics? Start here with our plain-English guide to interest rates, inflation, and more.",
              icon: BookOpen,
              cta: "Read Guide",
              color: "text-emerald-500",
            },
          ].map((card, index) => (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <LearnCard {...card} />
            </motion.div>
          ))}
        </div>
      </div>
    </SidebarShell>
  );
}

function LearnCard({ 
  href, 
  title, 
  description, 
  icon: Icon, 
  cta,
  color 
}: { 
  href: string; 
  title: string; 
  description: string; 
  icon: React.ElementType;
  cta: string;
  color: string;
}) {
  return (
    <Link href={href} className="h-full block">
      <motion.div 
        whileHover={{ scale: 1.02 }} 
        whileTap={{ scale: 0.98 }} 
        transition={{ duration: 0.15 }}
        className="group flex flex-col h-full bg-[#0e0e10] border border-white/[0.08] p-8 rounded-3xl transition-all hover:bg-zinc-900/50 hover:border-white/20 will-change-transform"
      >
        <div className={`w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
          <Icon className={`w-7 h-7 ${color}`} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-zinc-500 leading-relaxed mb-8 flex-1">
          {description}
        </p>
        <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:gap-3 transition-all uppercase tracking-widest">
          {cta}
          <ArrowRight className="w-4 h-4" />
        </div>
      </motion.div>
    </Link>
  );
}
