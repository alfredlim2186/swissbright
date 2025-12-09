import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Product highlight tiles translations
const productTiles = [
  {
    slug: 'discreetFormat',
    translations: {
      en: {
        title: 'Discreet Format',
        description: 'A single candy. No powders, no pills.',
      },
      ms: {
        title: 'Format Diskret',
        description: 'Sebiji gula-gula. Tiada serbuk, tiada pil.',
      },
      'zh-CN': {
        title: '低调形式',
        description: '一颗糖果。无粉末，无药丸。',
      },
    },
  },
  {
    slug: 'naturalBotanicals',
    translations: {
      en: {
        title: 'Natural Botanicals',
        description: 'Korean ginseng, Tongkat Ali, Maca—time-tested ingredients.',
      },
      ms: {
        title: 'Botani Semula Jadi',
        description: 'Ginseng Korea, Tongkat Ali, Maca—bahan yang telah diuji masa.',
      },
      'zh-CN': {
        title: '天然植物',
        description: '韩国人参、东革阿里、玛卡——久经考验的成分。',
      },
    },
  },
  {
    slug: 'lastingEffects',
    translations: {
      en: {
        title: 'Lasting Effects',
        description: 'Onset in 1-3 hours. Effects may last up to 3 days.',
      },
      ms: {
        title: 'Kesan Tahan Lama',
        description: 'Mula bertindak dalam 1-3 jam. Kesan boleh bertahan sehingga 3 hari.',
      },
      'zh-CN': {
        title: '持久效果',
        description: '1-3小时内起效。效果可持续长达3天。',
      },
    },
  },
]

async function main() {
  console.log('📦 Seeding product highlight tiles translations...')

  for (const tile of productTiles) {
    const baseKey = `product.highlight.${tile.slug}`

    // Seed for all languages
    for (const [lang, trans] of Object.entries(tile.translations)) {
      // Upsert title
      await prisma.content.upsert({
        where: {
          key_language: {
            key: `${baseKey}.title`,
            language: lang as 'en' | 'ms' | 'zh-CN',
          },
        },
        update: {
          value: trans.title,
          type: 'TEXT',
          section: 'product',
          label: `${tile.slug} - Title (${lang})`,
        },
        create: {
          key: `${baseKey}.title`,
          language: lang as 'en' | 'ms' | 'zh-CN',
          type: 'TEXT',
          value: trans.title,
          section: 'product',
          label: `${tile.slug} - Title (${lang})`,
        },
      })

      // Upsert description
      await prisma.content.upsert({
        where: {
          key_language: {
            key: `${baseKey}.description`,
            language: lang as 'en' | 'ms' | 'zh-CN',
          },
        },
        update: {
          value: trans.description,
          type: 'TEXT',
          section: 'product',
          label: `${tile.slug} - Description (${lang})`,
        },
        create: {
          key: `${baseKey}.description`,
          language: lang as 'en' | 'ms' | 'zh-CN',
          type: 'TEXT',
          value: trans.description,
          section: 'product',
          label: `${tile.slug} - Description (${lang})`,
        },
      })
    }

    console.log(`✅ Seeded tile: ${tile.slug} (en, ms, zh-CN)`)
  }

  console.log('✨ Product highlight tiles translations seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })



