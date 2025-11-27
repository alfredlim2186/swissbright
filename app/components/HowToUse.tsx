import styles from './HowToUse.module.css'
import ScrollReveal from './ScrollReveal'
import { getContent } from '@/lib/content'

const icons = ['①', '⏱', '◷', '◐', '✓']

export default async function HowToUse() {
  const title = await getContent('howtouse.title', 'How to Use')
  const instruction1 = await getContent('howtouse.instruction1', 'Take only one (1) SweetB per day.')
  const instruction2 = await getContent('howtouse.instruction2', 'Onset: 1–3 hours after consumption.')
  const instruction3 = await getContent('howtouse.instruction3', 'Duration: up to 3 days (varies by individual).')
  const instruction4 = await getContent('howtouse.instruction4', 'Allow it to dissolve slowly, or swallow whole if preferred.')
  const instruction5 = await getContent('howtouse.instruction5', 'For best results: take on an empty stomach or 2 hours after a meal.')

  const instructions = [
    { icon: icons[0], text: instruction1 },
    { icon: icons[1], text: instruction2 },
    { icon: icons[2], text: instruction3 },
    { icon: icons[3], text: instruction4 },
    { icon: icons[4], text: instruction5 },
  ]

  return (
    <section id="how-to-use" className={styles.howToUse}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className="gold-divider"></div>
      <ul className={styles.list}>
        {instructions.map((instruction, index) => (
          <ScrollReveal key={index} delay={index * 60}>
            <li className={styles.listItem}>
              <span className={styles.icon}>{instruction.icon}</span>
              <span>{instruction.text}</span>
            </li>
          </ScrollReveal>
        ))}
      </ul>
    </section>
  )
}

