
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { BackButton } from "@/components/ui/back-button";
import { HelpCircle, ArrowRight } from "lucide-react";

export default function BeginnerGuidePage() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb 
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Learn Hub', href: '/learn' },
            { label: "Beginner's Guide", href: null }
          ]} 
        />
        <BackButton href="/learn" label="Back to Learn Hub" />

        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
            Macroeconomics for Beginners
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Understanding the economy doesn&apos;t have to be complicated. Here are the core concepts Zemen tracks and why they matter to you.
          </p>
        </div>

        <div className="space-y-12">
          <GuideSection 
            title="1. Interest Rates: The Price of Money"
            content="Think of interest rates as the 'price' of borrowing money. When the Federal Reserve raises rates, borrowing becomes more expensive for everyone—from homebuyers with mortgages to businesses looking to expand. This slows down the economy to keep inflation in check."
          />
          <GuideSection 
            title="2. Inflation: Your Purchasing Power"
            content="Inflation is the rate at which the general level of prices for goods and services is rising. If inflation is 3%, a $100 grocery bill last year will cost $103 today. Zemen tracks the Consumer Price Index (CPI) to see how fast your money is losing its value."
          />
          <GuideSection 
            title="3. Unemployment: The Health of Labor"
            content="A healthy economy usually has low unemployment, meaning most people who want a job can find one. However, if unemployment gets too low, it can actually cause inflation as companies compete for workers by raising wages. If it gets too high, it's a sign of a recession."
          />
          <GuideSection 
            title="4. GDP Growth: The Size of the Pie"
            content="Gross Domestic Product (GDP) measures the total value of everything produced in the country. It's the ultimate scorecard for economic health. We want steady, moderate growth. Too fast, and the economy 'overheats'; too slow, and we might be in a recession."
          />
        </div>
        
        <div className="mt-16 p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/20">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-emerald-500" />
            Ready to test your knowledge?
          </h2>
          <p className="text-emerald-100/70 mb-6">
            Now that you know the basics, see if you can identify these patterns in the real world.
          </p>
          <a href="/learn/quiz" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-colors">
            Take the Macro IQ Quiz <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </>
  );
}

function GuideSection({ title, content }: { title: string; content: string }) {
  return (
    <div className="bg-[#0e0e10] border border-white/[0.08] p-8 rounded-3xl">
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">
        {content}
      </p>
    </div>
  );
}
