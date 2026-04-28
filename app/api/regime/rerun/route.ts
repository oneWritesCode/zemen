import { NextRequest, NextResponse } from 'next/server'
import { getRegimeAnalysis } from '@/lib/regime/get-analysis'
import { clearRegimeCache } from '@/lib/regime/cache'

export async function POST(request: NextRequest) {
  try {
    // Clear cache to force fresh analysis
    clearRegimeCache()
    
    // Force fresh analysis
    const data = await getRegimeAnalysis()
    
    // Award Zemen Points for running regime detection
    const pointsAwarded = 150
    
    return NextResponse.json({
      success: true,
      data,
      pointsAwarded,
      message: `Regime detection completed successfully! +${pointsAwarded} Zemen Points awarded.`
    })
  } catch (error) {
    console.error('Regime re-run error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to re-run regime detection. Please try again.',
      pointsAwarded: 0
    }, { status: 500 })
  }
}
