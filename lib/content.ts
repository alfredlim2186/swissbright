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
 * Get content by key (English only) - Hardcoded, no database required
 */
export const getContent = cache(async (
  key: string, 
  fallback: string = ''
): Promise<string> => {
  // Hardcoded content - no database required
  const hardcodedContent: Record<string, string> = {
    'header.whyBuyFromUs': 'Why Buy From Us',
    'header.verify': 'Verify',
    'promotionalmodal.message': 'Welcome to Swiss Bright',
    'memberbanner.message': 'Join Swiss Bright today',
  }
  
  if (hardcodedContent[key]) {
    return hardcodedContent[key]
  }
  
  try {
    const content = await prisma.content.findUnique({
      where: { 
        key_language: {
          key,
          language: 'en',
        }
      },
    })
    
    if (content?.value) {
      return content.value
    }
    
    return fallback
  } catch (error) {
    // Database not available, return fallback
    return fallback
  }
})

/**
 * Batch fetch multiple content keys in a single database query
 * More efficient than calling getContent() multiple times
 */
export const getContentBatch = cache(async (
  keys: string[],
  language: Language = 'en'
): Promise<Record<string, string>> => {
  const result: Record<string, string> = {}
  
  // Check hardcoded content first
  const hardcodedContent: Record<string, string> = {
    'header.whyBuyFromUs': 'Why Buy From Us',
    'header.verify': 'Verify',
    'promotionalmodal.message': 'Welcome to Swiss Bright',
    'memberbanner.message': 'Join Swiss Bright today',
  }
  
  keys.forEach(key => {
    if (hardcodedContent[key]) {
      result[key] = hardcodedContent[key]
    }
  })
  
  // Fetch remaining keys from database in a single query
  const keysToFetch = keys.filter(key => !result[key])
  if (keysToFetch.length > 0) {
    try {
      const contentItems = await prisma.content.findMany({
        where: {
          key: { in: keysToFetch },
          language,
        },
      })
      
      contentItems.forEach(item => {
        result[item.key] = item.value
      })
    } catch (error) {
      console.error('Error fetching content batch:', error)
    }
  }
  
  return result
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
    value: 'Premium Mobile Gadgets',
    type: 'TEXT',
    page: 'home',
    section: 'hero',
    label: 'Hero Headline',
    description: 'Main headline on the homepage hero section',
  },
  'hero.subheadline': {
    value: 'Your trusted source for premium mobile gadgets and accessories. Quality products, competitive prices, fast shipping.',
    type: 'TEXT',
    page: 'home',
    section: 'hero',
    label: 'Hero Subheadline',
    description: 'Subheadline text below the main headline',
  },
  'hero.cta.primary': {
    value: 'Shop Now',
    type: 'TEXT',
    page: 'home',
    section: 'hero',
    label: 'Primary CTA Button',
    description: 'Text for the primary call-to-action button',
  },
  'hero.cta.secondary': {
    value: 'Why Buy From Us',
    type: 'TEXT',
    page: 'home',
    section: 'hero',
    label: 'Secondary CTA Button',
    description: 'Text for the secondary call-to-action button',
  },

  // Product Showcase
  'product.eyebrow': {
    value: 'Our Products',
    type: 'TEXT',
    page: 'home',
    section: 'product',
    label: 'Product Eyebrow',
    description: 'Small text above the product title',
  },
  'product.title': {
    value: 'Quality Mobile Gadgets',
    type: 'TEXT',
    page: 'home',
    section: 'product',
    label: 'Product Title',
    description: 'Main title for the product showcase section',
  },
  'product.description': {
    value: 'Discover our curated selection of premium mobile gadgets and accessories. From protective cases to fast chargers, we offer quality products designed to enhance your mobile experience.',
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
    value: 'Swiss Bright combines quality materials with modern technology to deliver reliable mobile accessories and gadgets that enhance your daily experience.',
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
    value: 'Every product from Swiss Bright is crafted under the highest global standards of quality and safety.',
    type: 'TEXT',
    page: 'home',
    section: 'safety',
    label: 'Safety Description',
    description: 'Description text for the safety section',
  },
  'safety.closing': {
    value: 'These standards are more than numbers or labels. They represent our promise — that every Swiss Bright product you purchase is quality-tested, safe, and manufactured with integrity.',
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
  'header.whyBuyFromUs': {
    value: 'Why Buy From Us',
    type: 'TEXT',
    page: 'home',
    section: 'header',
    label: 'Header Why Buy From Us Link',
    description: 'Why Buy From Us link text in header',
  },
} as const

