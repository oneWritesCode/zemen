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

// Multiple connection string strategies for Neon
const getConnectionStrings = () => {
  const base = connectionString
  
  return [
    // Try with minimal SSL settings first
    base.replace('sslmode=verify-full', 'sslmode=disable'),
    // Try with require SSL
    base.replace('sslmode=verify-full', 'sslmode=require'),
    // Try with connection timeout
    base + '&connect_timeout=5',
    // Try with application name
    base + '&application_name=zemen-next',
    // Original as last resort
    base
  ]
}

// Enhanced Pool configuration for Neon/PostgreSQL 
const createPool = (connString: string) => new Pool({
  connectionString: connString,
  ssl: {
    rejectUnauthorized: false, // Required for Neon PostgreSQL
  },
  max: 2, // Minimal connections for stability
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000, // Very aggressive timeout
  keepAlive: false, // Disable keep alive for testing
  application_name: 'zemen-next',
})

// Try multiple connection strategies
let pool: Pool
let currentConnIndex = 0
const connectionStrings = getConnectionStrings()

const initializePool = async () => {
  for (let i = 0; i < connectionStrings.length; i++) {
    let testPool: Pool | null = null
    try {
      console.log(`Trying connection strategy ${i + 1}/${connectionStrings.length}`)
      testPool = createPool(connectionStrings[i])
      const client = await testPool.connect()
      await client.query('SELECT 1')
      client.release()
      pool = testPool
      currentConnIndex = i
      console.log(`Connection successful with strategy ${i + 1}`)
      return
    } catch (error: any) {
      console.log(`Connection strategy ${i + 1} failed:`, error.message)
      if (testPool) await testPool.end()
    }
  }
  throw new Error('All connection strategies failed')
}

// Initialize pool synchronously with fallback
pool = createPool(connectionStrings[0])
// Try async initialization in background
initializePool().then(() => {
  console.log('Database pool initialized successfully')
}).catch(error => {
  console.error('Async pool initialization failed, using fallback:', error)
})

const adapter = new PrismaPg(pool)

// Health check function with pool recreation
const healthCheck = async (): Promise<boolean> => {
  try {
    const client = await pool.connect()
    await client.query('SELECT 1')
    client.release()
    return true
  } catch (error) {
    console.error('Database health check failed:', error)
    // Try to recreate pool with next strategy
    try {
      await pool.end()
      currentConnIndex = (currentConnIndex + 1) % connectionStrings.length
      console.log(`Switching to connection strategy ${currentConnIndex + 1}`)
      pool = createPool(connectionStrings[currentConnIndex])
      const testClient = await pool.connect()
      await testClient.query('SELECT 1')
      testClient.release()
      return true
    } catch (recreateError) {
      console.error('Pool recreation failed:', recreateError)
      return false
    }
  }
}

// Enhanced Prisma client with circuit breaker
export const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

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
