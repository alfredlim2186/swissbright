import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export const dynamic = 'force-dynamic'

/**
 * ⚠️ ONE-TIME MIGRATION ROUTE
 * 
 * This route runs database migrations. It requires a secret key for security.
 * 
 * Usage:
 * POST /api/migrate
 * Headers: { "X-Migration-Secret": "your-secret-key" }
 * 
 * IMPORTANT: Delete this file after running migrations!
 */

export async function POST(request: NextRequest) {
  try {
    // Check for secret key
    const secret = request.headers.get('X-Migration-Secret')
    const expectedSecret = process.env.MIGRATION_SECRET || 'CHANGE_THIS_SECRET'

    if (!secret || secret !== expectedSecret) {
      return NextResponse.json(
        { 
          error: 'Unauthorized',
          message: 'Missing or invalid migration secret. Set MIGRATION_SECRET environment variable.'
        },
        { status: 401 }
      )
    }

    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { 
          error: 'Database not configured',
          message: 'DATABASE_URL environment variable is not set.'
        },
        { status: 500 }
      )
    }

    console.log('🔄 Starting database migrations...')

    // Run Prisma migrations
    try {
      const { stdout, stderr } = await execAsync('npx prisma migrate deploy', {
        env: {
          ...process.env,
          DATABASE_URL: process.env.DATABASE_URL,
        },
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      })

      console.log('✅ Migrations completed successfully')
      console.log('Migration output:', stdout)

      if (stderr && !stderr.includes('warning')) {
        console.warn('Migration warnings:', stderr)
      }

      return NextResponse.json({
        success: true,
        message: 'Database migrations completed successfully',
        output: stdout,
        warnings: stderr || null,
      })
    } catch (migrationError: any) {
      console.error('❌ Migration failed:', migrationError)
      
      return NextResponse.json(
        {
          error: 'Migration failed',
          message: migrationError.message,
          stdout: migrationError.stdout || null,
          stderr: migrationError.stderr || null,
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('❌ Migration route error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message || 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}

// Also allow GET for easy testing (but still require secret)
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message: 'Migration endpoint',
      instructions: 'Send a POST request with X-Migration-Secret header',
      note: '⚠️ Delete this route after running migrations!',
    },
    { status: 200 }
  )
}

