import Hero from './components/Hero'
import LycheeMintTeaserWrapper from './components/flavours/LycheeMintTeaserWrapper'
import ProductShowcase from './components/ProductShowcase'
import Ingredients from './components/Ingredients'
import HowToUse from './components/HowToUse'
import Safety from './components/Safety'
import Precautions from './components/Precautions'
import OfferBanner from './components/OfferBanner'
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
    title: 'Vitality Reborn',
    description: 'A discreet daily candy crafted for balanced energy, focus, and confidence — without the noise. Natural botanicals for men\'s vitality.',
    path: '/',
    keywords: ['mens health', 'supplement', 'energy', 'focus', 'confidence', 'vitality', 'natural', 'botanical'],
  })
}

export default async function Home() {
  // Fetch all content with error handling
  let headline = 'Vitality Reborn'
  let subheadline = 'A discreet daily candy crafted for balanced energy, focus, and confidence — without the noise.'
  let ctaPrimary = 'Shop SweetB'
  let ctaSecondary = 'Learn More'
  let productEyebrow = 'The Product'
  let productTitle = 'One Candy. Quiet Confidence.'
  let productDescription = 'SweetB is not a pill, not a powder, not a ritual. It\'s a single, discreet candy—precisely formulated with time-honored botanicals to support energy, focus, and natural vitality. No noise. No fuss. Just steady, masculine poise.'
  let productImage1 = 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&q=80'
  let productImage2 = 'https://images.unsplash.com/photo-1516733968668-dbdce39c4651?w=1200&q=80'
  let ingredientsTitle = 'Ingredients'
  let ingredientsDescription = 'SweetB combines time-tested botanicals with modern nutritional science to deliver balanced support for energy, focus, and vitality.'
  let safetyTitle = 'Our Commitment to Safety'
  let safetyDescription = 'Every piece of SweetB is crafted under the highest global standards of quality and safety. From the sourcing of each natural ingredient to the precision of final packaging, we follow a process built on accountability and care.'
  let safetyClosing = 'These standards are more than numbers or labels. They represent our promise — that every SweetB candy you enjoy is pure, safe, and manufactured with integrity.'

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
      ingredientsTitleResult,
      ingredientsDescriptionResult,
      safetyTitleResult,
      safetyDescriptionResult,
      safetyClosingResult,
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
      getContent('ingredients.title', ingredientsTitle),
      getContent('ingredients.description', ingredientsDescription),
      getContent('safety.title', safetyTitle),
      getContent('safety.description', safetyDescription),
      getContent('safety.closing', safetyClosing),
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
    ingredientsTitle = ingredientsTitleResult.status === 'fulfilled' ? ingredientsTitleResult.value : ingredientsTitle
    ingredientsDescription = ingredientsDescriptionResult.status === 'fulfilled' ? ingredientsDescriptionResult.value : ingredientsDescription
    safetyTitle = safetyTitleResult.status === 'fulfilled' ? safetyTitleResult.value : safetyTitle
    safetyDescription = safetyDescriptionResult.status === 'fulfilled' ? safetyDescriptionResult.value : safetyDescription
    safetyClosing = safetyClosingResult.status === 'fulfilled' ? safetyClosingResult.value : safetyClosing
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
        <LycheeMintTeaserWrapper />
        <Ingredients 
          title={ingredientsTitle}
          description={ingredientsDescription}
        />
        <HowToUse />
        <Safety 
          title={safetyTitle}
          description={safetyDescription}
          closing={safetyClosing}
        />
        <Precautions />
        {/* <OfferBanner /> - Moved to PromotionalModal */}
        <FAQ />
      </main>
      <Footer />
    </>
  )
}

