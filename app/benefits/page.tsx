import styles from './page.module.css'
import Link from 'next/link'
import ScrollReveal from '../components/ScrollReveal'
import PageBackground from '@/app/components/PageBackground'
import BackgroundElements from '@/app/components/BackgroundElements'
import { getContent } from '@/lib/content'

export const dynamic = 'force-dynamic'

export default async function BenefitsPage() {
  const backLink = await getContent('benefits.back', '← Back to Home')
  const title = await getContent('benefits.title', 'Redefining Vitality')
  const subtitle = await getContent('benefits.subtitle', 'Discover how SweetB supports your journey to balanced energy, confidence, and enduring performance.')
  
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
                <h2 className={styles.sectionTitle}>Energy & Focus</h2>
                <p className={styles.paragraph}>
                  Experience the difference between forced stimulation and true vitality. SweetB delivers 
                  <span className={styles.highlight}> clear, sustained energy</span> that flows naturally 
                  throughout your day, without the crash or jitters that come from synthetic alternatives.
                </p>
                <p className={styles.paragraph}>
                  Our carefully balanced blend of <strong>Korean Red Ginseng</strong> and <strong>Maca Root</strong> 
                  works synergistically to enhance mental clarity and physical stamina. You'll notice improved 
                  concentration during demanding tasks, sharper decision-making, and the mental endurance to 
                  stay focused from morning meetings to evening commitments.
                </p>
                <p className={styles.paragraph}>
                  Unlike caffeine-heavy products that spike and fade, SweetB supports your body's natural 
                  energy production, helping you maintain <span className={styles.highlight}>consistent 
                  performance</span> when it matters most.
                </p>
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
                <h2 className={styles.sectionTitle}>Balanced Confidence</h2>
                <p className={styles.paragraph}>
                  True confidence comes from within — from feeling composed, centered, and in control. 
                  SweetB's natural ingredients support your body's ability to maintain 
                  <span className={styles.highlight}> emotional equilibrium</span> even in high-pressure situations.
                </p>
                <p className={styles.paragraph}>
                  The <strong>Tongkat Ali</strong> and <strong>Tribulus Terrestris</strong> in our formula 
                  have been traditionally used for centuries to promote inner strength and self-assurance. 
                  These botanicals work at a foundational level, supporting healthy hormone balance and 
                  helping you feel more present, grounded, and ready to engage with the world around you.
                </p>
                <p className={styles.paragraph}>
                  Whether you're presenting to a boardroom, navigating social situations, or simply showing 
                  up as your best self, SweetB helps you maintain that <span className={styles.highlight}>quiet 
                  confidence</span> that doesn't need to announce itself — it simply is.
                </p>
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
                <h2 className={styles.sectionTitle}>Lasting Performance</h2>
                <p className={styles.paragraph}>
                  Performance isn't just about peak moments — it's about <span className={styles.highlight}>enduring 
                  support</span> that carries you through extended periods of physical and mental demand. SweetB's 
                  effects are designed to last, with benefits that can extend for up to three days.
                </p>
                <p className={styles.paragraph}>
                  The combination of <strong>L-Arginine</strong> and traditional adaptogens promotes healthy 
                  circulation and stamina, supporting your body's ability to sustain effort over time. This means 
                  better endurance during workouts, improved recovery, and the physical resilience to meet life's 
                  demands without constantly reaching for another boost.
                </p>
                <p className={styles.paragraph}>
                  Whether you're an athlete pushing your limits, a professional navigating long workdays, or 
                  simply someone who values <span className={styles.highlight}>steady, reliable vitality</span>, 
                  SweetB provides the foundation for lasting performance.
                </p>
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
                <h2 className={styles.sectionTitle}>Discreet & Convenient</h2>
                <p className={styles.paragraph}>
                  In a world that demands your attention at every turn, wellness should be 
                  <span className={styles.highlight}> simple, not complicated</span>. SweetB strips away the 
                  excess — no pills to swallow, no powders to mix, no elaborate routines to follow.
                </p>
                <p className={styles.paragraph}>
                  Just one discreet candy, taken once daily. It fits seamlessly into your life, whether you're 
                  at home, at work, or on the move. The elegant formulation means you can maintain your wellness 
                  practice without drawing attention or disrupting your day. No one needs to know about your 
                  personal choices for vitality.
                </p>
                <p className={styles.paragraph}>
                  This is <span className={styles.highlight}>refined simplicity</span> — sophisticated support 
                  that respects your time, your privacy, and your preference for understated excellence. Take 
                  it in the morning with your coffee, before an important meeting, or whenever you choose. 
                  SweetB adapts to your lifestyle, not the other way around.
                </p>
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
              <h2 className={styles.finalTitle}>Experience the Difference</h2>
              <p className={styles.finalText}>
                These benefits work together, creating a foundation for vitality that supports every aspect 
                of your life. From morning clarity to evening confidence, SweetB is your quiet companion 
                in the pursuit of balanced, enduring wellness.
              </p>
              <div className={styles.finalButtons}>
                <a href="/#shop" className="btn btn-primary">Shop SweetB</a>
                <a href="/about" className="btn btn-secondary">Our Story</a>
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

