import { NextRequest, NextResponse } from 'next/server'

// S&P 500 stocks organized by sector
// This is the master list we filter from
const STOCK_UNIVERSE = [
  // Technology
  { ticker: 'AAPL', name: 'Apple Inc', sector: 'Technology', industry: 'Consumer Electronics', marketCap: 'Giant' },
  { ticker: 'MSFT', name: 'Microsoft Corp', sector: 'Technology', industry: 'Software', marketCap: 'Giant' },
  { ticker: 'NVDA', name: 'NVIDIA Corp', sector: 'Technology', industry: 'Semiconductors', marketCap: 'Giant' },
  { ticker: 'GOOGL', name: 'Alphabet Inc', sector: 'Technology', industry: 'Internet', marketCap: 'Giant' },
  { ticker: 'META', name: 'Meta Platforms', sector: 'Technology', industry: 'Social Media', marketCap: 'Giant' },
  { ticker: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology', industry: 'Semiconductors', marketCap: 'Large' },
  { ticker: 'CRM', name: 'Salesforce Inc', sector: 'Technology', industry: 'Software', marketCap: 'Large' },
  { ticker: 'ADBE', name: 'Adobe Inc', sector: 'Technology', industry: 'Software', marketCap: 'Large' },
  { ticker: 'INTC', name: 'Intel Corp', sector: 'Technology', industry: 'Semiconductors', marketCap: 'Large' },
  { ticker: 'ORCL', name: 'Oracle Corp', sector: 'Technology', industry: 'Software', marketCap: 'Large' },
  { ticker: 'QCOM', name: 'Qualcomm Inc', sector: 'Technology', industry: 'Semiconductors', marketCap: 'Large' },
  { ticker: 'AVGO', name: 'Broadcom Inc', sector: 'Technology', industry: 'Semiconductors', marketCap: 'Giant' },
  { ticker: 'NOW', name: 'ServiceNow Inc', sector: 'Technology', industry: 'Software', marketCap: 'Large' },
  { ticker: 'SNOW', name: 'Snowflake Inc', sector: 'Technology', industry: 'Cloud', marketCap: 'Mid' },
  { ticker: 'NET', name: 'Cloudflare Inc', sector: 'Technology', industry: 'Cloud', marketCap: 'Mid' },
  { ticker: 'PLTR', name: 'Palantir Technologies', sector: 'Technology', industry: 'AI Software', marketCap: 'Mid' },
  { ticker: 'PATH', name: 'UiPath Inc', sector: 'Technology', industry: 'AI Software', marketCap: 'Mid' },
  { ticker: 'DDOG', name: 'Datadog Inc', sector: 'Technology', industry: 'Cloud', marketCap: 'Mid' },
  
  // Healthcare
  { ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', industry: 'Pharma', marketCap: 'Giant' },
  { ticker: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare', industry: 'Insurance', marketCap: 'Giant' },
  { ticker: 'LLY', name: 'Eli Lilly & Co', sector: 'Healthcare', industry: 'Pharma', marketCap: 'Giant' },
  { ticker: 'PFE', name: 'Pfizer Inc', sector: 'Healthcare', industry: 'Pharma', marketCap: 'Giant' },
  { ticker: 'ABBV', name: 'AbbVie Inc', sector: 'Healthcare', industry: 'Biotech', marketCap: 'Giant' },
  { ticker: 'MRK', name: 'Merck & Co', sector: 'Healthcare', industry: 'Pharma', marketCap: 'Giant' },
  { ticker: 'TMO', name: 'Thermo Fisher Scientific', sector: 'Healthcare', industry: 'Medical Devices', marketCap: 'Large' },
  { ticker: 'ISRG', name: 'Intuitive Surgical', sector: 'Healthcare', industry: 'Medical Devices', marketCap: 'Large' },
  { ticker: 'MRNA', name: 'Moderna Inc', sector: 'Healthcare', industry: 'Biotech', marketCap: 'Mid' },
  { ticker: 'AMGN', name: 'Amgen Inc', sector: 'Healthcare', industry: 'Biotech', marketCap: 'Large' },
  
  // Financials
  { ticker: 'JPM', name: 'JPMorgan Chase', sector: 'Financials', industry: 'Banking', marketCap: 'Giant' },
  { ticker: 'BAC', name: 'Bank of America', sector: 'Financials', industry: 'Banking', marketCap: 'Giant' },
  { ticker: 'GS', name: 'Goldman Sachs', sector: 'Financials', industry: 'Investment Banking', marketCap: 'Large' },
  { ticker: 'MS', name: 'Morgan Stanley', sector: 'Financials', industry: 'Investment Banking', marketCap: 'Large' },
  { ticker: 'V', name: 'Visa Inc', sector: 'Financials', industry: 'Payments', marketCap: 'Giant' },
  { ticker: 'MA', name: 'Mastercard Inc', sector: 'Financials', industry: 'Payments', marketCap: 'Giant' },
  { ticker: 'BLK', name: 'BlackRock Inc', sector: 'Financials', industry: 'Asset Management', marketCap: 'Large' },
  { ticker: 'AXP', name: 'American Express', sector: 'Financials', industry: 'Payments', marketCap: 'Large' },
  { ticker: 'WFC', name: 'Wells Fargo', sector: 'Financials', industry: 'Banking', marketCap: 'Large' },
  { ticker: 'C', name: 'Citigroup Inc', sector: 'Financials', industry: 'Banking', marketCap: 'Large' },
  
  // Consumer Discretionary
  { ticker: 'AMZN', name: 'Amazon.com Inc', sector: 'Consumer Discretionary', industry: 'E-Commerce', marketCap: 'Giant' },
  { ticker: 'TSLA', name: 'Tesla Inc', sector: 'Consumer Discretionary', industry: 'Electric Vehicles', marketCap: 'Giant' },
  { ticker: 'HD', name: 'Home Depot Inc', sector: 'Consumer Discretionary', industry: 'Retail', marketCap: 'Giant' },
  { ticker: 'MCD', name: "McDonald's Corp", sector: 'Consumer Discretionary', industry: 'Restaurants', marketCap: 'Giant' },
  { ticker: 'NKE', name: 'Nike Inc', sector: 'Consumer Discretionary', industry: 'Apparel', marketCap: 'Large' },
  { ticker: 'SBUX', name: 'Starbucks Corp', sector: 'Consumer Discretionary', industry: 'Restaurants', marketCap: 'Large' },
  { ticker: 'BKNG', name: 'Booking Holdings', sector: 'Consumer Discretionary', industry: 'Travel', marketCap: 'Large' },
  { ticker: 'TJX', name: 'TJX Companies', sector: 'Consumer Discretionary', industry: 'Retail', marketCap: 'Large' },
  
  // Consumer Staples
  { ticker: 'PG', name: 'Procter & Gamble', sector: 'Consumer Staples', industry: 'Household Products', marketCap: 'Giant' },
  { ticker: 'KO', name: 'Coca-Cola Co', sector: 'Consumer Staples', industry: 'Beverages', marketCap: 'Giant' },
  { ticker: 'PEP', name: 'PepsiCo Inc', sector: 'Consumer Staples', industry: 'Beverages', marketCap: 'Giant' },
  { ticker: 'WMT', name: 'Walmart Inc', sector: 'Consumer Staples', industry: 'Retail', marketCap: 'Giant' },
  { ticker: 'COST', name: 'Costco Wholesale', sector: 'Consumer Staples', industry: 'Retail', marketCap: 'Giant' },
  { ticker: 'PM', name: 'Philip Morris', sector: 'Consumer Staples', industry: 'Tobacco', marketCap: 'Large' },
  { ticker: 'CL', name: 'Colgate-Palmolive', sector: 'Consumer Staples', industry: 'Household Products', marketCap: 'Large' },
  
  // Energy
  { ticker: 'XOM', name: 'ExxonMobil Corp', sector: 'Energy', industry: 'Oil & Gas', marketCap: 'Giant' },
  { ticker: 'CVX', name: 'Chevron Corp', sector: 'Energy', industry: 'Oil & Gas', marketCap: 'Giant' },
  { ticker: 'COP', name: 'ConocoPhillips', sector: 'Energy', industry: 'Oil & Gas', marketCap: 'Large' },
  { ticker: 'SLB', name: 'SLB (Schlumberger)', sector: 'Energy', industry: 'Oil Services', marketCap: 'Large' },
  { ticker: 'EOG', name: 'EOG Resources', sector: 'Energy', industry: 'Oil & Gas', marketCap: 'Large' },
  { ticker: 'NEE', name: 'NextEra Energy', sector: 'Energy', industry: 'Renewable Energy', marketCap: 'Large' },
  { ticker: 'ENPH', name: 'Enphase Energy', sector: 'Energy', industry: 'Solar', marketCap: 'Mid' },
  
  // Industrials
  { ticker: 'CAT', name: 'Caterpillar Inc', sector: 'Industrials', industry: 'Machinery', marketCap: 'Large' },
  { ticker: 'HON', name: 'Honeywell International', sector: 'Industrials', industry: 'Conglomerate', marketCap: 'Large' },
  { ticker: 'RTX', name: 'RTX Corp', sector: 'Industrials', industry: 'Aerospace', marketCap: 'Large' },
  { ticker: 'DE', name: 'Deere & Company', sector: 'Industrials', industry: 'Machinery', marketCap: 'Large' },
  { ticker: 'BA', name: 'Boeing Co', sector: 'Industrials', industry: 'Aerospace', marketCap: 'Large' },
  { ticker: 'LMT', name: 'Lockheed Martin', sector: 'Industrials', industry: 'Defense', marketCap: 'Large' },
  { ticker: 'UPS', name: 'United Parcel Service', sector: 'Industrials', industry: 'Logistics', marketCap: 'Large' },
  { ticker: 'FDX', name: 'FedEx Corp', sector: 'Industrials', industry: 'Logistics', marketCap: 'Large' },
  
  // ETFs (always show these)
  { ticker: 'SPY', name: 'S&P 500 ETF', sector: 'ETF', industry: 'Broad Market', marketCap: 'Giant' },
  { ticker: 'VTI', name: 'Vanguard Total Market ETF', sector: 'ETF', industry: 'Broad Market', marketCap: 'Giant' },
  { ticker: 'QQQ', name: 'Nasdaq 100 ETF', sector: 'ETF', industry: 'Technology', marketCap: 'Giant' },
  { ticker: 'VGT', name: 'Vanguard Tech ETF', sector: 'ETF', industry: 'Technology', marketCap: 'Large' },
  { ticker: 'XLK', name: 'Technology Select ETF', sector: 'ETF', industry: 'Technology', marketCap: 'Large' },
  { ticker: 'XLF', name: 'Financials Select ETF', sector: 'ETF', industry: 'Financials', marketCap: 'Large' },
  { ticker: 'XLV', name: 'Healthcare Select ETF', sector: 'ETF', industry: 'Healthcare', marketCap: 'Large' },
  { ticker: 'GLD', name: 'Gold ETF', sector: 'ETF', industry: 'Commodities', marketCap: 'Large' },
  { ticker: 'BND', name: 'Vanguard Bond ETF', sector: 'ETF', industry: 'Bonds', marketCap: 'Large' },
]

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const budget = parseFloat(
    searchParams.get('budget') || '0'
  )
  const sector = searchParams.get('sector') || 'all'
  const industry = searchParams.get('industry') || 'all'
  const risk = searchParams.get('risk') || 'Balanced'
  const horizon = searchParams.get('horizon') || 'Medium'

  try {
    // Filter by sector and industry first
    const candidates = STOCK_UNIVERSE.filter(s => {
      if (sector !== 'all' && sector !== 'All Sectors' && s.sector !== sector)
        return false
      if (industry !== 'all' && industry !== 'All Industries' && s.industry !== industry)
        return false
      return true
    })

    // Fetch real prices from Yahoo Finance
    // for all candidates in parallel
    const tickers = candidates
      .map(s => s.ticker)
      .slice(0, 30) // limit to 30 per request

    const pricePromises = tickers.map(async (ticker) => {
      try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1mo`
        const res = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          next: { revalidate: 1800 }
        })
        const data = await res.json()
        const result = data?.chart?.result?.[0]
        const closes = result?.indicators?.quote?.[0]?.close || []
        const validCloses = closes.filter((c: number) => c !== null)
        
        if (validCloses.length === 0) return null

        const currentPrice = validCloses[validCloses.length - 1]
        const startPrice = validCloses[0]
        const m1Return = ((currentPrice - startPrice) / startPrice) * 100

        // Get 52 week data for YTD
        const url52 = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1mo&range=1y`
        const res52 = await fetch(url52, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          next: { revalidate: 3600 }
        })
        const data52 = await res52.json()
        const result52 = data52?.chart?.result?.[0]
        const closes52 = result52?.indicators?.quote?.[0]?.close || []
        const valid52 = closes52.filter((c: number) => c !== null)
        const ytdReturn = valid52.length >= 2
          ? ((valid52[valid52.length-1] - valid52[0]) / valid52[0]) * 100
          : m1Return

        // Sparkline from last 10 data points
        const sparkData = validCloses.slice(-10)

        return {
          ticker,
          currentPrice: parseFloat(currentPrice.toFixed(2)),
          m1Return: parseFloat(m1Return.toFixed(2)),
          ytdReturn: parseFloat(ytdReturn.toFixed(2)),
          sparkData
        }
      } catch {
        return null
      }
    })

    const prices = await Promise.all(pricePromises)

    // Combine with stock info
    const enriched = candidates
      .map(stock => {
        const priceData = prices.find(
          p => p?.ticker === stock.ticker
        )
        if (!priceData) return null
        return { ...stock, ...priceData }
      })
      .filter((s): s is NonNullable<typeof s> => s !== null)
      .filter(s => budget === 0 || s.currentPrice <= budget)

    // Score based on regime + risk
    const scored = enriched.map(stock => {
      let fit = 70 // base score

      // Regime fit scoring (Goldilocks)
      if (stock.sector === 'Technology') fit += 15
      if (stock.sector === 'Consumer Discretionary') fit += 10
      if (stock.sector === 'Financials') fit += 8
      if (stock.sector === 'Energy') fit -= 5
      if (stock.sector === 'Utilities') fit -= 8

      // Risk scoring
      if (risk === 'Conservative') {
        if (stock.sector === 'Consumer Staples') fit += 10
        if (stock.sector === 'Healthcare') fit += 8
        if (stock.sector === 'ETF') fit += 12
        if (stock.sector === 'Technology') fit -= 8
        if (stock.marketCap === 'Mid') fit -= 5
      }
      if (risk === 'Aggressive') {
        if (stock.sector === 'Technology') fit += 10
        if (stock.marketCap === 'Mid') fit += 8
        if (stock.sector === 'ETF') fit -= 5
      }

      // Momentum scoring
      if (stock.m1Return > 5) fit += 5
      if (stock.m1Return < -5) fit -= 5
      if (stock.ytdReturn > 20) fit += 5

      // Horizon scoring
      if (horizon === 'Long') {
        if (stock.sector === 'ETF') fit += 10
        if (stock.marketCap === 'Giant') fit += 5
      }
      if (horizon === 'Short') {
        if (stock.m1Return > 3) fit += 8
      }

      fit = Math.min(98, Math.max(30, fit))

      // Generate reason
      const reason = generateReason(
        stock,
        risk,
        horizon
      )

      return { ...stock, fit, reason }
    })

    // Sort by fit score
    const sorted = scored.sort(
      (a, b) => b.fit - a.fit
    )

    return NextResponse.json({
      success: true,
      stocks: sorted,
      count: sorted.length,
      regime: 'Goldilocks',
      regimeConfidence: 82
    })

  } catch (error) {
    console.error('Stock fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stocks' },
      { status: 500 }
    )
  }
}

