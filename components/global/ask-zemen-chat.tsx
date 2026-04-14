"use client";

import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "What does the current regime mean for me?",
  "Is the economy getting better or worse?",
  "What should I be watching right now?",
];

export function AskZemenChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raw = window.sessionStorage.getItem("zemen-chat");
    if (raw) {
      try {
        setMessages(JSON.parse(raw) as ChatMessage[]);
      } catch {
        // noop
      }
    }
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem("zemen-chat", JSON.stringify(messages.slice(-10)));
  }, [messages]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    const nextUser: ChatMessage = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev.slice(-9), nextUser]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ask-zemen", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: [...messages.slice(-9), nextUser] }),
      });
      const json = (await res.json()) as { answer?: string; error?: string };
      const reply = json.answer ?? json.error ?? "I could not answer right now.";
      setMessages((prev) => [...prev.slice(-9), { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev.slice(-9),
        { role: "assistant", content: "I could not connect. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-5 bottom-5 z-[85] inline-flex items-center gap-2 rounded-full bg-[#FFD000] px-4 py-3 font-semibold text-black shadow-lg transition hover:bg-[#ffdf52]"
      >
        <MessageCircle className="h-4 w-4" />
        Ask Zemen
      </button>

      <div
        className={`fixed top-12 right-0 z-[95] h-[calc(100vh-3rem)] w-full max-w-[380px] border-l border-white/10 bg-[#0f0f0f] transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <p className="font-semibold text-[#FFD000]">Ask Zemen</p>
          <button type="button" onClick={() => setOpen(false)} className="text-zinc-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="h-[calc(100%-7.5rem)] space-y-3 overflow-y-auto px-4 py-4">
          {messages.length === 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-zinc-400">Try one of these:</p>
              {STARTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void send(s)}
                  className="w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-3 py-2 text-left text-sm text-zinc-200 hover:border-[#FFD000]/40"
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}

          {messages.map((message, i) => (
            <div
              key={`${message.role}-${i}`}
              className={`rounded-xl px-3 py-2 text-sm leading-6 ${
                message.role === "user" ? "bg-[#FFD000] text-black" : "bg-[#1a1a1a] text-zinc-200"
              }`}
            >
              {message.content}
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="flex gap-2 border-t border-white/10 p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-lg border border-white/10 bg-[#161616] px-3 py-2 text-sm text-white outline-none focus:border-[#FFD000]/50"
            placeholder="Ask about the economy..."
          />
          <button
            type="submit"
            disabled={!canSend}
            className="rounded-lg bg-[#FFD000] px-3 text-black disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </>
  );
}

