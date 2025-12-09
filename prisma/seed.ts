import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@swissbright.com' },
    update: {},
    create: {
      email: 'admin@swissbright.com',
      name: 'Admin',
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create feature flags
  const luckyDrawFlag = await prisma.featureFlag.upsert({
    where: { key: 'lucky_draw_enabled' },
    update: {},
    create: {
      key: 'lucky_draw_enabled',
      enabled: false,
    },
  })
  console.log('✅ Feature flag created:', luckyDrawFlag.key)

  const randomDrawFlag = await prisma.featureFlag.upsert({
    where: { key: 'random_draw_enabled' },
    update: {},
    create: {
      key: 'random_draw_enabled',
      enabled: false,
    },
  })
  console.log('✅ Feature flag created:', randomDrawFlag.key)

  // Enable shop feature flag
  const shopFlag = await prisma.featureFlag.upsert({
    where: { key: 'shop_enabled' },
    update: { enabled: true },
    create: {
      key: 'shop_enabled',
      enabled: true,
    },
  })
  console.log('✅ Shop feature flag enabled')

  // Seed SEO settings
  const seoSettings = await prisma.seoSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteName: 'Swiss Bright',
      baseUrl: 'https://swissbright.com',
      defaultOgImage: '/og/default.jpg',
      twitterHandle: '@swissbright',
    },
  })
  console.log('✅ SEO settings seeded:', seoSettings.baseUrl)

  // Import and run product seeding
  const { execSync } = require('child_process')
  try {
    execSync('tsx prisma/seed-products.ts', { stdio: 'inherit' })
  } catch (error) {
    console.log('⚠️  Product seeding skipped (run separately if needed)')
  }

  console.log('✨ Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

