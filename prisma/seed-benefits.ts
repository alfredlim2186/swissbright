import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Benefits page content (English only)
const benefitsContent = {
  back: '← Back to Home',
  title: 'Why Buy From Us',
  subtitle: 'Discover why Swiss Bright is your trusted choice for premium mobile gadgets and accessories.',
  quality: {
    title: 'Quality Assurance',
    p1: 'At Swiss Bright, we understand that <span class="highlight">quality matters</span>. Every product in our catalog is carefully selected and tested to meet our high standards. We partner with trusted manufacturers and suppliers to ensure you receive only the best mobile gadgets and accessories.',
    p2: 'Our quality control process includes rigorous testing for durability, compatibility, and performance. Whether it\'s a protective case, charging cable, or stand, we verify that each product delivers on its promises. This commitment to quality means you can shop with confidence, knowing that your purchase will serve you well.',
    p3: 'We stand behind every product we sell. If you\'re not satisfied with your purchase, our customer service team is here to help. Quality isn\'t just a promise—it\'s our foundation.',
  },
  pricing: {
    title: 'Competitive Pricing',
    p1: 'Getting premium quality doesn\'t mean paying premium prices. At Swiss Bright, we work hard to offer <span class="highlight">competitive pricing</span> on all our mobile gadgets and accessories. We believe that everyone deserves access to quality products without breaking the bank.',
    p2: 'Our direct relationships with suppliers and efficient operations allow us to pass savings directly to you. We regularly review our prices to ensure they remain competitive in the market. Plus, we offer special promotions and discounts throughout the year, so you can save even more on your favorite products.',
    p3: 'Value isn\'t just about the price tag—it\'s about getting quality products that last. At Swiss Bright, you get both: competitive prices and products you can rely on.',
  },
  shipping: {
    title: 'Fast & Reliable Shipping',
    p1: 'We know you want your products quickly. That\'s why we\'ve streamlined our shipping process to get your orders to you <span class="highlight">as fast as possible</span>. With multiple shipping options available, you can choose the delivery speed that works best for you.',
    p2: 'Our fulfillment team processes orders promptly, and we work with trusted courier partners to ensure reliable delivery. You\'ll receive tracking information as soon as your order ships, so you always know where your package is. We\'re committed to making your shopping experience smooth and hassle-free.',
    p3: 'Whether you need your mobile accessories urgently or can wait a few days, we have shipping options to fit your needs and budget. Fast shipping shouldn\'t cost a fortune, and at Swiss Bright, it doesn\'t.',
  },
  warranty: {
    title: 'Warranty & Support',
    p1: 'Your peace of mind matters to us. That\'s why we offer <span class="highlight">comprehensive warranty coverage</span> on our products and dedicated customer support to help with any questions or concerns. We\'re not just selling products—we\'re building relationships with our customers.',
    p2: 'Our warranty policies protect you against manufacturing defects and ensure you get the full value from your purchase. If something goes wrong, our support team is ready to assist with returns, replacements, or repairs. We believe in standing behind our products and our service.',
    p3: 'Shopping with Swiss Bright means you\'re never alone. From product selection to after-sales support, we\'re here to help every step of the way. Your satisfaction is our priority.',
  },
  final: {
    title: 'Experience the Swiss Bright Difference',
    text: 'These advantages work together to create a shopping experience you can trust. From quality products to competitive prices, fast shipping to reliable support, Swiss Bright is your partner in finding the perfect mobile gadgets and accessories.',
    shopButton: 'Shop Now',
    storyButton: 'Our Story',
  },
}

