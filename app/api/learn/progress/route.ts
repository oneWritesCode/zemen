import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// GET: all progress for user
export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req)

    const progress = await prisma.learnProgress.findMany({
      where: { userId: user.userId },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      progress
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

// POST: mark topic as read / update progress
export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req)
    const body = await req.json()

    const { topicSlug, topicName, completed, xpEarned } = body

    if (!topicSlug || !topicName) {
      return NextResponse.json({
        success: false,
        error: 'topicSlug and topicName required'
      }, { status: 400 })
    }

    // Upsert progress
    const progress = await prisma.learnProgress.upsert({
      where: {
        userId_topicSlug: {
          userId: user.userId,
          topicSlug
        }
      },
      update: {
        completed: completed ?? true,
        readAt: new Date(),
        xpEarned: xpEarned || 10,
        updatedAt: new Date()
      },
      create: {
        userId: user.userId,
        topicSlug,
        topicName,
        completed: completed ?? true,
        readAt: new Date(),
        xpEarned: xpEarned || 10
      }
    })

    // Update user XP
    await prisma.userProfile.update({
      where: { userId: user.userId },
      data: {
        totalXp: { increment: xpEarned || 10 }
      }
    })

    return NextResponse.json({
      success: true,
      progress
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
