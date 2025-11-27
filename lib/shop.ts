import { prisma } from './db'
import type { FeatureFlag, Product, ProductImage, Promotion } from '@prisma/client'

export const SHOP_FEATURE_FLAG_KEY = 'shop_enabled'
export const MAX_FEATURED_PRODUCTS = 3

export type ProductWithImages = Product & { gallery: ProductImage[] }
export type ActivePromotion = Pick<Promotion, 'id' | 'discountType' | 'discountValue' | 'name'> & {
  startAt: string
  endAt: string
}

export const centsToNumber = (value: number) => {
  return Number((value ?? 0) / 100)
}

export const numberToCents = (value: number) => {
  if (!Number.isFinite(value)) return 0
  return Math.round(value * 100)
}

export const generateProductSlug = (source: string) => {
  return source
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const mapProductToPayload = (product: ProductWithImages) => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  description: product.shortDescription ?? '',
  longDescription: product.longDescription ?? '',
  heroImageUrl: product.heroImageUrl ?? '',
  price: centsToNumber(product.priceCents),
  inventory: product.inventory,
  isActive: product.isActive,
  isFeatured: product.isFeatured,
  createdAt: product.createdAt.toISOString(),
  updatedAt: product.updatedAt.toISOString(),
  images: product.gallery
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((image) => ({
      id: image.id,
      url: image.imageUrl,
      altText: image.altText ?? '',
      sortOrder: image.sortOrder,
    })),
})

export async function getShopCatalog() {
  const products = await prisma.product.findMany({
    include: {
      gallery: {
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy: [
      { isFeatured: 'desc' },
      { createdAt: 'desc' },
    ],
  })

  return products
}

export async function getActivePromotion(): Promise<ActivePromotion | null> {
  const now = new Date()
  const promotions = await prisma.promotion.findMany({
    where: {
      isActive: true,
      startAt: { lte: now },
      endAt: { gte: now },
    },
    orderBy: { startAt: 'desc' },
  })

  // Find first promotion that hasn't reached usage limit
  const promotion = promotions.find((p) => {
    if (p.maxUsage === null) return true // Unlimited
    return (p.completedUsageCount ?? 0) < p.maxUsage
  })

  if (!promotion) {
    return null
  }

  return {
    id: promotion.id,
    name: promotion.name,
    discountType: promotion.discountType as 'PERCENTAGE' | 'FIXED',
    discountValue: promotion.discountType === 'PERCENTAGE'
      ? promotion.discountValue
      : promotion.discountValue,
    startAt: promotion.startAt.toISOString(),
    endAt: promotion.endAt.toISOString(),
  }
}

export function applyPromotionToPrice(
  priceCents: number,
  promotion?: ActivePromotion | null,
) {
  if (!promotion) {
    return { final: priceCents, discount: 0 }
  }

  if (promotion.discountType === 'PERCENTAGE') {
    const discount = Math.min(priceCents, Math.floor((priceCents * promotion.discountValue) / 100))
    return { final: priceCents - discount, discount }
  }

  const discount = Math.min(priceCents, promotion.discountValue)
  return { final: priceCents - discount, discount }
}

export async function getShopState() {
  const [flag, products, promotion] = await Promise.all([
    prisma.featureFlag.findUnique({
      where: { key: SHOP_FEATURE_FLAG_KEY },
    }),
    getShopCatalog(),
    getActivePromotion(),
  ])

  return {
    enabled: Boolean(flag?.enabled),
    products,
    promotion,
  }
}

export async function getShopFlag(): Promise<FeatureFlag | null> {
  return prisma.featureFlag.findUnique({
    where: { key: SHOP_FEATURE_FLAG_KEY },
  })
}

export async function hasFeaturedCapacity(excludeProductId?: string) {
  const count = await prisma.product.count({
    where: {
      isFeatured: true,
      ...(excludeProductId ? { id: { not: excludeProductId } } : {}),
    },
  })
  return count < MAX_FEATURED_PRODUCTS
}

export async function ensureUniqueProductSlug(base: string, excludeProductId?: string) {
  const fallback = `product-${Date.now()}`
  const normalized = generateProductSlug(base || fallback) || fallback
  let slug = normalized
  let counter = 1

  let existing = await prisma.product.findUnique({ where: { slug } })

  while (existing && existing.id !== excludeProductId) {
    slug = `${normalized}-${counter++}`
    existing = await prisma.product.findUnique({ where: { slug } })
  }

  return slug
}



