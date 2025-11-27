import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

const updateGiftSchema = z.object({
  name: z.string().min(1).max(100).optional(),
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin()
    const body = await request.json()
    const data = updateGiftSchema.parse(body)

    const existing = await prisma.gift.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Gift not found' }, { status: 404 })
    }

    const gift = await prisma.gift.update({
      where: { id: params.id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        ...(data.inventory !== undefined && { inventory: data.inventory }),
      },
    })

    await prisma.auditLog.create({
      data: {
        actorId: session.id,
        action: 'update_gift',
        targetId: params.id,
        details: JSON.stringify({ changes: data }),
      },
    })

    return NextResponse.json({ gift })
  } catch (error) {
    console.error('Update gift error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    if ((error as Error).message?.includes('Forbidden') || (error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to update gift' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin()

    const existing = await prisma.gift.findUnique({
      where: { id: params.id },
      include: { redemptions: true },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Gift not found' }, { status: 404 })
    }

    if (existing.redemptions.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete gift that has been used in redemptions' },
        { status: 400 }
      )
    }

    await prisma.gift.delete({
      where: { id: params.id },
    })

    await prisma.auditLog.create({
      data: {
        actorId: session.id,
        action: 'delete_gift',
        targetId: params.id,
        details: JSON.stringify({ giftName: existing.name }),
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Delete gift error:', error)
    if ((error as Error).message?.includes('Forbidden') || (error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to delete gift' }, { status: 500 })
  }
}

