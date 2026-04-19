import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
  height?: string | number;
  width?: string | number;
}

export function Skeleton({ className = "", style, height, width }: SkeletonProps) {
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }} 
      transition={{ 
        duration: 1.5, 
        repeat: Infinity, 
        ease: 'easeInOut' 
      }}
      className={`rounded-md bg-zinc-800/80 ${className}`}
      style={{ height, width, ...style }}
    />
  );
}
