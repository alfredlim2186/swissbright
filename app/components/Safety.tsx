import styles from './Safety.module.css'
import ScrollReveal from './ScrollReveal'
import { getContent } from '@/lib/content'

interface SafetyProps {
  title?: string
  description?: string
  closing?: string
}

export default async function Safety({ title, description, closing }: SafetyProps) {
  // Fetch translations for all certifications
  const [
    iso22000Title,
    iso22000Desc,
    gmpTitle,
    gmpDesc,
    iso9001Title,
    iso9001Desc,
    haccpTitle,
    haccpDesc,
    organicTitle,
    organicDesc,
    vegetarianTitle,
    vegetarianDesc,
  ] = await Promise.all([
    getContent('safety.cert.iso22000.title', 'Food Safety Management'),
    getContent('safety.cert.iso22000.description', 'Food safety management at every stage of production.'),
    getContent('safety.cert.gmp.title', 'Good Manufacturing Practice'),
    getContent('safety.cert.gmp.description', 'Ensures consistent quality and purity in every batch.'),
    getContent('safety.cert.iso9001.title', 'Quality Management'),
    getContent('safety.cert.iso9001.description', 'Quality management focused on continuous improvement and reliability.'),
    getContent('safety.cert.haccp.title', 'Hazard Analysis'),
    getContent('safety.cert.haccp.description', 'Rigorous preventive control for safe and traceable production.'),
    getContent('safety.cert.organic.title', 'Certified Organic'),
    getContent('safety.cert.organic.description', 'Natural ingredients sourced from certified organic farms.'),
    getContent('safety.cert.vegetarian.title', 'Vegetarian Safe'),
    getContent('safety.cert.vegetarian.description', '100% plant-based ingredients with no animal derivatives.'),
  ])

  const certifications = [
  {
    icon: '🏆',
    code: 'ISO 22000',
    title: iso22000Title,
    description: iso22000Desc,
  },
  {
    icon: '✓',
    code: 'GMP',
    title: gmpTitle,
    description: gmpDesc,
  },
  {
    icon: '⚡',
    code: 'ISO 9001',
    title: iso9001Title,
    description: iso9001Desc,
  },
  {
    icon: '◆',
    code: 'HACCP',
    title: haccpTitle,
    description: haccpDesc,
  },
  {
    icon: '🌿',
    code: 'ORGANIC',
    title: organicTitle,
    description: organicDesc,
  },
  {
    icon: '🌱',
    code: 'VEGETARIAN',
    title: vegetarianTitle,
    description: vegetarianDesc,
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

