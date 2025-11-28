import styles from './ProductShowcase.module.css'
import ScrollReveal from './ScrollReveal'
import { getContent } from '@/lib/content'

interface ProductShowcaseProps {
  eyebrow?: string
  title?: string
  description?: string
  image1?: string
  image2?: string
}

export default async function ProductShowcase({
  eyebrow,
  title,
  description,
  image1,
  image2,
}: ProductShowcaseProps) {
  // Fetch translations for product highlight tiles
  const [
    discreetFormatTitle,
    discreetFormatDesc,
    naturalBotanicalsTitle,
    naturalBotanicalsDesc,
    lastingEffectsTitle,
    lastingEffectsDesc,
  ] = await Promise.all([
    getContent('product.highlight.discreetFormat.title', 'Discreet Format'),
    getContent('product.highlight.discreetFormat.description', 'A single candy. No powders, no pills.'),
    getContent('product.highlight.naturalBotanicals.title', 'Natural Botanicals'),
    getContent('product.highlight.naturalBotanicals.description', 'Korean ginseng, Tongkat Ali, Maca—time-tested ingredients.'),
    getContent('product.highlight.lastingEffects.title', 'Lasting Effects'),
    getContent('product.highlight.lastingEffects.description', 'Onset in 1-3 hours. Effects may last up to 3 days.'),
  ])

  const showcaseImages = [
    {
      src: image1 || 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&q=80',
      alt: 'SweetB luxury supplement lifestyle',
    },
    {
      src: image2 || 'https://images.unsplash.com/photo-1516733968668-dbdce39c4651?w=1200&q=80',
      alt: 'Premium wellness and vitality',
    },
  ]
  return (
    <section className={styles.showcase}>
      <div className={styles.introSection}>
        <ScrollReveal>
          <div className={styles.eyebrow}>{eyebrow || 'The Product'}</div>
          <h2 className={styles.title}>{title || 'One Candy. Quiet Confidence.'}</h2>
          <div className={styles.divider}></div>
          <p className={styles.description}>
            {description || 'SweetB is not a pill, not a powder, not a ritual. It\'s a single, discreet candy—precisely formulated with time-honored botanicals to support energy, focus, and natural vitality. No noise. No fuss. Just steady, masculine poise.'}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className={styles.highlights}>
            <div className={styles.highlight}>
              <span className={styles.highlightIcon}>✦</span>
              <div className={styles.highlightText}>
                <h3 className={styles.highlightTitle}>{discreetFormatTitle}</h3>
                <p className={styles.highlightDesc}>{discreetFormatDesc}</p>
              </div>
            </div>
            <div className={styles.highlight}>
              <span className={styles.highlightIcon}>✦</span>
              <div className={styles.highlightText}>
                <h3 className={styles.highlightTitle}>{naturalBotanicalsTitle}</h3>
                <p className={styles.highlightDesc}>{naturalBotanicalsDesc}</p>
              </div>
            </div>
            <div className={styles.highlight}>
              <span className={styles.highlightIcon}>✦</span>
              <div className={styles.highlightText}>
                <h3 className={styles.highlightTitle}>{lastingEffectsTitle}</h3>
                <p className={styles.highlightDesc}>{lastingEffectsDesc}</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div className={styles.grid}>
        {showcaseImages.map((image, index) => (
          <ScrollReveal key={index} delay={index * 150}>
            <div className={styles.imageCard}>
              <img 
                src={image.src} 
                alt={image.alt}
                className={styles.image}
                loading="lazy"
              />
              <div className={styles.overlay}></div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}

