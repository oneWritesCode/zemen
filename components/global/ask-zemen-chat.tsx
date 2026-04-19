"use client";

import {
  Activity,
  BarChart2,
  Clipboard,
  Edit2,
  FileText,
  Globe,
  History,
  Image as ImageIcon,
  Landmark,
  Lightbulb,
  LineChart,
  Maximize2,
  MessageCircle,
  Mic,
  Minimize2,
  Paperclip,
  PieChart,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  Share2,
  ShieldAlert,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { RichChatResponse } from "@/components/global/rich-chat-response";
import type { ChartData, ResponseMode } from "@/lib/chat/rich";

type ChatMessage = { role: "user" | "assistant"; content: string };

const PILL_OPTIONS = [
  { text: "Current regime", icon: Activity },
  { text: "Market outlook", icon: LineChart },
  { text: "Fed rate impact", icon: Landmark },
  { text: "Yield curve analysis", icon: TrendingUp },
  { text: "Asset allocation", icon: PieChart },
  { text: "Risk assessment", icon: ShieldAlert },
  { text: "Historical data", icon: BarChart2 },
  { text: "Key indicators", icon: Lightbulb },
  { text: "Recent reports", icon: FileText },
];

const MODE_OPTIONS: Array<{ id: ResponseMode; label: string }> = [
  { id: "SIMPLE", label: "Simple" },
  { id: "DETAILED", label: "Detailed" },
  { id: "RAW", label: "Raw" },
];

const SUGGESTED_BY_MODE: Record<ResponseMode, string[]> = {
  SIMPLE: [
    "Is the economy doing well right now?",
    "Should I be worried about inflation?",
    "What does the current regime mean for me?",
  ],
  DETAILED: [
    "Show me the inflation trend with a chart",
    "Compare this recession risk to 2008",
    "What indicators are flashing warning signs?",
  ],
  RAW: [
    "Full breakdown of current regime signals",
    "Historical performance table by regime",
    "Correlation between Fed rate and S&P 500",
  ],
};

type HistoryItem = {
  question: string;
  answer: string;
  mode: ResponseMode;
  ts: number;
};

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 h-6">
      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
    </div>
  );
}

