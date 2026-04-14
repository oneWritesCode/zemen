const TOKENS = [
  { text: "2.4%", className: "top-[14%] left-[10%] float-slow" },
  { text: "CPI", className: "top-[22%] right-[14%] float-medium" },
  { text: "GDP +3.1", className: "top-[44%] left-[16%] float-fast" },
  { text: "Fed 5.25%", className: "top-[60%] right-[12%] float-slow" },
  { text: "Jobs 4.2%", className: "top-[75%] left-[28%] float-medium" },
  { text: "Gold", className: "top-[36%] right-[36%] float-fast" },
];

export function FloatingMacroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255, 208, 0, 0.81),transparent_55%)]" />
      {TOKENS.map((token) => (
        <span
          key={token.text}
          className={`absolute rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-400 ${token.className}`}
        >
          {token.text}  
        </span>
      ))}
    </div>
  );
}
