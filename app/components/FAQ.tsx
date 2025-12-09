import styles from './FAQ.module.css'
import ScrollReveal from './ScrollReveal'
import { getContent } from '@/lib/content'

export default async function FAQ() {
  const title = await getContent('faq.title', 'FAQ')
  const q1 = await getContent('faq.q1', 'What types of mobile gadgets do you sell?')
  const a1 = await getContent('faq.a1', 'We offer a wide range of mobile gadgets and accessories including protective cases, charging cables, wireless chargers, phone stands, screen protectors, and more. We focus on quality products that enhance your mobile experience.')
  const q2 = await getContent('faq.q2', 'Are your products authentic?')
  const a2 = await getContent('faq.a2', 'Yes, all our products are authentic and sourced from trusted manufacturers and suppliers. We verify the authenticity and quality of every product before adding it to our catalog.')
  const q3 = await getContent('faq.q3', 'What is your return policy?')
  const a3 = await getContent('faq.a3', 'We offer a comprehensive warranty and return policy. If you\'re not satisfied with your purchase, please contact our customer service team within 7 days of receipt. We\'ll work with you to resolve any issues.')
  const q4 = await getContent('faq.q4', 'How fast is shipping?')
  const a4 = await getContent('faq.a4', 'We offer multiple shipping options to suit your needs. Standard shipping typically takes 3-5 business days, while express shipping options are available for faster delivery. You\'ll receive tracking information once your order ships.')
  const q5 = await getContent('faq.q5', 'Do you ship internationally?')
  const a5 = await getContent('faq.a5', 'Currently, we ship within our primary service area. Please check our shipping page or contact us for specific delivery locations and rates.')

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

