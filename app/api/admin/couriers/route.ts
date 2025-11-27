import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { numberToCents } from '@/lib/shop'

const createCourierSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional().nullable(),
  fee: z.number().min(0),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

const updateCourierSchema = createCourierSchema.partial()

export async function GET() {
  try {
    await requireAdmin()
    const couriers = await prisma.courier.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    })

    return NextResponse.json({
      couriers: couriers.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        feeCents: c.feeCents,
        fee: c.feeCents / 100,
        isActive: c.isActive,
        sortOrder: c.sortOrder,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Admin couriers GET error:', error)
    if ((error as Error).message === 'Unauthorized' || (error as Error).message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to load couriers' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const payload = await request.json()
    const data = createCourierSchema.parse(payload)

    const courier = await prisma.courier.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        feeCents: numberToCents(data.fee),
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
    })

    return NextResponse.json({
      courier: {
        id: courier.id,
        name: courier.name,
        description: courier.description,
        feeCents: courier.feeCents,
        fee: courier.feeCents / 100,
        isActive: courier.isActive,
        sortOrder: courier.sortOrder,
        createdAt: courier.createdAt.toISOString(),
        updatedAt: courier.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    console.error('Admin couriers POST error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    if ((error as Error).message?.includes('Unique constraint failed')) {
      return NextResponse.json({ error: 'Courier name already exists' }, { status: 400 })
    }
    if ((error as Error).message === 'Unauthorized' || (error as Error).message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to create courier' }, { status: 500 })
  }
}