async function main() {
  console.log('💪 Seeding benefits page content (English only)...')

  const content = benefitsContent
  const lang = 'en'

  // Basic page content
  await prisma.content.upsert({
    where: { key_language: { key: 'benefits.back', language: lang } },
    update: { value: content.back, type: 'TEXT', page: 'benefits' },
    create: { key: 'benefits.back', language: lang, value: content.back, type: 'TEXT', page: 'benefits' },
  })
  await prisma.content.upsert({
    where: { key_language: { key: 'benefits.title', language: lang } },
    update: { value: content.title, type: 'TEXT', page: 'benefits' },
    create: { key: 'benefits.title', language: lang, value: content.title, type: 'TEXT', page: 'benefits' },
  })
  await prisma.content.upsert({
    where: { key_language: { key: 'benefits.subtitle', language: lang } },
    update: { value: content.subtitle, type: 'TEXT', page: 'benefits' },
    create: { key: 'benefits.subtitle', language: lang, value: content.subtitle, type: 'TEXT', page: 'benefits' },
  })

  // Quality section
  await prisma.content.upsert({
    where: { key_language: { key: 'benefits.quality.title', language: lang } },
    update: { value: content.quality.title, type: 'TEXT', page: 'benefits' },
    create: { key: 'benefits.quality.title', language: lang, value: content.quality.title, type: 'TEXT', page: 'benefits' },
  })
  await prisma.content.upsert({
    where: { key_language: { key: 'benefits.quality.p1', language: lang } },
    update: { value: content.quality.p1, type: 'TEXT', page: 'benefits' },
    create: { key: 'benefits.quality.p1', language: lang, value: content.quality.p1, type: 'TEXT', page: 'benefits' },
  })
  await prisma.content.upsert({
    where: { key_language: { key: 'benefits.quality.p2', language: lang } },
    update: { value: content.quality.p2, type: 'TEXT', page: 'benefits' },
    create: { key: 'benefits.quality.p2', language: lang, value: content.quality.p2, type: 'TEXT', page: 'benefits' },
  })
  await prisma.content.upsert({
    where: { key_language: { key: 'benefits.quality.p3', language: lang } },
    update: { value: content.quality.p3, type: 'TEXT', page: 'benefits' },
    create: { key: 'benefits.quality.p3', language: lang, value: content.quality.p3, type: 'TEXT', page: 'benefits' },
  })

  // Pricing section
  await prisma.content.upsert({
    where: { key_language: { key: 'benefits.pricing.title', language: lang } },
    update: { value: content.pricing.title, type: 'TEXT', page: 'benefits' },
    create: { key: 'benefits.pricing.title', language: lang, value: content.pricing.title, type: 'TEXT', page: 'benefits' },
  })
  await prisma.content.upsert({
    where: { key_language: { key: 'benefits.pricing.p1', language: lang } },
    update: { value: content.pricing.p1, type: 'TEXT', page: 'benefits' },
    create: { key: 'benefits.pricing.p1', language: lang, value: content.pricing.p1, type: 'TEXT', page: 'benefits' },
  })
  await prisma.content.upsert({
    where: { key_language: { key: 'benefits.pricing.p2', language: lang } },
    update: { value: content.pricing.p2, type: 'TEXT', page: 'benefits' },
    create: { key: 'benefits.pricing.p2', language: lang, value: content.pricing.p2, type: 'TEXT', page: 'benefits' },
  })
  await prisma.content.upsert({
    where: { key_language: { key: 'benefits.pricing.p3', language: lang } },
    update: { value: content.pricing.p3, type: 'TEXT', page: 'benefits' },
    create: { key: 'benefits.pricing.p3', language: lang, value: content.pricing.p3, type: 'TEXT', page: 'benefits' },
  })

  // Shipping section
  await prisma.content.upsert({
    where: { key_language: { key: 'benefits.shipping.title', language: lang } },
    update: { value: content.shipping.title, type: 'TEXT', page: 'benefits' },
    create: { key: 'benefits.shipping.title', language: lang, value: content.shipping.title, type: 'TEXT', page: 'benefits' },
  })
  await prisma.content.upsert({
    where: { key_language: { key: 'benefits.shipping.p1', language: lang } },
    update: { value: content.shipping.p1, type: 'TEXT', page: 'benefits' },
    create: { key: 'benefits.shipping.p1', language: lang, value: content.shipping.p1, type: 'TEXT', page: 'benefits' },
  })
  await prisma.content.upsert({
    where: { key_language: { key: 'benefits.shipping.p2', language: lang } },
    update: { value: content.shipping.p2, type: 'TEXT', page: 'benefits' },
    create: { key: 'benefits.shipping.p2', language: lang, value: content.shipping.p2, type: 'TEXT', page: 'benefits' },
  })
  await prisma.content.upsert({
    where: { key_language: { key: 'benefits.shipping.p3', language: lang } },
    update: { value: content.shipping.p3, type: 'TEXT', page: 'benefits' },
    create: { key: 'benefits.shipping.p3', language: lang, value: content.shipping.p3, type: 'TEXT', page: 'benefits' },
  })

  // Warranty section
  await prisma.content.upsert({
    where: { key_language: { key: 'benefits.warranty.title', language: lang } },
    update: { value: content.warranty.title, type: 'TEXT', page: 'benefits' },
    create: { key: 'benefits.warranty.title', language: lang, value: content.warranty.title, type: 'TEXT', page: 'benefits' },
  })
  await prisma.content.upsert({
    where: { key_language: { key: 'benefits.warranty.p1', language: lang } },
    update: { value: content.warranty.p1, type: 'TEXT', page: 'benefits' },
    create: { key: 'benefits.warranty.p1', language: lang, value: content.warranty.p1, type: 'TEXT', page: 'benefits' },
  })
  await prisma.content.upsert({
    where: { key_language: { key: 'benefits.warranty.p2', language: lang } },
    update: { value: content.warranty.p2, type: 'TEXT', page: 'benefits' },
    create: { key: 'benefits.warranty.p2', language: lang, value: content.warranty.p2, type: 'TEXT', page: 'benefits' },
  })
  await prisma.content.upsert({
    where: { key_language: { key: 'benefits.warranty.p3', language: lang } },
    update: { value: content.warranty.p3, type: 'TEXT', page: 'benefits' },
    create: { key: 'benefits.warranty.p3', language: lang, value: content.warranty.p3, type: 'TEXT', page: 'benefits' },
  })

  // Final section
  await prisma.content.upsert({
    where: { key_language: { key: 'benefits.final.title', language: lang } },
    update: { value: content.final.title, type: 'TEXT', page: 'benefits' },
    create: { key: 'benefits.final.title', language: lang, value: content.final.title, type: 'TEXT', page: 'benefits' },
  })
  await prisma.content.upsert({
    where: { key_language: { key: 'benefits.final.text', language: lang } },
    update: { value: content.final.text, type: 'TEXT', page: 'benefits' },
    create: { key: 'benefits.final.text', language: lang, value: content.final.text, type: 'TEXT', page: 'benefits' },
  })
  await prisma.content.upsert({
    where: { key_language: { key: 'benefits.final.shopButton', language: lang } },
    update: { value: content.final.shopButton, type: 'TEXT', page: 'benefits' },
    create: { key: 'benefits.final.shopButton', language: lang, value: content.final.shopButton, type: 'TEXT', page: 'benefits' },
  })
  await prisma.content.upsert({
    where: { key_language: { key: 'benefits.final.storyButton', language: lang } },
    update: { value: content.final.storyButton, type: 'TEXT', page: 'benefits' },
    create: { key: 'benefits.final.storyButton', language: lang, value: content.final.storyButton, type: 'TEXT', page: 'benefits' },
  })

  console.log('✨ Benefits page content seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })



