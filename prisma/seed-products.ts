import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'

// Load environment variables from .env.local manually
try {
  const envPath = resolve(process.cwd(), '.env.local')
  const envFile = readFileSync(envPath, 'utf-8')
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim()
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  })
} catch (error) {
  console.warn('Could not load .env.local, using system environment variables')
}

const prisma = new PrismaClient()

// 20 realistic mobile gadget products with reasonable pricing
const products = [
  {
    name: 'Premium Clear Phone Case - iPhone 15 Pro',
    slug: 'premium-clear-phone-case-iphone-15-pro',
    shortDescription: 'Crystal clear protective case with anti-yellowing technology. Perfect fit for iPhone 15 Pro.',
    longDescription: 'Made from premium TPU material with anti-yellowing technology to keep your case crystal clear. Features raised edges to protect your screen and camera. Precise cutouts for all ports and buttons. Slim profile maintains your phone\'s sleek design while providing excellent protection.',
    priceCents: 4500, // RM 45.00
    inventory: 50,
    isFeatured: true,
    heroImageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80', altText: 'Clear phone case front view', sortOrder: 0 },
      { url: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80', altText: 'Clear phone case side view', sortOrder: 1 },
    ],
  },
  {
    name: 'Fast Wireless Charging Pad',
    slug: 'fast-wireless-charging-pad',
    shortDescription: '15W fast wireless charger with LED indicator. Compatible with all Qi-enabled devices.',
    longDescription: 'Charge your phone wirelessly at up to 15W speed. Features LED charging indicator, overheat protection, and foreign object detection. Works with all Qi-compatible smartphones. Sleek design with non-slip base keeps your phone secure while charging.',
    priceCents: 8900, // RM 89.00
    inventory: 30,
    isFeatured: true,
    heroImageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80', altText: 'Wireless charging pad', sortOrder: 0 },
    ],
  },
  {
    name: 'USB-C Fast Charging Cable (2m)',
    slug: 'usb-c-fast-charging-cable-2m',
    shortDescription: 'Durable 2-meter USB-C cable with fast charging support. Nylon braided for extra durability.',
    longDescription: 'Premium USB-C to USB-C cable supporting fast charging up to 100W. Reinforced nylon braiding prevents tangling and extends cable life. Gold-plated connectors ensure optimal charging speed and data transfer. Perfect for charging phones, tablets, and laptops.',
    priceCents: 3500, // RM 35.00
    inventory: 100,
    isFeatured: false,
    heroImageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80', altText: 'USB-C charging cable', sortOrder: 0 },
    ],
  },
  {
    name: 'Tempered Glass Screen Protector - Universal',
    slug: 'tempered-glass-screen-protector-universal',
    shortDescription: '9H hardness tempered glass screen protector. Bubble-free installation with crystal clear clarity.',
    longDescription: 'Premium tempered glass with 9H hardness rating provides excellent scratch and impact protection. Features oleophobic coating to resist fingerprints and smudges. Easy bubble-free installation with included cleaning kit. Maintains touch sensitivity and screen clarity.',
    priceCents: 2500, // RM 25.00
    inventory: 150,
    isFeatured: false,
    heroImageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80', altText: 'Tempered glass screen protector', sortOrder: 0 },
    ],
  },
  {
    name: 'Adjustable Phone Stand - Aluminum',
    slug: 'adjustable-phone-stand-aluminum',
    shortDescription: 'Premium aluminum phone stand with adjustable viewing angles. Holds phones in portrait or landscape.',
    longDescription: 'Sturdy aluminum construction supports phones up to 7 inches. Adjustable viewing angles from 30° to 90°. Foldable design for easy portability. Non-slip base and phone cradle keep your device secure. Perfect for video calls, watching content, or hands-free use.',
    priceCents: 4200, // RM 42.00
    inventory: 40,
    isFeatured: false,
    heroImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', altText: 'Aluminum phone stand', sortOrder: 0 },
    ],
  },
  {
    name: 'Car Phone Mount - Magnetic',
    slug: 'car-phone-mount-magnetic',
    shortDescription: 'Strong magnetic car mount with 360° rotation. Easy one-handed operation.',
    longDescription: 'Powerful neodymium magnets securely hold your phone while driving. 360° rotation allows perfect viewing angle. Vent clip and dashboard mount options included. Works with all phones (magnetic plate included for non-magnetic cases). One-handed operation for safe driving.',
    priceCents: 5500, // RM 55.00
    inventory: 35,
    isFeatured: false,
    heroImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', altText: 'Car phone mount', sortOrder: 0 },
    ],
  },
  {
    name: 'Portable Power Bank 20000mAh',
    slug: 'portable-power-bank-20000mah',
    shortDescription: 'High capacity 20000mAh power bank with fast charging. Charges multiple devices simultaneously.',
    longDescription: 'Massive 20000mAh capacity can charge most phones 4-5 times. Features fast charging technology and dual USB outputs. LED battery indicator shows remaining power. Compact design with built-in safety protections. Perfect for travel, camping, or daily use.',
    priceCents: 12900, // RM 129.00
    inventory: 25,
    isFeatured: true,
    heroImageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80', altText: 'Power bank', sortOrder: 0 },
    ],
  },
  {
    name: 'Bluetooth Earbuds - Wireless',
    slug: 'bluetooth-earbuds-wireless',
    shortDescription: 'True wireless earbuds with 30-hour battery life. Crystal clear sound and comfortable fit.',
    longDescription: 'Premium true wireless earbuds with active noise cancellation. 30-hour total battery life (6 hours per charge, 24 hours from case). IPX7 waterproof rating. Touch controls for music and calls. Ergonomic design ensures comfortable fit for extended use.',
    priceCents: 18900, // RM 189.00
    inventory: 20,
    isFeatured: false,
    heroImageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', altText: 'Wireless earbuds', sortOrder: 0 },
    ],
  },
  {
    name: 'Phone Camera Lens Kit',
    slug: 'phone-camera-lens-kit',
    shortDescription: 'Professional camera lens kit with wide-angle, macro, and fisheye lenses. Clip-on design.',
    longDescription: 'Transform your phone camera with this professional lens kit. Includes wide-angle, macro, and fisheye lenses. Universal clip-on design works with all smartphones. High-quality optical glass provides sharp, clear images. Perfect for photography enthusiasts and content creators.',
    priceCents: 7900, // RM 79.00
    inventory: 30,
    isFeatured: false,
    heroImageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80', altText: 'Camera lens kit', sortOrder: 0 },
    ],
  },
  {
    name: 'Phone Grip & Stand - PopSocket Style',
    slug: 'phone-grip-stand-popsocket',
    shortDescription: 'Collapsible phone grip and stand. Secure hold and comfortable viewing angle.',
    longDescription: 'Multi-functional phone accessory that works as a grip, stand, and wallet holder. Collapsible design when not in use. Strong adhesive base sticks securely to any phone or case. Comfortable grip reduces phone drops. Stands your phone in portrait or landscape mode.',
    priceCents: 3200, // RM 32.00
    inventory: 60,
    isFeatured: false,
    heroImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', altText: 'Phone grip stand', sortOrder: 0 },
    ],
  },
  {
    name: 'USB-C Hub with HDMI & USB Ports',
    slug: 'usb-c-hub-hdmi-usb',
    shortDescription: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and charging port.',
    longDescription: 'Expand your phone\'s connectivity with this versatile USB-C hub. Features HDMI output (4K), 3x USB 3.0 ports, SD/TF card readers, and USB-C charging pass-through. Compact design perfect for connecting to external displays, transferring files, or charging while using accessories.',
    priceCents: 14900, // RM 149.00
    inventory: 15,
    isFeatured: false,
    heroImageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80', altText: 'USB-C hub', sortOrder: 0 },
    ],
  },
  {
    name: 'Phone Ring Light - Selfie Light',
    slug: 'phone-ring-light-selfie',
    shortDescription: 'LED ring light with adjustable brightness. Perfect for selfies, video calls, and content creation.',
    longDescription: 'Professional LED ring light with 3 brightness levels and warm/cool color temperature options. Clips onto any phone. USB rechargeable with long battery life. Perfect for improving lighting in selfies, video calls, TikTok videos, and live streaming. Compact and portable design.',
    priceCents: 4900, // RM 49.00
    inventory: 45,
    isFeatured: false,
    heroImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', altText: 'Ring light', sortOrder: 0 },
    ],
  },
  {
    name: 'Phone Wallet Case - Leather',
    slug: 'phone-wallet-case-leather',
    shortDescription: 'Premium genuine leather wallet case with card slots. Protects phone and holds cards.',
    longDescription: 'Elegant genuine leather case with 3 card slots and cash pocket. Magnetic closure keeps everything secure. Full phone protection with raised screen and camera bezels. RFID blocking protects your cards from unauthorized scanning. Available in multiple colors.',
    priceCents: 8900, // RM 89.00
    inventory: 30,
    isFeatured: false,
    heroImageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80', altText: 'Leather wallet case', sortOrder: 0 },
    ],
  },
  {
    name: 'Phone Cooling Fan - Gaming',
    slug: 'phone-cooling-fan-gaming',
    shortDescription: 'Active cooling fan for phones. Prevents overheating during gaming and charging.',
    longDescription: 'Keep your phone cool during intensive gaming or fast charging. Dual-fan design provides efficient cooling. Adjustable fan speed with LED indicator. Clips securely onto phone. Prevents thermal throttling for better performance. USB-powered for convenience.',
    priceCents: 4500, // RM 45.00
    inventory: 40,
    isFeatured: false,
    heroImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', altText: 'Phone cooling fan', sortOrder: 0 },
    ],
  },
  {
    name: 'Phone Lanyard & Wrist Strap',
    slug: 'phone-lanyard-wrist-strap',
    shortDescription: 'Adjustable lanyard and wrist strap. Prevents phone drops and provides secure carrying.',
    longDescription: 'Durable phone lanyard with adjustable length (60-120cm). Comfortable wrist strap included. Universal attachment works with all phones and cases. Prevents accidental drops while taking photos or using phone. Perfect for travel, events, and active use.',
    priceCents: 1800, // RM 18.00
    inventory: 80,
    isFeatured: false,
    heroImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', altText: 'Phone lanyard', sortOrder: 0 },
    ],
  },
  {
    name: 'Phone Cleaning Kit - Microfiber',
    slug: 'phone-cleaning-kit-microfiber',
    shortDescription: 'Complete phone cleaning kit with microfiber cloth, cleaning solution, and tools.',
    longDescription: 'Professional cleaning kit includes premium microfiber cloth, screen cleaning solution, cleaning brush, and lint-free wipes. Safe for all phone screens and camera lenses. Removes fingerprints, smudges, and dust. Keeps your phone looking brand new.',
    priceCents: 2200, // RM 22.00
    inventory: 70,
    isFeatured: false,
    heroImageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80', altText: 'Phone cleaning kit', sortOrder: 0 },
    ],
  },
  {
    name: 'Phone Stylus Pen - Universal',
    slug: 'phone-stylus-pen-universal',
    shortDescription: 'Precision stylus pen for touchscreens. Works with all capacitive touch devices.',
    longDescription: 'High-precision stylus with fine tip for accurate writing and drawing. Works with all capacitive touchscreens. Comfortable grip design. Perfect for note-taking, drawing, or precise screen navigation. Includes replacement tips and storage case.',
    priceCents: 3500, // RM 35.00
    inventory: 50,
    isFeatured: false,
    heroImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', altText: 'Stylus pen', sortOrder: 0 },
    ],
  },
  {
    name: 'Phone Tripod Mount - Flexible',
    slug: 'phone-tripod-mount-flexible',
    shortDescription: 'Flexible tripod with phone mount. Perfect for stable photos and videos.',
    longDescription: 'Versatile flexible tripod with adjustable phone mount. Bendable legs wrap around objects for unique angles. Extends up to 25cm. Compatible with all phone sizes. Perfect for vlogging, time-lapse photography, and group selfies. Compact and portable.',
    priceCents: 5500, // RM 55.00
    inventory: 35,
    isFeatured: false,
    heroImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', altText: 'Flexible tripod', sortOrder: 0 },
    ],
  },
  {
    name: 'Phone Signal Booster - Antenna',
    slug: 'phone-signal-booster-antenna',
    shortDescription: 'External antenna booster for improved phone signal. Works in weak signal areas.',
    longDescription: 'Enhance your phone\'s signal strength with this external antenna booster. Extends signal range in weak coverage areas. Magnetic base attaches to metal surfaces. Compatible with all phones. Perfect for rural areas, basements, or buildings with poor reception.',
    priceCents: 6900, // RM 69.00
    inventory: 25,
    isFeatured: false,
    heroImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', altText: 'Signal booster', sortOrder: 0 },
    ],
  },
  {
    name: 'Phone Waterproof Pouch',
    slug: 'phone-waterproof-pouch',
    shortDescription: 'IPX8 waterproof phone pouch. Protects phone from water, sand, and dust.',
    longDescription: 'Keep your phone safe during water activities with this IPX8 certified waterproof pouch. Seals completely to protect from water, sand, and dust. Touchscreen works through the clear window. Floats on water if dropped. Perfect for beach, pool, or underwater photography.',
    priceCents: 3800, // RM 38.00
    inventory: 55,
    isFeatured: false,
    heroImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', altText: 'Waterproof pouch', sortOrder: 0 },
    ],
  },
  {
    name: 'Phone Fingerprint Stickers - 6 Pack',
    slug: 'phone-fingerprint-stickers-6pack',
    shortDescription: 'Decorative fingerprint stickers for phone backs. Adds grip and personalization.',
    longDescription: 'Set of 6 colorful fingerprint stickers to personalize your phone. Adds extra grip to prevent drops. Easy to apply and remove without residue. Various colors and patterns available. Fun way to customize your phone while improving functionality.',
    priceCents: 1500, // RM 15.00
    inventory: 100,
    isFeatured: false,
    heroImageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80', altText: 'Fingerprint stickers', sortOrder: 0 },
    ],
  },
]

