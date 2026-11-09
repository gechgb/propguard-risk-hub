import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import seoMatrix from "@/data/prop-seo-matrix.json";
import {
  Shield,
  Calculator,
  TrendingDown,
  BarChart3,
  ArrowRight,
  Zap,
  Target,
  Activity,
  Scale,
  Sparkles,
  Lock,
  Cpu,
  Layers,
} from "lucide-react";
import type { SeoMatrix } from "@/lib/types";

const data = seoMatrix as SeoMatrix;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* ── Hero Section ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-24 border-b border-slate-800/60">
        {/* Futuristic Background Glow & Gradients */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[550px] w-[1000px] -translate-x-1/2 rounded-full bg-emerald-500/[0.08] blur-[140px]" />
          <div className="absolute top-20 right-1/4 h-[350px] w-[500px] rounded-full bg-amber-500/[0.04] blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-md shadow-lg shadow-emerald-500/5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>Institutional Prop-Firm Risk Engine</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">2026 Updated Rules</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Zero-Error Sizing for{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              Funded Traders
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-base sm:text-xl text-slate-300 leading-relaxed font-normal">
            Calculate exact lot sizes that factor in your prop firm&apos;s daily drawdown cap, live spread, and round-turn commissions. Floor lot sizes to prevent accidental breaches.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="#calculators"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-xl shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all cursor-pointer"
            >
              <Calculator className="h-4 w-4" />
              <span>Launch Calculator</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/60 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:border-slate-600 hover:bg-slate-800/60 transition-all backdrop-blur-md"
            >
              <Scale className="h-4 w-4 text-emerald-400" />
              <span>Compare Prop Firms</span>
            </Link>
          </div>

          {/* Live Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-8">
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">0.01 Lot</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Strict Risk Flooring</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
              <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400">40+ Pairs</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Static Pre-built Pages</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
              <div className="text-xl sm:text-2xl font-bold font-mono text-sky-400">0.00 CLS</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Zero Layout Shift</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
              <div className="text-xl sm:text-2xl font-bold font-mono text-rose-400">100% Free</div>
              <div className="text-[11px] text-slate-400 mt-0.5">No Login Required</div>
            </div>
          </div>

          {/* MyBid Ad Banner Unit */}
          <div className="pt-4 max-w-4xl mx-auto">
            <AdSlot slotId="top-leaderboard" bannerId="2031283" className="min-h-[90px]" />
          </div>
        </div>
      </section>

      {/* ── Calculator Explorer Grid ───────────────────────────────── */}
      <section id="calculators" className="mx-auto max-w-6xl px-4 sm:px-6 py-20 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-400">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Select Your Evaluation Account</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Choose Firm &amp; Instrument
          </h2>
          <p className="text-slate-400 text-sm">
            Instant zero-latency position sizing calibrated to each firm&apos;s daily loss rules and contract specifications.
          </p>
        </div>

        {/* Firm Cards */}
        <div className="space-y-8">
          {data.propFirms.map((firm) => (
            <div
              key={firm.slug}
              className="rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900/70 to-slate-950 p-6 space-y-4 shadow-xl"
            >
              {/* Firm Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/60">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-lg font-bold text-white">{firm.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {firm.programName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Model: <strong className="text-slate-300">{firm.drawdownType}</strong> • Reset:{" "}
                    <strong className="text-slate-300">{firm.dailyResetRule}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    Daily Cap: {firm.dailyDrawdownPct}%
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                    Max DD: {firm.maxDrawdownPct}%
                  </span>
                </div>
              </div>

              {/* Instrument Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {data.instruments.map((inst) => (
                  <Link
                    key={`${firm.slug}-${inst.slug}`}
                    href={`/calculators/${firm.slug}/${inst.slug}`}
                    className="group p-3.5 rounded-xl border border-slate-800/90 bg-slate-950/60 hover:bg-slate-900 hover:border-emerald-500/40 transition-all duration-150 flex flex-col justify-between space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                        {inst.symbol}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                        {inst.assetClass}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="truncate max-w-[100px]">{inst.displayName.split(" ")[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ──────────────────────────────────────────── */}
      <section className="border-t border-slate-800/60 bg-slate-900/30 py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Built for Quantitative Risk Preservation
            </h2>
            <p className="text-slate-400 text-sm">
              Standard forex calculators ignore prop-firm specific constraints. PropGuard prevents the 3 most common breach causes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-950/70 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Mathematical Downward Flooring</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Standard rounding rules round 1.256 lots up to 1.26 lots, which overshoots your dollar risk budget. PropGuard floors every calculation to the nearest 0.01 micro lot so you never exceed your intended risk.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-950/70 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Friction &amp; Cost Buffering</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Average spread and broker commissions are deducted from your allowable risk upfront. A 50-pip stop with 2 pips spread and $3/lot comm will not push your account into a daily breach.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-950/70 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <TrendingDown className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Consecutive Loss Survival Tracking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Know before entering a trade exactly how many consecutive full losses will breach your daily cap. Yellow alerts trigger at &gt;30% buffer use, and red warnings at &gt;50%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Ad Banner */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <AdSlot slotId="bottom-leaderboard" bannerId="2031285" className="min-h-[90px]" />
      </div>
    </div>
  );
}
