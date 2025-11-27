import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { generateOtp, hashOtp } from '@/lib/crypto'
import { sendEmail, generateOtpEmail } from '@/lib/email'
import { rateLimit } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

const requestSchema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  console.log('📥 POST /api/auth/request-otp called')
  
  // Rate limiting: 5 requests per 15 minutes per IP
  let limit
  try {
    limit = await rateLimit(request, {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
    })
    console.log('✅ Rate limit check passed')
  } catch (rateLimitError) {
    console.error('❌ Rate limit error:', rateLimitError)
    // If rate limiting fails, allow the request but log the error
    limit = { allowed: true, remaining: 5, resetAt: Date.now() + 15 * 60 * 1000 }
  }

  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(limit.resetAt).toISOString(),
        },
      }
    )
  }

  try {
    console.log('📝 Parsing request body...')
    const body = await request.json()
    console.log('✅ Request body parsed:', { email: body.email })
    
    const { email } = requestSchema.parse(body)
    console.log('✅ Schema validation passed')

    // Create or update user (email only - account is tied to email)
    console.log('💾 Upserting user in database...')
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
      },
    })

    // Generate OTP
    console.log('🔑 Generating OTP...')
    const otp = generateOtp(6)
    
    // Only log OTP in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔑 Generated OTP for', email, ':', otp)
    }
    
    console.log('🔐 Hashing OTP...')
    const otpHash = await hashOtp(otp)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store OTP
    console.log('💾 Storing OTP in database...')
    await prisma.emailOtp.create({
      data: {
        email,
        otpHash,
        expiresAt,
      },
    })

    // Send email
    try {
      const emailResult = await sendEmail({
        to: email,
        subject: 'Your SweetB Verification Code',
        html: generateOtpEmail(otp, 10),
      })

      if (!emailResult.success) {
        console.error('Email send failed:', emailResult.error)
        // For development only, log the OTP to console if email fails
        if (process.env.NODE_ENV === 'development') {
          console.log('🔑 OTP for', email, ':', otp, '(Email send failed)')
        }
        // Still return success since OTP is stored in DB
        // In dev, user can get OTP from console if email fails
      } else {
        console.log('✅ Email sent successfully to:', email)
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      // For development only, log the OTP to console if email fails
      if (process.env.NODE_ENV === 'development') {
        console.log('🔑 OTP for', email, ':', otp, '(Email send error)')
      }
      // Still return success since OTP is stored in DB
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Request OTP error:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { 
        error: 'Failed to send verification code',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    )
  }
}