export function AskZemenChat() {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<ResponseMode>("DETAILED");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [expandedCharts, setExpandedCharts] = useState<ChartData[] | null>(null);
  const [dock, setDock] = useState<"launcher" | "minicard">("launcher");
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const raw = window.sessionStorage.getItem("zemen-chat");
    if (raw) {
      try {
        setMessages(JSON.parse(raw) as ChatMessage[]);
      } catch {
        // noop
      }
    }
    const savedMode = window.sessionStorage.getItem("zemen-chat-mode") as ResponseMode | null;
    if (savedMode && (savedMode === "SIMPLE" || savedMode === "DETAILED" || savedMode === "RAW")) {
      setMode(savedMode);
    }
    const savedDock = window.sessionStorage.getItem("zemen-chat-dock");
    if (savedDock === "minicard" || savedDock === "launcher") setDock(savedDock);
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem("zemen-chat", JSON.stringify(messages.slice(-10)));
  }, [messages]);

  useEffect(() => {
    window.sessionStorage.setItem("zemen-chat-mode", mode);
  }, [mode]);

  useEffect(() => {
    window.sessionStorage.setItem("zemen-chat-dock", dock);
  }, [dock]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [open, messages, loading]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  const pushHistory = (item: HistoryItem) => {
    try {
      const key = "zemen_chat_history";
      const raw = window.localStorage.getItem(key);
      const existing = raw ? (JSON.parse(raw) as HistoryItem[]) : [];
      const next = [item, ...existing].slice(0, 10);
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // noop
    }
  };

  const readHistory = (): HistoryItem[] => {
    try {
      const raw = window.localStorage.getItem("zemen_chat_history");
      if (!raw) return [];
      const parsed = JSON.parse(raw) as HistoryItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const send = async (text: string, historyPrefix?: ChatMessage[]) => {
    if (!text.trim()) return;
    setError(null);
    const nextUser: ChatMessage = { role: "user", content: text.trim() };
    const baseMessages = historyPrefix ?? messages;
    const nextMessages = [...baseMessages.slice(-9), nextUser];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ask-zemen", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, mode }),
      });
      const json = (await res.json()) as { answer?: string; error?: string };
      if (!res.ok) {
        const msg = json.error ?? "Request failed. Please try again.";
        setError(msg);
        setMessages((prev) => [...prev.slice(-9), { role: "assistant", content: msg }]);
        return;
      }
      const reply = json.answer ?? "I could not answer right now.";
      setMessages((prev) => [...prev.slice(-9), { role: "assistant", content: reply }]);
      pushHistory({ question: nextUser.content, answer: reply, mode, ts: Date.now() });
    } catch {
      const msg = "I could not connect. Please check your network and try again.";
      setError(msg);
      setMessages((prev) => [...prev.slice(-9), { role: "assistant", content: msg }]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // noop
    }
  };

  const shareResponse = async (question: string, answer: string, usedMode: ResponseMode) => {
    try {
      const url = new URL("/share", window.location.origin);
      url.searchParams.set("q", question);
      url.searchParams.set("a", answer);
      url.searchParams.set("m", usedMode);
      url.searchParams.set("t", String(Date.now()));
      await navigator.clipboard.writeText(url.toString());
    } catch {
      // noop
    }
  };

  const editMessage = (msg: ChatMessage, index: number) => {
    if (msg.role === "user") {
      setInput(msg.content);
      setMessages((prev) => prev.slice(0, index));
    }
  };

  const resendMessage = (index: number) => {
    let userMessageIdx = index;
    while (userMessageIdx >= 0 && messages[userMessageIdx].role !== "user") {
      userMessageIdx--;
    }
    if (userMessageIdx >= 0) {
      const msgText = messages[userMessageIdx].content;
      const historyPrefix = messages.slice(0, userMessageIdx);
      void send(msgText, historyPrefix);
    }
  };

  const refreshChat = () => {
    setError(null);
    setLoading(false);
    setInput("");
    setMessages([]);
    window.sessionStorage.removeItem("zemen-chat");
  };

  const panelBase = [
    "fixed z-[95] bg-[#0a0a0a]/98 backdrop-blur-sm transition-transform duration-300 flex flex-col",
    fullscreen
      ? "inset-0 border-l-0"
      : "top-0 right-0 h-screen w-full max-w-[420px] border-l border-white/[0.06]",
    open ? "translate-x-0" : "translate-x-full",
  ].join(" ");

  const isEmpty = messages.length === 0 && !loading;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) {
        void send(input);
      }
    }
  };

  return (
    <>
      {dock === "launcher" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed right-5 bottom-5 z-[85] inline-flex items-center gap-2 rounded-full bg-[#FFFFFF] px-4 py-3 font-semibold text-black shadow-lg transition hover:bg-[#ffdf52]"
        >
          <MessageCircle className="h-4 w-4" />
          Ask Zemen
        </button>
      ) : null}

      {dock === "minicard" && !open ? (
        <div className="fixed right-5 bottom-5 z-[85] w-[280px] overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0d]/95 shadow-2xl backdrop-blur-md">
          <div className="flex items-start justify-between gap-3 p-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#FFFFFF]">Ask Zemen</p>
              <p className="mt-0.5 text-[11px] text-zinc-500">
                Mode: {MODE_OPTIONS.find((m) => m.id === mode)?.label}
              </p>
              <p className="mt-2 line-clamp-2 text-xs text-zinc-300">
                {messages.length > 0 ? messages[messages.length - 1]?.content : "Ask a macro question."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDock("launcher")}
              className="p-1.5 text-zinc-400 hover:text-zinc-100"
              aria-label="Dismiss mini chat card"
              title="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-white/[0.06] px-3 py-2">
            <button
              type="button"
              onClick={() => {
                setOpen(true);
                setFullscreen(false);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#FFFFFF] px-3 py-1.5 text-xs font-semibold text-black hover:bg-[#ffdf52] transition"
            >
              <MessageCircle className="h-4 w-4" />
              Show chat
            </button>
            <button
              type="button"
              onClick={() => refreshChat()}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:border-white/20 transition"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>
      ) : null}

      <div className={panelBase}>
        {/* Background for fullscreen mode */}
        {fullscreen ? (
          <div className="pointer-events-none absolute inset-0 z-0 flex justify-center items-center overflow-hidden">
             {/* Using grid pattern observed in AI chat interfaces */}
            <div className="absolute inset-0 opacity-[0.25] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:64px_64px]" />
            <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,208,0,0.15),transparent_70%)] blur-3xl pointer-events-none" />
          </div>
        ) : null}

        {/* Header */}
        <div className="relative z-10 shrink-0 border-b border-white/[0.06]">
          {/* Top row: title + action icons */}
          <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-2">
            <p className="font-medium text-[#FFFFFF] flex items-center gap-2 text-sm">
              <Search className="w-4 h-4 shrink-0" />
              Ask Zemen
            </p>

            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => setHistoryOpen((v) => !v)}
                className="p-2 text-zinc-400 transition hover:text-zinc-100 hover:bg-white/5 rounded-md"
                aria-label="Chat history"
                title="History"
              >
                <History className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={refreshChat}
                className="p-2 text-zinc-400 transition hover:text-zinc-100 hover:bg-white/5 rounded-md"
                aria-label="Refresh chat"
                title="Refresh chat"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setFullscreen((v) => !v)}
                className="p-2 text-zinc-400 transition hover:text-zinc-100 hover:bg-white/5 rounded-md hidden sm:block"
                aria-label={fullscreen ? "Exit fullscreen chat" : "Fullscreen chat"}
                title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setFullscreen(false);
                  setDock("minicard");
                }}
                className="p-2 text-zinc-400 transition hover:text-zinc-100 hover:bg-white/5 rounded-md"
                aria-label="Close chat"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Bottom row: mode toggle pills */}
          <div className="flex items-center gap-3 px-4 pb-3">
            <div className="flex items-center gap-1 rounded-full bg-white/[0.04] p-1 border border-white/[0.06]">
              {MODE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMode(opt.id)}
                  className={[
                    "px-2.5 py-1 text-[11px] font-semibold rounded-full transition",
                    mode === opt.id
                      ? "bg-[#FFFFFF] text-black"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06]",
                  ].join(" ")}
                  aria-pressed={mode === opt.id}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-zinc-500 font-medium">
              Mode: {MODE_OPTIONS.find((m) => m.id === mode)?.label}
            </span>
          </div>
        </div>

        {/* Body and Content Areas */}
        {isEmpty && fullscreen ? (
          <div className="relative z-10 flex-1 overflow-y-auto flex flex-col items-center pt-[10vh] px-4 pb-8 w-full">
            <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-8">
              What&apos;s on your mind today?
            </h2>

            <div className="w-full max-w-3xl bg-[#1e1e24]/60 sm:bg-white/[0.03] border border-white/10 rounded-3xl p-4 shadow-2xl backdrop-blur-xl transition-all focus-within:border-white/20 focus-within:bg-white/[0.05]">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-white resize-none outline-none text-base sm:text-lg min-h-[120px] placeholder:text-zinc-500 font-medium"
                placeholder="Message AI chat..."
              />

              <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button type="button" className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition" aria-label="Attach file">
                    <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button type="button" className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-300 bg-white/5 border border-white/5 hover:bg-white/10 rounded-full transition">
                    <Globe className="w-4 h-4" />
                    <span className="hidden sm:inline">Search</span>
                  </button>
                  <button type="button" className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-300 bg-white/5 border border-white/5 hover:bg-white/10 rounded-full transition">
                    <ImageIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Create image</span>
                  </button>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button type="button" className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition" aria-label="Use microphone">
                    <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => void send(input)}
                    disabled={!canSend}
                    type="button"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFFFFF] text-black transition hover:bg-[#ffdf52] disabled:opacity-40"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2.5 sm:gap-3 w-full max-w-4xl">
              {SUGGESTED_BY_MODE[mode].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => void send(q)}
                  className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition rounded-2xl text-xs sm:text-sm text-zinc-300 whitespace-nowrap shadow-sm group"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FFFFFF]" />
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {historyOpen ? (
              <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm" onClick={() => setHistoryOpen(false)}>
                <div
                  className="absolute right-0 top-0 h-full w-full max-w-[360px] border-l border-white/10 bg-[#0b0b0d] p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-white">History</div>
                    <button
                      type="button"
                      className="p-2 text-zinc-400 hover:text-zinc-100"
                      onClick={() => setHistoryOpen(false)}
                      aria-label="Close history"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-2">
                    {readHistory().map((h) => (
                      <button
                        key={`${h.ts}-${h.question}`}
                        type="button"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-left hover:bg-white/[0.06] transition"
                        onClick={() => {
                          setMessages([
                            { role: "user", content: h.question },
                            { role: "assistant", content: h.answer },
                          ]);
                          setMode(h.mode);
                          setHistoryOpen(false);
                        }}
                      >
                        <div className="text-xs text-zinc-500">
                          {new Date(h.ts).toLocaleString("en-US", { timeZone: "UTC" })} · {h.mode}
                        </div>
                        <div className="mt-1 truncate text-sm text-zinc-200">
                          {h.question.length > 40 ? `${h.question.slice(0, 40)}…` : h.question}
                        </div>
                      </button>
                    ))}
                    {readHistory().length === 0 ? (
                      <div className="text-sm text-zinc-500">No history yet.</div>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

            {expandedCharts ? (
              <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm">
                <div className="absolute inset-0 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-white">Charts</div>
                    <button
                      type="button"
                      className="p-2 text-zinc-300 hover:text-white"
                      onClick={() => setExpandedCharts(null)}
                      aria-label="Close charts"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-3 h-[calc(100%-3rem)] overflow-y-auto">
                    <div className="mx-auto max-w-3xl space-y-4">
                      {expandedCharts.map((c, idx) => (
                        <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
                          <RichChatResponse content={`CHART_DATA:${JSON.stringify(c)}\n`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <div ref={listRef} className="relative z-10 flex-1 overflow-y-auto px-4 py-4 w-full">
              <div className={fullscreen ? "mx-auto max-w-3xl" : " "}>
                {error ? <p className="text-sm text-red-300/90 bg-red-500/10 p-3 rounded-xl border border-red-500/20">{error}</p> : null}

                {messages.length === 0 ? (
                  <div className="space-y-4 pt-4 pb-4">
                    <p className="text-sm text-zinc-400 text-center font-medium">Explore Zemen Tools</p>
                    <div className="flex flex-col gap-2.5">
                      {PILL_OPTIONS.slice(0, 6).map((opt) => (
                        <button
                          key={opt.text}
                          type="button"
                          onClick={() => void send(opt.text)}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/[0.05] hover:bg-white/10 hover:border-white/[0.08] transition text-sm text-zinc-300 w-full group shadow-sm text-left"
                        >
                          <div className="bg-white/5 p-2 rounded-lg group-hover:bg-white/10 transition-colors">
                            <opt.icon className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                          </div>
                          <span className="flex-1 font-medium group-hover:text-white transition-colors">{opt.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {messages.map((message, i) => (
                  <div key={`${message.role}-${i}`} className={`flex flex-col group ${message.role === "user" ? "items-end" : "items-start"}`}>
                    <div
                      className={[
                        "text-sm leading-relaxed max-w-[92%] sm:max-w-[84%] px-4 py-3 rounded-2xl",
                        message.role === "user"
                          ? "bg-white/10 text-white rounded-br-sm"
                          : "bg-white/[0.03] border border-white/[0.06] text-zinc-200 rounded-bl-sm",
                      ].join(" ")}
                    >
                      {message.role === "assistant" ? (
                        <RichChatResponse
                          content={message.content}
                          onExpandCharts={(charts) => setExpandedCharts(charts)}
                        />
                      ) : (
                        message.content
                      )}
                    </div>
                    
                    <div className={`flex items-center gap-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity ${message.role === "user" ? "mr-1" : "ml-1"}`}>
                      {message.role === "user" ? (
                        <button 
                          onClick={() => editMessage(message, i)}
                          className="text-[11px] sm:text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 p-1 hover:bg-white/5 rounded transition-colors"
                          aria-label="Edit message"
                        >
                          <Edit2 className="w-3 h-3" /> 
                        </button>
                      ) : null}
                      {message.role === "assistant" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => void copyToClipboard(message.content)}
                            className="text-[11px] sm:text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 p-1 hover:bg-white/5 rounded transition-colors"
                            aria-label="Copy response"
                          >
                            <Clipboard className="w-3 h-3" />
                            Copy
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const q = messages[i - 1]?.role === "user" ? messages[i - 1]!.content : "";
                              void shareResponse(q, message.content, mode);
                            }}
                            className="text-[11px] sm:text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 p-1 hover:bg-white/5 rounded transition-colors"
                            aria-label="Share response"
                          >
                            <Share2 className="w-3 h-3" />
                            Share
                          </button>
                        </>
                      ) : null}
                      <button 
                        onClick={() => resendMessage(i)}
                        className="text-[11px] sm:text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 p-1 hover:bg-white/5 rounded transition-colors"
                        aria-label="Resend message"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {loading ? (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
                      <TypingDots />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className={`relative z-10 shrink-0 p-4 ${fullscreen ? "mx-auto max-w-3xl w-full" : "w-full border-t border-white/[0.06]"}`}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void send(input);
                }}
              >
                <div className="flex items-end bg-[#1e1e24] sm:bg-white/[0.04] border border-white/10 rounded-[1.5rem] p-1.5 focus-within:border-white/20 focus-within:bg-white/[0.06] transition-all shadow-sm">
                  <button type="button" className="p-2 text-zinc-400 hover:text-white shrink-0 mb-0.5 rounded-full hover:bg-white/5 transition" aria-label="Attach file">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    className="max-h-32 min-h-11 min-w-0 flex-1 resize-none bg-transparent px-2 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 font-medium leading-relaxed"
                    placeholder="Message Zemen..."
                  />
                  <button type="button" className="p-2 text-zinc-400 hover:text-white shrink-0 mb-0.5 rounded-full hover:bg-white/5 transition" aria-label="Use microphone">
                    <Mic className="w-5 h-5" />
                  </button>
                  <button
                    type="submit"
                    disabled={!canSend}
                    className="m-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition disabled:opacity-40 hover:bg-[#e5e5e5] shadow-[0_4px_20px_rgba(255,255,255,0.15)] mb-1 sm:mb-0.5 font-semibold"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-center mt-2">
                  <p className="text-[10px] text-zinc-600">
                    Zemen explains. It does not give financial advice.
                  </p>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
}
