import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Public API to fetch ingredients for frontend display
export async function GET() {
  try {
    // Fetch all ingredient content items
    const content = await prisma.content.findMany({
      where: {
        section: 'ingredients',
        key: {
          startsWith: 'ingredients.',
        },
      },
      orderBy: { key: 'asc' },
    })

    // Group by ingredient slug (e.g., "korean-red-ginseng")
    const ingredientsMap = new Map<string, any>()

    content.forEach((item) => {
      // Parse key like "ingredients.korean-red-ginseng.image" or "ingredients.korean-red-ginseng.name"
      const parts = item.key.split('.')
      if (parts.length >= 3) {
        const slug = parts[1] // e.g., "korean-red-ginseng"
        const field = parts[2] // e.g., "image", "name", "benefit", "icon"

        if (!ingredientsMap.has(slug)) {
          ingredientsMap.set(slug, {
            slug,
            name: '',
            benefit: '',
            image: '',
            icon: '🌿',
            imageAlt: '',
          })
        }

        const ingredient = ingredientsMap.get(slug)!
        if (field === 'name') ingredient.name = item.value
        else if (field === 'benefit') ingredient.benefit = item.value
        else if (field === 'image') ingredient.image = item.value
        else if (field === 'icon') ingredient.icon = item.value
        else if (field === 'imageAlt') ingredient.imageAlt = item.value
      }
    })

    // Convert to array and filter out incomplete ingredients
    const ingredients = Array.from(ingredientsMap.values())
      .filter((ing) => ing.name && ing.image) // Only include ingredients with name and image
      .sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json({ ingredients })
  } catch (error) {
    console.error('Ingredients API error:', error)
    return NextResponse.json({ ingredients: [] }, { status: 200 }) // Return empty array on error
  }
}

