import { prisma } from './db'
import { cache } from 'react'
import type { Language } from './i18n-constants'
import { SUPPORTED_LANGUAGES } from './i18n-constants'

/**
 * Get current language from cookies (server-side only)
 * Use this in Server Components only
 */
export async function getCurrentLanguage(): Promise<Language> {
  try {
    // Dynamic import to avoid build-time errors
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const lang = cookieStore.get('language')?.value as Language
    return lang && SUPPORTED_LANGUAGES.includes(lang) ? lang : 'en'
  } catch (error) {
    // If cookies() is not available (client-side or error), return default
    console.error('Error getting language from cookies:', error)
    return 'en'
  }
}

/**
 * Get content by key with language support and fallback
 */
export const getContent = cache(async (
  key: string, 
  fallback: string = '',
  language?: Language
): Promise<string> => {
  try {
    let lang: Language = 'en'
    
    if (language) {
      lang = language
    } else {
      try {
        lang = await getCurrentLanguage()
      } catch (error) {
        console.error('Error getting current language, defaulting to English:', error)
        lang = 'en'
      }
    }
    
    try {
      const content = await prisma.content.findUnique({
        where: { 
          key_language: {
            key,
            language: lang,
          }
        },
      })
      
      if (content?.value) {
        return content.value
      }
      
      // If not found in current language, try English as fallback
      if (lang !== 'en') {
        const englishContent = await prisma.content.findUnique({
          where: { 
            key_language: {
              key,
              language: 'en',
            }
          },
        })
        if (englishContent?.value) {
          return englishContent.value
        }
      }
    } catch (dbError) {
      console.error(`Database error fetching content for key "${key}" (${lang}):`, dbError)
    }
    
    return fallback
  } catch (error) {
    console.error(`Error fetching content for key "${key}":`, error)
    return fallback
  }
})

/**
 * Get all content items for a specific page/section and language
 */
export const getContentByPage = cache(async (
  page?: string, 
  section?: string,
  language?: Language
) => {
  try {
    const lang = language || await getCurrentLanguage()
    const where: any = { language: lang }
    if (page) where.page = page
    if (section) where.section = section

    const content = await prisma.content.findMany({
      where,
      orderBy: { key: 'asc' },
    })
    return content
  } catch (error) {
    console.error('Error fetching content by page/section:', error)
    return []
  }
})

/**
 * Get all content items for a specific language
 */
export const getAllContent = cache(async (language?: Language) => {
  try {
    const lang = language || await getCurrentLanguage()
    return await prisma.content.findMany({
      where: { language: lang },
      orderBy: [{ page: 'asc' }, { section: 'asc' }, { key: 'asc' }],
    })
  } catch (error) {
    console.error('Error fetching all content:', error)
    return []
  }
})

/**
 * Content keys with their default values and metadata
 * This defines all editable content on the site
 */
export const CONTENT_DEFAULTS = {
  // Hero Section
  'hero.headline': {
    value: 'Vitality Reborn',
    type: 'TEXT',
    page: 'home',
    section: 'hero',
    label: 'Hero Headline',
    description: 'Main headline on the homepage hero section',
  },
  'hero.subheadline': {
    value: 'A discreet daily candy crafted for balanced energy, focus, and confidence — without the noise.',
    type: 'TEXT',
    page: 'home',
    section: 'hero',
    label: 'Hero Subheadline',
    description: 'Subheadline text below the main headline',
  },
  'hero.cta.primary': {
    value: 'Discover SweetB',
    type: 'TEXT',
    page: 'home',
    section: 'hero',
    label: 'Primary CTA Button',
    description: 'Text for the primary call-to-action button',
  },
  'hero.cta.secondary': {
    value: 'Learn More',
    type: 'TEXT',
    page: 'home',
    section: 'hero',
    label: 'Secondary CTA Button',
    description: 'Text for the secondary call-to-action button',
  },

  // Product Showcase
  'product.eyebrow': {
    value: 'The Product',
    type: 'TEXT',
    page: 'home',
    section: 'product',
    label: 'Product Eyebrow',
    description: 'Small text above the product title',
  },
  'product.title': {
    value: 'Discreet Power, Natural Balance',
    type: 'TEXT',
    page: 'home',
    section: 'product',
    label: 'Product Title',
    description: 'Main title for the product showcase section',
  },
  'product.description': {
    value: 'Each SweetB candy combines time-tested botanicals with modern nutritional science. Formulated for men who value subtle strength and lasting performance.',
    type: 'TEXT',
    page: 'home',
    section: 'product',
    label: 'Product Description',
    description: 'Description text introducing the product',
  },
  'product.image1': {
    value: '/images/product/product-1.jpg',
    type: 'IMAGE',
    page: 'home',
    section: 'product',
    label: 'Product Image 1',
    description: 'First product lifestyle image',
  },
  'product.image2': {
    value: '/images/product/product-2.jpg',
    type: 'IMAGE',
    page: 'home',
    section: 'product',
    label: 'Product Image 2',
    description: 'Second product lifestyle image',
  },

  // Ingredients
  'ingredients.title': {
    value: 'Ingredients',
    type: 'TEXT',
    page: 'home',
    section: 'ingredients',
    label: 'Ingredients Title',
    description: 'Title for the ingredients section',
  },
  'ingredients.description': {
    value: 'SweetB combines time-tested botanicals with modern nutritional science to deliver balanced support for energy, focus, and vitality.',
    type: 'TEXT',
    page: 'home',
    section: 'ingredients',
    label: 'Ingredients Description',
    description: 'Description text for the ingredients section',
  },

  // Safety Section
  'safety.title': {
    value: 'Our Commitment to Safety',
    type: 'TEXT',
    page: 'home',
    section: 'safety',
    label: 'Safety Title',
    description: 'Title for the safety section',
  },
  'safety.description': {
    value: 'Every piece of SweetB is crafted under the highest global standards of quality and safety.',
    type: 'TEXT',
    page: 'home',
    section: 'safety',
    label: 'Safety Description',
    description: 'Description text for the safety section',
  },
  'safety.closing': {
    value: 'These standards are more than numbers or labels. They represent our promise — that every SweetB candy you enjoy is pure, safe, and manufactured with integrity.',
    type: 'TEXT',
    page: 'home',
    section: 'safety',
    label: 'Safety Closing Statement',
    description: 'Closing statement for the safety section',
  },
  'header.verify': {
    value: 'Verify',
    type: 'TEXT',
    page: 'home',
    section: 'header',
    label: 'Header Verify Link',
    description: 'Verify link text in header',
  },
} as const

