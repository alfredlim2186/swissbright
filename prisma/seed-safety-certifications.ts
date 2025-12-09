import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Certification translations
const certifications = [
  {
    slug: 'iso22000',
    code: 'ISO 22000',
    icon: '🏆',
    translations: {
      en: {
        title: 'Food Safety Management',
        description: 'Food safety management at every stage of production.',
      },
      ms: {
        title: 'Pengurusan Keselamatan Makanan',
        description: 'Pengurusan keselamatan makanan pada setiap peringkat pengeluaran.',
      },
      'zh-CN': {
        title: '食品安全管理',
        description: '在生产过程的每个阶段进行食品安全管理。',
      },
    },
  },
  {
    slug: 'gmp',
    code: 'GMP',
    icon: '✓',
    translations: {
      en: {
        title: 'Good Manufacturing Practice',
        description: 'Ensures consistent quality and purity in every batch.',
      },
      ms: {
        title: 'Amalan Pembuatan Baik',
        description: 'Memastikan kualiti dan kesucian yang konsisten dalam setiap kumpulan.',
      },
      'zh-CN': {
        title: '良好生产规范',
        description: '确保每批产品的一致质量和纯度。',
      },
    },
  },
  {
    slug: 'iso9001',
    code: 'ISO 9001',
    icon: '⚡',
    translations: {
      en: {
        title: 'Quality Management',
        description: 'Quality management focused on continuous improvement and reliability.',
      },
      ms: {
        title: 'Pengurusan Kualiti',
        description: 'Pengurusan kualiti yang fokus pada peningkatan berterusan dan kebolehpercayaan.',
      },
      'zh-CN': {
        title: '质量管理',
        description: '专注于持续改进和可靠性的质量管理。',
      },
    },
  },
  {
    slug: 'haccp',
    code: 'HACCP',
    icon: '◆',
    translations: {
      en: {
        title: 'Hazard Analysis',
        description: 'Rigorous preventive control for safe and traceable production.',
      },
      ms: {
        title: 'Analisis Bahaya',
        description: 'Kawalan pencegahan yang ketat untuk pengeluaran yang selamat dan boleh dikesan.',
      },
      'zh-CN': {
        title: '危害分析',
        description: '严格的预防控制，确保安全且可追溯的生产。',
      },
    },
  },
  {
    slug: 'organic',
    code: 'ORGANIC',
    icon: '🌿',
    translations: {
      en: {
        title: 'Certified Organic',
        description: 'Natural ingredients sourced from certified organic farms.',
      },
      ms: {
        title: 'Bersijil Organik',
        description: 'Bahan semula jadi yang diperoleh dari ladang organik yang disahkan.',
      },
      'zh-CN': {
        title: '有机认证',
        description: '来自认证有机农场的天然成分。',
      },
    },
  },
  {
    slug: 'vegetarian',
    code: 'VEGETARIAN',
    icon: '🌱',
    translations: {
      en: {
        title: 'Vegetarian Safe',
        description: '100% plant-based ingredients with no animal derivatives.',
      },
      ms: {
        title: 'Selamat untuk Vegetarian',
        description: '100% bahan berasaskan tumbuhan tanpa derivatif haiwan.',
      },
      'zh-CN': {
        title: '素食安全',
        description: '100% 植物成分，不含动物衍生物。',
      },
    },
  },
]

async function main() {
  console.log('🛡️  Seeding safety certification translations...')

  for (const cert of certifications) {
    const baseKey = `safety.cert.${cert.slug}`

    // Seed for all languages
    for (const [lang, trans] of Object.entries(cert.translations)) {
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
          section: 'safety',
          label: `${cert.code} - Title (${lang})`,
        },
        create: {
          key: `${baseKey}.title`,
          language: lang as 'en' | 'ms' | 'zh-CN',
          type: 'TEXT',
          value: trans.title,
          section: 'safety',
          label: `${cert.code} - Title (${lang})`,
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
          section: 'safety',
          label: `${cert.code} - Description (${lang})`,
        },
        create: {
          key: `${baseKey}.description`,
          language: lang as 'en' | 'ms' | 'zh-CN',
          type: 'TEXT',
          value: trans.description,
          section: 'safety',
          label: `${cert.code} - Description (${lang})`,
        },
      })
    }

    console.log(`✅ Seeded certification: ${cert.code} (en, ms, zh-CN)`)
  }

  console.log('✨ Safety certification translations seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })



