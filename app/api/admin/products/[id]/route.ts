import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import {
  ensureUniqueProductSlug,
  hasFeaturedCapacity,
  mapProductToPayload,
  MAX_FEATURED_PRODUCTS,
  numberToCents,
} from '@/lib/shop'

type RouteContext = {
  params: {
    id: string
  }
}

const imageSchema = z.object({
  url: z.string().min(1, 'Image URL is required'),
  altText: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
})

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  longDescription: z.string().optional(),
  heroImageUrl: z.string().optional().nullable(),
  price: z.coerce.number().min(0).optional(),
  inventory: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  images: z.array(imageSchema).optional(),
})

const toNullable = (value?: string | null) => {
  if (value === undefined) return undefined
  if (value === null) return null
  return value.trim() === '' ? null : value
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin()
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { gallery: { orderBy: { sortOrder: 'asc' } } },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ product: mapProductToPayload(product) })
  } catch (error) {
    console.error('Admin product GET error:', error)
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if ((error as Error).message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to load product' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin()
    const body = await request.json()
    const data = updateProductSchema.parse(body)

    const existing = await prisma.product.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (data.isFeatured && !existing.isFeatured) {
      const hasCapacity = await hasFeaturedCapacity(params.id)
      if (!hasCapacity) {
        return NextResponse.json(
          { error: `Only ${MAX_FEATURED_PRODUCTS} products can be featured at a time.` },
          { status: 400 },
        )
      }
    }

    const updateData: Prisma.ProductUpdateInput = {}

    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.shortDescription = toNullable(data.description)
    if (data.longDescription !== undefined) updateData.longDescription = toNullable(data.longDescription)
    if (data.heroImageUrl !== undefined) updateData.heroImageUrl = toNullable(data.heroImageUrl)
    if (data.price !== undefined) updateData.priceCents = numberToCents(data.price)
    if (data.inventory !== undefined) updateData.inventory = data.inventory
    if (data.isActive !== undefined) updateData.isActive = data.isActive
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured

    if (data.slug && data.slug !== existing.slug) {
      updateData.slug = await ensureUniqueProductSlug(data.slug, params.id)
    }

    if (data.images) {
      updateData.gallery = {
        deleteMany: {},
        create: data.images.map((image, index) => ({
          imageUrl: image.url,
          altText: image.altText,
          sortOrder: image.sortOrder ?? index,
        })),
      }
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
      include: { gallery: { orderBy: { sortOrder: 'asc' } } },
    })

    return NextResponse.json({ product: mapProductToPayload(product) })
  } catch (error) {
    console.error('Admin product PATCH error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if ((error as Error).message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin()
    await prisma.product.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Admin product DELETE error:', error)
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if ((error as Error).message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}


