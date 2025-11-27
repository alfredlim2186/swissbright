import styles from './Benefits.module.css'
import ScrollReveal from './ScrollReveal'

const benefits = [
  {
    icon: '⚡',
    title: 'Energy & Focus',
    description: 'Clear, balanced energy throughout the day.',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
    imageAlt: 'Focused professional man working',
  },
  {
    icon: '◆',
    title: 'Balanced Confidence',
    description: 'Feel composed, centered, and in control.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    imageAlt: 'Confident man portrait',
  },
  {
    icon: '∞',
    title: 'Lasting Performance',
    description: 'Steady, enduring support.',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    imageAlt: 'Athletic man training',
  },
  {
    icon: '✦',
    title: 'Discreet & Convenient',
    description: 'Simple, daily, and refined.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80',
    imageAlt: 'Modern lifestyle man',
  },
]

export default function Benefits() {
  return (
    <section id="benefits" className={styles.benefits}>
      <h2 className={styles.sectionTitle}>Benefits</h2>
      <div className="gold-divider"></div>
      <div className={styles.grid}>
        {benefits.map((benefit, index) => (
          <ScrollReveal key={index} delay={index * 100}>
            <div className={styles.card}>
              <div className={styles.imageContainer}>
                <img 
                  src={benefit.image} 
                  alt={benefit.imageAlt}
                  className={styles.cardImage}
                  loading="lazy"
                />
                <div className={styles.imageOverlay}></div>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.icon}>{benefit.icon}</div>
                <h3 className={styles.cardTitle}>{benefit.title}</h3>
                <p className={styles.cardDescription}>{benefit.description}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}

