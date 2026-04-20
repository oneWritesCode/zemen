import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
  height?: string | number;
  width?: string | number;
}

export function Skeleton({ className = "", style, height, width }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ height, width, ...style }}
    />
  );
}
