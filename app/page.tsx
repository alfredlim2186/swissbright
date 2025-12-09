import Hero from './components/Hero'
import ProductShowcase from './components/ProductShowcase'
import HowToUse from './components/HowToUse'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import BackgroundElements from './components/BackgroundElements'
import PageBackground from './components/PageBackground'
import { generatePageMetadata } from '@/lib/seo'
import { getContent } from '@/lib/content'

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
    const [
      headlineResult,
      subheadlineResult,
      ctaPrimaryResult,
      ctaSecondaryResult,
      productEyebrowResult,
      productTitleResult,
      productDescriptionResult,
      productImage1Result,
      productImage2Result,
    ] = await Promise.allSettled([
      getContent('hero.headline', headline),
      getContent('hero.subheadline', subheadline),
      getContent('hero.cta.primary', ctaPrimary),
      getContent('hero.cta.secondary', ctaSecondary),
      getContent('product.eyebrow', productEyebrow),
      getContent('product.title', productTitle),
      getContent('product.description', productDescription),
      getContent('product.image1', productImage1),
      getContent('product.image2', productImage2),
    ])

    // Extract values from settled promises
    headline = headlineResult.status === 'fulfilled' ? headlineResult.value : headline
    subheadline = subheadlineResult.status === 'fulfilled' ? subheadlineResult.value : subheadline
    ctaPrimary = ctaPrimaryResult.status === 'fulfilled' ? ctaPrimaryResult.value : ctaPrimary
    ctaSecondary = ctaSecondaryResult.status === 'fulfilled' ? ctaSecondaryResult.value : ctaSecondary
    productEyebrow = productEyebrowResult.status === 'fulfilled' ? productEyebrowResult.value : productEyebrow
    productTitle = productTitleResult.status === 'fulfilled' ? productTitleResult.value : productTitle
    productDescription = productDescriptionResult.status === 'fulfilled' ? productDescriptionResult.value : productDescription
    productImage1 = productImage1Result.status === 'fulfilled' ? productImage1Result.value : productImage1
    productImage2 = productImage2Result.status === 'fulfilled' ? productImage2Result.value : productImage2
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

