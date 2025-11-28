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
    getContent('about.title', 'The Legend of Candy B'),
    getContent('about.origin.title', 'The Origin'),
    getContent('about.origin.p1', 'High in the mountains of Peru, where the clouds hang low and the wind smells of wild herbs, a quiet tradition began. Local healers studied the plants that grew in that rare altitude, learning which roots restored strength, which leaves eased the mind, and which barks rekindled the body\'s fire.'),
    getContent('about.origin.p2', 'From their hands came a blend that would later be known as Formula B.'),
    getContent('about.nature.title', 'Nature\'s Wisdom'),
    getContent('about.nature.p1', 'The formula was born from nature itself. Ginseng-like roots offered sustained energy, while gentle tonics balanced the heart and spirit. Each component was gathered by hand and prepared with care, using methods that preserved the natural potency of the herbs.'),
    getContent('about.nature.p2', 'The result was something powerful yet calm, a source of vitality that felt deeply human.'),
    getContent('about.heritage.title', 'Fifty Years of Heritage'),
    getContent('about.heritage.p1', 'For more than fifty years, this secret was guarded within a small Peruvian family. It was refined slowly, protected as both a craft and a calling.'),
    getContent('about.heritage.p2', 'To them, it was never just a supplement, but a way of honoring the balance between human strength and nature\'s rhythm.'),
    getContent('about.modern.title', 'Modern Evolution'),
    getContent('about.modern.p1', 'When science finally met this heritage, the formula found a new expression. The wisdom of those herbalists inspired SweetB, a discreet candy shaped for modern life but rooted in ancient knowledge.'),
    getContent('about.modern.p2', 'Each piece carries the same promise of renewal, made from natural herbs and pure ingredients that support energy, stamina, and focus without force.'),
    getContent('about.final.title', 'From the Andes to You'),
    getContent('about.final.text', 'What began as a whisper in the Andes now lives on as a quiet act of restoration. From the soil to your hand, SweetB continues the story of nature\'s gift — steady, clean, and enduring.'),
    getContent('about.final.tagline', 'Vitality Reborn.'),
    getContent('about.final.benefitsButton', 'Discover Benefits'),
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
            src="https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1920&q=80"
            alt="Peruvian mountains"
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
                  src="https://images.unsplash.com/photo-1589802829985-817e51171b92?w=800&q=80"
                  alt="Misty Peruvian mountains"
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
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80"
                  alt="Natural herbs and botanicals"
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
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80"
                  alt="Traditional craftsmanship"
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
                  src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80"
                  alt="Modern wellness"
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
                <a href="/#benefits" className="btn btn-primary">{benefitsButton}</a>
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

