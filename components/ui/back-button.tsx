"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MoveLeft } from "lucide-react";

interface BackButtonProps {
  href: string;
  label: string;
}

export const BackButton = ({ href, label }: BackButtonProps) => (
  <motion.div
    whileHover={{ x: -3 }}
    transition={{ duration: 0.2 }}
  >
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-zinc-500 text-[13px] no-underline mb-6 py-1.5 transition-colors cursor-pointer hover:text-white"
    >
      <MoveLeft className="w-4 h-4" />
      <span>{label}</span>
    </Link>
  </motion.div>
);
