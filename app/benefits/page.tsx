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
    energyTitle,
    energyP1,
    energyP2,
    energyP3,
    confidenceTitle,
    confidenceP1,
    confidenceP2,
    confidenceP3,
    performanceTitle,
    performanceP1,
    performanceP2,
    performanceP3,
    discreetTitle,
    discreetP1,
    discreetP2,
    discreetP3,
    finalTitle,
    finalText,
    shopButton,
    storyButton,
  ] = await Promise.all([
    getContent('benefits.back', '← Back to Home'),
    getContent('benefits.title', 'Redefining Vitality'),
    getContent('benefits.subtitle', 'Discover how SweetB supports your journey to balanced energy, confidence, and enduring performance.'),
    getContent('benefits.energy.title', 'Energy & Focus'),
    getContent('benefits.energy.p1', 'Experience the difference between forced stimulation and true vitality. SweetB delivers clear, sustained energy that flows naturally throughout your day, without the crash or jitters that come from synthetic alternatives.'),
    getContent('benefits.energy.p2', 'Our carefully balanced blend of Korean Red Ginseng and Maca Root works synergistically to enhance mental clarity and physical stamina. You\'ll notice improved concentration during demanding tasks, sharper decision-making, and the mental endurance to stay focused from morning meetings to evening commitments.'),
    getContent('benefits.energy.p3', 'Unlike caffeine-heavy products that spike and fade, SweetB supports your body\'s natural energy production, helping you maintain consistent performance when it matters most.'),
    getContent('benefits.confidence.title', 'Balanced Confidence'),
    getContent('benefits.confidence.p1', 'True confidence comes from within — from feeling composed, centered, and in control. SweetB\'s natural ingredients support your body\'s ability to maintain emotional equilibrium even in high-pressure situations.'),
    getContent('benefits.confidence.p2', 'The Tongkat Ali and Tribulus Terrestris in our formula have been traditionally used for centuries to promote inner strength and self-assurance. These botanicals work at a foundational level, supporting healthy hormone balance and helping you feel more present, grounded, and ready to engage with the world around you.'),
    getContent('benefits.confidence.p3', 'Whether you\'re presenting to a boardroom, navigating social situations, or simply showing up as your best self, SweetB helps you maintain that quiet confidence that doesn\'t need to announce itself — it simply is.'),
    getContent('benefits.performance.title', 'Lasting Performance'),
    getContent('benefits.performance.p1', 'Performance isn\'t just about peak moments — it\'s about enduring support that carries you through extended periods of physical and mental demand. SweetB\'s effects are designed to last, with benefits that can extend for up to three days.'),
    getContent('benefits.performance.p2', 'The combination of L-Arginine and traditional adaptogens promotes healthy circulation and stamina, supporting your body\'s ability to sustain effort over time. This means better endurance during workouts, improved recovery, and the physical resilience to meet life\'s demands without constantly reaching for another boost.'),
    getContent('benefits.performance.p3', 'Whether you\'re an athlete pushing your limits, a professional navigating long workdays, or simply someone who values steady, reliable vitality, SweetB provides the foundation for lasting performance.'),
    getContent('benefits.discreet.title', 'Discreet & Convenient'),
    getContent('benefits.discreet.p1', 'In a world that demands your attention at every turn, wellness should be simple, not complicated. SweetB strips away the excess — no pills to swallow, no powders to mix, no elaborate routines to follow.'),
    getContent('benefits.discreet.p2', 'Just one discreet candy, taken once daily. It fits seamlessly into your life, whether you\'re at home, at work, or on the move. The elegant formulation means you can maintain your wellness practice without drawing attention or disrupting your day. No one needs to know about your personal choices for vitality.'),
    getContent('benefits.discreet.p3', 'This is refined simplicity — sophisticated support that respects your time, your privacy, and your preference for understated excellence. Take it in the morning with your coffee, before an important meeting, or whenever you choose. SweetB adapts to your lifestyle, not the other way around.'),
    getContent('benefits.final.title', 'Experience the Difference'),
    getContent('benefits.final.text', 'These benefits work together, creating a foundation for vitality that supports every aspect of your life. From morning clarity to evening confidence, SweetB is your quiet companion in the pursuit of balanced, enduring wellness.'),
    getContent('benefits.final.shopButton', 'Shop SweetB'),
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
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&q=80"
            alt="Vitality and wellness"
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
        
        {/* Benefit 1: Energy & Focus */}
        <ScrollReveal>
          <section className={styles.benefitSection}>
            <div className={styles.sectionLayout}>
              <div className={styles.imageWrapper}>
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
                  alt="Focused professional at work"
                  className={styles.sectionImage}
                  loading="lazy"
                />
                <div className={styles.imageOverlay}></div>
              </div>
              <div className={styles.textContent}>
                <span className={styles.sectionIcon}>⚡</span>
                <h2 className={styles.sectionTitle}>{energyTitle}</h2>
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: energyP1 }} />
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: energyP2 }} />
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: energyP3 }} />
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Benefit 2: Balanced Confidence */}
        <ScrollReveal>
          <section className={`${styles.benefitSection} ${styles.reverse}`}>
            <div className={styles.sectionLayout}>
              <div className={styles.textContent}>
                <span className={styles.sectionIcon}>◆</span>
                <h2 className={styles.sectionTitle}>{confidenceTitle}</h2>
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: confidenceP1 }} />
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: confidenceP2 }} />
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: confidenceP3 }} />
              </div>
              <div className={styles.imageWrapper}>
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
                  alt="Confident man portrait"
                  className={styles.sectionImage}
                  loading="lazy"
                />
                <div className={styles.imageOverlay}></div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Benefit 3: Lasting Performance */}
        <ScrollReveal>
          <section className={styles.benefitSection}>
            <div className={styles.sectionLayout}>
              <div className={styles.imageWrapper}>
                <img 
                  src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80"
                  alt="Athletic training and performance"
                  className={styles.sectionImage}
                  loading="lazy"
                />
                <div className={styles.imageOverlay}></div>
              </div>
              <div className={styles.textContent}>
                <span className={styles.sectionIcon}>∞</span>
                <h2 className={styles.sectionTitle}>{performanceTitle}</h2>
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: performanceP1 }} />
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: performanceP2 }} />
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: performanceP3 }} />
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Benefit 4: Discreet & Convenient */}
        <ScrollReveal>
          <section className={`${styles.benefitSection} ${styles.reverse}`}>
            <div className={styles.sectionLayout}>
              <div className={styles.textContent}>
                <span className={styles.sectionIcon}>✦</span>
                <h2 className={styles.sectionTitle}>{discreetTitle}</h2>
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: discreetP1 }} />
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: discreetP2 }} />
                <p className={styles.paragraph} dangerouslySetInnerHTML={{ __html: discreetP3 }} />
              </div>
              <div className={styles.imageWrapper}>
                <img 
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80"
                  alt="Modern lifestyle"
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
                <a href="/#shop" className="btn btn-primary">{shopButton}</a>
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

