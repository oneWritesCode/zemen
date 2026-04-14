export type ResponseMode = "SIMPLE" | "DETAILED" | "RAW";

export type ChartData =
  | {
      type: "line" | "bar" | "scatter";
      title?: string;
      x: (string | number)[];
      y: number[];
      color?: string;
      ylabel?: string;
      xlabel?: string;
    }
  | {
      type: "gauge";
      title?: string;
      value: number;
      min?: number;
      max?: number;
      color?: string;
      ylabel?: string;
    };

export type TableData = {
  headers: string[];
  rows: Array<Array<string | number | null>>;
};

export type MetricData = {
  metrics: Array<{
    label: string;
    value: string;
    change?: string;
    direction?: "up" | "down" | "stable";
    good?: true | false | "neutral";
  }>;
};

export type ParsedRichResponse = {
  text: string;
  charts: ChartData[];
  tables: TableData[];
  metrics: MetricData[];
  rawBlocks: { kind: "chart" | "table" | "metric"; json: string }[];
};

function safeJsonParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

function isChartData(x: unknown): x is ChartData {
  if (!isObject(x)) return false;
  const t = x.type;
  if (t === "gauge") return typeof x.value === "number";
  if (t === "line" || t === "bar" || t === "scatter") {
    return Array.isArray(x.x) && Array.isArray(x.y);
  }
  return false;
}

function isTableData(x: unknown): x is TableData {
  if (!isObject(x)) return false;
  return Array.isArray(x.headers) && Array.isArray(x.rows);
}

function isMetricData(x: unknown): x is MetricData {
  if (!isObject(x)) return false;
  return Array.isArray(x.metrics);
}

/**
 * Extracts rich blocks that must be on their own line:
 * - CHART_DATA:{...json...}
 * - TABLE_DATA:{...json...}
 * - METRIC_DATA:{...json...}
 *
 * Any successfully parsed blocks are removed from the returned `text`.
 */
export function parseRichResponse(responseText: string): ParsedRichResponse {
  const charts: ChartData[] = [];
  const tables: TableData[] = [];
  const metrics: MetricData[] = [];
  const rawBlocks: ParsedRichResponse["rawBlocks"] = [];

  const keptLines: string[] = [];
  const lines = responseText.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("CHART_DATA:")) {
      const json = trimmed.slice("CHART_DATA:".length).trim();
      const parsed = safeJsonParse<unknown>(json);
      if (parsed && isChartData(parsed)) {
        charts.push(parsed);
        rawBlocks.push({ kind: "chart", json });
        continue;
      }
    }

    if (trimmed.startsWith("TABLE_DATA:")) {
      const json = trimmed.slice("TABLE_DATA:".length).trim();
      const parsed = safeJsonParse<unknown>(json);
      if (parsed && isTableData(parsed)) {
        tables.push(parsed);
        rawBlocks.push({ kind: "table", json });
        continue;
      }
    }

    if (trimmed.startsWith("METRIC_DATA:")) {
      const json = trimmed.slice("METRIC_DATA:".length).trim();
      const parsed = safeJsonParse<unknown>(json);
      if (parsed && isMetricData(parsed)) {
        metrics.push(parsed);
        rawBlocks.push({ kind: "metric", json });
        continue;
      }
    }

    keptLines.push(line);
  }

  return {
    text: keptLines.join("\n").trim(),
    charts,
    tables,
    metrics,
    rawBlocks,
  };
}

export type MarkdownBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: Array<{ text: string; depth: number }> };

/**
 * Minimal markdown-ish parser for:
 * - paragraphs
 * - bullet lists with indentation (2 spaces = one level)
 */
export function parseMarkdownBlocks(text: string): MarkdownBlock[] {
  const lines = text.split(/\r?\n/);
  const blocks: MarkdownBlock[] = [];

  let curPara: string[] = [];
  let curList: Array<{ text: string; depth: number }> | null = null;

  const flushPara = () => {
    const p = curPara.join("\n").trim();
    if (p) blocks.push({ type: "p", text: p });
    curPara = [];
  };
  const flushList = () => {
    if (curList && curList.length) blocks.push({ type: "ul", items: curList });
    curList = null;
  };

  for (const raw of lines) {
    const line = raw.replace(/\t/g, "  ");
    const isBlank = line.trim().length === 0;
    if (isBlank) {
      flushPara();
      flushList();
      continue;
    }

    const m = line.match(/^(\s*)([-*])\s+(.*)$/);
    if (m) {
      flushPara();
      const spaces = m[1]?.length ?? 0;
      const depth = Math.floor(spaces / 2);
      const itemText = (m[3] ?? "").trim();
      if (!curList) curList = [];
      curList.push({ text: itemText, depth });
      continue;
    }

    flushList();
    curPara.push(line);
  }

  flushPara();
  flushList();
  return blocks;
}

