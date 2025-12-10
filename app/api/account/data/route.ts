import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * Combined endpoint to fetch all account data in a single request
 * This reduces the number of API calls from 4 to 1, improving performance
 */
export async function GET() {
  try {
    const session = await requireAuth()

    // Fetch all data in parallel
    const [user, latestShipment, redemptions, gifts] = await Promise.all([
      // User data
      prisma.user.findUnique({
        where: { id: session.id },
        select: {
          id: true,
          email: true,
          name: true,
          aliasName: true,
          role: true,
          totalPurchases: true,
          totalGifts: true,
          emailVerified: true,
          createdAt: true,
          phoneNumber: true,
          addressLine1: true,
          addressLine2: true,
          city: true,
          state: true,
          postalCode: true,
          country: true,
          profileUpdatedAt: true,
        },
      }),
      // Latest shipment
      prisma.redemption.findFirst({
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
      }),
      // Redemptions
      prisma.redemption.findMany({
        where: {
          userId: session.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          status: true,
          giftDesc: true,
          giftImageUrl: true,
          createdAt: true,
          updatedAt: true,
          courierName: true,
          trackingNumber: true,
          shippedAt: true,
        },
      }),
      // Active gifts
      prisma.gift.findMany({
        where: { isActive: true },
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'desc' },
        ],
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
          inventory: true,
        },
      }),
    ])

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Structure profile data for compatibility
    const profile = {
      name: user.name,
      aliasName: user.aliasName,
      phoneNumber: user.phoneNumber,
      addressLine1: user.addressLine1,
      addressLine2: user.addressLine2,
      city: user.city,
      state: user.state,
      postalCode: user.postalCode,
      country: user.country,
      profileUpdatedAt: user.profileUpdatedAt,
      createdAt: user.createdAt,
    }

    return NextResponse.json(
      {
        user,
        profile,
        latestShipment,
        redemptions,
        gifts,
      },
      {
        headers: {
          'Cache-Control': 'private, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
  } catch (error) {
    console.error('Get account data error:', error)
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Please log in' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to fetch account data' },
      { status: 500 }
    )
  }
}

