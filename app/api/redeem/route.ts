import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await request.json()
    const { giftId } = body
    
    const user = await prisma.user.findUnique({
      where: { id: session.id },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const requiredFields: (keyof typeof user)[] = [
      'phoneNumber',
      'addressLine1',
      'city',
      'state',
      'postalCode',
      'country',
    ]

    const missingFields = requiredFields.filter((field) => {
      const value = (user as any)[field]
      return typeof value !== 'string' || value.trim().length === 0
    })

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Delivery details required before redemption',
          missingFields,
        },
        { status: 400 }
      )
    }

    const threshold = Number(process.env.GIFT_THRESHOLD || 10)
    const eligibleGifts = Math.floor(user.totalPurchases / threshold)

    if (eligibleGifts <= user.totalGifts) {
      return NextResponse.json(
        { 
          error: 'Not eligible for gift redemption',
          eligible: eligibleGifts,
          redeemed: user.totalGifts,
        },
        { status: 400 }
      )
    }

    // Validate gift exists and is active if giftId provided
    let gift = null
    if (giftId) {
      gift = await prisma.gift.findUnique({
        where: { id: giftId },
      })

      if (!gift) {
        return NextResponse.json(
          { error: 'Selected gift not found' },
          { status: 400 }
        )
      }

      if (!gift.isActive) {
        return NextResponse.json(
          { error: 'Selected gift is not available' },
          { status: 400 }
        )
      }
    }

    const redemption = await prisma.redemption.create({
      data: {
        userId: session.id,
        giftId: giftId || null,
        status: 'PENDING',
        // Keep legacy fields for backward compatibility
        giftDesc: gift ? gift.description || gift.name : null,
        giftImageUrl: gift ? gift.imageUrl : null,
      },
      include: {
        gift: true,
      },
    })

    await prisma.user.update({
      where: { id: session.id },
      data: { totalGifts: { increment: 1 } },
    })

    return NextResponse.json({ 
      ok: true,
      status: 'PENDING',
      redemption: {
        id: redemption.id,
        giftId: redemption.giftId,
        giftDesc: redemption.gift?.description || redemption.gift?.name || redemption.giftDesc,
        giftImageUrl: redemption.gift?.imageUrl || redemption.giftImageUrl,
        createdAt: redemption.createdAt,
      }
    })
  } catch (error) {
    console.error('Redeem error:', error)
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Please log in first' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Redemption failed' },
      { status: 500 }
    )
  }
}

