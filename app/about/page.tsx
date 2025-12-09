import styles from './page.module.css'
import Link from 'next/link'
import ScrollReveal from '../components/ScrollReveal'
import PageBackground from '@/app/components/PageBackground'
import BackgroundElements from '@/app/components/BackgroundElements'
import { getContent } from '@/lib/content'

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  // Fetch all translations
  const [
    backLink,
    title,
    originTitle,
    originP1,
    originP2,
    natureTitle,
    natureP1,
    natureP2,
    heritageTitle,
    heritageP1,
    heritageP2,
    modernTitle,
    modernP1,
    modernP2,
    finalTitle,
    finalText,
    tagline,
    benefitsButton,
    contactButton,
  ] = await Promise.all([
    getContent('about.back', '← Back to Home'),
    getContent('about.title', 'About Swiss Bright'),
    getContent('about.origin.title', 'Our Mission'),
    getContent('about.origin.p1', 'Swiss Bright was founded with a simple mission: to provide premium mobile gadgets and accessories that combine quality, affordability, and excellent customer service. We believe that everyone deserves access to high-quality mobile accessories without paying premium prices.'),
    getContent('about.origin.p2', 'Our commitment is to source the best products, offer competitive pricing, and deliver exceptional service to every customer.'),
    getContent('about.nature.title', 'Quality First'),
    getContent('about.nature.p1', 'Every product in our catalog is carefully selected and tested to meet our high standards. We work directly with trusted manufacturers and suppliers to ensure authenticity and quality. From protective cases to charging cables, each item is verified for durability, compatibility, and performance.'),
    getContent('about.nature.p2', 'We don\'t just sell products—we curate a collection that we\'re proud to stand behind.'),
    getContent('about.heritage.title', 'Customer Focused'),
    getContent('about.heritage.p1', 'At Swiss Bright, our customers are at the heart of everything we do. We understand that shopping for mobile gadgets should be simple, straightforward, and stress-free. That\'s why we offer clear product descriptions, competitive prices, and responsive customer support.'),
    getContent('about.heritage.p2', 'We\'re committed to building long-term relationships with our customers, not just making one-time sales.'),
    getContent('about.modern.title', 'Innovation & Growth'),
    getContent('about.modern.p1', 'As the mobile technology landscape evolves, so do we. We continuously expand our product range to include the latest accessories and innovations. Our team stays up-to-date with industry trends to bring you the most relevant and useful mobile gadgets.'),
    getContent('about.modern.p2', 'Whether you need a new case for your latest phone, a fast charger, or the latest mobile accessory, Swiss Bright is your trusted partner.'),
    getContent('about.final.title', 'Your Trusted Mobile Gadget Partner'),
    getContent('about.final.text', 'From our carefully curated product selection to our commitment to customer satisfaction, Swiss Bright is dedicated to being your go-to source for premium mobile gadgets and accessories. We\'re here to help you enhance your mobile experience with quality products you can trust.'),
    getContent('about.final.tagline', 'Premium Mobile Gadgets.'),
    getContent('about.final.benefitsButton', 'Why Buy From Us'),
    getContent('about.final.contactButton', 'Get in Touch'),
  ])
  
  return (
    <div className={styles.aboutPage}>
      <PageBackground />
      <BackgroundElements />
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <img 
            src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1920&q=80"
            alt="Mobile gadgets and technology"
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
          <div className={styles.divider}></div>
        </div>
      </section>

      {/* Story Content */}
      <main className={styles.storyContent}>
        {/* Section 1: The Beginning */}
        <ScrollReveal>
          <section className={styles.storySection}>
            <div className={styles.sectionLayout}>
              <div className={styles.imageWrapper}>
                <img 
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                  alt="Mobile technology and innovation"
                  className={styles.sectionImage}
                  loading="lazy"
                />
                <div className={styles.imageOverlay}></div>
              </div>
              <div className={styles.textContent}>
                <span className={styles.sectionIcon}>🏔</span>
                <h2 className={styles.sectionTitle}>{originTitle}</h2>
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: originP1 }} />
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: originP2 }} />
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Section 2: The Formula */}
        <ScrollReveal>
          <section className={`${styles.storySection} ${styles.reverse}`}>
            <div className={styles.sectionLayout}>
              <div className={styles.textContent}>
                <span className={styles.sectionIcon}>🌿</span>
                <h2 className={styles.sectionTitle}>{natureTitle}</h2>
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: natureP1 }} />
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: natureP2 }} />
              </div>
              <div className={styles.imageWrapper}>
                <img 
                  src="https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80"
                  alt="Quality mobile gadgets"
                  className={styles.sectionImage}
                  loading="lazy"
                />
                <div className={styles.imageOverlay}></div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Section 3: The Tradition */}
        <ScrollReveal>
          <section className={styles.storySection}>
            <div className={styles.sectionLayout}>
              <div className={styles.imageWrapper}>
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
                  alt="Customer service and support"
                  className={styles.sectionImage}
                  loading="lazy"
                />
                <div className={styles.imageOverlay}></div>
              </div>
              <div className={styles.textContent}>
                <span className={styles.sectionIcon}>⏳</span>
                <h2 className={styles.sectionTitle}>{heritageTitle}</h2>
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: heritageP1 }} />
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: heritageP2 }} />
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Section 4: Science Meets Heritage */}
        <ScrollReveal>
          <section className={`${styles.storySection} ${styles.reverse}`}>
            <div className={styles.sectionLayout}>
              <div className={styles.textContent}>
                <span className={styles.sectionIcon}>⚗</span>
                <h2 className={styles.sectionTitle}>{modernTitle}</h2>
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: modernP1 }} />
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: modernP2 }} />
              </div>
              <div className={styles.imageWrapper}>
                <img 
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                  alt="Mobile technology innovation"
                  className={styles.sectionImage}
                  loading="lazy"
                />
                <div className={styles.imageOverlay}></div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Final Message */}
        <ScrollReveal>
          <section className={styles.finalSection}>
            <div className={styles.finalContent}>
              <span className={styles.finalIcon}>✦</span>
              <h2 className={styles.finalTitle}>{finalTitle}</h2>
              <p className={styles.finalText}>{finalText}</p>
              <div className={styles.tagline}>
                <span className={styles.taglineText}>{tagline}</span>
              </div>
              <div className={styles.finalButtons}>
                <a href="/benefits" className="btn btn-primary">{benefitsButton}</a>
                <a href="/contact" className="btn btn-secondary">{contactButton}</a>
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

