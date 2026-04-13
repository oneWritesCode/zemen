/** Single observation row from FRED `series/observations`. */
export type FredObservationRow = {
  realtime_start: string;
  realtime_end: string;
  date: string;
  value: string;
};

export type FredObservationsResponse = {
  realtime_start: string;
  realtime_end: string;
  observation_start: string;
  observation_end: string;
  units: string;
  output_type: number;
  file_type: string;
  order_by: string;
  sort_order: string;
  count: number;
  offset: number;
  limit: number;
  observations: FredObservationRow[];
};

export type ParsedObservation = {
  /** ISO calendar date from FRED (`YYYY-MM-DD`). */
  date: string;
  value: number;
};

export type MacroSeriesKey =
  | "fedFundsRate"
  | "cpi"
  | "unemployment"
  | "yieldSpread10y2y"
  | "hyOas";

/** Monthly panel aligned on `YYYY-MM` (first day of month convention in output). */
export type MacroMonthlyRow = {
  period: string;
  fedFundsRate: number | null;
  cpi: number | null;
  unemployment: number | null;
  yieldSpread10y2y: number | null;
  hyOas: number | null;
};
