import styles from './page.module.css'
import Link from 'next/link'
import ScrollReveal from '../components/ScrollReveal'
import PageBackground from '@/app/components/PageBackground'
import BackgroundElements from '@/app/components/BackgroundElements'
import { getContent } from '@/lib/content'

export const dynamic = 'force-dynamic'

export default async function BenefitsPage() {
  // Fetch all translations
  const [
    backLink,
    title,
    subtitle,
    qualityTitle,
    qualityP1,
    qualityP2,
    qualityP3,
    pricingTitle,
    pricingP1,
    pricingP2,
    pricingP3,
    shippingTitle,
    shippingP1,
    shippingP2,
    shippingP3,
    warrantyTitle,
    warrantyP1,
    warrantyP2,
    warrantyP3,
    finalTitle,
    finalText,
    shopButton,
    storyButton,
  ] = await Promise.all([
    getContent('benefits.back', '← Back to Home'),
    getContent('benefits.title', 'Why Buy From Us'),
    getContent('benefits.subtitle', 'Discover why Swiss Bright is your trusted choice for premium mobile gadgets and accessories.'),
    getContent('benefits.quality.title', 'Quality Assurance'),
    getContent('benefits.quality.p1', 'At Swiss Bright, we understand that quality matters. Every product in our catalog is carefully selected and tested to meet our high standards. We partner with trusted manufacturers and suppliers to ensure you receive only the best mobile gadgets and accessories.'),
    getContent('benefits.quality.p2', 'Our quality control process includes rigorous testing for durability, compatibility, and performance. Whether it\'s a protective case, charging cable, or stand, we verify that each product delivers on its promises. This commitment to quality means you can shop with confidence, knowing that your purchase will serve you well.'),
    getContent('benefits.quality.p3', 'We stand behind every product we sell. If you\'re not satisfied with your purchase, our customer service team is here to help. Quality isn\'t just a promise—it\'s our foundation.'),
    getContent('benefits.pricing.title', 'Competitive Pricing'),
    getContent('benefits.pricing.p1', 'Getting premium quality doesn\'t mean paying premium prices. At Swiss Bright, we work hard to offer competitive pricing on all our mobile gadgets and accessories. We believe that everyone deserves access to quality products without breaking the bank.'),
    getContent('benefits.pricing.p2', 'Our direct relationships with suppliers and efficient operations allow us to pass savings directly to you. We regularly review our prices to ensure they remain competitive in the market. Plus, we offer special promotions and discounts throughout the year, so you can save even more on your favorite products.'),
    getContent('benefits.pricing.p3', 'Value isn\'t just about the price tag—it\'s about getting quality products that last. At Swiss Bright, you get both: competitive prices and products you can rely on.'),
    getContent('benefits.shipping.title', 'Fast & Reliable Shipping'),
    getContent('benefits.shipping.p1', 'We know you want your products quickly. That\'s why we\'ve streamlined our shipping process to get your orders to you as fast as possible. With multiple shipping options available, you can choose the delivery speed that works best for you.'),
    getContent('benefits.shipping.p2', 'Our fulfillment team processes orders promptly, and we work with trusted courier partners to ensure reliable delivery. You\'ll receive tracking information as soon as your order ships, so you always know where your package is. We\'re committed to making your shopping experience smooth and hassle-free.'),
    getContent('benefits.shipping.p3', 'Whether you need your mobile accessories urgently or can wait a few days, we have shipping options to fit your needs and budget. Fast shipping shouldn\'t cost a fortune, and at Swiss Bright, it doesn\'t.'),
    getContent('benefits.warranty.title', 'Warranty & Support'),
    getContent('benefits.warranty.p1', 'Your peace of mind matters to us. That\'s why we offer comprehensive warranty coverage on our products and dedicated customer support to help with any questions or concerns. We\'re not just selling products—we\'re building relationships with our customers.'),
    getContent('benefits.warranty.p2', 'Our warranty policies protect you against manufacturing defects and ensure you get the full value from your purchase. If something goes wrong, our support team is ready to assist with returns, replacements, or repairs. We believe in standing behind our products and our service.'),
    getContent('benefits.warranty.p3', 'Shopping with Swiss Bright means you\'re never alone. From product selection to after-sales support, we\'re here to help every step of the way. Your satisfaction is our priority.'),
    getContent('benefits.final.title', 'Experience the Swiss Bright Difference'),
    getContent('benefits.final.text', 'These advantages work together to create a shopping experience you can trust. From quality products to competitive prices, fast shipping to reliable support, Swiss Bright is your partner in finding the perfect mobile gadgets and accessories.'),
    getContent('benefits.final.shopButton', 'Shop Now'),
    getContent('benefits.final.storyButton', 'Our Story'),
  ])
  
  return (
    <div className={styles.benefitsPage}>
      <PageBackground />
      <BackgroundElements />
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <img 
            src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1920&q=80"
            alt="Mobile gadgets and accessories"
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay}></div>
        </div>
        <div className={styles.heroContent}>
          <Link href="/" className={styles.backLink}>
            {backLink}
          </Link>
          <div className={styles.emblem}>✦</div>
          <h1 className={styles.heroTitle}>{title}</h1>
          <p className={styles.heroSubtitle}>
            {subtitle}
          </p>
          <div className={styles.divider}></div>
        </div>
      </section>

      {/* Benefits Content */}
      <main className={styles.benefitsContent}>
        
        {/* Section 1: Quality Assurance */}
        <ScrollReveal>
          <section className={styles.benefitSection}>
            <div className={styles.sectionLayout}>
              <div className={styles.imageWrapper}>
                <img 
                  src="https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80"
                  alt="Quality mobile gadgets"
                  className={styles.sectionImage}
                  loading="lazy"
                />
                <div className={styles.imageOverlay}></div>
              </div>
              <div className={styles.textContent}>
                <span className={styles.sectionIcon}>✓</span>
                <h2 className={styles.sectionTitle}>{qualityTitle}</h2>
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: qualityP1 }} />
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: qualityP2 }} />
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: qualityP3 }} />
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Section 2: Competitive Pricing */}
        <ScrollReveal>
          <section className={`${styles.benefitSection} ${styles.reverse}`}>
            <div className={styles.sectionLayout}>
              <div className={styles.textContent}>
                <span className={styles.sectionIcon}>$</span>
                <h2 className={styles.sectionTitle}>{pricingTitle}</h2>
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: pricingP1 }} />
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: pricingP2 }} />
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: pricingP3 }} />
              </div>
              <div className={styles.imageWrapper}>
                <img 
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"
                  alt="Value and pricing"
                  className={styles.sectionImage}
                  loading="lazy"
                />
                <div className={styles.imageOverlay}></div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Section 3: Fast Shipping */}
        <ScrollReveal>
          <section className={styles.benefitSection}>
            <div className={styles.sectionLayout}>
              <div className={styles.imageWrapper}>
                <img 
                  src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&q=80"
                  alt="Fast shipping and delivery"
                  className={styles.sectionImage}
                  loading="lazy"
                />
                <div className={styles.imageOverlay}></div>
              </div>
              <div className={styles.textContent}>
                <span className={styles.sectionIcon}>🚀</span>
                <h2 className={styles.sectionTitle}>{shippingTitle}</h2>
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: shippingP1 }} />
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: shippingP2 }} />
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: shippingP3 }} />
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Section 4: Warranty & Support */}
        <ScrollReveal>
          <section className={`${styles.benefitSection} ${styles.reverse}`}>
            <div className={styles.sectionLayout}>
              <div className={styles.textContent}>
                <span className={styles.sectionIcon}>🛡️</span>
                <h2 className={styles.sectionTitle}>{warrantyTitle}</h2>
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: warrantyP1 }} />
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: warrantyP2 }} />
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: warrantyP3 }} />
              </div>
              <div className={styles.imageWrapper}>
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
                  alt="Customer support and warranty"
                  className={styles.sectionImage}
                  loading="lazy"
                />
                <div className={styles.imageOverlay}></div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Final CTA Section */}
        <ScrollReveal>
          <section className={styles.finalSection}>
            <div className={styles.finalContent}>
              <span className={styles.finalIcon}>◆</span>
              <h2 className={styles.finalTitle}>{finalTitle}</h2>
              <p className={styles.finalText}>{finalText}</p>
              <div className={styles.finalButtons}>
                <a href="/shop" className="btn btn-primary">{shopButton}</a>
                <a href="/about" className="btn btn-secondary">{storyButton}</a>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>

      {/* Decorative elements */}
      <div className={styles.decorCircle1}></div>
      <div className={styles.decorCircle2}></div>
      <div className={styles.decorCircle3}></div>
    </div>
  )
}

