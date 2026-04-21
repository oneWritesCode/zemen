"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, AlertCircle, Briefcase } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/lib/hooks/use-toast";
import { MotionDiv } from "@/components/ui/animations";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profession, setProfession] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, profession }),
      });

      const data = await res.json();

      if (data.success) {
        showToast("Account created successfully!", "success");
        login(data.token, data.user);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#FFD000]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/5 blur-[120px]" />
      </div>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#666] hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back</span>
        </button>

        <div className="bg-[#0d0d0d] border border-white/[0.05] rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-[#FFD000]/10 flex items-center justify-center border border-[#FFD000]/20">
              <Sparkles className="h-5 w-5 text-[#FFD000]" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">Create Account</h1>
              <p className="text-xs text-[#666]">Start your macro journey</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#444] ml-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-[#050505] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFD000]/50 transition-colors"
                placeholder="warren_buffett"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#444] ml-1">
                Profession
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  required
                  className="w-full bg-[#050505] border border-white/[0.05] rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-[#FFD000]/50 transition-colors"
                  placeholder="Retail Investor"
                />
                <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#333]" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#444] ml-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#050505] border border-white/[0.05] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFD000]/50 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl p-3 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-black text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-[#FFD000] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-[#444]">
            Already have an account?{" "}
            <Link href="/login" className="text-white hover:text-[#FFD000] transition-colors font-bold">
              Login here
            </Link>
          </p>
        </div>
      </MotionDiv>
    </div>
  );
}
