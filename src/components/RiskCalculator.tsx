"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Shield,
  AlertTriangle,
  AlertOctagon,
  TrendingDown,
  Calculator,
  ChevronDown,
  DollarSign,
  BarChart3,
  Activity,
  Layers,
  Info,
  Copy,
  Check,
  Target,
} from "lucide-react";
import { calculatePropRisk, type RiskOutput } from "@/lib/riskMath";
import type { PropFirm, Instrument, SeoMatrix } from "@/lib/types";

interface RiskCalculatorProps {
  defaultFirm: PropFirm;
  defaultPair: Instrument;
  allData: SeoMatrix;
}

const RISK_PRESETS = [0.25, 0.5, 1.0, 2.0];
const SL_MODES = ["Pips", "Points", "Price Change"] as const;
type SLMode = (typeof SL_MODES)[number];
type RiskMode = "percentage" | "fixed";
const RR_RATIOS = [1, 1.5, 2, 3];

function useLocalStorage<T>(key: string, fallback: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(fallback);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) setValue(JSON.parse(stored));
    } catch {}
  }, [key]);
  const set = useCallback(
    (v: T) => {
      setValue(v);
      try {
        localStorage.setItem(key, JSON.stringify(v));
      } catch {}
    },
    [key]
  );
  return [value, set];
}

