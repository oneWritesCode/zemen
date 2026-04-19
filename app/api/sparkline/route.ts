import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const ticker = req.nextUrl.searchParams.get('ticker')
  
  if (!ticker) {
    return NextResponse.json({ prices: [] })
  }
  
  try {
    // Yahoo Finance unofficial API
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1mo&range=1y`
    
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      },
      next: { revalidate: 3600 }
    })
    
    const json = await res.json()
    const closes = json?.chart?.result?.[0]?.indicators?.quote?.[0]?.close || []
    
    const prices = closes
      .filter((p: number | null) => p !== null)
      .map((p: number) => Math.round(p * 100) / 100)
    
    return NextResponse.json({
      prices,
      ticker,
      cached: false
    })
    
  } catch (error) {
    console.error('Error fetching sparkline data:', error)
    return NextResponse.json({ prices: [] })
  }
}
