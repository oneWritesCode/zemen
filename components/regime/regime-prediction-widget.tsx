"use client";

import { useState, useEffect } from "react";
import { 
  Target, 
  Clock, 
  History,
  ArrowRight
} from "lucide-react";
import { REGIMES } from "@/lib/regime/types";

interface Prediction {
  prediction: string;
  date: string;
  currentRegime: string;
  resolved: boolean;
  correct: boolean | null;
}

export function RegimePredictionWidget({ currentRegimeId }: { currentRegimeId: string }) {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('zemen_prediction');
    if (saved) {
      const parsed = JSON.parse(saved);
      
      // Logic to resolve if 30 days passed (mock logic for now)
      // In real app, we'd check if the regime changed as predicted
      queueMicrotask(() => setPrediction(parsed));
    }
  }, []);

  const handlePredict = () => {
    if (!selectedId) return;
    
    setSubmitting(true);
    
    const newPrediction: Prediction = {
      prediction: selectedId,
      date: new Date().toISOString(),
      currentRegime: currentRegimeId,
      resolved: false,
      correct: null
    };
    
    setTimeout(() => {
      localStorage.setItem('zemen_prediction', JSON.stringify(newPrediction));
      setPrediction(newPrediction);
      setSubmitting(false);
    }, 1000);
  };

  const currentRegimeMeta = REGIMES.find(r => r.id === currentRegimeId);

  return (
    <div className="mt-12 bg-[#0e0e10] border border-white/[0.08] rounded-3xl overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
            <Target className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Predict the Next Regime</h2>
            <p className="text-xs text-zinc-500">What do YOU think comes next?</p>
          </div>
        </div>

        {!prediction ? (
          <div className="space-y-8">
            <div className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-white/[0.05] rounded-2xl">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ background: `${currentRegimeMeta?.color}15`, border: `1px solid ${currentRegimeMeta?.color}30` }}>
                {currentRegimeMeta && <currentRegimeMeta.icon className="w-6 h-6" style={{ color: currentRegimeMeta.color }} />}
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Current Status</p>
                <p className="text-lg font-bold" style={{ color: currentRegimeMeta?.color }}>{currentRegimeMeta?.label}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {REGIMES.map(r => (
                <button
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                    selectedId === r.id 
                    ? 'bg-white/[0.08] border-white/40 ring-2 ring-white/10' 
                    : 'bg-zinc-900/30 border-white/[0.05] hover:border-white/20'
                  }`}
                >
                  <r.icon className="w-6 h-6" style={{ color: r.color }} />
                  <span className="text-[10px] font-bold uppercase text-center leading-tight">{r.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handlePredict}
              disabled={!selectedId || submitting}
              className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all ${
                !selectedId || submitting 
                ? 'bg-white/5 text-zinc-600 border border-white/[0.05] cursor-not-allowed' 
                : 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
              }`}
            >
              {submitting ? 'Submitting...' : 'Confirm Prediction'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-zinc-900/50 border border-white/[0.05] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">You Predicted</p>
                  <div className="flex items-center gap-2">
                    {REGIMES.find(r => r.id === prediction.prediction) && (
                      (() => {
                        const r = REGIMES.find(r => r.id === prediction.prediction)!;
                        return <r.icon className="w-6 h-6" style={{ color: r.color }} />;
                      })()
                    )}
                    <span className="text-xl font-bold">{REGIMES.find(r => r.id === prediction.prediction)?.label}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Date</p>
                  <p className="font-bold">{new Date(prediction.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-black/40 rounded-xl border border-white/[0.03]">
                <Clock className="w-5 h-5 text-zinc-500" />
                <p className="text-sm text-zinc-400">
                  Prediction pending... <span className="text-zinc-200 font-bold">Check back in 30 days</span> to see if you were right.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 py-2">
              <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium">
                <History className="w-4 h-4" />
                <span>Leaderboard coming soon</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-purple-500/5 border-t border-white/[0.05] p-4 flex items-center justify-center gap-4">
        <div className="flex -space-x-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0e0e10] bg-zinc-800" />
          ))}
        </div>
        <p className="text-[10px] text-zinc-500 font-medium">
          <span className="text-purple-400 font-bold">1,248+ users</span> have made predictions this month
        </p>
      </div>
    </div>
  );
}
