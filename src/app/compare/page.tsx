import type { Metadata } from "next";
import Link from "next/link";
import seoMatrix from "@/data/prop-seo-matrix.json";
import AdSlot from "@/components/AdSlot";
import { Shield, ArrowRight, CheckCircle2, AlertCircle, Scale } from "lucide-react";
import type { SeoMatrix } from "@/lib/types";

const data = seoMatrix as SeoMatrix;

export const metadata: Metadata = {
  title: "Prop Firm Drawdown Rules Comparison 2026 (FTMO vs FundedNext vs The5ers vs Topstep)",
  description:
    "Side-by-side comparison of daily drawdown, maximum drawdown, reset rules, and profit targets across major prop firms. Static vs Trailing drawdown analysis.",
  openGraph: {
    title: "Prop Firm Drawdown Rules Comparison 2026 — PropGuard Risk Hub",
    description:
      "Detailed breakdown of FTMO, FundedNext, The5ers, Alpha Capital, and Topstep drawdown mechanics.",
  },
};

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <header className="space-y-3 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
            <Scale className="w-3.5 h-3.5" />
            Institutional Evaluation Matrix
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Prop Firm Drawdown &amp; Rule Comparison
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Compare daily loss limits, maximum drawdown models (Static vs. Trailing), reset server times, and profit targets across top prop trading firms.
          </p>
        </header>

        {/* Top MyBid Ad Banner */}
        <AdSlot slotId="top-leaderboard" bannerId="2031283" className="min-h-[90px]" />

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-4 px-5">Prop Firm &amp; Program</th>
                <th className="py-4 px-4 text-center">Daily Drawdown</th>
                <th className="py-4 px-4 text-center">Max Drawdown</th>
                <th className="py-4 px-4">Drawdown Model</th>
                <th className="py-4 px-4">Daily Reset Rule</th>
                <th className="py-4 px-4 text-center">Profit Target</th>
                <th className="py-4 px-4 text-center">Round-Turn Comm</th>
                <th className="py-4 px-5 text-right">Calculator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {data.propFirms.map((firm) => (
                <tr key={firm.slug} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-5 font-semibold text-white">
                    <div>{firm.name}</div>
                    <div className="text-xs font-normal text-slate-400">{firm.programName}</div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {firm.dailyDrawdownPct}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      {firm.maxDrawdownPct}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-xs font-medium text-slate-300">
                    {firm.drawdownType}
                  </td>
                  <td className="py-4 px-4 text-xs text-slate-400">
                    {firm.dailyResetRule}
                  </td>
                  <td className="py-4 px-4 text-center text-xs">
                    <span className="text-emerald-400 font-semibold">{firm.profitTargetStep1Pct}%</span>
                    {firm.profitTargetStep2Pct > 0 && (
                      <span className="text-slate-500"> / {firm.profitTargetStep2Pct}%</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center text-xs font-mono">
                    {firm.defaultCommissionPerLotUsd > 0
                      ? `$${firm.defaultCommissionPerLotUsd.toFixed(2)}/lot`
                      : "Zero Comm"}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <Link
                      href={`/calculators/${firm.slug}/xauusd`}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
                    >
                      Calculate
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detailed Breakdown Section */}
        <section className="grid md:grid-cols-2 gap-6 pt-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-lg">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              Static Drawdown Advantage
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Firms like <strong>FTMO</strong> and <strong>FundedNext</strong> lock your maximum loss limit to your starting account balance. If you scale a $100,000 account to $108,000, your maximum loss limit remains at $90,000 (10% of starting balance). This gives you an effective $18,000 breathing room, allowing you to endure normal variance without risking account liquidation.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-lg">
              <AlertCircle className="w-5 h-5 shrink-0" />
              Trailing Drawdown Mechanics
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Firms like <strong>Topstep</strong> enforce an End-of-Day Trailing Maximum Loss rule. As your account equity creates new peaks, your loss floor trails upwards dollar-for-dollar until reaching the initial starting balance. This means unrealized intraday open profits must be safeguarded diligently to prevent premature breach.
            </p>
          </div>
        </section>

        {/* Bottom MyBid Ad Banner */}
        <AdSlot slotId="bottom-leaderboard" bannerId="2031285" className="min-h-[90px]" />
      </div>
    </main>
  );
}

