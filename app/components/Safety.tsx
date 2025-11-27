import styles from './Safety.module.css'
import ScrollReveal from './ScrollReveal'

interface SafetyProps {
  title?: string
  description?: string
  closing?: string
}

export default function Safety({ title, description, closing }: SafetyProps) {
  const certifications = [
  {
    icon: '🏆',
    code: 'ISO 22000',
    title: 'Food Safety Management',
    description: 'Food safety management at every stage of production.',
  },
  {
    icon: '✓',
    code: 'GMP',
    title: 'Good Manufacturing Practice',
    description: 'Ensures consistent quality and purity in every batch.',
  },
  {
    icon: '⚡',
    code: 'ISO 9001',
    title: 'Quality Management',
    description: 'Quality management focused on continuous improvement and reliability.',
  },
  {
    icon: '◆',
    code: 'HACCP',
    title: 'Hazard Analysis',
    description: 'Rigorous preventive control for safe and traceable production.',
  },
  {
    icon: '🌿',
    code: 'ORGANIC',
    title: 'Certified Organic',
    description: 'Natural ingredients sourced from certified organic farms.',
  },
  {
    icon: '🌱',
    code: 'VEGETARIAN',
    title: 'Vegetarian Safe',
    description: '100% plant-based ingredients with no animal derivatives.',
  },
]

  return (
    <section id="safety" className={styles.safety}>
      <div className={styles.container}>
        <ScrollReveal>
          <div className={styles.header}>
            <h2 className={styles.sectionTitle}>{title || 'Our Commitment to Safety'}</h2>
            <div className="gold-divider"></div>
            <p className={styles.intro}>
              {description || 'Every piece of SweetB is crafted under the highest global standards of quality and safety. From the sourcing of each natural ingredient to the precision of final packaging, we follow a process built on accountability and care.'}
            </p>
          </div>
        </ScrollReveal>

        <div className={styles.certificationsGrid}>
          {certifications.map((cert, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div className={styles.certCard}>
                <div className={styles.certIcon}>{cert.icon}</div>
                <div className={styles.certCode}>{cert.code}</div>
                <h3 className={styles.certTitle}>{cert.title}</h3>
                <p className={styles.certDescription}>{cert.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className={styles.closingStatement}>
            <div className={styles.statementIcon}>✦</div>
            <p className={styles.statementText}>
              {closing || 'These standards are more than numbers or labels. They represent our promise — that every SweetB candy you enjoy is pure, safe, and manufactured with integrity.'}
            </p>
            <div className={styles.finalNote}>
              <span className={styles.finalIcon}>◇</span>
              <p className={styles.finalText}>
                From the first herb to the final seal, SweetB is made with respect for your body 
                and confidence in our craft.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

