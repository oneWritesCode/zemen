import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import prisma from '@/lib/prisma'
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

    // Check username taken
    const existing = await prisma.user.findUnique({
      where: { username }
    })

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

    // Create user + profile + streak in transaction
    const user = await prisma.$transaction(async (tx) => {
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
    })

    // Sign JWT
    const token = signToken({
      userId: user.id,
      username: user.username,
      profession: user.profession
    })

    // Set response with cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        profession: user.profession,
        profile: user.profile,
        streak: user.streak
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

  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({
      success: false,
      error: 'Something went wrong. Please try again.'
    }, { status: 500 })
  }
}
