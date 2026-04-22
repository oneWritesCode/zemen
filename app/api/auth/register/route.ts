import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { db, withCircuitBreaker } from '@/lib/prisma'
import { signToken } from '@/lib/jwt'

const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username max 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 
      'Username can only contain letters, numbers, underscores'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100),
  profession: z
    .string()
    .min(2, 'Please enter your profession')
    .max(50)
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate input
    const parsed = RegisterSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        error: parsed.error.issues[0].message
      }, { status: 400 })
    }

    const { username, password, profession } = 
      parsed.data

    // Check username taken with circuit breaker
    const existing = await withCircuitBreaker(
      () => db.user.findUnique({
        where: { username }
      }),
      'check-username-exists'
    )

    if (existing) {
      return NextResponse.json({
        success: false,
        error: 'Username already taken. Try another.'
      }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password, 12
    )

    // Create user + profile + streak in transaction with circuit breaker
    const user = await withCircuitBreaker(
      () => db.$transaction(async (tx: any) => {
        const newUser = await tx.user.create({
          data: {
            username,
            password: hashedPassword,
            profession,
            profile: {
              create: {
                macroIqScore: 0,
                level: 'Beginner',
                totalXp: 0,
                quizzesPlayed: 0,
                bestScore: 0
              }
            },
            streak: {
              create: {
                currentStreak: 0,
                longestStreak: 0
              }
            }
          },
          include: {
            profile: true,
            streak: true
          }
        })
        return newUser
      }),
      'create-user-transaction'
    )

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create user after multiple attempts. Please try again.'
      }, { status: 500 })
    }

    // Sign JWT
    const token = signToken({
      userId: (user as any).id,
      username: (user as any).username,
      profession: (user as any).profession
    })

    // Set response with cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: (user as any).id,
        username: (user as any).username,
        profession: (user as any).profession,
        profile: (user as any).profile,
        streak: (user as any).streak
      },
      token
    }, { status: 201 })

    response.cookies.set('zemen_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response

  } catch (error: any) {
    console.error('Register error:', error)
    
    // Handle circuit breaker errors specifically
    if (error.message?.includes('circuit breaker')) {
      return NextResponse.json({
        success: false,
        error: 'Database temporarily unavailable. Please try again in a few minutes.'
      }, { status: 503 })
    }
    
    // Handle timeout errors specifically
    if (error.code === 'ETIMEDOUT') {
      return NextResponse.json({
        success: false,
        error: 'Connection timeout. Please check your network and try again.'
      }, { status: 504 })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Registration failed. Please try again.'
    }, { status: 500 })
  }
}