export default function RiskCalculator({
  defaultFirm,
  defaultPair,
  allData,
}: RiskCalculatorProps) {
  const [firmSlug, setFirmSlug] = useLocalStorage("pg_firm", defaultFirm.slug);
  const [pairSlug, setPairSlug] = useLocalStorage("pg_pair", defaultPair.slug);
  const [accountSize, setAccountSize] = useLocalStorage("pg_acctSize", 100000);
  const [customBalance, setCustomBalance] = useState("");
  const [useCustomBalance, setUseCustomBalance] = useState(false);
  const [equity, setEquity] = useState("");

  // Risk Mode: Percentage vs Fixed $
  const [riskMode, setRiskMode] = useState<RiskMode>("percentage");
  const [riskPct, setRiskPct] = useLocalStorage("pg_risk", 0.5);
  const [customRiskPct, setCustomRiskPct] = useState("");
  const [fixedRiskUsd, setFixedRiskUsd] = useState(500);

  // Stop Loss & Buffer
  const [slMode, setSLMode] = useState<SLMode>("Pips");
  const [slValue, setSLValue] = useLocalStorage("pg_sl", 0);
  const [spreadBuffer, setSpreadBuffer] = useState("");

  // Risk to Reward target
  const [riskReward, setRiskReward] = useState(2);
  const [copied, setCopied] = useState(false);

  const firm = useMemo(
    () => allData.propFirms.find((f) => f.slug === firmSlug) ?? defaultFirm,
    [firmSlug, allData, defaultFirm]
  );
  const pair = useMemo(
    () => allData.instruments.find((p) => p.slug === pairSlug) ?? defaultPair,
    [pairSlug, allData, defaultPair]
  );

  // Set defaults when pair changes
  useEffect(() => {
    setSLValue(pair.defaultStopLossPips);
    setSpreadBuffer(String(pair.typicalSpreadPips));
  }, [pair, setSLValue]);

  const effectiveBalance = useCustomBalance
    ? Number(customBalance) || 100000
    : accountSize;
  const effectiveEquity =
    equity !== "" ? Number(equity) || effectiveBalance : effectiveBalance;

  const effectiveRiskPct =
    customRiskPct !== "" ? Number(customRiskPct) || 0.5 : riskPct;

  // Convert SL value to pips based on mode
  const slInPips = useMemo(() => {
    if (slMode === "Pips") return slValue;
    if (slMode === "Points") return slValue * (pair.pointSize / pair.pipSize);
    return pair.pipSize > 0 ? slValue / pair.pipSize : slValue;
  }, [slValue, slMode, pair]);

  const result: RiskOutput = useMemo(
    () =>
      calculatePropRisk({
        accountBalance: effectiveBalance,
        currentEquity: effectiveEquity,
        riskPercentage: riskMode === "percentage" ? effectiveRiskPct : undefined,
        fixedRiskUsd: riskMode === "fixed" ? fixedRiskUsd : undefined,
        stopLossPips: slInPips,
        spreadPips: Number(spreadBuffer) || pair.typicalSpreadPips,
        pipValuePerLotUsd: pair.pipValuePerStandardLotUsd,
        commissionPerLotUsd: firm.defaultCommissionPerLotUsd,
        dailyDrawdownPct: firm.dailyDrawdownPct,
        maxDrawdownPct: firm.maxDrawdownPct,
      }),
    [
      effectiveBalance,
      effectiveEquity,
      riskMode,
      effectiveRiskPct,
      fixedRiskUsd,
      slInPips,
      spreadBuffer,
      pair,
      firm,
    ]
  );

  // Projected TP profit
  const projectedProfitUsd = result.actualStopLossUsd * riskReward;
  const targetPhase1Usd = effectiveBalance * (firm.profitTargetStep1Pct / 100);

  const handleCopySetup = () => {
    const text = [
      `PropGuard Risk Setup — ${firm.name} (${firm.programName})`,
      `Instrument: ${pair.symbol} (${pair.displayName})`,
      `Account Size: $${effectiveBalance.toLocaleString()}`,
      `Risk: ${result.effectiveRiskPercentage.toFixed(2)}% ($${result.targetRiskUsd.toFixed(2)})`,
      `Position Size: ${result.recommendedLots.toFixed(2)} Standard Lots (${result.miniLots.toFixed(1)} mini / ${result.microLots} micro)`,
      `Stop Loss: ${slValue} ${slMode} | Spread Buffer: ${spreadBuffer} pips`,
      `True Dollar Risk: $${result.totalRiskWithCostsUsd.toFixed(2)}`,
      `Daily Drawdown Consumed: ${result.dailyDrawdownUsedPct.toFixed(1)}% (${result.consecutiveLossesToDailyBreach} full losses to breach)`,
      `Risk Status: ${result.riskStatus}`,
    ].join("\n");

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const statusColor =
    result.riskStatus === "DANGER"
      ? "rose"
      : result.riskStatus === "CAUTION"
      ? "amber"
      : "emerald";

  const StatusIcon =
    result.riskStatus === "DANGER"
      ? AlertOctagon
      : result.riskStatus === "CAUTION"
      ? AlertTriangle
      : Shield;

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-6">
      {/* ── Left: Calculator Inputs + Results ── */}
      <div className="space-y-6">
        {/* Firm & Pair Selectors */}
        <div className="grid sm:grid-cols-2 gap-4">
          <SelectField
            label="Prop Firm & Program"
            icon={<Layers className="w-4 h-4 text-emerald-400" />}
            value={firmSlug}
            onChange={(v) => setFirmSlug(v)}
            options={allData.propFirms.map((f) => ({
              value: f.slug,
              label: `${f.name} — ${f.programName}`,
            }))}
          />
          <SelectField
            label="Instrument"
            icon={<BarChart3 className="w-4 h-4 text-sky-400" />}
            value={pairSlug}
            onChange={(v) => setPairSlug(v)}
            options={allData.instruments.map((i) => ({
              value: i.slug,
              label: `${i.symbol} — ${i.displayName}`,
            }))}
          />
        </div>

        {/* Account Balance */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Account Balance
            </h3>
            <span className="text-xs text-slate-500">
              Drawdown Floor: ${((1 - firm.maxDrawdownPct / 100) * effectiveBalance).toLocaleString()}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {firm.accountSizes.map((size) => (
              <button
                key={size}
                onClick={() => {
                  setAccountSize(size);
                  setUseCustomBalance(false);
                }}
                className={`px-3 py-1.5 text-sm rounded-lg border font-medium transition-all ${
                  !useCustomBalance && accountSize === size
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                    : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600"
                }`}
              >
                ${size.toLocaleString()}
              </button>
            ))}
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Custom $"
                value={customBalance}
                onChange={(e) => {
                  setCustomBalance(e.target.value);
                  setUseCustomBalance(true);
                }}
                onFocus={() => setUseCustomBalance(true)}
                className="w-32 px-3 py-1.5 text-sm bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Current Equity (Drawdown Buffer tracker) */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">
              Current Account Equity (optional — enter your live balance to check intraday drawdown remaining)
            </label>
            <input
              type="number"
              placeholder={`$${effectiveBalance.toLocaleString()} (default)`}
              value={equity}
              onChange={(e) => setEquity(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none"
            />
          </div>
        </div>

        {/* Risk Per Trade (Toggle: % of Balance vs Fixed $) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              Risk Per Trade
            </h3>

            {/* Toggle */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setRiskMode("percentage")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  riskMode === "percentage"
                    ? "bg-amber-500/20 text-amber-400 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                % of Balance
              </button>
              <button
                type="button"
                onClick={() => setRiskMode("fixed")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  riskMode === "fixed"
                    ? "bg-amber-500/20 text-amber-400 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Fixed Dollar ($)
              </button>
            </div>
          </div>

          {riskMode === "percentage" ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {RISK_PRESETS.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRiskPct(r);
                      setCustomRiskPct("");
                    }}
                    className={`px-3.5 py-1.5 text-sm rounded-lg border font-medium transition-all ${
                      customRiskPct === "" && riskPct === r
                        ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                        : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    {r}%
                  </button>
                ))}
                <input
                  type="number"
                  step="0.05"
                  placeholder="Custom %"
                  value={customRiskPct}
                  onChange={(e) => setCustomRiskPct(e.target.value)}
                  className="w-24 px-3 py-1.5 text-sm bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:border-amber-500/50 focus:outline-none"
                />
              </div>

              {/* Slider */}
              <div className="space-y-1 pt-1">
                <input
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.05"
                  value={effectiveRiskPct}
                  onChange={(e) => {
                    setRiskPct(Number(e.target.value));
                    setCustomRiskPct("");
                  }}
                  className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>0.1% (Conservative)</span>
                  <span className="text-amber-400 font-semibold">
                    {effectiveRiskPct.toFixed(2)}% ($
                    {(effectiveBalance * (effectiveRiskPct / 100)).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    )
                  </span>
                  <span>3.0% (Aggressive)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                  <input
                    type="number"
                    step="50"
                    value={fixedRiskUsd}
                    onChange={(e) => setFixedRiskUsd(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-7 pr-3 py-2 text-sm bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 focus:border-amber-500/50 focus:outline-none"
                  />
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap">
                  = {result.effectiveRiskPercentage.toFixed(2)}% of balance
                </span>
              </div>
              <input
                type="range"
                min="50"
                max={effectiveBalance * 0.05}
                step="50"
                value={fixedRiskUsd}
                onChange={(e) => setFixedRiskUsd(Number(e.target.value))}
                className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Stop Loss Distance */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-400" />
              Stop-Loss Distance &amp; Cost Buffer
            </h3>
            <span className="text-xs text-slate-500">
              1 pip = ${pair.pipValuePerStandardLotUsd.toFixed(2)} / lot
            </span>
          </div>

          <div className="flex gap-2">
            {SL_MODES.map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setSLMode(mode);
                  if (mode === "Pips") setSLValue(pair.defaultStopLossPips);
                  else if (mode === "Points")
                    setSLValue(pair.defaultStopLossPips * (pair.pipSize / pair.pointSize));
                  else setSLValue(pair.defaultStopLossPips * pair.pipSize);
                }}
                className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-all ${
                  slMode === mode
                    ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                    : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                Stop-Loss ({slMode})
              </label>
              <input
                type="number"
                step="0.1"
                value={slValue}
                onChange={(e) => setSLValue(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 focus:border-rose-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                Spread Buffer ({pair.symbol} pips)
              </label>
              <input
                type="number"
                step="0.1"
                value={spreadBuffer}
                onChange={(e) => setSpreadBuffer(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 focus:border-rose-500/50 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* ── Results Panel ── */}
        <div
          className={`bg-slate-900/60 border rounded-2xl p-5 space-y-5 transition-colors ${
            result.riskStatus === "DANGER"
              ? "border-rose-500/40"
              : result.riskStatus === "CAUTION"
              ? "border-amber-500/40"
              : "border-slate-800"
          }`}
        >
          {/* Header & Status Badge */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-sky-400" />
              Calculated Position Sizing
            </h3>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopySetup}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
                title="Copy Trade Setup to Clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Setup</span>
                  </>
                )}
              </button>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full ${
                  result.riskStatus === "DANGER"
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    : result.riskStatus === "CAUTION"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                }`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                {result.riskStatus}
              </span>
            </div>
          </div>

          {/* Lot Size Output Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ResultCard
              label="Standard Lots"
              value={result.recommendedLots.toFixed(2)}
              highlight
            />
            <ResultCard
              label="Mini Lots"
              value={result.miniLots.toFixed(1)}
            />
            <ResultCard
              label="Micro Lots"
              value={String(result.microLots)}
            />
            <ResultCard
              label="Contract Units"
              value={(result.recommendedLots * pair.contractSize).toLocaleString()}
            />
          </div>

          {/* Dollar Risk Breakdown */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-500">Stop-Loss Risk</div>
              <div className="text-lg font-bold text-slate-200">
                ${result.actualStopLossUsd.toFixed(2)}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-500">Spread + Comm</div>
              <div className="text-lg font-bold text-slate-200">
                ${result.estimatedExecutionCostUsd.toFixed(2)}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-500">True Dollar Risk</div>
              <div
                className={`text-lg font-bold ${
                  result.riskStatus === "DANGER"
                    ? "text-rose-400"
                    : result.riskStatus === "CAUTION"
                    ? "text-amber-400"
                    : "text-emerald-400"
                }`}
              >
                ${result.totalRiskWithCostsUsd.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Take Profit Target Projection (RR Target) */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                Target Risk-to-Reward (RR)
              </span>
              <div className="flex gap-1.5">
                {RR_RATIOS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRiskReward(r)}
                    className={`px-2 py-0.5 rounded text-[11px] border ${
                      riskReward === r
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 font-semibold"
                        : "border-slate-800 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    1:{r}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-slate-500">
                Target TP Gain ({riskReward}R):{" "}
                <strong className="text-emerald-400">
                  +${projectedProfitUsd.toFixed(2)}
                </strong>
              </span>
              {firm.profitTargetStep1Pct > 0 && (
                <span className="text-slate-500">
                  Covers {(projectedProfitUsd / targetPhase1Usd * 100).toFixed(1)}% of Phase 1
                </span>
              )}
            </div>
          </div>

          {/* Daily Drawdown Survival Meter */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">
                Daily Drawdown Usage (This Trade)
              </span>
              <span
                className={`font-bold ${
                  result.riskStatus === "DANGER"
                    ? "text-rose-400"
                    : result.riskStatus === "CAUTION"
                    ? "text-amber-400"
                    : "text-emerald-400"
                }`}
              >
                {Math.min(result.dailyDrawdownUsedPct, 100).toFixed(1)}%
              </span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  result.riskStatus === "DANGER"
                    ? "bg-rose-500"
                    : result.riskStatus === "CAUTION"
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
                style={{
                  width: `${Math.min(result.dailyDrawdownUsedPct, 100)}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>
                Daily Cap: ${result.dailyLossCapUsd.toLocaleString()} | Remaining Buffer: ${result.remainingDailyBufferUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
              <span className="font-semibold text-sky-400">
                {result.consecutiveLossesToDailyBreach} losses to breach
              </span>
            </div>
          </div>

          {/* Amber Warning: > 30% */}
          {result.riskStatus === "CAUTION" && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-400">
                  Prop-Firm Caution: &gt;30% Daily Drawdown Consumed
                </p>
                <p className="text-xs text-amber-300/80 mt-1 leading-relaxed">
                  This single trade consumes{" "}
                  <strong>{result.dailyDrawdownUsedPct.toFixed(1)}%</strong> of your remaining daily loss limit.{" "}
                  <strong>{result.consecutiveLossesToDailyBreach} consecutive full losses</strong> at this position size will breach {firm.name}&apos;s {firm.dailyDrawdownPct}% daily limit.
                </p>
              </div>
            </div>
          )}

          {/* Red Alert: > 50% */}
          {result.riskStatus === "DANGER" && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-rose-400">
                  Prop-Firm Danger: &gt;50% Daily Drawdown Consumed
                </p>
                <p className="text-xs text-rose-300/80 mt-1 leading-relaxed">
                  CRITICAL: This trade commits{" "}
                  <strong>{result.dailyDrawdownUsedPct.toFixed(1)}%</strong> of your daily drawdown limit. Just{" "}
                  <strong>{result.consecutiveLossesToDailyBreach} consecutive loss</strong> will trigger an account breach on {firm.name}. Reduce your risk percentage or lot size immediately to preserve your funded status.
                </p>
              </div>
            </div>
          )}

          {/* Firm Info Rule Snippet */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800/50">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-500 leading-relaxed">
              <strong className="text-slate-400">{firm.name} Specifications:</strong>{" "}
              {firm.ruleNotes} Daily reset: <span className="text-slate-400">{firm.dailyResetRule}</span>.
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Sidebar Ad Slot + Pair Specifications ── */}
      <aside className="hidden lg:block">
        <div className="sticky top-20 space-y-4">
          <AdSlotInline slotId="sidebar-rectangle" className="min-h-[250px]" />
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <h4 className="text-xs font-semibold text-slate-400 mb-2">
              {pair.symbol} Contract Specifications
            </h4>
            <dl className="space-y-1.5 text-xs">
              <SpecRow label="Asset Class" value={pair.assetClass} />
              <SpecRow
                label="Contract Size"
                value={`${pair.contractSize.toLocaleString()} ${pair.unitLabel}`}
              />
              <SpecRow label="Pip Size" value={String(pair.pipSize)} />
              <SpecRow
                label="Pip Value / Std Lot"
                value={`$${pair.pipValuePerStandardLotUsd.toFixed(2)}`}
              />
              <SpecRow label="Avg Spread" value={`${pair.typicalSpreadPips} pips`} />
              <SpecRow
                label="Commission"
                value={`$${firm.defaultCommissionPerLotUsd.toFixed(2)}/lot RT`}
              />
            </dl>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ── Helpers ── */

function SelectField({
  label,
  icon,
  value,
  onChange,
  options,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
        {icon}
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:border-emerald-500/50 focus:outline-none cursor-pointer"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-3 rounded-xl border ${
        highlight
          ? "bg-emerald-500/10 border-emerald-500/20"
          : "bg-slate-950 border-slate-800"
      }`}
    >
      <div className="text-xs text-slate-500">{label}</div>
      <div
        className={`text-xl font-bold mt-0.5 ${
          highlight ? "text-emerald-400" : "text-slate-200"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-slate-300 font-medium">{value}</dd>
    </div>
  );
}

function AdSlotInline({
  slotId,
  className = "",
}: {
  slotId: string;
  className?: string;
}) {
  const isDev = process.env.NODE_ENV === "development";
  return (
    <div
      className={`flex items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/30 text-slate-600 text-xs ${className}`}
      data-ad-slot={slotId}
    >
      {isDev ? (
        <span className="select-none">Ad Slot: {slotId}</span>
      ) : (
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", height: "100%" }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
