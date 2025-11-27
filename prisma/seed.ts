import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sweetb.co' },
    update: {},
    create: {
      email: 'admin@sweetb.co',
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

  // Seed SEO settings
  const seoSettings = await prisma.seoSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteName: 'SweetB',
      baseUrl: 'https://sweetb.co',
      defaultOgImage: '/og/default.jpg',
      twitterHandle: '@sweetb',
    },
  })
  console.log('✅ SEO settings seeded:', seoSettings.baseUrl)

  // Import and run translation seeding
  const { execSync } = require('child_process')
  try {
    execSync('tsx prisma/seed-translations.ts', { stdio: 'inherit' })
  } catch (error) {
    console.log('⚠️  Translation seeding skipped (run separately if needed)')
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

