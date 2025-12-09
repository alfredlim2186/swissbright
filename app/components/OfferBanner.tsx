import styles from './OfferBanner.module.css'
import { getContent } from '@/lib/content'

export default async function OfferBanner() {
  const text = await getContent('offerbanner.text', 'Register at {link} to unlock member perks — free gifts with every 10-box purchase.')
  
  // Replace {link} placeholder with actual link
  const parts = text.split('{link}')
  const linkText = parts[0].trim()
  const afterLink = parts[1] ? parts[1].trim() : ''

  return (
    <section className={styles.offerBanner}>
      <div className={styles.content}>
        <span className={styles.icon}>★</span>
        <p className={styles.text}>
          {linkText} <a href="https://swissbright.com" className={styles.link}>swissbright.com</a> {afterLink}
        </p>
        <span className={styles.icon}>★</span>
      </div>
    </section>
  )
}

