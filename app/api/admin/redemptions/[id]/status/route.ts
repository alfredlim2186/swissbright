import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

const statusSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'SHIPPED', 'REJECTED']),
  note: z.string().optional(),
  courierName: z.string().trim().min(2).max(80).optional(),
  trackingNumber: z.string().trim().min(2).max(120).optional(),
  giftImageUrl: z.string().url().optional().nullable(),
  giftDesc: z.string().max(500).optional().nullable(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin()
    const body = await request.json()
    const { status, note, courierName, trackingNumber, giftImageUrl, giftDesc } = statusSchema.parse(body)

    if (status === 'SHIPPED' && (!courierName || !trackingNumber)) {
      return NextResponse.json(
        { error: 'Courier name and tracking number are required when marking as shipped.' },
        { status: 400 }
      )
    }

    const updateData: any = {
      status,
      approvedBy: session.email,
    }

    if (status === 'SHIPPED') {
      updateData.courierName = courierName
      updateData.trackingNumber = trackingNumber
      updateData.shippedAt = new Date()
    } else if (courierName || trackingNumber) {
      updateData.courierName = courierName ?? null
      updateData.trackingNumber = trackingNumber ?? null
      updateData.shippedAt = null
    }

    // Update gift image and description if provided
    if (giftImageUrl !== undefined) {
      updateData.giftImageUrl = giftImageUrl
    }
    if (giftDesc !== undefined) {
      updateData.giftDesc = giftDesc
    }

    const redemption = await prisma.redemption.update({
      where: { id: params.id },
      data: updateData,
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        actorId: session.id,
        action: 'update_redemption_status',
        targetId: params.id,
        details: JSON.stringify({
          newStatus: status,
          note,
          redemptionId: params.id,
        }),
      },
    })

    return NextResponse.json({ ok: true, redemption })
  } catch (error) {
    console.error('Update redemption status error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    if ((error as Error).message?.includes('Forbidden') || (error as Error).message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Update failed' },
      { status: 500 }
    )
  }
}

