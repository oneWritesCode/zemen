import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in environment variables.')
}

// Robust Pool configuration for Neon/PostgreSQL 
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Set to true if you want to verify certs strictly, but false is often needed for serverless environments or if certs are local.
  },
  max: 20, // Limit connections for stability
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // 10s timeout to prevent long hangs
})

const adapter = new PrismaPg(pool)

export const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
