import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

const contactLinkSchema = z.object({
  label: z.string().min(2).max(120),
  url: z.string().url(),
  logoUrl: z.union([z.string().url(), z.literal('')]).optional().transform((val) => val === '' ? undefined : val),
  description: z.string().max(200).optional(),
  accentColor: z.string().regex(/^#|rgba|rgb|hsl/, 'Provide a valid CSS color').optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

export async function GET() {
  try {
    await requireAdmin()
    const links = await prisma.contactLink.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    })
    return NextResponse.json({ links })
  } catch (error) {
    console.error('Get contact links error:', error)
    if ((error as Error).message?.includes('Forbidden') || (error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to load contacts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = await request.json()
    const payload = contactLinkSchema.parse(body)
    const maxOrder = await prisma.contactLink.aggregate({ _max: { sortOrder: true } })
    const link = await prisma.contactLink.create({
      data: {
        ...payload,
        sortOrder: payload.sortOrder ?? (maxOrder._max.sortOrder ?? 0) + 1,
      },
    })
    return NextResponse.json({ link })
  } catch (error) {
    console.error('Create contact link error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    if ((error as Error).message?.includes('Forbidden') || (error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to create contact link' }, { status: 500 })
  }
}


