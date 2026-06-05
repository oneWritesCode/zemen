import { AlertCircle, ExternalLink, ShieldAlert } from "lucide-react";

export function ApiKeyExpiredError() {
  return (
    <div className="w-full max-w-md mx-auto my-4 overflow-hidden rounded-2xl border border-red-500/20 bg-[#0a0a0a] shadow-2xl transition-all hover:border-red-500/30">
      <div className="relative p-6">
        {/* Background glow */}
        <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-red-500/10 blur-2xl" />
        
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
            <ShieldAlert className="h-5 w-5" />
          </div>
          
          <div className="flex-1 space-y-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              Service Unavailable
              <span className="flex h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            </h3>
            
            <p className="text-xs leading-relaxed text-zinc-400">
              The API key of this chatbot has been expired. If you want to use it, ask the developer to fix it.
            </p>
            
            <div className="pt-2 flex items-center justify-between">
              <a 
                href="https://d33pak.space" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white hover:text-red-400 transition-colors group"
              >
                Contact Developer
                <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              
              <span className="text-[10px] text-zinc-600 font-mono">
                ERR_API_EXPIRED
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-50" />
    </div>
  );
}
