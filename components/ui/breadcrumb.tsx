"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface BreadcrumbItem {
  label: string;
  href: string | null;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => (
  <motion.div 
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
    className="flex items-center gap-2 mb-6 text-[12px] text-zinc-600"
  >
    {items.map((item, i) => (
      <React.Fragment key={i}>
        {i > 0 && <ChevronRight className="w-3 h-3 text-zinc-700" />}
        {item.href === null || i === items.length - 1 ? (
          <span className="text-zinc-400 font-medium">{item.label}</span>
        ) : (
          <Link
            href={item.href}
            className="text-zinc-600 no-underline transition-colors hover:text-zinc-300"
          >
            {item.label}
          </Link>
        )}
      </React.Fragment>
    ))}
  </motion.div>
);
