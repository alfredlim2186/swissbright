import Image from 'next/image'
import styles from './ProductShowcase.module.css'
import ScrollReveal from './ScrollReveal'

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
  // Hardcoded values for premium mobile gadgets
  const discreetFormatTitle = 'Premium Design'
  const discreetFormatDesc = 'Cutting-edge devices. No compromises, no shortcuts.'
  const naturalBotanicalsTitle = 'Top-Tier Hardware'
  const naturalBotanicalsDesc = 'Latest processors, premium displays, advanced cameras—industry-leading technology.'
  const lastingEffectsTitle = 'Durable Quality'
  const lastingEffectsDesc = 'Fast delivery. Devices built to last for years.'

  const showcaseImages = [
    {
      src: image1 || 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&q=80',
      alt: 'Swiss Bright premium mobile gadgets',
    },
    {
      src: image2 || 'https://images.unsplash.com/photo-1516733968668-dbdce39c4651?w=1200&q=80',
      alt: 'Premium mobile accessories and gadgets',
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
            {description || 'Discover our curated selection of premium mobile gadgets and accessories. From protective cases to fast chargers, we offer quality products designed to enhance your mobile experience.'}
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
              <Image 
                src={image.src} 
                alt={image.alt}
                fill
                className={styles.image}
                quality={85}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className={styles.overlay}></div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}

