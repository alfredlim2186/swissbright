import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Default ingredients data matching the component
const defaultIngredients = [
  {
    slug: 'korean-red-ginseng',
    name: 'Korean Red Ginseng',
    benefit: 'Energy & vitality',
    icon: '🌿',
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=400&q=80',
    imageAlt: 'Korean red ginseng root',
  },
  {
    slug: 'tongkat-ali',
    name: 'Tongkat Ali',
    benefit: 'Supports natural testosterone',
    icon: '🌱',
    image: 'https://images.unsplash.com/photo-1616361444779-9d8b97e1c6f0?w=400&q=80',
    imageAlt: 'Tongkat ali plant',
  },
  {
    slug: 'maca-root',
    name: 'Maca Root',
    benefit: 'Endurance & stamina',
    icon: '🌾',
    image: 'https://images.unsplash.com/photo-1599932477328-0a35f0d33b4a?w=400&q=80',
    imageAlt: 'Maca root powder',
  },
  {
    slug: 'l-arginine',
    name: 'L-Arginine',
    benefit: 'Promotes healthy blood flow',
    icon: '◉',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
    imageAlt: 'Natural supplements',
  },
  {
    slug: 'tribulus-terrestris',
    name: 'Tribulus Terrestris',
    benefit: 'Performance optimization',
    icon: '✧',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&q=80',
    imageAlt: 'Tribulus terrestris plant',
  },
]

async function main() {
  console.log('🌿 Seeding ingredients data...')

  // Seed for English (en) language
  for (const ingredient of defaultIngredients) {
    const baseKey = `ingredients.${ingredient.slug}`

    // Upsert name
    await prisma.content.upsert({
      where: {
        key_language: {
          key: `${baseKey}.name`,
          language: 'en',
        },
      },
      update: {
        value: ingredient.name,
        type: 'TEXT',
        section: 'ingredients',
        label: `${ingredient.name} - Name`,
      },
      create: {
        key: `${baseKey}.name`,
        language: 'en',
        type: 'TEXT',
        value: ingredient.name,
        section: 'ingredients',
        label: `${ingredient.name} - Name`,
      },
    })

    // Upsert benefit
    await prisma.content.upsert({
      where: {
        key_language: {
          key: `${baseKey}.benefit`,
          language: 'en',
        },
      },
      update: {
        value: ingredient.benefit,
        type: 'TEXT',
        section: 'ingredients',
        label: `${ingredient.name} - Benefit`,
      },
      create: {
        key: `${baseKey}.benefit`,
        language: 'en',
        type: 'TEXT',
        value: ingredient.benefit,
        section: 'ingredients',
        label: `${ingredient.name} - Benefit`,
      },
    })

    // Upsert icon
    await prisma.content.upsert({
      where: {
        key_language: {
          key: `${baseKey}.icon`,
          language: 'en',
        },
      },
      update: {
        value: ingredient.icon,
        type: 'ICON',
        section: 'ingredients',
        label: `${ingredient.name} - Icon`,
      },
      create: {
        key: `${baseKey}.icon`,
        language: 'en',
        type: 'ICON',
        value: ingredient.icon,
        section: 'ingredients',
        label: `${ingredient.name} - Icon`,
      },
    })

    // Upsert image
    await prisma.content.upsert({
      where: {
        key_language: {
          key: `${baseKey}.image`,
          language: 'en',
        },
      },
      update: {
        value: ingredient.image,
        type: 'IMAGE',
        section: 'ingredients',
        label: `${ingredient.name} - Image`,
      },
      create: {
        key: `${baseKey}.image`,
        language: 'en',
        type: 'IMAGE',
        value: ingredient.image,
        section: 'ingredients',
        label: `${ingredient.name} - Image`,
      },
    })

    // Upsert imageAlt
    await prisma.content.upsert({
      where: {
        key_language: {
          key: `${baseKey}.imageAlt`,
          language: 'en',
        },
      },
      update: {
        value: ingredient.imageAlt,
        type: 'TEXT',
        section: 'ingredients',
        label: `${ingredient.name} - Image Alt Text`,
      },
      create: {
        key: `${baseKey}.imageAlt`,
        language: 'en',
        type: 'TEXT',
        value: ingredient.imageAlt,
        section: 'ingredients',
        label: `${ingredient.name} - Image Alt Text`,
      },
    })

    console.log(`✅ Seeded ingredient: ${ingredient.name}`)
  }

  console.log('✨ Ingredients seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

