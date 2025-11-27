import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

const flagSchema = z.object({
  key: z.string(),
  enabled: z.boolean(),
})

export async function GET() {
  try {
    await requireAdmin()

    const flags = await prisma.featureFlag.findMany({
      orderBy: {
        key: 'asc',
      },
    })

    return NextResponse.json({ flags })
  } catch (error) {
    console.error('Get flags error:', error)
    if ((error as Error).message?.includes('Forbidden') || (error as Error).message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to fetch flags' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin()
    const body = await request.json()
    const { key, enabled } = flagSchema.parse(body)

    // Use upsert to create the flag if it doesn't exist
    const flag = await prisma.featureFlag.upsert({
      where: { key },
      update: { enabled },
      create: {
        key,
        enabled,
        meta: JSON.stringify({ description: `Feature flag for ${key}` }),
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        actorId: session.id,
        action: 'toggle_feature_flag',
        targetId: key,
        details: JSON.stringify({
          key,
          enabled,
        }),
      },
    })

    return NextResponse.json({ ok: true, flag })
  } catch (error) {
    console.error('Toggle flag error:', error)
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
      { error: 'Toggle failed', details: (error as Error).message },
      { status: 500 }
    )
  }
}

