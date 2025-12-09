import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { compareOtp } from '@/lib/crypto'
import { createSession } from '@/lib/auth'
import { rateLimit } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
})

export async function POST(request: NextRequest) {
  // Rate limiting: 10 attempts per 15 minutes per IP (brute force protection)
  let limit
  try {
    limit = await rateLimit(request, {
      maxRequests: 10,
      windowMs: 15 * 60 * 1000, // 15 minutes
    })
  } catch (rateLimitError) {
    console.error('Rate limit error:', rateLimitError)
    // If rate limiting fails, allow the request but log the error
    limit = { allowed: true, remaining: 10, resetAt: Date.now() + 15 * 60 * 1000 }
  }

  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many verification attempts. Please try again later.' },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(limit.resetAt).toISOString(),
        },
      }
    )
  }

  try {
    const body = await request.json()
    const { email, code } = verifySchema.parse(body)

    // Only log in development, never log the actual code
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 Verifying OTP for:', email)
    }

    // Find latest OTP for this email
    const otpRecord = await prisma.emailOtp.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' },
    })

    if (!otpRecord) {
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ No OTP record found for:', email)
      }
      return NextResponse.json(
        { error: 'No verification code found' },
        { status: 400 }
      )
    }

    // Check expiry
    const now = new Date()
    if (now > otpRecord.expiresAt) {
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ OTP expired')
      }
      await prisma.emailOtp.delete({ where: { id: otpRecord.id } })
      return NextResponse.json(
        { error: 'Verification code expired' },
        { status: 400 }
      )
    }

    // Development bypass for admin account (only in development, with additional check)
    let isValid = false
    if (
      process.env.NODE_ENV === 'development' && 
      process.env.ALLOW_DEV_BYPASS === 'true' &&
      email === 'admin@swissbright.com' && 
      code === '000000'
    ) {
      console.log('🔓 Using admin development bypass code')
      isValid = true
    } else {
      // Verify OTP
      isValid = await compareOtp(code, otpRecord.otpHash)
      if (process.env.NODE_ENV === 'development') {
        console.log('🔑 Code validation result:', isValid)
      }
    }
    
    if (!isValid) {
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ Invalid OTP')
      }
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    // Update user email verified status
    const user = await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    })

    // Delete OTP
    await prisma.emailOtp.delete({ where: { id: otpRecord.id } })
    console.log('🗑️ OTP deleted')

    // Create session
    await createSession({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    console.log('✅ Session created for:', user.email)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Verify OTP error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}