async function main() {
  console.log('📦 Seeding mobile gadget products...')

  // Enable shop feature flag
  await prisma.featureFlag.upsert({
    where: { key: 'shop_enabled' },
    update: { enabled: true },
    create: {
      key: 'shop_enabled',
      enabled: true,
    },
  })
  console.log('✅ Shop feature flag enabled')

  // Create products
  for (const productData of products) {
    const { images, ...productInfo } = productData
    
    const product = await prisma.product.upsert({
      where: { slug: productInfo.slug },
      update: {
        name: productInfo.name,
        shortDescription: productInfo.shortDescription,
        longDescription: productInfo.longDescription,
        priceCents: productInfo.priceCents,
        inventory: productInfo.inventory,
        isActive: true, // Default to active for all products
        isFeatured: productInfo.isFeatured,
        heroImageUrl: productInfo.heroImageUrl,
      },
      create: {
        ...productInfo,
        isActive: true,
      },
    })

    // Delete existing images and create new ones
    await prisma.productImage.deleteMany({
      where: { productId: product.id },
    })

    // Create product images
    for (const imageData of images) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          imageUrl: imageData.url,
          altText: imageData.altText,
          sortOrder: imageData.sortOrder,
        },
      })
    }

    console.log(`✅ Created product: ${product.name}`)
  }

  console.log(`✨ Seeded ${products.length} products successfully!`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

