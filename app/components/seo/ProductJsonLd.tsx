import { getSeoSettings } from '@/lib/seo'

interface ProductJsonLdProps {
  name: string
  description: string
  image?: string
  price?: string
  currency?: string
}

export default async function ProductJsonLd({ 
  name, 
  description, 
  image,
  price,
  currency = 'USD'
}: ProductJsonLdProps) {
  const seo = await getSeoSettings()
  const imageUrl = image || seo.defaultOgImage
  const fullImageUrl = imageUrl.startsWith('http') 
    ? imageUrl 
    : `${seo.baseUrl}${imageUrl}`
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "brand": {
      "@type": "Brand",
      "name": "SweetB"
    },
    "image": [fullImageUrl],
    "description": description,
    "category": "DietarySupplement",
    "url": `${seo.baseUrl}/flavours/lychee-mint`,
    ...(price && {
      "offers": {
        "@type": "Offer",
        "price": price,
        "priceCurrency": currency,
        "availability": "https://schema.org/InStock"
      }
    })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}




