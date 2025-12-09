import { PrismaClient } from '@prisma/client'

// Ensure DATABASE_URL is loaded
if (!process.env.DATABASE_URL) {
  // Try to load from .env.local if not already loaded
  try {
    const fs = require('fs')
    const path = require('path')
    const envPath = path.resolve(process.cwd(), '.env.local')
    if (fs.existsSync(envPath)) {
      const envFile = fs.readFileSync(envPath, 'utf-8')
      envFile.split('\n').forEach((line: string) => {
        const match = line.match(/^([^=]+)=(.*)$/)
        if (match) {
          const key = match[1].trim()
          const value = match[2].trim()
          if (key === 'DATABASE_URL' && !process.env[key]) {
            process.env[key] = value
          }
        }
      })
    }
  } catch (error) {
    // Ignore errors, will fail later if DATABASE_URL is still missing
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

