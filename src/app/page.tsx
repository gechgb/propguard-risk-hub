import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import {
  Shield,
  Calculator,
  TrendingDown,
  BarChart3,
  ArrowRight,
  Zap,
  Target,
  Activity,
} from "lucide-react";

const firms = [
  {
    name: "FTMO",
    slug: "ftmo",
    maxDaily: "5%",
    maxTotal: "10%",
    accent: "emerald",
  },
  {
    name: "FundedNext",
    slug: "fundednext",
    maxDaily: "5%",
    maxTotal: "10%",
    accent: "amber",
  },
  {
    name: "The5ers",
    slug: "the5ers",
    maxDaily: "4%",
    maxTotal: "6%",
    accent: "sky",
  },
  {
    name: "Alpha Capital Group",
    slug: "alpha-capital",
    maxDaily: "5%",
    maxTotal: "10%",
    accent: "rose",
  },
];

const instruments = [
  { name: "XAUUSD", slug: "xauusd", label: "Gold" },
  { name: "EURUSD", slug: "eurusd", label: "Euro/Dollar" },
  { name: "NAS100", slug: "nas100", label: "Nasdaq 100" },
  { name: "GBPJPY", slug: "gbpjpy", label: "Pound/Yen" },
];

const accentMap: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  emerald: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-300",
  },
  amber: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    badge: "bg-amber-500/20 text-amber-300",
  },
  sky: {
    border: "border-sky-500/30",
    bg: "bg-sky-500/10",
    text: "text-sky-400",
    badge: "bg-sky-500/20 text-sky-300",
  },
  rose: {
    border: "border-rose-500/30",
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    badge: "bg-rose-500/20 text-rose-300",
  },
};

const features = [
  {
    icon: Calculator,
    title: "Real-time Lot Sizing",
    description:
      "Instant position size calculations calibrated to each firm's specific contract specs, leverage, and margin requirements.",
  },
  {
    icon: TrendingDown,
    title: "Drawdown Survival Tracking",
    description:
      "Know exactly how much room you have before breaching daily or max drawdown — down to the pip.",
  },
  {
    icon: Activity,
    title: "Spread & Commission Buffers",
    description:
      "Built-in cost modeling so your true risk accounts for spreads, commissions, and slippage on every trade.",
  },
  {
    icon: Zap,
    title: "Zero-cost Hosting",
    description:
      "Runs entirely in your browser. No subscriptions, no data collection, no server costs. Free forever.",
  },
];

const steps = [
  {
    number: "01",
    title: "Select Your Firm",
    description:
      "Choose your prop firm and account size. We load the exact drawdown rules, leverage limits, and contract specifications.",
  },
  {
    number: "02",
    title: "Pick Your Instrument",
    description:
      "Select the pair or index you want to trade. Each instrument has calibrated pip values, tick sizes, and margin rates.",
  },
  {
    number: "03",
    title: "Get Your Safe Lot Size",
    description:
      "Enter your stop loss in pips and see your maximum safe position size, dollar risk, and drawdown impact instantly.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* ── Hero Section ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Gradient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-48 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/[0.07] blur-[120px]" />
          <div className="absolute -top-24 left-1/3 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-amber-500/[0.05] blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-28 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
            <Shield className="h-4 w-4" />
            Prop Firm Risk Management
          </div>

          <h1 className="mb-4 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-400 bg-clip-text text-transparent">
              PropGuard
            </span>{" "}
            Risk Hub
          </h1>

          <p className="mx-auto mb-3 max-w-2xl text-xl font-medium text-slate-300 sm:text-2xl">
            Zero-error position sizing for prop firm traders
          </p>

          <p className="mx-auto mb-10 max-w-xl text-base text-slate-400">
            Stop guessing your lot sizes. PropGuard calculates the exact safe
            position for every firm, every instrument — so you never blow a
            drawdown limit again.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="#calculators"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500"
            >
              Open Calculators
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/60 px-6 py-3 font-semibold text-slate-300 transition hover:border-slate-600 hover:text-white"
            >
              How It Works
            </Link>
          </div>

          {/* Top MyBid Ad Banner */}
          <div className="mt-12 max-w-4xl mx-auto">
            <AdSlot slotId="top-leaderboard" bannerId="2031283" className="min-h-[90px]" />
          </div>
        </div>
      </section>

      {/* ── Calculator Grid ─────────────────────────────────────────── */}
      <section id="calculators" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-3xl font-bold tracking-tight">
            Choose Your Calculator
          </h2>
          <p className="text-slate-400">
            Select a firm &times; instrument combination to get started
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {firms.map((firm) => {
            const a = accentMap[firm.accent];
            return instruments.map((inst) => (
              <Link
                key={`${firm.slug}-${inst.slug}`}
                href={`/calculators/${firm.slug}/${inst.slug}`}
                className={`group relative rounded-xl border ${a.border} bg-slate-900/70 p-5 transition hover:border-opacity-60 hover:bg-slate-800/80`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-semibold ${a.badge}`}
                  >
                    {firm.name}
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-slate-400" />
                </div>
                <p className="text-lg font-bold text-white">{inst.name}</p>
                <p className="text-sm text-slate-500">{inst.label}</p>
              </Link>
            ));
          })}
        </div>
      </section>

      {/* ── Quick Links by Firm ─────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-3xl font-bold tracking-tight">
            Quick Links by Firm
          </h2>
          <p className="text-slate-400">
            Jump straight to your prop firm&apos;s calculators
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {firms.map((firm) => {
            const a = accentMap[firm.accent];
            return (
              <div
                key={firm.slug}
                className={`rounded-xl border ${a.border} bg-slate-900/60 p-6`}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${a.bg}`}
                  >
                    <BarChart3 className={`h-5 w-5 ${a.text}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {firm.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Daily&nbsp;{firm.maxDaily} &middot; Max&nbsp;
                      {firm.maxTotal} drawdown
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {instruments.map((inst) => (
                    <Link
                      key={inst.slug}
                      href={`/calculators/${firm.slug}/${inst.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-800/50 px-3 py-1.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-white"
                    >
                      <Target className="h-3.5 w-3.5 text-slate-500" />
                      {inst.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────── */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-3xl font-bold tracking-tight">
            How It Works
          </h2>
          <p className="text-slate-400">
            Three steps to risk-perfect position sizing
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <span className="mb-4 block text-5xl font-black text-emerald-500/20">
                {step.number}
              </span>
              <h3 className="mb-2 text-xl font-bold text-white">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-3xl font-bold tracking-tight">
            Built for Serious Traders
          </h2>
          <p className="text-slate-400">
            Every detail designed to keep your funded account alive
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition hover:border-slate-700"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Icon className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="mb-1 text-lg font-bold text-white">
                  {feat.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800/60 py-10 text-center text-sm text-slate-500">
        <p className="mb-1">
          <span className="font-semibold text-slate-400">PropGuard</span> Risk
          Hub &mdash; free &amp; open-source
        </p>
        <p>
          Not affiliated with any prop firm. Use at your own discretion.
        </p>
      </footer>
    </div>
  );
}
