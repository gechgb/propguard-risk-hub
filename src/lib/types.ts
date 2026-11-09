export interface PropFirm {
  slug: string;
  name: string;
  programName: string;
  dailyDrawdownPct: number;
  maxDrawdownPct: number;
  drawdownType: string;
  dailyResetRule: string;
  profitTargetStep1Pct: number;
  profitTargetStep2Pct: number;
  accountSizes: number[];
  defaultCommissionPerLotUsd: number;
  ruleNotes: string;
}

export interface Instrument {
  slug: string;
  symbol: string;
  displayName: string;
  assetClass: string;
  contractSize: number;
  unitLabel: string;
  pipSize: number;
  pointSize: number;
  pipValuePerStandardLotUsd: number;
  pointValuePerStandardLotUsd: number;
  defaultStopLossPips: number;
  typicalSpreadPips: number;
  seoDescription: string;
}

export interface SeoMatrix {
  propFirms: PropFirm[];
  instruments: Instrument[];
}
