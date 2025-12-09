import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Lazy-load admin credentials to avoid build-time errors
function getAdminUsername(): string {
  return process.env.ADMIN_BASIC_USERNAME || 'Admin'
}

function getAdminPassword(): string {
  return process.env.ADMIN_BASIC_PASSWORD || 'Admin8899!'
}

export async function POST(request: NextRequest) {
  try {
    const { username = '', password = '' } = await request.json()

    // Trim whitespace and normalize
    const trimmedUsername = username.trim()
    const trimmedPassword = password.trim()
    const expectedUsername = getAdminUsername().trim()
    const expectedPassword = getAdminPassword().trim()

    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 Admin login attempt:', {
        receivedUsername: trimmedUsername,
        expectedUsername: expectedUsername,
        usernameMatch: trimmedUsername === expectedUsername,
        passwordLength: trimmedPassword.length,
        expectedPasswordLength: expectedPassword.length,
        passwordMatch: trimmedPassword === expectedPassword,
      })
    }

    if (trimmedUsername !== expectedUsername || trimmedPassword !== expectedPassword) {
      // In development, provide more helpful error message
      if (process.env.NODE_ENV === 'development') {
        const errors = []
        if (trimmedUsername !== expectedUsername) {
          errors.push(`Username mismatch. Expected: "${expectedUsername}", Got: "${trimmedUsername}"`)
        }
        if (trimmedPassword !== expectedPassword) {
          errors.push(`Password mismatch. Expected length: ${expectedPassword.length}, Got length: ${trimmedPassword.length}`)
        }
        return NextResponse.json({ 
          error: 'Invalid credentials',
          details: errors.join('; ')
        }, { status: 401 })
      }
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Check database connection and find admin user
    let adminUser
    try {
      adminUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
        orderBy: { createdAt: 'asc' },
      })
    } catch (dbError: any) {
      console.error('❌ Database error:', dbError)
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      }, { status: 500 })
    }

    if (!adminUser) {
      console.error('❌ Admin user not found in database')
      return NextResponse.json({ 
        error: 'Admin account not found. Please run: npm run db:seed',
        details: 'No user with ADMIN role exists in the database.'
      }, { status: 500 })
    }

    // Create session
    try {
      await createSession({
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
      })
      console.log('✅ Session created successfully for:', adminUser.email)
    } catch (sessionError: any) {
      console.error('❌ Session creation error:', sessionError)
      return NextResponse.json({ 
        error: 'Failed to create session',
        details: process.env.NODE_ENV === 'development' ? sessionError.message : undefined
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('❌ Admin basic login error:', error)
    console.error('Error type:', error?.constructor?.name)
    console.error('Error message:', error?.message)
    console.error('Error stack:', error?.stack)
    
    return NextResponse.json({ 
      error: 'Unable to login. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}


