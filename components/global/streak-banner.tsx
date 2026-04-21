"use client";

import { useState, useEffect } from "react";
import { Flame, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/lib/hooks/use-toast";

export function StreakBanner() {
  const [streak, setStreak] = useState(0);
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneText, setMilestoneText] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    function checkMilestones(s: number) {
      if (s === 3) {
        setMilestoneText("Nice! You're building a habit");
        setShowMilestone(true);
      } else if (s === 7) {
        setMilestoneText("One week streak! You're serious");
        setShowMilestone(true);
      } else if (s === 14) {
        setMilestoneText("Two weeks! Macro is your thing");
        setShowMilestone(true);
      } else if (s === 30) {
        setMilestoneText("30 days! You are a Macro Master");
        setShowMilestone(true);
      }
    }

    const lastVisit = localStorage.getItem('zemen_last_visit');
    const savedStreak = localStorage.getItem('zemen_streak');
    const today = new Date().toISOString().split('T')[0];
    
    let currentStreak = savedStreak ? parseInt(savedStreak) : 0;
    let streakUpdated = false;
    
    if (lastVisit) {
      const lastDate = new Date(lastVisit);
      const todayDate = new Date(today);
      const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak += 1;
        streakUpdated = true;
        queueMicrotask(() => checkMilestones(currentStreak));
      } else if (diffDays > 1) {
        currentStreak = 1;
        streakUpdated = true;
      }
    } else {
      currentStreak = 1;
      streakUpdated = true;
    }
    
    if (streakUpdated) {
      localStorage.setItem('zemen_last_visit', today);
      localStorage.setItem('zemen_streak', currentStreak.toString());
      showToast(`Streak: ${currentStreak} days`, 'success');
    }
    queueMicrotask(() => setStreak(currentStreak));
  }, [showToast]);


  return (
    <>
      <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
        <Flame className={`w-4 h-4 ${streak > 0 ? 'text-white' : 'text-zinc-600'}`} />
        <span className="text-sm font-bold text-white">
          {streak} Day Streak
        </span>
        {streak >= 7 && (
          <div className="flex items-center gap-1 ml-2 pl-3 border-l border-white/10">
            <Trophy className="w-3.5 h-3.5 text-white" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-white">Week Warrior</span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showMilestone && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 bg-[#111111] border border-white/[0.1] p-6 rounded-2xl shadow-2xl max-w-xs"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">Streak Milestone!</h4>
                <p className="text-sm text-zinc-400">{milestoneText}</p>
                <button 
                  onClick={() => setShowMilestone(false)}
                  className="mt-4 text-xs font-bold text-white uppercase tracking-widest"
                >
                  Keep it up →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
