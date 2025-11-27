import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const couriers = await prisma.courier.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    })

    return NextResponse.json({
      couriers: couriers.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        feeCents: c.feeCents,
        fee: c.feeCents / 100,
      })),
    })
  } catch (error) {
    console.error('Couriers GET error:', error)
    return NextResponse.json({ error: 'Failed to load couriers' }, { status: 500 })
  }
}

