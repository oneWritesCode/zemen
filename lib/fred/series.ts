import type { MacroSeriesKey } from "./types";

/** FRED series IDs backing the Zemen macro feature set. */
export const FRED_SERIES_IDS: Record<
  Exclude<MacroSeriesKey, "yieldSpread10y2y">,
  string
> = {
  fedFundsRate: "FEDFUNDS",
  cpi: "CPIAUCSL",
  unemployment: "UNRATE",
  hyOas: "BAMLH0A0HYM2",
};

/** Monthly Treasury constant maturity rates used to compute a 10y–2y spread. */
export const FRED_YIELD_CURVE = {
  treasury10y: "GS10",
  treasury2y: "GS2",
} as const;
