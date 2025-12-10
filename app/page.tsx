import Hero from './components/Hero'
import ProductShowcase from './components/ProductShowcase'
import HowToUse from './components/HowToUse'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import BackgroundElements from './components/BackgroundElements'
import PageBackground from './components/PageBackground'
import { generatePageMetadata } from '@/lib/seo'
import { getContentBatch } from '@/lib/content'

// Force dynamic rendering since we use cookies for language detection
export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return await generatePageMetadata({
    title: 'Swiss Bright - Premium Mobile Gadgets',
    description: 'Your trusted source for premium mobile gadgets and accessories. Quality products, competitive prices, fast shipping.',
    path: '/',
    keywords: ['mobile gadgets', 'phone accessories', 'chargers', 'cases', 'cables', 'mobile accessories', 'tech gadgets'],
  })
}

export default async function Home() {
  // Fetch all content with error handling
  let headline = 'Premium Mobile Gadgets'
  let subheadline = 'Your trusted source for premium mobile gadgets and accessories. Quality products, competitive prices, fast shipping.'
  let ctaPrimary = 'Shop Now'
  let ctaSecondary = 'Why Buy From Us'
  let productEyebrow = 'Our Products'
  let productTitle = 'Quality Mobile Gadgets'
  let productDescription = 'Discover our curated selection of premium mobile gadgets and accessories. From protective cases to fast chargers, we offer quality products designed to enhance your mobile experience.'
  let productImage1 = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80'
  let productImage2 = 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=1200&q=80'

  try {
    // Fetch all content keys in a single database query for better performance
    const contentKeys = [
      'hero.headline',
      'hero.subheadline',
      'hero.cta.primary',
      'hero.cta.secondary',
      'product.eyebrow',
      'product.title',
      'product.description',
      'product.image1',
      'product.image2',
    ]
    
    const contentMap = await getContentBatch(contentKeys, 'en')

    // Extract values with fallbacks
    headline = contentMap['hero.headline'] || headline
    subheadline = contentMap['hero.subheadline'] || subheadline
    ctaPrimary = contentMap['hero.cta.primary'] || ctaPrimary
    ctaSecondary = contentMap['hero.cta.secondary'] || ctaSecondary
    productEyebrow = contentMap['product.eyebrow'] || productEyebrow
    productTitle = contentMap['product.title'] || productTitle
    productDescription = contentMap['product.description'] || productDescription
    productImage1 = contentMap['product.image1'] || productImage1
    productImage2 = contentMap['product.image2'] || productImage2
  } catch (error) {
    console.error('Error loading content, using defaults:', error)
  }

  return (
    <>
      <PageBackground />
      <BackgroundElements />
      <main className="main-content">
        <Hero 
          headline={headline}
          subheadline={subheadline}
          ctaPrimary={ctaPrimary}
          ctaSecondary={ctaSecondary}
        />
        <ProductShowcase 
          eyebrow={productEyebrow}
          title={productTitle}
          description={productDescription}
          image1={productImage1}
          image2={productImage2}
        />
        <HowToUse />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}

