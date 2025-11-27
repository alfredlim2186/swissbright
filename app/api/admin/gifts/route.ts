import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

const giftSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional().nullable(),
  imageUrl: z.string().refine(
    (val) => {
      if (!val || val.trim() === '') return true // Allow empty
      if (val.startsWith('/')) return true // Allow relative URLs
      try {
        new URL(val) // Check if valid absolute URL
        return true
      } catch {
        return false
      }
    },
    { message: 'Image URL must be a valid URL or start with /' }
  ).transform((val) => {
    if (!val || val.trim() === '') return null
    return val
  }).optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  inventory: z.number().int().min(0).optional(),
})

export async function GET() {
  try {
    await requireAdmin()

    const gifts = await prisma.gift.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json({ gifts })
  } catch (error) {
    console.error('Get gifts error:', error)
    if ((error as Error).message?.includes('Forbidden') || (error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to fetch gifts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin()
    const body = await request.json()
    const data = giftSchema.parse(body)

    const gift = await prisma.gift.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        imageUrl: data.imageUrl ?? null,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
        inventory: data.inventory ?? 0,
      },
    })

    await prisma.auditLog.create({
      data: {
        actorId: session.id,
        action: 'create_gift',
        targetId: gift.id,
        details: JSON.stringify({ giftName: gift.name }),
      },
    })

    return NextResponse.json({ gift })
  } catch (error) {
    console.error('Create gift error:', error)
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.errors)
      return NextResponse.json({ 
        error: 'Invalid input', 
        details: error.errors,
        message: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      }, { status: 400 })
    }
    if ((error as Error).message?.includes('Forbidden') || (error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    return NextResponse.json({ 
      error: 'Failed to create gift',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

