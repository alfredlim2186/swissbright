import styles from './Precautions.module.css'
import ScrollReveal from './ScrollReveal'
import { getContent } from '@/lib/content'

export default async function Precautions() {
  const title = await getContent('precautions.title', 'Precautions & Disclaimer')
  const warning1 = await getContent('precautions.warning1', 'Do not exceed one candy in 24 hours.')
  const warning2 = await getContent('precautions.warning2', 'Not recommended for individuals with a history of heart issues.')
  const warning3 = await getContent('precautions.warning3', 'Avoid after heavy alcohol or intense exercise.')
  const warning4 = await getContent('precautions.warning4', 'Do not mix with other medicines unless advised by a doctor.')
  const warning5 = await getContent('precautions.warning5', 'Keep out of reach of children.')
  const disclaimer = await getContent('precautions.disclaimer', 'This product may cause a temporary increase in heart rate, body warmth, or mild sweating. If you experience discomfort, consult a doctor.')

  const warnings = [warning1, warning2, warning3, warning4, warning5]

  return (
    <section className={styles.precautions}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className="gold-divider"></div>
      <ScrollReveal>
        <div className={styles.card}>
          <div className={styles.warningIcon}>⚠</div>
          <ul className={styles.list}>
            {warnings.map((warning, index) => (
              <li key={index} className={styles.listItem}>
                {warning}
              </li>
            ))}
          </ul>
          <p className={styles.disclaimer}>
            {disclaimer}
          </p>
        </div>
      </ScrollReveal>
    </section>
  )
}

