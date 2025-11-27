import styles from './FAQ.module.css'
import ScrollReveal from './ScrollReveal'
import { getContent } from '@/lib/content'

export default async function FAQ() {
  const title = await getContent('faq.title', 'FAQ')
  const q1 = await getContent('faq.q1', 'How long do effects last?')
  const a1 = await getContent('faq.a1', 'Effects typically last up to 3 days, though this can vary by individual based on metabolism, diet, and activity level.')
  const q2 = await getContent('faq.q2', 'Is SweetB safe for daily use?')
  const a2 = await getContent('faq.a2', 'SweetB is designed to be taken once per day. Do not exceed one candy in a 24-hour period. If you have any medical conditions or concerns, consult your doctor before use.')
  const q3 = await getContent('faq.q3', 'Can I mix SweetB with other supplements?')
  const a3 = await getContent('faq.a3', 'We recommend not mixing SweetB with other medicines or supplements unless advised by your doctor, as interactions can occur.')
  const q4 = await getContent('faq.q4', 'When should I take SweetB?')
  const a4 = await getContent('faq.a4', 'For best results, take SweetB on an empty stomach or at least 2 hours after a meal. Effects typically begin 1–3 hours after consumption.')
  const q5 = await getContent('faq.q5', 'Where is SweetB made?')
  const a5 = await getContent('faq.a5', 'SweetB is manufactured in facilities that adhere to strict quality and safety standards, ensuring consistency and purity in every candy.')

  const faqs = [
    { question: q1, answer: a1 },
    { question: q2, answer: a2 },
    { question: q3, answer: a3 },
    { question: q4, answer: a4 },
    { question: q5, answer: a5 },
  ]

  return (
    <section id="faq" className={styles.faq}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className="gold-divider"></div>
      <div className={styles.list}>
        {faqs.map((faq, index) => (
          <ScrollReveal key={index} delay={index * 80}>
            <details className={styles.item}>
              <summary className={styles.question}>{faq.question}</summary>
              <p className={styles.answer}>{faq.answer}</p>
            </details>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}

