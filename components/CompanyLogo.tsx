"use client";

import { useState } from "react";

// ─── Domain mapping ────────────────────────────────────────────────────────────
export const TICKER_TO_DOMAIN: Record<string, string> = {
  // Technology
  AAPL: "apple.com",
  MSFT: "microsoft.com",
  NVDA: "nvidia.com",
  GOOGL: "google.com",
  META: "meta.com",
  AMD: "amd.com",
  AVGO: "broadcom.com",
  CRM: "salesforce.com",
  INTC: "intel.com",
  QCOM: "qualcomm.com",

  // Healthcare
  JNJ: "jnj.com",
  UNH: "unitedhealthgroup.com",
  LLY: "lilly.com",
  PFE: "pfizer.com",
  ABBV: "abbvie.com",
  MRK: "merck.com",
  TMO: "thermofisher.com",
  ISRG: "intuitive.com",

  // Financials
  JPM: "jpmorganchase.com",
  "BRK-B": "berkshirehathaway.com",
  GS: "goldmansachs.com",
  BAC: "bankofamerica.com",
  V: "visa.com",
  MA: "mastercard.com",
  BLK: "blackrock.com",
  AXP: "americanexpress.com",

  // Energy
  XOM: "exxonmobil.com",
  CVX: "chevron.com",
  COP: "conocophillips.com",
  SLB: "slb.com",

  // Consumer Staples
  PG: "pg.com",
  KO: "coca-cola.com",
  PEP: "pepsico.com",
  WMT: "walmart.com",
  COST: "costco.com",
  PM: "pmi.com",
  CL: "colgate.com",

  // Consumer Discretionary
  AMZN: "amazon.com",
  TSLA: "tesla.com",
  HD: "homedepot.com",
  MCD: "mcdonalds.com",
  NKE: "nike.com",
  SBUX: "starbucks.com",
  BKNG: "booking.com",

  // Industrials
  CAT: "caterpillar.com",
  HON: "honeywell.com",
  UNP: "up.com",
  RTX: "rtx.com",
  DE: "deere.com",
  BA: "boeing.com",
  LMT: "lockheedmartin.com",

  // Real Estate
  PLD: "prologis.com",
  AMT: "americantower.com",
  EQIX: "equinix.com",
  PSA: "publicstorage.com",

  // Utilities
  NEE: "nexteraenergy.com",
  DUK: "duke-energy.com",
  SO: "southerncompany.com",

  // Materials
  LIN: "linde.com",
  SHW: "sherwin-williams.com",
  FCX: "fcx.com",
  NEM: "newmont.com",

  // Emerging Tech
  PLTR: "palantir.com",
  COIN: "coinbase.com",
  NET: "cloudflare.com",
  PATH: "uipath.com",

  // ── Platform / broker / service domains ──────────────────────────────────────
  ZERODHA: "zerodha.com",
  GROWW: "groww.in",
  UPSTOX: "upstox.com",
  ANGELONE: "angelone.in",
  INDMONEY: "indmoney.com",
  ROBINHOOD: "robinhood.com",
  ETORO: "etoro.com",
  LINKEDIN: "linkedin.com",
  NAUKRI: "naukri.com",
  INDEED: "indeed.com",
  INTERNSHALA: "internshala.com",
  WELLFOUND: "wellfound.com",
  UPWORK: "upwork.com",
  ZERODHA_GOLD: "zerodha.com",
  PHONEPE: "phonepe.com",
  PAYTM: "paytm.com",
  RBIDIRECT: "rbiretaildirect.org.in",
  MMTCPAMP: "mmtcpamp.com",
  BANKBAZAAR: "bankbazaar.com",
  PAISABAZAAR: "paisabazaar.com",
  CRED: "cred.club",
  CASHKARO: "cashkaro.com",
  TREASURYDIRECT: "treasurydirect.gov",
  MAGICBRICKS: "magicbricks.com",
  ACRES99: "99acres.com",
  HOUSING: "housing.com",
  NOBROKER: "nobroker.in",
  ZILLOW: "zillow.com",
};

// ─── Component ────────────────────────────────────────────────────────────────
interface CompanyLogoProps {
  /** Ticker symbol OR platform key from TICKER_TO_DOMAIN */
  ticker: string;
  name: string;
  size?: number;
  /** Background color of the fallback tile */
  fallbackColor?: string;
}

export function CompanyLogo({
  ticker,
  name,
  size = 44,
  fallbackColor = "#1a1a1a",
}: CompanyLogoProps) {
  const domain = TICKER_TO_DOMAIN[ticker];
  const [srcIndex, setSrcIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const logoSources = domain
    ? [
        // Priority 1 – Logo.dev (best quality, no auth required for basic use)
        `https://img.logo.dev/${domain}?token=pk_free&size=128`,
        // Priority 2 – Clearbit
        `https://logo.clearbit.com/${domain}`,
        // Priority 3 – Google favicon (always resolves)
        `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
      ]
    : [];

  const radius = size > 36 ? "10px" : "6px";

  const handleError = () => {
    if (srcIndex < logoSources.length - 1) {
      setSrcIndex((prev) => prev + 1);
    } else {
      setImgError(true);
    }
  };

  // No domain found OR all sources exhausted → letter fallback
  if (imgError || !domain) {
    return (
      <div
        aria-label={name}
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          background: fallbackColor,
          border: "1px solid #2a2a2a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.38,
          fontWeight: 700,
          color: "#fff",
          flexShrink: 0,
          fontFamily: "monospace",
          userSelect: "none",
        }}
      >
        {ticker.slice(0, 2)}
      </div>
    );
  }

  return (
    <div
      aria-label={name}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        border: "1px solid #2a2a2a",
        background: "#fff",
        overflow: "hidden",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Shimmer skeleton while loading */}
      {!loaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, #1a1a1a 25%, #262626 50%, #1a1a1a 75%)",
            backgroundSize: "400px 100%",
            animation: "zemen-shimmer 1.5s infinite linear",
          }}
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoSources[srcIndex]}
        alt={name}
        onError={handleError}
        onLoad={() => setLoaded(true)}
        style={{
          width: size - 8,
          height: size - 8,
          objectFit: "contain",
          display: loaded ? "block" : "none",
          borderRadius: "4px",
        }}
      />
    </div>
  );
}
