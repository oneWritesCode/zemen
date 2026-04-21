import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { signToken } from '@/lib/jwt'

const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const parsed = LoginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        error: 'Username and password are required.'
      }, { status: 400 })
    }

    const { username, password } = parsed.data

    // Find user
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        profile: true,
        streak: true
      }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid username or password.'
      }, { status: 401 })
    }

    // Verify password
    const valid = await bcrypt.compare(
      password,
      user.password
    )

    if (!valid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid username or password.'
      }, { status: 401 })
    }

    // Update streak (upsert for robustness)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let currentStreak = 1
    let longestStreak = 1

    if (user.streak) {
      const lastVisit = user.streak.lastVisitDate
      currentStreak = user.streak.currentStreak
      longestStreak = user.streak.longestStreak

      if (lastVisit) {
        const last = new Date(lastVisit)
        last.setHours(0, 0, 0, 0)
        const diffDays = Math.floor(
          (today.getTime() - last.getTime()) 
          / (1000 * 60 * 60 * 24)
        )

        if (diffDays === 0) {
          // Already visited today - no change
        } else if (diffDays === 1) {
          // Consecutive day
          currentStreak += 1
        } else {
          // Streak broken
          currentStreak = 1
        }
      } else {
        currentStreak = 1
      }
      longestStreak = Math.max(currentStreak, longestStreak)
    }

    const updatedStreak = await prisma.userStreak.upsert({
      where: { userId: user.id },
      update: {
        currentStreak,
        longestStreak,
        lastVisitDate: new Date()
      },
      create: {
        userId: user.id,
        currentStreak,
        longestStreak,
        lastVisitDate: new Date()
      }
    })

    // Sign JWT
    const token = signToken({
      userId: user.id,
      username: user.username,
      profession: user.profession
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        profession: user.profession,
        profile: user.profile,
        streak: updatedStreak
      },
      token
    })

    response.cookies.set('zemen_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      success: false,
      error: 'Something went wrong.'
    }, { status: 500 })
  }
}
