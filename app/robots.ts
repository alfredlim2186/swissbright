import { MetadataRoute } from 'next'
import { getSeoSettings } from '@/lib/seo'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getSeoSettings()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/account/'],
    },
    sitemap: `${seo.baseUrl}/sitemap.xml`,
  }
}




