import { NextRequest } from 'next/server'
import { verifyToken, JWTPayload } from './jwt'

export function getTokenFromRequest(
  req: NextRequest
): string | null {
  // Check Authorization header first
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }
  
  // Then check cookie
  const cookieToken = req.cookies.get('zemen_token')?.value
  if (cookieToken) return cookieToken

  return null
}

export function getUserFromRequest(
  req: NextRequest
): JWTPayload | null {
  const token = getTokenFromRequest(req)
  if (!token) return null
  return verifyToken(token)
}

export function requireAuth(
  req: NextRequest
): JWTPayload {
  const user = getUserFromRequest(req)
  if (!user) {
    throw new Error('UNAUTHORIZED')
  }
  return user
}
