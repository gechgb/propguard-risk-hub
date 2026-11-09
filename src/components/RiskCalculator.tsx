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
  Sparkles,
  ArrowRight,
  Clock,
  Sliders,
} from "lucide-react";
import { calculatePropRisk, type RiskOutput } from "@/lib/riskMath";
import type { PropFirm, Instrument, SeoMatrix } from "@/lib/types";

interface RiskCalculatorProps {
  defaultFirm: PropFirm;
  defaultPair: Instrument;
  allData: SeoMatrix;
}

const RISK_PRESETS = [0.25, 0.5, 1.0, 2.0];
const SL_MODES = ["Pips", "Points", "Price Move", "Price Levels"] as const;
type SLMode = (typeof SL_MODES)[number];
type RiskMode = "percentage" | "fixed";
const RR_RATIOS = [1, 1.5, 2, 3, 4];

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

  // Risk Mode
  const [riskMode, setRiskMode] = useState<RiskMode>("percentage");
  const [riskPct, setRiskPct] = useLocalStorage("pg_risk", 0.5);
  const [customRiskPct, setCustomRiskPct] = useState("");
  const [fixedRiskUsd, setFixedRiskUsd] = useState(500);

  // Stop Loss & Entry Levels
  const [slMode, setSLMode] = useState<SLMode>("Pips");
  const [slValue, setSLValue] = useLocalStorage("pg_sl", 0);
  const [entryPrice, setEntryPrice] = useState("");
  const [stopPrice, setStopPrice] = useState("");
  const [spreadBuffer, setSpreadBuffer] = useState("");

  // Risk Reward target
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

  // Sync pair defaults
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

  // Compute SL in pips depending on mode
  const slInPips = useMemo(() => {
    if (slMode === "Price Levels") {
      const e = parseFloat(entryPrice);
      const s = parseFloat(stopPrice);
      if (!isNaN(e) && !isNaN(s) && e !== s && pair.pipSize > 0) {
        return Math.abs(e - s) / pair.pipSize;
      }
      return pair.defaultStopLossPips;
    }
    if (slMode === "Pips") return slValue;
    if (slMode === "Points") return slValue * (pair.pointSize / pair.pipSize);
    return pair.pipSize > 0 ? slValue / pair.pipSize : slValue;
  }, [slValue, slMode, entryPrice, stopPrice, pair]);

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

  const projectedProfitUsd = result.actualStopLossUsd * riskReward;
  const targetPhase1Usd = effectiveBalance * (firm.profitTargetStep1Pct / 100);

  const handleCopySetup = () => {
    const text = [
      `🛡️ PropGuard Trade Setup`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `Firm: ${firm.name} (${firm.programName})`,
      `Pair: ${pair.symbol} (${pair.displayName})`,
      `Balance: $${effectiveBalance.toLocaleString()}`,
      `Risk: ${result.effectiveRiskPercentage.toFixed(2)}% ($${result.targetRiskUsd.toFixed(2)})`,
      `Position Size: ${result.recommendedLots.toFixed(2)} Standard Lots`,
      `Micro Lots: ${result.microLots} | Units: ${(result.recommendedLots * pair.contractSize).toLocaleString()}`,
      `Stop Loss: ${slInPips.toFixed(1)} Pips | Spread: ${spreadBuffer} pips`,
      `True Dollar Risk: $${result.totalRiskWithCostsUsd.toFixed(2)}`,
      `Daily Drawdown Consumed: ${result.dailyDrawdownUsedPct.toFixed(1)}%`,
      `Full Losses to Breach: ${result.consecutiveLossesToDailyBreach}`,
      `Status: ${result.riskStatus}`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `Calculated with PropGuard Risk Hub`,
    ].join("\n");

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const statusTheme = {
    SAFE: {
      badgeBg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
      barBg: "bg-gradient-to-r from-emerald-500 to-emerald-400",
      borderGlow: "border-slate-800 hover:border-emerald-500/30",
      text: "text-emerald-400",
      icon: Shield,
    },
    CAUTION: {
      badgeBg: "bg-amber-500/15 border-amber-500/30 text-amber-400",
      barBg: "bg-gradient-to-r from-amber-500 to-amber-400",
      borderGlow: "border-amber-500/30",
      text: "text-amber-400",
      icon: AlertTriangle,
    },
    DANGER: {
      badgeBg: "bg-rose-500/15 border-rose-500/30 text-rose-400",
      barBg: "bg-gradient-to-r from-rose-500 to-rose-400",
      borderGlow: "border-rose-500/40",
      text: "text-rose-400",
      icon: AlertOctagon,
    },
  }[result.riskStatus];

  const StatusIcon = statusTheme.icon;

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6">
      {/* ── Left Column: Configurator & Real-Time Engine ── */}
      <div className="space-y-6">
        {/* Institutional Firm & Instrument Selectors */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-900/40 border border-slate-800/80 shadow-2xl backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Evaluation Setup
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset: {firm.dailyResetRule}</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3.5">
            <SelectField
              label="Prop Trading Firm"
              icon={<Layers className="w-4 h-4 text-emerald-400" />}
              value={firmSlug}
              onChange={(v) => setFirmSlug(v)}
              options={allData.propFirms.map((f) => ({
                value: f.slug,
                label: `${f.name} — ${f.programName}`,
              }))}
            />
            <SelectField
              label="Instrument / Asset"
              icon={<BarChart3 className="w-4 h-4 text-sky-400" />}
              value={pairSlug}
              onChange={(v) => setPairSlug(v)}
              options={allData.instruments.map((i) => ({
                value: i.slug,
                label: `${i.symbol} (${i.displayName})`,
              }))}
            />
          </div>

          {/* Quick Specifications Tag Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
            <span className="px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-800 font-mono text-[11px]">
              Daily Loss: <strong className="text-amber-400">{firm.dailyDrawdownPct}%</strong>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-800 font-mono text-[11px]">
              Max Loss: <strong className="text-rose-400">{firm.maxDrawdownPct}%</strong>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-800 text-[11px]">
              Model: <strong className="text-slate-300">{firm.drawdownType}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-800 text-[11px]">
              1 Pip = <strong className="text-emerald-400">${pair.pipValuePerStandardLotUsd.toFixed(2)}</strong>/lot
            </span>
          </div>
        </div>

        {/* Account Size & Current Equity Card */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-slate-200">Starting Account Capital</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Drawdown Floor:{" "}
              <strong className="text-rose-400">
                ${((1 - firm.maxDrawdownPct / 100) * effectiveBalance).toLocaleString()}
              </strong>
            </span>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2">
            {firm.accountSizes.map((size) => {
              const isSelected = !useCustomBalance && accountSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setAccountSize(size);
                    setUseCustomBalance(false);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 border ${
                    isSelected
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/20"
                      : "bg-slate-950/70 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  ${size.toLocaleString()}
                </button>
              );
            })}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">$</span>
              <input
                type="number"
                placeholder="Custom Capital"
                value={customBalance}
                onChange={(e) => {
                  setCustomBalance(e.target.value);
                  setUseCustomBalance(true);
                }}
                onFocus={() => setUseCustomBalance(true)}
                className={`w-36 pl-6 pr-3 py-2 text-xs rounded-xl bg-slate-950/70 border transition-all focus:outline-none ${
                  useCustomBalance
                    ? "border-emerald-500/50 text-emerald-300 ring-1 ring-emerald-500/20"
                    : "border-slate-800/80 text-slate-300 placeholder-slate-600 focus:border-slate-700"
                }`}
              />
            </div>
          </div>

          {/* Intraday Account Equity */}
          <div className="pt-2 border-t border-slate-800/40">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs text-slate-400 flex items-center gap-1.5">
                <span>Current Account Equity (Optional)</span>
                <span className="text-[10px] text-slate-500">Live balance buffer tracking</span>
              </label>
              {equity !== "" && (
                <button
                  type="button"
                  onClick={() => setEquity("")}
                  className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Reset to starting
                </button>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">$</span>
              <input
                type="number"
                placeholder={`$${effectiveBalance.toLocaleString()} (Starting Balance)`}
                value={equity}
                onChange={(e) => setEquity(e.target.value)}
                className="w-full pl-7 pr-3 py-2 text-xs font-mono rounded-xl bg-slate-950/60 border border-slate-800/80 text-slate-200 placeholder-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
              />
            </div>

            {/* Dynamic Drawdown Recovery Mode Card */}
            {effectiveEquity < effectiveBalance && (
              <div className="mt-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                    <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
                    Drawdown Recovery Analysis
                  </span>
                  <span className="font-mono text-amber-400 font-bold">
                    -${(effectiveBalance - effectiveEquity).toLocaleString(undefined, { minimumFractionDigits: 2 })} (
                    {(((effectiveBalance - effectiveEquity) / effectiveBalance) * 100).toFixed(2)}% DD)
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block">Daily Buffer Left</span>
                    <span className="text-slate-200 font-semibold">${result.remainingDailyBufferUsd.toFixed(2)}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block">1:2 RR to Breakeven</span>
                    <span className="text-emerald-400 font-semibold">
                      {result.targetRiskUsd > 0
                        ? `${Math.ceil((effectiveBalance - effectiveEquity) / (result.targetRiskUsd * 2))} wins`
                        : "—"}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block">1:3 RR to Breakeven</span>
                    <span className="text-emerald-400 font-semibold">
                      {result.targetRiskUsd > 0
                        ? `${Math.ceil((effectiveBalance - effectiveEquity) / (result.targetRiskUsd * 3))} wins`
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Risk Budgeting Card (Toggle: % vs $) */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-slate-200">Risk Allocation</h3>
            </div>

            {/* Segmented Risk Mode Selector */}
            <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800/80 text-xs">
              <button
                type="button"
                onClick={() => setRiskMode("percentage")}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  riskMode === "percentage"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                % of Balance
              </button>
              <button
                type="button"
                onClick={() => setRiskMode("fixed")}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  riskMode === "fixed"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Fixed Dollar ($)
              </button>
            </div>
          </div>

          {riskMode === "percentage" ? (
            <div className="space-y-3.5">
              <div className="flex flex-wrap gap-2">
                {RISK_PRESETS.map((r) => {
                  const isSelected = customRiskPct === "" && riskPct === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setRiskPct(r);
                        setCustomRiskPct("");
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/20"
                          : "bg-slate-950/70 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                      }`}
                    >
                      {r}%
                    </button>
                  );
                })}
                <input
                  type="number"
                  step="0.05"
                  placeholder="Custom %"
                  value={customRiskPct}
                  onChange={(e) => setCustomRiskPct(e.target.value)}
                  className={`w-24 px-3 py-1.5 text-xs rounded-xl bg-slate-950/70 border transition-all focus:outline-none ${
                    customRiskPct !== ""
                      ? "border-amber-500/50 text-amber-300 ring-1 ring-amber-500/20"
                      : "border-slate-800/80 text-slate-300 placeholder-slate-600 focus:border-slate-700"
                  }`}
                />
              </div>

              {/* Modern Risk Slider with Context Markers */}
              <div className="space-y-1.5 pt-1">
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
                  className="w-full h-2 bg-slate-950 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>0.1% Conservative</span>
                  <span className="text-amber-400 font-bold">
                    {effectiveRiskPct.toFixed(2)}% ($
                    {(effectiveBalance * (effectiveRiskPct / 100)).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    )
                  </span>
                  <span>3.0% Aggressive</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">$</span>
                  <input
                    type="number"
                    step="50"
                    value={fixedRiskUsd}
                    onChange={(e) => setFixedRiskUsd(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-7 pr-3 py-2 text-xs font-mono rounded-xl bg-slate-950/70 border border-slate-800/80 text-slate-200 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/20"
                  />
                </div>
                <span className="text-xs font-mono text-slate-400 px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  = <strong className="text-amber-400">{result.effectiveRiskPercentage.toFixed(2)}%</strong> of balance
                </span>
              </div>
              <input
                type="range"
                min="50"
                max={Math.max(5000, effectiveBalance * 0.05)}
                step="50"
                value={fixedRiskUsd}
                onChange={(e) => setFixedRiskUsd(Number(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Stop-Loss Distance & Entry Calculator */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-semibold text-slate-200">Stop-Loss Parameters</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Active Distance: <strong className="text-rose-400">{slInPips.toFixed(1)} Pips</strong>
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800/80">
            {SL_MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSLMode(mode)}
                className={`py-1.5 text-center text-xs font-medium rounded-lg transition-all ${
                  slMode === mode
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {slMode === "Price Levels" ? (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">Entry Price</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 2650.00"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 focus:border-rose-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">Stop-Loss Price</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 2645.00"
                  value={stopPrice}
                  onChange={(e) => setStopPrice(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 focus:border-rose-500/50 focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">Distance ({slMode})</label>
                <input
                  type="number"
                  step="0.1"
                  value={slValue}
                  onChange={(e) => setSLValue(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 focus:border-rose-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">Spread Buffer ({pair.symbol} pips)</label>
                <input
                  type="number"
                  step="0.1"
                  value={spreadBuffer}
                  onChange={(e) => setSpreadBuffer(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 focus:border-rose-500/50 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Right Column: Institutional Terminal Results Card ── */}
      <div className="space-y-6">
        <div
          className={`p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border ${statusTheme.borderGlow} shadow-2xl backdrop-blur-xl space-y-5 transition-all duration-200`}
        >
          {/* Header & Status Indicator */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Sizing Engine Output
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopySetup}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-slate-300 hover:text-white border border-slate-700/70 transition-all cursor-pointer"
                title="Copy Trade Setup"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Setup</span>
                  </>
                )}
              </button>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ${statusTheme.badgeBg}`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                {result.riskStatus}
              </span>
            </div>
          </div>

          {/* Primary Position Size Hero Display */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Recommended Position Size
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-extrabold font-mono tracking-tight text-white tabular-nums">
                {result.recommendedLots.toFixed(2)}
              </span>
              <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                Standard Lots
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/60 text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[10px]">Mini Lots</span>
                <span className="text-slate-200 font-semibold">{result.miniLots.toFixed(1)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Micro Lots</span>
                <span className="text-slate-200 font-semibold">{result.microLots}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Contract Units</span>
                <span className="text-slate-200 font-semibold truncate block">
                  {(result.recommendedLots * pair.contractSize).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Dollar Risk & Friction Breakdown */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">SL Risk</span>
              <span className="text-sm font-bold font-mono text-slate-200 mt-0.5 block tabular-nums">
                ${result.actualStopLossUsd.toFixed(2)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Friction</span>
              <span className="text-sm font-bold font-mono text-slate-400 mt-0.5 block tabular-nums">
                ${result.estimatedExecutionCostUsd.toFixed(2)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">True Dollar</span>
              <span className={`text-sm font-bold font-mono ${statusTheme.text} mt-0.5 block tabular-nums`}>
                ${result.totalRiskWithCostsUsd.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Daily Drawdown Survival Gauge */}
          <div className="space-y-2.5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Daily Drawdown Consumed</span>
              <span className={`font-bold font-mono text-sm tabular-nums ${statusTheme.text}`}>
                {Math.min(result.dailyDrawdownUsedPct, 100).toFixed(1)}%
              </span>
            </div>

            {/* Segmented Visual Progress Track with 30% / 50% Tick Markers */}
            <div className="relative">
              <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${statusTheme.barBg}`}
                  style={{ width: `${Math.min(result.dailyDrawdownUsedPct, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>0% Safe</span>
                <span className="text-amber-500">30% Caution</span>
                <span className="text-rose-500">50% Breach Danger</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/40 flex justify-between items-center text-xs">
              <span className="text-slate-500">
                Daily Cap: <strong className="text-slate-300">${result.dailyLossCapUsd.toLocaleString()}</strong>
              </span>
              <span className="font-semibold font-mono text-sky-400">
                {result.consecutiveLossesToDailyBreach} full losses to breach
              </span>
            </div>
          </div>

          {/* Risk-to-Reward (RR) Take-Profit Planner */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                Target R:R Projection
              </span>
              <div className="inline-flex gap-1">
                {RR_RATIOS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRiskReward(r)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-all ${
                      riskReward === r
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold"
                        : "border-slate-800 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    1:{r}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center text-xs font-mono pt-1">
              <span className="text-slate-400">
                Gain ({riskReward}R):{" "}
                <strong className="text-emerald-400">+${projectedProfitUsd.toFixed(2)}</strong>
              </span>
              {firm.profitTargetStep1Pct > 0 && (
                <span className="text-slate-400">
                  Phase 1 Target:{" "}
                  <strong className="text-emerald-300">
                    {(projectedProfitUsd / targetPhase1Usd * 100).toFixed(1)}%
                  </strong>
                </span>
              )}
            </div>
          </div>

          {/* Dynamic Caution / Danger Callout */}
          {result.riskStatus === "CAUTION" && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300/90 leading-relaxed">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Warning:</strong> Single trade consumes &gt;30% of daily buffer. You have only {result.consecutiveLossesToDailyBreach} full stops left today.
              </span>
            </div>
          )}

          {result.riskStatus === "DANGER" && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300/90 leading-relaxed">
              <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>
                <strong>High Breach Danger:</strong> &gt;50% daily drawdown consumed! {result.consecutiveLossesToDailyBreach} consecutive loss will breach {firm.name}. Reduce lot size.
              </span>
            </div>
          )}
        </div>

        {/* Sidebar MyBid Ad Slot + Specs */}
        <div className="space-y-4">
          <AdSlotInline slotId="sidebar-rectangle" className="min-h-[250px]" />

          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2 text-xs">
            <h4 className="font-semibold text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              {pair.symbol} Live Specifications
            </h4>
            <dl className="space-y-1.5 text-slate-400 font-mono text-[11px]">
              <div className="flex justify-between">
                <dt className="text-slate-500">Asset Class</dt>
                <dd className="text-slate-300 font-sans">{pair.assetClass}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Standard Lot Size</dt>
                <dd className="text-slate-300">{pair.contractSize.toLocaleString()} {pair.unitLabel}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Pip Value</dt>
                <dd className="text-emerald-400">${pair.pipValuePerStandardLotUsd.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Typical Spread</dt>
                <dd className="text-slate-300">{pair.typicalSpreadPips} pips</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Firm Commission</dt>
                <dd className="text-slate-300">${firm.defaultCommissionPerLotUsd.toFixed(2)}/lot RT</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

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
    <div>
      <label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
        {icon}
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-slate-950/80 border border-slate-800/80 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-200 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 cursor-pointer transition-all"
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

function AdSlotInline({
  slotId,
  className = "",
}: {
  slotId: string;
  className?: string;
}) {
  const isDev = process.env.NODE_ENV === "development";
  const bannerId = slotId === "sidebar-rectangle" ? "2031285" : "2031283";

  return (
    <div
      className={`flex items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 text-slate-500 text-xs overflow-hidden ${className}`}
      data-ad-slot={slotId}
      aria-label="Advertisement"
    >
      <div data-banner-id={bannerId} className="w-full flex justify-center" />
      {isDev && (
        <span className="select-none text-[11px] font-mono text-emerald-500/70 py-2">
          MyBid Banner #{bannerId}
        </span>
      )}
    </div>
  );
}
