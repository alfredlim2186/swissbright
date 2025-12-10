import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json(
      { 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          aliasName: (user as any).aliasName,
          role: user.role,
          totalPurchases: user.totalPurchases,
          totalGifts: user.totalGifts,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
          phoneNumber: user.phoneNumber,
          addressLine1: user.addressLine1,
          addressLine2: user.addressLine2,
          city: user.city,
          state: user.state,
          postalCode: user.postalCode,
          country: user.country,
          profileUpdatedAt: user.profileUpdatedAt,
        }
      },
      {
        headers: {
          'Cache-Control': 'private, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    )
  }
}

