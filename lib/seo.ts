import { prisma } from './db'
import { cache } from 'react'
import type { Metadata } from 'next'

export const getSeoSettings = cache(async () => {
  try {
    const settings = await prisma.seoSettings.findUnique({
      where: { id: 1 },
    })
    
    return settings || {
      siteName: 'SweetB',
      baseUrl: 'https://sweetb.co',
      defaultOgImage: '/og/default.jpg',
      twitterHandle: '@sweetb',
      updatedAt: new Date(),
    }
  } catch (error) {
    console.error('Error fetching SEO settings:', error)
    return {
      siteName: 'SweetB',
      baseUrl: 'https://sweetb.co',
      defaultOgImage: '/og/default.jpg',
      twitterHandle: '@sweetb',
      updatedAt: new Date(),
    }
  }
})

export async function generatePageMetadata(params: {
  title: string
  description: string
  path: string
  image?: string
  keywords?: string[]
}): Promise<Metadata> {
  const seo = await getSeoSettings()
  const url = `${seo.baseUrl}${params.path}`
  const imageUrl = params.image || seo.defaultOgImage
  const fullImageUrl = imageUrl.startsWith('http') 
    ? imageUrl 
    : `${seo.baseUrl}${imageUrl}`
  
  return {
    title: `${params.title} - ${seo.siteName}`,
    description: params.description,
    keywords: params.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: params.title,
      description: params.description,
      url,
      siteName: seo.siteName,
      images: [{
        url: fullImageUrl,
        width: 1200,
        height: 630,
        alt: params.title,
      }],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      site: seo.twitterHandle,
      title: params.title,
      description: params.description,
      images: [fullImageUrl],
    },
  }
}




