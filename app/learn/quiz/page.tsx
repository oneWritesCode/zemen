"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Share2, 
  Brain, 
  Trophy,
  ChevronRight,
  Sprout,
  Book,
  BarChart2
} from "lucide-react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { BackButton } from "@/components/ui/back-button";
import { useToast } from "@/lib/hooks/use-toast";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  indicator?: string;
}

const STATIC_QUESTIONS: QuizQuestion[] = [
  {
    question: "What does the Federal Reserve do when inflation is too high?",
    options: ["Cuts interest rates", "Raises interest rates", "Prints more money", "Raises taxes"],
    correct: 1,
    explanation: "The Fed raises rates to make borrowing more expensive, which slows spending and brings inflation down.",
    difficulty: "easy",
    indicator: "interest-rates"
  },
  {
    question: "What is a recession officially defined as?",
    options: ["Stock market falling 20%", "Unemployment above 6%", "Two consecutive quarters of GDP decline", "Inflation above 5%"],
    correct: 2,
    explanation: "While the NBER considers many factors, the rule of thumb is two consecutive quarters of negative GDP growth.",
    difficulty: "easy",
    indicator: "gdp-growth"
  },
  {
    question: "Which asset historically performs BEST during stagflation?",
    options: ["Technology stocks", "Government bonds", "Gold", "Real estate"],
    correct: 2,
    explanation: "Gold is a classic hedge against inflation when growth is weak (stagflation).",
    difficulty: "medium",
    indicator: "gold"
  },
  {
    question: "What does a 'hawkish' Fed signal?",
    options: ["Likely to cut rates", "Likely to raise or hold rates high", "Concerned about growth", "Neutral stance"],
    correct: 1,
    explanation: "Hawks prioritize low inflation and are more likely to favor higher interest rates.",
    difficulty: "easy",
    indicator: "interest-rates"
  },
  {
    question: "The 'inverted yield curve' is often seen as a predictor of what?",
    options: ["Stock market boom", "Hyperinflation", "Recession", "Strong employment"],
    correct: 2,
    explanation: "An inverted curve (short-term rates higher than long-term) has preceded almost every US recession.",
    difficulty: "hard",
    indicator: "interest-rates"
  },
  {
    question: "What is the Fed's dual mandate?",
    options: ["Low taxes and high growth", "Stable prices and maximum employment", "Strong dollar and trade balance", "Low debt and high savings"],
    correct: 1,
    explanation: "The Fed is legally required to pursue both price stability (low inflation) and maximum sustainable employment.",
    difficulty: "medium",
    indicator: "unemployment"
  },
  {
    question: "Which index measures stock market volatility and investor fear?",
    options: ["S&P 500", "Nasdaq 100", "VIX", "CPI"],
    correct: 2,
    explanation: "The VIX (Volatility Index) is often called the 'fear gauge' of the market.",
    difficulty: "easy",
    indicator: "stock-market"
  },
  {
    question: "What happens to bond prices when interest rates rise?",
    options: ["They go up", "They go down", "They stay the same", "They become more volatile"],
    correct: 1,
    explanation: "Bond prices and interest rates have an inverse relationship. When rates rise, existing bonds with lower rates become less valuable.",
    difficulty: "medium",
    indicator: "interest-rates"
  },
  {
    question: "What does CPI stand for?",
    options: ["Central Price Index", "Consumer Price Index", "Corporate Profit Index", "Capital Price Indicator"],
    correct: 1,
    explanation: "The Consumer Price Index measures the average change over time in the prices paid by urban consumers for a market basket of goods and services.",
    difficulty: "easy",
    indicator: "inflation"
  },
  {
    question: "In a 'Goldilocks' economy, which of these is true?",
    options: ["Inflation is very high", "Growth is very low", "Conditions are 'just right' (moderate growth, low inflation)", "Unemployment is rising rapidly"],
    correct: 2,
    explanation: "A Goldilocks economy is neither too hot (inflation) nor too cold (recession).",
    difficulty: "easy",
    indicator: "gdp-growth"
  }
];

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const { showToast } = useToast();

  useEffect(() => {
    // Shuffle and pick 10
    const shuffled = [...STATIC_QUESTIONS].sort(() => 0.5 - Math.random());
    queueMicrotask(() => {
      setQuestions(shuffled.slice(0, 10));
      
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('zemen_iq_score');
        if (saved) setHighScore(parseInt(saved));
      }
    });
  }, []);

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    
    setSelectedOption(idx);
    setIsAnswered(true);
    
    const isCorrect = idx === questions[currentIdx].correct;
    if (isCorrect) {
      setScore(prev => prev + 10);
      showToast("Correct! +10 points", "success");
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizComplete(true);
      const finalScore = score + (selectedOption === questions[currentIdx].correct ? 10 : 0);
      if (typeof window !== 'undefined') {
        if (finalScore > highScore) {
          localStorage.setItem('zemen_iq_score', finalScore.toString());
          localStorage.setItem('zemen_iq_date', new Date().toISOString());
        }
      }
      
      if (finalScore >= 90) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#888888', '#22c55e']
        });
      }
    }
  };

  const resetQuiz = () => {
    const shuffled = [...STATIC_QUESTIONS].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 10));
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizComplete(false);
  };

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  const getRating = (s: number) => {
    if (s <= 30) return <div className="flex items-center gap-2 justify-center"><span>Macro Beginner</span> <Sprout className="w-5 h-5 text-green-500" /></div>;
    if (s <= 60) return <div className="flex items-center gap-2 justify-center"><span>Macro Student</span> <Book className="w-5 h-5 text-blue-500" /></div>;
    if (s <= 80) return <div className="flex items-center gap-2 justify-center"><span>Macro Analyst</span> <BarChart2 className="w-5 h-5 text-orange-500" /></div>;
    return <div className="flex items-center gap-2 justify-center"><span>Macro Expert</span> <Trophy className="w-5 h-5 text-yellow-500" /></div>;
  };

  return (
    <>
      <div className="min-h-screen bg-[#080809] text-zinc-100 py-12 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <Breadcrumb 
              items={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Learn Hub', href: '/learn' },
                { label: 'Macro IQ Quiz', href: null }
              ]} 
            />
            <BackButton href="/learn" label="Back to Learn Hub" />
            
            {!quizComplete ? (
              <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white">Macro IQ Quiz</h1>
                      <p className="text-xs text-zinc-500">Test your economic knowledge</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-500 uppercase tracking-widest">Question</p>
                    <p className="text-lg font-bold text-white">{currentIdx + 1} <span className="text-zinc-600">/ {questions.length}</span></p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                {/* Question Card */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIdx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-[#0e0e10] border border-white/[0.08] rounded-2xl p-6 sm:p-8"
                  >
                    <div className="mb-8">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-4 ${
                        currentQuestion.difficulty === 'easy' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                        currentQuestion.difficulty === 'medium' ? 'bg-white/10 text-white border border-white/20' :
                        'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}>
                        {currentQuestion.difficulty}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold leading-tight text-white">
                        {currentQuestion.question}
                      </h2>
                    </div>

                    <div className="grid gap-3">
                      {currentQuestion.options.map((option, i) => {
                        const isCorrect = i === currentQuestion.correct;
                        const isSelected = i === selectedOption;
                        
                        let bgClass = "bg-zinc-900/50 border-white/[0.05] hover:border-white/20";
                        if (isAnswered) {
                          if (isCorrect) bgClass = "bg-green-500/10 border-green-500/50 text-green-400";
                          else if (isSelected) bgClass = "bg-red-500/10 border-red-500/50 text-red-400 shake";
                        }

                        return (
                          <button
                            key={i}
                            onClick={() => handleAnswer(i)}
                            disabled={isAnswered}
                            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${bgClass}`}
                          >
                            <span className="font-medium">{option}</span>
                            {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                            {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 p-5 bg-zinc-900/50 border border-white/[0.05] rounded-xl"
                      >
                        <p className="text-sm text-zinc-400 leading-relaxed">
                          <span className="font-bold text-zinc-200">Explanation:</span> {currentQuestion.explanation}
                        </p>
                        <button
                          onClick={nextQuestion}
                          className="mt-6 w-full py-3 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                        >
                          {currentIdx === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              /* End Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8"
              >
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white/10 border border-white/20 mb-4">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                
                <div>
                  <h1 className="text-4xl font-bold mb-2 text-white">Quiz Complete!</h1>
                  <p className="text-zinc-500">Your Macro IQ results are in</p>
                </div>

                <div className="bg-[#0e0e10] border border-white/[0.08] rounded-3xl p-8 max-w-md mx-auto">
                  <div className="mb-6">
                    <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Final Score</p>
                    <p className="text-6xl font-bold text-white">{score}<span className="text-2xl text-zinc-700">/100</span></p>
                  </div>
                  
                  <div className="py-4 border-y border-white/[0.05] mb-6">
                    <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">Your Rating</p>
                    <p className="text-2xl font-bold text-white">{getRating(score)}</p>
                  </div>

                  {highScore > 0 && (
                    <p className="text-sm text-zinc-500 mb-8">
                      Your best score: <span className="text-zinc-300 font-bold">{highScore}/100</span>
                    </p>
                  )}

                  <div className="grid gap-3">
                    <button 
                      onClick={resetQuiz}
                      className="w-full py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Try Again
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="py-4 bg-zinc-900 border border-white/[0.08] text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors">
                        <Share2 className="w-5 h-5" />
                        Share
                      </button>
                      <Link 
                        href="/dashboard"
                        className="py-4 bg-zinc-900 border border-white/[0.08] text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
                      >
                        Dashboard
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </div>
    </>
  );
}
