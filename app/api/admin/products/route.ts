import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import {
  ensureUniqueProductSlug,
  getShopState,
  hasFeaturedCapacity,
  mapProductToPayload,
  MAX_FEATURED_PRODUCTS,
  numberToCents,
} from '@/lib/shop'

const imageSchema = z.object({
  url: z.string().min(1, 'Image URL is required'),
  altText: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
})

const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().optional(),
  description: z.string().optional(),
  longDescription: z.string().optional(),
  heroImageUrl: z.string().optional(),
  price: z.coerce.number().min(0),
  inventory: z.coerce.number().int().min(0),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  images: z.array(imageSchema).optional(),
})

export async function GET() {
  try {
    await requireAdmin()
    const { enabled, products } = await getShopState()

    return NextResponse.json({
      shopEnabled: enabled,
      maxFeatured: MAX_FEATURED_PRODUCTS,
      products: products.map(mapProductToPayload),
    })
  } catch (error) {
    console.error('Admin products GET error:', error)
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if ((error as Error).message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const payload = await request.json()
    const data = createProductSchema.parse(payload)

    if (data.isFeatured) {
      const hasCapacity = await hasFeaturedCapacity()
      if (!hasCapacity) {
        return NextResponse.json(
          { error: `Only ${MAX_FEATURED_PRODUCTS} products can be featured at a time.` },
          { status: 400 },
        )
      }
    }

    const slug = await ensureUniqueProductSlug(data.slug || data.name)

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        shortDescription: data.description,
        longDescription: data.longDescription,
        heroImageUrl: data.heroImageUrl,
        inventory: data.inventory,
        priceCents: numberToCents(data.price),
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        gallery: data.images
          ? {
              create: data.images.map((image, index) => ({
                imageUrl: image.url,
                altText: image.altText,
                sortOrder: image.sortOrder ?? index,
              })),
            }
          : undefined,
      },
      include: {
        gallery: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    return NextResponse.json({
      product: mapProductToPayload(product),
    })
  } catch (error) {
    console.error('Admin products POST error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if ((error as Error).message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}


