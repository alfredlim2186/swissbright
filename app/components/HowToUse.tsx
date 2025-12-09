import styles from './HowToUse.module.css'
import ScrollReveal from './ScrollReveal'
import { getContent } from '@/lib/content'

const icons = ['①', '⏱', '◷', '◐', '✓']

export default async function HowToUse() {
  const title = await getContent('howtouse.title', 'How to Shop')
  const instruction1 = await getContent('howtouse.instruction1', 'Browse our catalog of premium mobile gadgets and accessories.')
  const instruction2 = await getContent('howtouse.instruction2', 'Add products to your cart and review your selections.')
  const instruction3 = await getContent('howtouse.instruction3', 'Proceed to checkout and complete your order.')
  const instruction4 = await getContent('howtouse.instruction4', 'Receive tracking information once your order ships.')
  const instruction5 = await getContent('howtouse.instruction5', 'Enjoy your new mobile gadgets with our quality guarantee.')

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

