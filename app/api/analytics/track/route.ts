import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createHash } from 'crypto'

export const dynamic = 'force-dynamic'

// Generate a visitor ID from IP and user agent (fingerprinting)
function generateVisitorId(ip: string | null, userAgent: string | null): string {
  const combined = `${ip || 'unknown'}-${userAgent || 'unknown'}`
  return createHash('sha256').update(combined).digest('hex').substring(0, 16)
}

// Hash IP address for privacy
function hashIp(ip: string | null): string | null {
  if (!ip) return null
  return createHash('sha256').update(ip).digest('hex').substring(0, 16)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { page, referrer } = body

    // Get IP address
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ip = forwardedFor?.split(',')[0]?.trim() || realIp || null

    // Get user agent
    const userAgent = request.headers.get('user-agent') || null

    // Generate visitor ID
    const visitorId = generateVisitorId(ip, userAgent)

    // Hash IP for privacy
    const hashedIp = hashIp(ip)

    // Store visit
    await prisma.visit.create({
      data: {
        visitorId,
        page: page || null,
        referrer: referrer || null,
        userAgent: userAgent?.substring(0, 500) || null, // Limit length
        ipAddress: hashedIp,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Track visit error:', error)
    // Don't fail the request if tracking fails
    return NextResponse.json({ ok: true })
  }
}

