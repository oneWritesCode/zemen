'use client'

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("zemen_loaded");
    if (seen) {
      setLoaded(true);
    } else {
      sessionStorage.setItem("zemen_loaded", "1");
    }
  }, []);

  return (
    <>
      <AnimatePresence>
        {!loaded && (
          <LoadingScreen onComplete={() => setLoaded(true)} />
        )}
      </AnimatePresence>
      
      <motion.div
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    </>
  );
}
