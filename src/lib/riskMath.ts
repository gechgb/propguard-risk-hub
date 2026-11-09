export interface RiskInput {
  accountBalance: number;
  currentEquity: number;
  riskPercentage?: number;      // e.g., 0.5 for 0.5%
  fixedRiskUsd?: number;        // e.g., $500 fixed dollar risk
  stopLossPips: number;         // e.g., 50 pips ($5.00 move on XAUUSD)
  spreadPips: number;           // e.g., 1.8 pips
  pipValuePerLotUsd: number;    // e.g., $10.00 per standard lot
  commissionPerLotUsd: number;  // e.g., $3.00 round-turn per lot
  dailyDrawdownPct: number;     // e.g., 5.0%
  maxDrawdownPct: number;       // e.g., 10.0%
}

export interface RiskOutput {
  targetRiskUsd: number;
  effectiveRiskPercentage: number;
  recommendedLots: number;
  miniLots: number;
  microLots: number;
  actualStopLossUsd: number;
  estimatedExecutionCostUsd: number; // Spread + Commission
  totalRiskWithCostsUsd: number;
  dailyLossCapUsd: number;
  remainingDailyBufferUsd: number;
  dailyDrawdownUsedPct: number;
  consecutiveLossesToDailyBreach: number;
  riskStatus: "SAFE" | "CAUTION" | "DANGER";
}

export function calculatePropRisk(input: RiskInput): RiskOutput {
  const {
    accountBalance,
    currentEquity,
    riskPercentage,
    fixedRiskUsd,
    stopLossPips,
    spreadPips,
    pipValuePerLotUsd,
    commissionPerLotUsd,
    dailyDrawdownPct,
  } = input;

  // 1. Target dollar risk based on fixed dollar amount or percentage of starting account balance
  const targetRiskUsd =
    fixedRiskUsd !== undefined && fixedRiskUsd > 0
      ? fixedRiskUsd
      : accountBalance * ((riskPercentage ?? 0.5) / 100);

  const effectiveRiskPercentage =
    accountBalance > 0 ? (targetRiskUsd / accountBalance) * 100 : 0;

  // 2. Total cost per 1.00 Standard Lot if stopped out (Stop-Loss + Spread + Commission)
  const effectiveStopLossPips = Math.max(stopLossPips + spreadPips, 0.1);
  const lossPerLotUsd =
    effectiveStopLossPips * pipValuePerLotUsd + commissionPerLotUsd;

  // 3. Floor to nearest 0.01 lot so trader NEVER risks more than targetRiskUsd
  const rawLots = lossPerLotUsd > 0 ? targetRiskUsd / lossPerLotUsd : 0;
  const recommendedLots = Math.max(0, Math.floor(rawLots * 100) / 100);

  // 4. Actual dollar breakdown at the rounded lot size
  const actualStopLossUsd = recommendedLots * stopLossPips * pipValuePerLotUsd;
  const estimatedExecutionCostUsd =
    recommendedLots * (spreadPips * pipValuePerLotUsd + commissionPerLotUsd);
  const totalRiskWithCostsUsd = actualStopLossUsd + estimatedExecutionCostUsd;

  // 5. Prop Firm Daily Drawdown Buffer
  const dailyLossCapUsd = accountBalance * (dailyDrawdownPct / 100);
  const currentIntradayLoss = Math.max(0, accountBalance - currentEquity);
  const remainingDailyBufferUsd = Math.max(0, dailyLossCapUsd - currentIntradayLoss);

  const dailyDrawdownUsedPct =
    remainingDailyBufferUsd > 0
      ? (totalRiskWithCostsUsd / remainingDailyBufferUsd) * 100
      : 100;

  const consecutiveLossesToDailyBreach =
    totalRiskWithCostsUsd > 0
      ? Math.floor(remainingDailyBufferUsd / totalRiskWithCostsUsd)
      : 0;

  // 6. Institutional Risk Status Classification (Prompt requirements: Amber > 30%, Red > 50%)
  let riskStatus: "SAFE" | "CAUTION" | "DANGER" = "SAFE";
  if (dailyDrawdownUsedPct > 50 || consecutiveLossesToDailyBreach <= 1) {
    riskStatus = "DANGER";
  } else if (dailyDrawdownUsedPct > 30 || consecutiveLossesToDailyBreach <= 3) {
    riskStatus = "CAUTION";
  }

  return {
    targetRiskUsd,
    effectiveRiskPercentage,
    recommendedLots,
    miniLots: Number((recommendedLots * 10).toFixed(1)),
    microLots: Math.round(recommendedLots * 100),
    actualStopLossUsd,
    estimatedExecutionCostUsd,
    totalRiskWithCostsUsd,
    dailyLossCapUsd,
    remainingDailyBufferUsd,
    dailyDrawdownUsedPct,
    consecutiveLossesToDailyBreach,
    riskStatus,
  };
}
