import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { numberToCents } from '@/lib/shop'

const updateCourierSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  fee: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

type RouteContext = {
  params: { id: string }
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin()
    const { id } = params
    const courier = await prisma.courier.findUnique({
      where: { id },
    })

    if (!courier) {
      return NextResponse.json({ error: 'Courier not found' }, { status: 404 })
    }

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
    console.error('Admin courier GET error:', error)
    if ((error as Error).message === 'Unauthorized' || (error as Error).message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to load courier' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin()
    const { id } = params
    const payload = await request.json()
    const data = updateCourierSchema.parse(payload)

    const updateData: any = {}
    if (data.name !== undefined) updateData.name = data.name.trim()
    if (data.description !== undefined) updateData.description = data.description?.trim() || null
    if (data.fee !== undefined) updateData.feeCents = numberToCents(data.fee)
    if (data.isActive !== undefined) updateData.isActive = data.isActive
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder

    const courier = await prisma.courier.update({
      where: { id },
      data: updateData,
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
    console.error('Admin courier PATCH error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    if ((error as Error).message?.includes('Record to update not found')) {
      return NextResponse.json({ error: 'Courier not found' }, { status: 404 })
    }
    if ((error as Error).message?.includes('Unique constraint failed')) {
      return NextResponse.json({ error: 'Courier name already exists' }, { status: 400 })
    }
    if ((error as Error).message === 'Unauthorized' || (error as Error).message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to update courier' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin()
    const { id } = params

    // Check if courier is used in any orders
    const orderCount = await prisma.order.count({
      where: { courierId: id },
    })

    if (orderCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete courier: ${orderCount} order(s) are using it. Deactivate instead.` },
        { status: 400 },
      )
    }

    await prisma.courier.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin courier DELETE error:', error)
    if ((error as Error).message?.includes('Record to delete does not exist')) {
      return NextResponse.json({ error: 'Courier not found' }, { status: 404 })
    }
    if ((error as Error).message === 'Unauthorized' || (error as Error).message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to delete courier' }, { status: 500 })
  }
}

