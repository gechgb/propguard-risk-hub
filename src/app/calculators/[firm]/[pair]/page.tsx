import { Metadata } from "next";
import { notFound } from "next/navigation";
import seoMatrix from "@/data/prop-seo-matrix.json";
import { calculatePropRisk } from "@/lib/riskMath";
import RiskCalculator from "@/components/RiskCalculator";
import AdSlot from "@/components/AdSlot";
import FaqAccordion from "@/components/FaqAccordion";
import type { PropFirm, Instrument, SeoMatrix } from "@/lib/types";

interface PageProps {
  params: Promise<{ firm: string; pair: string }>;
}

const data = seoMatrix as SeoMatrix;

// 1. Pre-build all Firm × Instrument combinations as static HTML (SSG)
export async function generateStaticParams() {
  const paths: { firm: string; pair: string }[] = [];
  for (const firm of data.propFirms) {
    for (const pair of data.instruments) {
      paths.push({ firm: firm.slug, pair: pair.slug });
    }
  }
  return paths;
}

// 2. Dynamic High-CTR SEO Metadata per page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { firm: firmSlug, pair: pairSlug } = await params;
  const firm = data.propFirms.find((f) => f.slug === firmSlug);
  const pair = data.instruments.find((p) => p.slug === pairSlug);
  if (!firm || !pair) return {};

  return {
    title: `${firm.name} ${pair.symbol} Lot Size & Drawdown Calculator (2026 Rules)`,
    description: `Calculate exact ${pair.symbol} lot sizes for your ${firm.name} funded account. Stay inside the ${firm.dailyDrawdownPct}% daily drawdown limit with spread & commission buffers.`,
    openGraph: {
      title: `${firm.name} ${pair.symbol} Lot Size Calculator — PropGuard Risk Hub`,
      description: `Zero-error position sizing for ${pair.displayName} on ${firm.programName}. Includes real-time drawdown survival tracking.`,
      type: "website",
    },
  };
}

