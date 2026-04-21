import jwt from 'jsonwebtoken'

// Ensure we have a secret, otherwise default to a fallback for development only
const JWT_SECRET = process.env.JWT_SECRET || 'zemen-super-secret-key-12345'
const JWT_EXPIRES = '7d'

export interface JWTPayload {
  userId: string
  username: string
  profession: string
}

export function signToken(payload: JWTPayload): string {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES
    })
  } catch (err) {
    console.error('Error signing token:', err)
    throw new Error('Failed to sign authentication token.')
  }
}

export function verifyToken(
  token: string
): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (err) {
    console.warn('Error verifying token:', err)
    return null
  }
}

export function decodeToken(
  token: string
): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload
  } catch (err) {
    console.warn('Error decoding token:', err)
    return null
  }
}
