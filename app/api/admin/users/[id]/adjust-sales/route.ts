import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

const adjustSchema = z.object({
  delta: z.number().int(),
  reason: z.string().min(1),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin()
    const body = await request.json()
    const { delta, reason } = adjustSchema.parse(body)

    // Update user
    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        totalPurchases: {
          increment: delta,
        },
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        actorId: session.id,
        action: 'adjust_sales',
        targetId: params.id,
        details: JSON.stringify({
          delta,
          reason,
          previousTotal: user.totalPurchases - delta,
          newTotal: user.totalPurchases,
        }),
      },
    })

    return NextResponse.json({ 
      ok: true,
      newTotal: user.totalPurchases,
    })
  } catch (error) {
    console.error('Adjust sales error:', error)
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
      { error: 'Adjustment failed' },
      { status: 500 }
    )
  }
}