export default async function PropPairCalculatorPage({ params }: PageProps) {
  const { firm: firmSlug, pair: pairSlug } = await params;
  const firm = data.propFirms.find((f) => f.slug === firmSlug);
  const pair = data.instruments.find((p) => p.slug === pairSlug);

  if (!firm || !pair) notFound();

  // Pre-compute a worked $100,000 example for crawlers & AdSense reviewers
  const workedExample = calculatePropRisk({
    accountBalance: 100000,
    currentEquity: 100000,
    riskPercentage: 0.5,
    stopLossPips: pair.defaultStopLossPips,
    spreadPips: pair.typicalSpreadPips,
    pipValuePerLotUsd: pair.pipValuePerStandardLotUsd,
    commissionPerLotUsd: firm.defaultCommissionPerLotUsd,
    dailyDrawdownPct: firm.dailyDrawdownPct,
    maxDrawdownPct: firm.maxDrawdownPct,
  });

  // Build FAQ items
  const faqItems = [
    {
      question: `What is the ideal ${pair.symbol} lot size for a $100,000 ${firm.name} account?`,
      answer: `Risking 0.5% ($500) on a $100,000 ${firm.name} account with a ${pair.defaultStopLossPips}-pip stop loss and ${pair.typicalSpreadPips}-pip spread on ${pair.symbol} gives a position size of ${workedExample.recommendedLots.toFixed(2)} standard lots (${workedExample.miniLots.toFixed(1)} mini lots / ${workedExample.microLots} micro lots). This allows ${workedExample.consecutiveLossesToDailyBreach} consecutive losses before hitting ${firm.name}'s ${firm.dailyDrawdownPct}% daily loss limit.`,
    },
    {
      question: `How does ${firm.name} calculate daily drawdown when trading ${pair.symbol}?`,
      answer: firm.ruleNotes,
    },
    {
      question: `What is the difference between static and trailing drawdown for ${firm.name}?`,
      answer: `${firm.name} uses a ${firm.drawdownType} drawdown model. ${
        firm.drawdownType.toLowerCase().includes("static")
          ? `With a static drawdown, your maximum loss limit remains fixed at ${firm.maxDrawdownPct}% of your initial account balance regardless of profits. This means on a $100,000 account, your absolute floor is $${(100000 * (1 - firm.maxDrawdownPct / 100)).toLocaleString()} — even if your equity grows to $110,000.`
          : `With a trailing drawdown, the loss limit moves up as your account reaches new equity highs. This means profitable trades effectively reduce your available drawdown buffer, making risk management more critical during winning streaks.`
      } The daily drawdown of ${firm.dailyDrawdownPct}% resets at ${firm.dailyResetRule}.`,
    },
    {
      question: `How much is 1 pip worth on ${pair.symbol}?`,
      answer: `On ${pair.displayName}, 1 pip (${pair.pipSize} price movement) is worth $${pair.pipValuePerStandardLotUsd.toFixed(2)} per standard lot (${pair.contractSize.toLocaleString()} ${pair.unitLabel}). For mini lots (0.10), 1 pip = $${(pair.pipValuePerStandardLotUsd * 0.1).toFixed(2)}. For micro lots (0.01), 1 pip = $${(pair.pipValuePerStandardLotUsd * 0.01).toFixed(2)}.`,
    },
    {
      question: `Should I include spread and commission when calculating lot size for ${firm.name}?`,
      answer: `Absolutely. ${pair.symbol} has a typical spread of ${pair.typicalSpreadPips} pips ($${(pair.typicalSpreadPips * pair.pipValuePerStandardLotUsd).toFixed(2)} per standard lot), and ${firm.name} charges $${firm.defaultCommissionPerLotUsd.toFixed(2)} per lot round-turn in commission. Failing to account for these costs can push your actual risk ${((pair.typicalSpreadPips * pair.pipValuePerStandardLotUsd + firm.defaultCommissionPerLotUsd) / (pair.defaultStopLossPips * pair.pipValuePerStandardLotUsd) * 100).toFixed(1)}% higher than intended, potentially causing accidental drawdown breaches.`,
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `PropGuard ${firm.name} ${pair.symbol} Risk Calculator`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: `Free ${pair.symbol} position size calculator for ${firm.name} funded accounts with real-time drawdown tracking.`,
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <header className="space-y-3">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
            {firm.programName} &bull; {pair.assetClass} Risk Engine
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {firm.name} {pair.symbol} Position Size &amp; Drawdown Calculator
          </h1>
          <p className="text-slate-400 max-w-3xl">
            Calculate your exact {pair.displayName} lot size while factoring in{" "}
            {firm.name}&apos;s{" "}
            <strong className="text-slate-200">
              {firm.dailyDrawdownPct}% daily drawdown
            </strong>{" "}
            and{" "}
            <strong className="text-slate-200">
              {firm.maxDrawdownPct}% maximum loss limit
            </strong>
            . Includes spread, commission, and consecutive-loss analysis.
          </p>
        </header>

        {/* Top MyBid Banner Ad */}
        <AdSlot slotId="top-leaderboard" bannerId="2031283" className="min-h-[90px]" />

        {/* Interactive Client Calculator + Side Ad Unit */}
        <RiskCalculator
          defaultFirm={firm as PropFirm}
          defaultPair={pair as Instrument}
          allData={data}
        />

        {/* ── Programmatic SEO Documentation ── */}
        <article className="prose prose-invert max-w-none bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-8">
          {/* Section 1: Formula & Contract Specification */}
          <section>
            <h2 className="text-2xl font-semibold text-white">
              {pair.symbol} Contract Specification &amp; Lot Size Formula for{" "}
              {firm.name}
            </h2>
            <p className="text-slate-300 leading-relaxed">
              {pair.seoDescription}
            </p>
            <p className="text-slate-300 leading-relaxed">
              The exact lot size formula used by PropGuard for any prop firm
              account is:
            </p>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-sm text-emerald-400 overflow-x-auto">
              Lot Size = floor( (Account Balance × Risk%) / ((Stop Loss Pips +
              Spread Pips) × Pip Value + Commission per Lot) × 100 ) / 100
            </div>
            <p className="text-slate-300 leading-relaxed mt-4">
              The result is always <strong>floored to the nearest 0.01 lot</strong>{" "}
              (micro lot) to ensure you never exceed your intended dollar risk.
              This is critical for prop firm compliance where even a $0.01
              overshoot can be flagged.
            </p>

            {/* Contract Spec Table */}
            <div className="overflow-x-auto mt-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-left text-slate-400">
                    <th className="pb-2 pr-4">Specification</th>
                    <th className="pb-2">{pair.symbol} Value</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2 pr-4 text-slate-400">Symbol</td>
                    <td className="py-2 font-medium">{pair.symbol}</td>
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2 pr-4 text-slate-400">Asset Class</td>
                    <td className="py-2">{pair.assetClass}</td>
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2 pr-4 text-slate-400">
                      Standard Lot Contract Size
                    </td>
                    <td className="py-2">
                      {pair.contractSize.toLocaleString()} {pair.unitLabel}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2 pr-4 text-slate-400">1 Pip</td>
                    <td className="py-2">{pair.pipSize} price movement</td>
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2 pr-4 text-slate-400">
                      Pip Value (1.00 Std Lot)
                    </td>
                    <td className="py-2">
                      ${pair.pipValuePerStandardLotUsd.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2 pr-4 text-slate-400">1 Point</td>
                    <td className="py-2">{pair.pointSize} price movement</td>
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2 pr-4 text-slate-400">
                      Point Value (1.00 Std Lot)
                    </td>
                    <td className="py-2">
                      ${pair.pointValuePerStandardLotUsd.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-slate-400">
                      Typical Spread
                    </td>
                    <td className="py-2">{pair.typicalSpreadPips} pips</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 2: Worked Example */}
          <section>
            <h2 className="text-2xl font-semibold text-white">
              Worked Example: $100,000 {firm.name} Account Trading{" "}
              {pair.symbol} at 0.5% Risk
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Let&apos;s walk through a complete lot size and drawdown
              calculation for a trader with a $100,000 {firm.programName}{" "}
              account trading {pair.displayName} with a 0.5% risk per trade and
              a {pair.defaultStopLossPips}-pip stop loss.
            </p>
            <ol className="list-decimal list-inside space-y-3 text-slate-300 leading-relaxed">
              <li>
                <strong className="text-slate-200">
                  Calculate Target Dollar Risk:
                </strong>{" "}
                $100,000 × 0.5% = $
                {workedExample.targetRiskUsd.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </li>
              <li>
                <strong className="text-slate-200">
                  Effective Stop-Loss Including Spread:
                </strong>{" "}
                {pair.defaultStopLossPips} pips (SL) + {pair.typicalSpreadPips}{" "}
                pips (spread) ={" "}
                {(pair.defaultStopLossPips + pair.typicalSpreadPips).toFixed(1)}{" "}
                effective pips
              </li>
              <li>
                <strong className="text-slate-200">
                  Dollar Cost per 1.00 Lot if Stopped:
                </strong>{" "}
                ({(pair.defaultStopLossPips + pair.typicalSpreadPips).toFixed(1)}{" "}
                pips × ${pair.pipValuePerStandardLotUsd.toFixed(2)}/pip) + $
                {firm.defaultCommissionPerLotUsd.toFixed(2)} commission = $
                {(
                  (pair.defaultStopLossPips + pair.typicalSpreadPips) *
                    pair.pipValuePerStandardLotUsd +
                  firm.defaultCommissionPerLotUsd
                ).toFixed(2)}{" "}
                per lot
              </li>
              <li>
                <strong className="text-slate-200">
                  Raw Lot Calculation:
                </strong>{" "}
                ${workedExample.targetRiskUsd.toFixed(2)} ÷ $
                {(
                  (pair.defaultStopLossPips + pair.typicalSpreadPips) *
                    pair.pipValuePerStandardLotUsd +
                  firm.defaultCommissionPerLotUsd
                ).toFixed(2)}{" "}
                ={" "}
                {(
                  workedExample.targetRiskUsd /
                  ((pair.defaultStopLossPips + pair.typicalSpreadPips) *
                    pair.pipValuePerStandardLotUsd +
                    firm.defaultCommissionPerLotUsd)
                ).toFixed(4)}{" "}
                lots
              </li>
              <li>
                <strong className="text-slate-200">
                  Floor to Nearest 0.01:
                </strong>{" "}
                <span className="text-emerald-400 font-bold">
                  {workedExample.recommendedLots.toFixed(2)} standard lots
                </span>{" "}
                ({workedExample.miniLots.toFixed(1)} mini /{" "}
                {workedExample.microLots} micro)
              </li>
              <li>
                <strong className="text-slate-200">True Dollar Risk:</strong> $
                {workedExample.totalRiskWithCostsUsd.toFixed(2)} (SL: $
                {workedExample.actualStopLossUsd.toFixed(2)} + Costs: $
                {workedExample.estimatedExecutionCostUsd.toFixed(2)})
              </li>
            </ol>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-4 my-6">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">
                  0.5% Risk on $100K ({pair.defaultStopLossPips} Pips SL)
                </div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">
                  {workedExample.recommendedLots.toFixed(2)} Lots
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Includes {pair.typicalSpreadPips} pip spread &amp; $
                  {firm.defaultCommissionPerLotUsd}/lot comm
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">
                  {firm.name} Daily Loss Cap ({firm.dailyDrawdownPct}%)
                </div>
                <div className="text-2xl font-bold text-amber-400 mt-1">
                  ${workedExample.dailyLossCapUsd.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Reset: {firm.dailyResetRule}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">
                  Losses Before Daily Breach
                </div>
                <div className="text-2xl font-bold text-sky-400 mt-1">
                  {workedExample.consecutiveLossesToDailyBreach} Full Stops
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  At 0.5% risk per trade
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Static vs Trailing Drawdown */}
          <section>
            <h2 className="text-2xl font-semibold text-white">
              {firm.name} Drawdown Rules: {firm.drawdownType}
            </h2>
            <p className="text-slate-300 leading-relaxed">
              {firm.name}&apos;s {firm.programName} enforces a{" "}
              <strong className="text-slate-200">
                {firm.dailyDrawdownPct}% daily drawdown limit
              </strong>{" "}
              and a{" "}
              <strong className="text-slate-200">
                {firm.maxDrawdownPct}% maximum overall drawdown
              </strong>
              . The drawdown model is classified as:{" "}
              <span className="text-amber-400 font-semibold">
                {firm.drawdownType}
              </span>
              .
            </p>
            <p className="text-slate-300 leading-relaxed">
              {firm.ruleNotes} This means that on a $100,000 account, your daily
              loss limit is ${(100000 * firm.dailyDrawdownPct / 100).toLocaleString()}, and your absolute
              maximum drawdown floor is $
              {(100000 * (1 - firm.maxDrawdownPct / 100)).toLocaleString()}.
            </p>
            {firm.drawdownType.toLowerCase().includes("static") ? (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mt-4">
                <h3 className="text-sm font-semibold text-emerald-400 mb-2">
                  Static Drawdown Advantage
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  With static drawdown, your maximum loss limit stays anchored
                  to your initial balance. If you grow your $100,000 account to
                  $110,000, your absolute floor remains at $
                  {(100000 * (1 - firm.maxDrawdownPct / 100)).toLocaleString()}{" "}
                  — giving you an effective $
                  {(110000 - 100000 * (1 - firm.maxDrawdownPct / 100)).toLocaleString()}{" "}
                  buffer. This makes it progressively safer as you build profit.
                </p>
              </div>
            ) : (
              <div className="bg-slate-950 border border-rose-800/30 rounded-xl p-4 mt-4">
                <h3 className="text-sm font-semibold text-rose-400 mb-2">
                  Trailing Drawdown Warning
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  With trailing drawdown, your maximum loss floor rises with
                  every new equity high. If you grow from $100,000 to $110,000,
                  the floor rises to $
                  {(110000 * (1 - firm.maxDrawdownPct / 100)).toLocaleString()}.
                  This means a profitable trade followed by a series of losses
                  can breach the drawdown faster than expected. Always
                  recalculate your risk after hitting new highs.
                </p>
              </div>
            )}
            <p className="text-slate-300 leading-relaxed mt-4">
              For {pair.symbol} traders, it is important to note that{" "}
              {pair.assetClass.toLowerCase()} instruments can exhibit higher
              volatility than standard forex pairs. A sudden spike against your
              position can consume a large portion of the daily loss limit in
              seconds, especially during high-impact news events. Always use a
              hard stop loss and factor in the average spread of{" "}
              {pair.typicalSpreadPips} pips when setting your position size.
            </p>

            {/* Profit Target Info */}
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">
                  Phase 1 Profit Target
                </div>
                <div className="text-xl font-bold text-emerald-400 mt-1">
                  {firm.profitTargetStep1Pct}% ($
                  {(100000 * firm.profitTargetStep1Pct / 100).toLocaleString()})
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">
                  Phase 2 Profit Target
                </div>
                <div className="text-xl font-bold text-emerald-400 mt-1">
                  {firm.profitTargetStep2Pct}% ($
                  {(100000 * firm.profitTargetStep2Pct / 100).toLocaleString()})
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: FAQ Accordion */}
          <section>
            <h2 className="text-2xl font-semibold text-white">
              Frequently Asked Questions: {pair.symbol} on {firm.name}
            </h2>
            <div className="mt-4">
              <FaqAccordion items={faqItems} />
            </div>
          </section>
        </article>

        {/* Bottom MyBid Banner Ad */}
        <AdSlot slotId="bottom-leaderboard" bannerId="2031285" className="min-h-[90px]" />
      </div>
    </main>
  );
}

