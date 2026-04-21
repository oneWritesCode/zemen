import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// DELETE: remove from watchlist
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  try {
    const user = requireAuth(req)
    const { ticker } = await params

    await prisma.watchlistItem.deleteMany({
      where: {
        userId: user.userId,
        ticker: ticker.toUpperCase()
      }
    })

    return NextResponse.json({ success: true })

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
