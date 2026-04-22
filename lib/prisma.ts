import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  circuitBreaker: {
    isOpen: boolean
    failures: number
    lastFailureTime: number
    threshold: number
    resetTimeout: number
  } | undefined
}

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in environment variables.')
}

// Circuit breaker configuration
const circuitBreaker = globalForPrisma.circuitBreaker || {
  isOpen: false,
  failures: 0,
  lastFailureTime: 0,
  threshold: 3, // Open circuit after 3 failures (more aggressive)
  resetTimeout: 30000, // Reset after 30 seconds (faster recovery)
}

if (!globalForPrisma.circuitBreaker) {
  globalForPrisma.circuitBreaker = circuitBreaker
}

// Simple Pool configuration for Neon/PostgreSQL 
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Required for Neon PostgreSQL
  },
  max: 5, // Reduced connections for stability
  idleTimeoutMillis: 20000,
  connectionTimeoutMillis: 10000, // Increased timeout for network issues
  keepAlive: true,
  keepAliveInitialDelayMillis: 5000,
  application_name: 'zemen-next',
})

const adapter = new PrismaPg(pool)

// Health check function
const healthCheck = async (): Promise<boolean> => {
  try {
    const client = await pool.connect()
    await client.query('SELECT 1')
    client.release()
    return true
  } catch (error) {
    console.error('Database health check failed:', error)
    return false
  }
}

// Enhanced Prisma client with circuit breaker
export const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// Export unified client interface
export const db = prisma

// Wrapper for database operations with circuit breaker
export const withCircuitBreaker = async <T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> => {
  // Check if circuit is open
  if (circuitBreaker.isOpen) {
    const timeSinceLastFailure = Date.now() - circuitBreaker.lastFailureTime
    if (timeSinceLastFailure < circuitBreaker.resetTimeout) {
      throw new Error(`Database circuit breaker is open. Operation ${operationName} blocked.`)
    } else {
      // Try to reset circuit
      const isHealthy = await healthCheck()
      if (isHealthy) {
        circuitBreaker.isOpen = false
        circuitBreaker.failures = 0
        console.log('Database circuit breaker reset')
      } else {
        circuitBreaker.lastFailureTime = Date.now()
        throw new Error(`Database circuit breaker remains closed. Operation ${operationName} blocked.`)
      }
    }
  }

  try {
    const result = await operation()
    // Reset failures on success
    circuitBreaker.failures = 0
    return result
  } catch (error: any) {
    circuitBreaker.failures++
    circuitBreaker.lastFailureTime = Date.now()
    
    if (circuitBreaker.failures >= circuitBreaker.threshold) {
      circuitBreaker.isOpen = true
      console.error(`Database circuit breaker opened due to ${circuitBreaker.failures} failures`)
    }
    
    throw error
  }
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