function generateReason(
  stock: { sector: string },
  _risk: string,
  _horizon: string
): string {
  const reasons: Record<string, string[]> = {
    'Technology': [
      'AI infrastructure spending creates multi-year tailwind for tech earnings.',
      'Cloud adoption acceleration benefits enterprise software names.',
      'Semiconductor demand driven by AI training and inference workloads.'
    ],
    'Healthcare': [
      'Defensive characteristics provide stability across economic cycles.',
      'Aging demographics drive structural demand for healthcare services.',
      'Drug pipeline innovation supports premium valuations.'
    ],
    'Financials': [
      'Steepening yield curve expands net interest margins for banks.',
      'Strong consumer credit quality supports loan book growth.',
      'Capital markets activity recovering as volatility normalises.'
    ],
    'Consumer Discretionary': [
      'Resilient consumer spending in Goldilocks environment favours discretionary.',
      'E-commerce penetration still growing in key categories.',
      'Brand strength provides pricing power in moderate inflation.'
    ],
    'Consumer Staples': [
      'Reliable dividends and defensive moat suit conservative allocation.',
      'Pricing power protects margins against input cost pressure.',
      'Global distribution network provides revenue diversification.'
    ],
    'Energy': [
      'Supply discipline from OPEC+ supports oil price floor.',
      'Energy transition capex benefits diversified energy majors.',
      'Free cash flow generation enables shareholder returns.'
    ],
    'Industrials': [
      'Infrastructure spending cycle supports industrial demand.',
      'Reshoring trend drives domestic manufacturing investment.',
      'Defense budget increases support aerospace and defense names.'
    ],
    'ETF': [
      'Low-cost diversification anchors portfolio with broad market exposure.',
      'Index exposure reduces single-stock risk in uncertain environment.',
      'Systematic rebalancing captures market beta efficiently.'
    ]
  }

  const sectorReasons = reasons[stock.sector]
    || ['Solid fundamentals in current macro environment.']
  
  return sectorReasons[
    Math.floor(Math.random() * sectorReasons.length)
  ]
}
