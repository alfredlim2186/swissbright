import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

const profileSchema = z.object({
  name: z.string().trim().min(1).max(100).optional().or(z.literal('').transform(() => undefined)),
  aliasName: z.string().trim().min(1).max(100).optional().or(z.literal('').transform(() => undefined)),
  phoneNumber: z.string().trim().min(6).max(30).optional().or(z.literal('').transform(() => undefined)),
  addressLine1: z.string().trim().min(2).max(120).optional().or(z.literal('').transform(() => undefined)),
  addressLine2: z.string().trim().max(120).optional().or(z.literal('').transform(() => undefined)),
  city: z.string().trim().min(2).max(80).optional().or(z.literal('').transform(() => undefined)),
  state: z.string().trim().min(2).max(80).optional().or(z.literal('').transform(() => undefined)),
  postalCode: z.string().trim().min(2).max(20).optional().or(z.literal('').transform(() => undefined)),
  country: z.string().trim().min(2).max(80).optional().or(z.literal('').transform(() => undefined)),
})

export async function GET() {
  try {
    const session = await requireAuth()

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        name: true,
        aliasName: true,
        phoneNumber: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        profileUpdatedAt: true,
        createdAt: true,
      },
    })

    const latestShipment = await prisma.redemption.findFirst({
      where: {
        userId: session.id,
        courierName: { not: null },
        trackingNumber: { not: null },
      },
      orderBy: { updatedAt: 'desc' },
      select: {
        courierName: true,
        trackingNumber: true,
        status: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ profile: user, latestShipment })
  } catch (error) {
    console.error('Get account profile error:', error)
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await request.json()
    const parsed = profileSchema.parse(body)

    const updateData: any = {
      phoneNumber: parsed.phoneNumber ?? null,
      addressLine1: parsed.addressLine1 ?? null,
      addressLine2: parsed.addressLine2 ?? null,
      city: parsed.city ?? null,
      state: parsed.state ?? null,
      postalCode: parsed.postalCode ?? null,
      country: parsed.country ?? null,
      profileUpdatedAt: new Date(),
    }

    // Update name if provided
    if (parsed.name !== undefined) {
      updateData.name = parsed.name ?? null
    }

    // Update aliasName if provided
    if (parsed.aliasName !== undefined) {
      updateData.aliasName = parsed.aliasName ?? null
    }

    const profile = await prisma.user.update({
      where: { id: session.id },
      data: updateData,
      select: {
        name: true,
        aliasName: true,
        phoneNumber: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        profileUpdatedAt: true,
      },
    })

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Update account profile error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}


