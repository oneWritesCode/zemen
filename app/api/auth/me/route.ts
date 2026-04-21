import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const jwtUser = getUserFromRequest(req)
    
    if (!jwtUser) {
      return NextResponse.json({
        success: false,
        error: 'Not authenticated'
      }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: jwtUser.userId },
      include: {
        profile: true,
        streak: true,
        learnProgress: {
          orderBy: { updatedAt: 'desc' }
        },
        watchlist: {
          orderBy: { addedAt: 'desc' }
        },
        quizResults: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    // Never send password
    const safeUser = {
      id: user.id,
      username: user.username,
      profession: user.profession,
      createdAt: user.createdAt,
      profile: user.profile,
      streak: user.streak,
      learnProgress: user.learnProgress,
      watchlist: user.watchlist,
      quizResults: user.quizResults
    }

    return NextResponse.json({
      success: true,
      user: safeUser
    })

  } catch {
    return NextResponse.json({
      success: false,
      error: 'Server error'
    }, { status: 500 })
  }
}
