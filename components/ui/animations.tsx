"use client";

import React, { useEffect, useState } from 'react';
import { motion, animate, AnimatePresence } from 'framer-motion';

export const MotionDiv = motion.div;
export const MotionSection = motion.section;
export { AnimatePresence };

export const PageWrapper = ({ children }: { children: React.ReactNode }) => ( 
  <motion.div 
    initial={{ opacity: 0, y: 8 }} 
    animate={{ opacity: 1, y: 0 }} 
    exit={{ opacity: 0, y: -8 }} 
    transition={{ 
      duration: 0.25, 
      ease: 'easeInOut' 
    }} 
    className="will-change-transform"
  > 
    {children} 
  </motion.div> 
);

export const AnimatedNumber = ({ 
  value, 
  decimals = 2, 
  suffix = '' 
}: {
  value: number | null | undefined;
  decimals?: number;
  suffix?: string;
}) => { 
  const [display, setDisplay] = useState('—');
  
  useEffect(() => { 
    if (value === null || value === undefined) { 
      queueMicrotask(() => setDisplay('—'));
      return;
    } 
    
    const controls = animate(0, value, { 
      duration: 1.2, 
      ease: 'easeOut', 
      onUpdate: (v) => { 
        setDisplay( 
          v.toFixed(decimals) + suffix 
        );
      } 
    }); 
    
    return controls.stop;
  }, [value, decimals, suffix]); 
  
  return <span>{display}</span>;
};

export const Skeleton = ({ 
  width = '100%', 
  height = '20px', 
  borderRadius = '4px' 
}) => ( 
  <motion.div 
    animate={{ opacity: [0.5, 1, 0.5] }} 
    transition={{ 
      duration: 1.5, 
      repeat: Infinity, 
      ease: 'easeInOut' 
    }} 
    style={{ 
      width, 
      height, 
      borderRadius, 
      background: '#1a1a1a' 
    }} 
  /> 
);

export const Toast = ({ message, type }: { message: string, type: 'success' | 'info' }) => ( 
  <motion.div 
    initial={{ opacity: 0, y: 50, x: '-50%' }} 
    animate={{ opacity: 1, y: 0, x: '-50%' }} 
    exit={{ opacity: 0, y: 50, x: '-50%' }} 
    style={{ 
      position: 'fixed', 
      bottom: '80px', 
      left: '50%', 
      background: type === 'success' 
        ? '#0a1f0a' : '#111', 
      border: `1px solid ${ 
        type === 'success' ? '#166534' : '#333' 
      }`, 
      color: type === 'success' 
        ? '#22c55e' : '#fff', 
      padding: '12px 20px', 
      borderRadius: '8px', 
      fontSize: '13px', 
      zIndex: 1000, 
      pointerEvents: 'none' 
    }} 
    className="will-change-transform"
  > 
    {message} 
  </motion.div> 
);
