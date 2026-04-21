import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// GET: fetch user's watchlist
export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req)

    const watchlist = await prisma.watchlistItem.findMany({
      where: { userId: user.userId },
      orderBy: { addedAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      watchlist
    })

  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}

// POST: add to watchlist
export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req)
    const body = await req.json()

    const { 
      ticker, name, sector, 
      industry, currentPrice, notes 
    } = body

    if (!ticker || !name) {
      return NextResponse.json({
        success: false,
        error: 'Ticker and name are required'
      }, { status: 400 })
    }

    // Upsert - add or update if exists
    const item = await prisma.watchlistItem.upsert({
      where: {
        userId_ticker: {
          userId: user.userId,
          ticker
        }
      },
      update: {
        currentPrice: currentPrice || 0,
        notes,
        updatedAt: new Date()
      },
      create: {
        userId: user.userId,
        ticker,
        name,
        sector: sector || 'Unknown',
        industry: industry || 'Unknown',
        addedPrice: currentPrice || 0,
        currentPrice: currentPrice || 0,
        notes
      }
    })

    return NextResponse.json({
      success: true,
      item
    }, { status: 201 })

  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}
