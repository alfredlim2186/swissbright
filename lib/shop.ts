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
  // Hardcoded products - no database required (20 products, 3 featured)
  const hardcodedProducts: ProductWithImages[] = [
    // Featured Products (3)
    {
      id: '1',
      name: 'Premium Clear Phone Case - iPhone 15 Pro',
      slug: 'premium-clear-phone-case-iphone-15-pro',
      shortDescription: 'Crystal clear protective case with anti-yellowing technology. Perfect fit for iPhone 15 Pro.',
      longDescription: 'Made from premium TPU material with anti-yellowing technology to keep your case crystal clear. Features raised edges to protect your screen and camera. Precise cutouts for all ports and buttons.',
      priceCents: 4500,
      currency: 'MYR',
      inventory: 50,
      isActive: true,
      isFeatured: true,
      heroImageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
      gallery: [
        {
          id: '1-1',
          productId: '1',
          imageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
          altText: 'Clear phone case front view',
          sortOrder: 0,
          createdAt: new Date(),
        },
      ],
    },
    {
      id: '2',
      name: 'Fast Wireless Charging Pad',
      slug: 'fast-wireless-charging-pad',
      shortDescription: '15W fast wireless charger with LED indicator. Compatible with all Qi-enabled devices.',
      longDescription: 'Charge your phone wirelessly at up to 15W speed. Features LED charging indicator, overheat protection, and foreign object detection. Works with all Qi-compatible smartphones.',
      priceCents: 8900,
      currency: 'MYR',
      inventory: 30,
      isActive: true,
      isFeatured: true,
      heroImageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
      gallery: [
        {
          id: '2-1',
          productId: '2',
          imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
          altText: 'Wireless charging pad',
          sortOrder: 0,
          createdAt: new Date(),
        },
      ],
    },
    {
      id: '3',
      name: 'MagSafe-Compatible Phone Stand',
      slug: 'magsafe-compatible-phone-stand',
      shortDescription: 'Premium aluminum stand with MagSafe compatibility. Perfect for desk use.',
      longDescription: 'Sturdy aluminum construction with built-in MagSafe magnets. Adjustable viewing angles and foldable design. Perfect for video calls, watching content, or hands-free use.',
      priceCents: 6500,
      currency: 'MYR',
      inventory: 25,
      isActive: true,
      isFeatured: true,
      heroImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
      gallery: [
        {
          id: '3-1',
          productId: '3',
          imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
          altText: 'MagSafe phone stand',
          sortOrder: 0,
          createdAt: new Date(),
        },
      ],
    },
    // Regular Products (17)
    {
      id: '4',
      name: 'USB-C Fast Charging Cable (2m)',
      slug: 'usb-c-fast-charging-cable-2m',
      shortDescription: 'Durable 2-meter USB-C cable with fast charging support. Nylon braided for extra durability.',
      longDescription: 'Premium USB-C to USB-C cable supporting fast charging up to 100W. Reinforced nylon braiding prevents tangling and extends cable life. Gold-plated connectors ensure optimal charging speed.',
      priceCents: 3500,
      currency: 'MYR',
      inventory: 100,
      isActive: true,
      isFeatured: false,
      heroImageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
      gallery: [
        {
          id: '4-1',
          productId: '4',
          imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
          altText: 'USB-C charging cable',
          sortOrder: 0,
          createdAt: new Date(),
        },
      ],
    },
    {
      id: '5',
      name: 'Tempered Glass Screen Protector - Universal',
      slug: 'tempered-glass-screen-protector-universal',
      shortDescription: '9H hardness tempered glass screen protector. Bubble-free installation with crystal clear clarity.',
      longDescription: 'Premium tempered glass with 9H hardness rating provides excellent scratch and impact protection. Features oleophobic coating to resist fingerprints and smudges.',
      priceCents: 2500,
      currency: 'MYR',
      inventory: 150,
      isActive: true,
      isFeatured: false,
      heroImageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
      gallery: [
        {
          id: '5-1',
          productId: '5',
          imageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
          altText: 'Tempered glass screen protector',
          sortOrder: 0,
          createdAt: new Date(),
        },
      ],
    },
    {
      id: '6',
      name: 'Adjustable Phone Stand - Aluminum',
      slug: 'adjustable-phone-stand-aluminum',
      shortDescription: 'Premium aluminum phone stand with adjustable viewing angles. Holds phones in portrait or landscape.',
      longDescription: 'Sturdy aluminum construction supports phones up to 7 inches. Adjustable viewing angles from 30° to 90°. Foldable design for easy portability.',
      priceCents: 4200,
      currency: 'MYR',
      inventory: 40,
      isActive: true,
      isFeatured: false,
      heroImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
      gallery: [
        {
          id: '6-1',
          productId: '6',
          imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
          altText: 'Aluminum phone stand',
          sortOrder: 0,
          createdAt: new Date(),
        },
      ],
    },
    {
      id: '7',
      name: 'Car Phone Mount - Magnetic',
      slug: 'car-phone-mount-magnetic',
      shortDescription: 'Strong magnetic car mount with 360° rotation. Easy one-handed operation.',
      longDescription: 'Powerful neodymium magnets securely hold your phone while driving. 360° rotation allows perfect viewing angle. Vent clip and dashboard mount options included.',
      priceCents: 5500,
      currency: 'MYR',
      inventory: 35,
      isActive: true,
      isFeatured: false,
      heroImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
      gallery: [
        {
          id: '7-1',
          productId: '7',
          imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
          altText: 'Car phone mount',
          sortOrder: 0,
          createdAt: new Date(),
        },
      ],
    },
    {
      id: '8',
      name: 'Portable Power Bank 20000mAh',
      slug: 'portable-power-bank-20000mah',
      shortDescription: 'High-capacity 20000mAh power bank with fast charging. USB-C and USB-A ports.',
      longDescription: 'Massive 20000mAh capacity charges your phone multiple times. Features fast charging support, dual USB ports, and LED battery indicator. Compact design perfect for travel.',
      priceCents: 12900,
      currency: 'MYR',
      inventory: 20,
      isActive: true,
      isFeatured: false,
      heroImageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
      gallery: [
        {
          id: '8-1',
          productId: '8',
          imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
          altText: 'Power bank',
          sortOrder: 0,
          createdAt: new Date(),
        },
      ],
    },
    {
      id: '9',
      name: 'Bluetooth Earbuds - True Wireless',
      slug: 'bluetooth-earbuds-true-wireless',
      shortDescription: 'Premium true wireless earbuds with noise cancellation. 30-hour battery life.',
      longDescription: 'Crystal clear audio with active noise cancellation. Comfortable fit with multiple ear tip sizes. IPX7 waterproof rating. Long battery life with charging case.',
      priceCents: 18900,
      currency: 'MYR',
      inventory: 15,
      isActive: true,
      isFeatured: false,
      heroImageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
      gallery: [
        {
          id: '9-1',
          productId: '9',
          imageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
          altText: 'Wireless earbuds',
          sortOrder: 0,
          createdAt: new Date(),
        },
      ],
    },
    {
      id: '10',
      name: 'Phone Camera Lens Kit',
      slug: 'phone-camera-lens-kit',
      shortDescription: 'Professional camera lens kit with wide-angle, macro, and fisheye lenses.',
      longDescription: 'Transform your phone camera into a professional setup. Includes wide-angle, macro, and fisheye lenses. Universal clip fits all smartphones. High-quality glass optics.',
      priceCents: 7500,
      currency: 'MYR',
      inventory: 28,
      isActive: true,
      isFeatured: false,
      heroImageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
      gallery: [
        {
          id: '10-1',
          productId: '10',
          imageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
          altText: 'Camera lens kit',
          sortOrder: 0,
          createdAt: new Date(),
        },
      ],
    },
    {
      id: '11',
      name: 'Phone Grip Ring - Pop Socket Style',
      slug: 'phone-grip-ring-pop-socket-style',
      shortDescription: 'Adjustable phone grip ring for secure one-handed use. Multiple colors available.',
      longDescription: 'Comfortable grip ring that extends and retracts. Prevents phone drops and makes one-handed use easy. Adhesive mount works with cases. Multiple color options.',
      priceCents: 1800,
      currency: 'MYR',
      inventory: 80,
      isActive: true,
      isFeatured: false,
      heroImageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
      gallery: [
        {
          id: '11-1',
          productId: '11',
          imageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
          altText: 'Phone grip ring',
          sortOrder: 0,
          createdAt: new Date(),
        },
      ],
    },
    {
      id: '12',
      name: 'Phone Wallet Case - Leather',
      slug: 'phone-wallet-case-leather',
      shortDescription: 'Premium leather wallet case with card slots. Holds 3 cards and cash.',
      longDescription: 'Genuine leather wallet case combines protection with convenience. Holds up to 3 cards and cash. Magnetic closure keeps everything secure. Available in multiple colors.',
      priceCents: 6800,
      currency: 'MYR',
      inventory: 22,
      isActive: true,
      isFeatured: false,
      heroImageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
      gallery: [
        {
          id: '12-1',
          productId: '12',
          imageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
          altText: 'Leather wallet case',
          sortOrder: 0,
          createdAt: new Date(),
        },
      ],
    },
    {
      id: '13',
      name: 'USB-C Hub - 7-in-1',
      slug: 'usb-c-hub-7-in-1',
      shortDescription: 'Multi-port USB-C hub with HDMI, USB 3.0, SD card reader, and more.',
      longDescription: 'Expand your device connectivity with 7 ports: HDMI 4K, 3x USB 3.0, SD/TF card readers, USB-C PD charging. Perfect for laptops, tablets, and phones.',
      priceCents: 11900,
      currency: 'MYR',
      inventory: 18,
      isActive: true,
      isFeatured: false,
      heroImageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
      gallery: [
        {
          id: '13-1',
          productId: '13',
          imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
          altText: 'USB-C hub',
          sortOrder: 0,
          createdAt: new Date(),
        },
      ],
    },
    {
      id: '14',
      name: 'Phone Cooling Fan',
      slug: 'phone-cooling-fan',
      shortDescription: 'Portable phone cooling fan with RGB lighting. Prevents overheating during gaming.',
      longDescription: 'Keep your phone cool during intensive gaming or charging. Adjustable fan speed with RGB lighting. Magnetic attachment works with MagSafe. USB-powered.',
      priceCents: 4800,
      currency: 'MYR',
      inventory: 32,
      isActive: true,
      isFeatured: false,
      heroImageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
      gallery: [
        {
          id: '14-1',
          productId: '14',
          imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
          altText: 'Phone cooling fan',
          sortOrder: 0,
          createdAt: new Date(),
        },
      ],
    },
    {
      id: '15',
      name: 'Phone Selfie Ring Light',
      slug: 'phone-selfie-ring-light',
      shortDescription: 'LED ring light with adjustable brightness. Perfect for video calls and selfies.',
      longDescription: 'Professional LED ring light with 3 brightness levels. Universal phone clip. USB rechargeable with long battery life. Perfect for content creators and video calls.',
      priceCents: 3200,
      currency: 'MYR',
      inventory: 45,
      isActive: true,
      isFeatured: false,
      heroImageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
      gallery: [
        {
          id: '15-1',
          productId: '15',
          imageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
          altText: 'Ring light',
          sortOrder: 0,
          createdAt: new Date(),
        },
      ],
    },
    {
      id: '16',
      name: 'Phone Tripod with Remote',
      slug: 'phone-tripod-with-remote',
      shortDescription: 'Adjustable tripod with Bluetooth remote shutter. Extends up to 1.5m.',
      longDescription: 'Sturdy tripod with adjustable height from 30cm to 1.5m. Includes Bluetooth remote for hands-free photos and videos. Universal phone mount. Lightweight and portable.',
      priceCents: 5500,
      currency: 'MYR',
      inventory: 30,
      isActive: true,
      isFeatured: false,
      heroImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
      gallery: [
        {
          id: '16-1',
          productId: '16',
          imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
          altText: 'Phone tripod',
          sortOrder: 0,
          createdAt: new Date(),
        },
      ],
    },
    {
      id: '17',
      name: 'Phone Stylus Pen',
      slug: 'phone-stylus-pen',
      shortDescription: 'Precision stylus pen with palm rejection. Works with all touch screens.',
      longDescription: 'Fine-tip stylus for precise drawing and note-taking. Palm rejection technology. Works with all capacitive touch screens. Rechargeable with long battery life.',
      priceCents: 2800,
      currency: 'MYR',
      inventory: 55,
      isActive: true,
      isFeatured: false,
      heroImageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
      gallery: [
        {
          id: '17-1',
          productId: '17',
          imageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
          altText: 'Stylus pen',
          sortOrder: 0,
          createdAt: new Date(),
        },
      ],
    },
    {
      id: '18',
      name: 'Phone Car Mount - Vent Clip',
      slug: 'phone-car-mount-vent-clip',
      shortDescription: 'Secure vent clip mount with one-touch release. 360° rotation.',
      longDescription: 'Strong grip vent clip mount holds phones securely. One-touch release button. 360° rotation for perfect viewing angle. Compatible with all phone sizes.',
      priceCents: 3800,
      currency: 'MYR',
      inventory: 42,
      isActive: true,
      isFeatured: false,
      heroImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
      gallery: [
        {
          id: '18-1',
          productId: '18',
          imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
          altText: 'Vent clip mount',
          sortOrder: 0,
          createdAt: new Date(),
        },
      ],
    },
    {
      id: '19',
      name: 'Phone Cleaning Kit',
      slug: 'phone-cleaning-kit',
      shortDescription: 'Complete cleaning kit with microfiber cloth, cleaning solution, and tools.',
      longDescription: 'Professional cleaning kit includes microfiber cloth, screen cleaning solution, brush, and cleaning tools. Safe for all phone screens and cases. Keeps your device spotless.',
      priceCents: 2200,
      currency: 'MYR',
      inventory: 60,
      isActive: true,
      isFeatured: false,
      heroImageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
      gallery: [
        {
          id: '19-1',
          productId: '19',
          imageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
          altText: 'Cleaning kit',
          sortOrder: 0,
          createdAt: new Date(),
        },
      ],
    },
    {
      id: '20',
      name: 'Phone Fingerprint Stickers',
      slug: 'phone-fingerprint-stickers',
      shortDescription: 'Decorative fingerprint-resistant stickers. Multiple designs available.',
      longDescription: 'Fun and functional stickers that reduce fingerprints on your phone. Multiple designs and patterns. Easy to apply and remove. Protects while personalizing your device.',
      priceCents: 1200,
      currency: 'MYR',
      inventory: 90,
      isActive: true,
      isFeatured: false,
      heroImageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
      gallery: [
        {
          id: '20-1',
          productId: '20',
          imageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
          altText: 'Fingerprint stickers',
          sortOrder: 0,
          createdAt: new Date(),
        },
      ],
    },
  ]

  try {
    // Try database first, fallback to hardcoded
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
    return products.length > 0 ? products : hardcodedProducts
  } catch (error) {
    console.warn('Database not available, using hardcoded products:', error)
    return hardcodedProducts
  }
}

export async function getActivePromotion(): Promise<ActivePromotion | null> {
  try {
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
  } catch (error) {
    console.warn('Database not available for promotions:', error)
    return null
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
  try {
    const [flag, products, promotion] = await Promise.all([
      prisma.featureFlag.findUnique({
        where: { key: SHOP_FEATURE_FLAG_KEY },
      }).catch(() => null),
      getShopCatalog(),
      getActivePromotion(),
    ])

    return {
      enabled: Boolean(flag?.enabled) || true, // Default to enabled if database unavailable
      products,
      promotion,
    }
  } catch (error) {
    console.warn('Database not available, using hardcoded shop state:', error)
    // Return hardcoded state if database fails
    const products = await getShopCatalog()
    return {
      enabled: true, // Always enabled when using hardcoded data
      products,
      promotion: null,
    }
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



