import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'

const createPromoSchema = z.object({
  code: z.string().min(3).max(32),
  description: z.string().max(500).optional().nullable(),
  discountType: z.enum(['PERCENTAGE', 'FIXED']),
  discountValue: z.number().positive(),
  minOrder: z.number().min(0).optional(),
  maxUsage: z.number().int().min(1).optional().nullable(), // null = unlimited
  startAt: z.string().min(1),
  endAt: z.string().min(1),
  timezone: z.string().optional(),
})

const appendMalaysiaOffset = (value: string) => {
  if (!value) throw new Error('Invalid date: empty value')
  
  // If it's already an ISO string with timezone offset, return as-is
  if (value.includes('+') || (value.includes('-') && value.length > 19 && value[value.length - 6] === ':')) {
    return value
  }
  
  // If it's an ISO string ending with Z, convert to Malaysia timezone
  if (value.endsWith('Z')) {
    return value.replace('Z', '+08:00')
  }
  
  // If it's a datetime-local format (YYYY-MM-DDTHH:mm), add seconds and timezone
  if (value.includes('T') && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
    return `${value}:00+08:00`
  }
  
  // If it's a datetime with seconds but no timezone (YYYY-MM-DDTHH:mm:ss)
  if (value.includes('T') && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)) {
    return `${value}+08:00`
  }
  
  // If it already has timezone format like YYYY-MM-DDTHH:mm:ss+08:00, return as-is
  if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}$/)) {
    return value
  }
  
  // Otherwise, try to parse and format
  try {
    // Try parsing as datetime-local format first
    if (value.includes('T')) {
      return `${value}:00+08:00`
    }
    throw new Error(`Invalid date format: ${value}`)
  } catch (err) {
    throw new Error(`Invalid date format: ${value}`)
  }
}

const serializePromoCode = (
  promo: any,
  metrics: { orders: number; discountGiven: number },
) => ({
  id: promo.id,
  code: promo.code,
  description: promo.description,
  discountType: promo.discountType,
  discountValue: promo.discountValue,
  minOrderCents: promo.minOrderCents ?? 0,
  startAt: promo.startAt.toISOString(),
  endAt: promo.endAt.toISOString(),
  timezone: promo.timezone,
  usageCount: promo.usageCount,
  maxUsage: promo.maxUsage,
  completedUsageCount: promo.completedUsageCount ?? 0,
  isActive: promo.isActive,
  createdAt: promo.createdAt.toISOString(),
  updatedAt: promo.updatedAt.toISOString(),
  metrics,
})

export async function GET() {
  try {
    await requireAdmin()
    const promoCodes = await prisma.promoCode.findMany({
      orderBy: { createdAt: 'desc' },
    })

    const result = await Promise.all(
      promoCodes.map(async (promo) => {
        const analytics = await prisma.order.aggregate({
          _count: true,
          _sum: { promoCodeDiscountCents: true },
          where: {
            promoCodeId: promo.id,
          },
        })

        return serializePromoCode(promo, {
          orders: analytics._count,
          discountGiven: analytics._sum.promoCodeDiscountCents ?? 0,
        })
      }),
    )

    return NextResponse.json({ promoCodes: result })
  } catch (error) {
    console.error('Admin promo-codes GET error:', error)
    if ((error as Error).message === 'Unauthorized' || (error as Error).message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to load promo codes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const payload = await request.json()
    const data = createPromoSchema.parse(payload)

    let startAt: Date
    let endAt: Date
    
    try {
      console.log('Raw date inputs:', { startAt: data.startAt, endAt: data.endAt })
      const startAtStr = appendMalaysiaOffset(data.startAt)
      const endAtStr = appendMalaysiaOffset(data.endAt)
      console.log('Formatted dates:', { startAtStr, endAtStr })
      startAt = new Date(startAtStr)
      endAt = new Date(endAtStr)
      console.log('Parsed dates:', { startAt: startAt.toISOString(), endAt: endAt.toISOString() })
    } catch (dateError) {
      console.error('Date parsing error:', dateError, { startAt: data.startAt, endAt: data.endAt })
      return NextResponse.json({ error: `Invalid date format: ${(dateError as Error).message}` }, { status: 400 })
    }

    if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
      console.error('Invalid date values:', { startAt: data.startAt, endAt: data.endAt, parsedStart: startAt, parsedEnd: endAt })
      return NextResponse.json({ error: 'Invalid date provided' }, { status: 400 })
    }

    if (endAt <= startAt) {
      return NextResponse.json({ error: 'End time must be after start time' }, { status: 400 })
    }

    const code = data.code.trim().toUpperCase()
    const discountValue =
      data.discountType === 'PERCENTAGE'
        ? Math.min(100, Math.max(1, Math.round(data.discountValue)))
        : Math.round(data.discountValue * 100)
    const minOrderCents = data.minOrder ? Math.round(data.minOrder * 100) : 0

    const promo = await prisma.promoCode.create({
      data: {
        code,
        description: data.description || null,
        discountType: data.discountType,
        discountValue,
        minOrderCents,
        startAt,
        endAt,
        timezone: data.timezone || 'Asia/Kuala_Lumpur',
      },
    })

    return NextResponse.json(
      serializePromoCode(promo, {
        orders: 0,
        discountGiven: 0,
      }),
    )
  } catch (error) {
    console.error('Admin promo-codes POST error:', error)
    console.error('Error type:', error?.constructor?.name)
    console.error('Error details:', {
      message: (error as Error).message,
      stack: (error as Error).stack,
      name: (error as Error).name,
    })
    
    // Log the full error for debugging
    if (error instanceof Error) {
      try {
        console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)))
      } catch (e) {
        console.error('Could not stringify error:', e)
      }
    }
    
    // Check if it's a Prisma validation error
    if ((error as any)?.code === 'P2009' || (error as any)?.code === 'P2012' || (error as Error).message?.includes('Unknown arg')) {
      console.error('PRISMA CLIENT OUT OF SYNC - Please run: npx prisma generate')
      return NextResponse.json({ 
        error: 'Database schema mismatch', 
        details: 'The Prisma client needs to be regenerated. Please stop the server, run "npx prisma generate", and restart.',
        hint: 'This usually happens when the database schema was updated but Prisma client was not regenerated.'
      }, { status: 500 })
    }
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    if ((error as Error).message?.includes('Unique constraint failed') || (error as Error).message?.includes('UNIQUE constraint')) {
      return NextResponse.json({ error: 'Promo code already exists' }, { status: 400 })
    }
    if ((error as Error).message === 'Unauthorized' || (error as Error).message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    // Return the actual error message to help debug
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ 
      error: 'Failed to create promo code', 
      details: errorMessage,
      fullError: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 })
  }
}


