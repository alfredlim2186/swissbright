import Link from 'next/link'
import styles from './FlavourHeader.module.css'

interface FlavourHeaderProps {
  title: string
  tagline: string
  description: string
}

export default function FlavourHeader({ title, tagline, description }: FlavourHeaderProps) {
  return (
    <section className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.tagline}>{tagline}</p>
        <p className={styles.description}>{description}</p>
        
        <div className={styles.buttons}>
          <Link href="/shop" className={styles.primaryButton}>
            Find a Box
          </Link>
          <Link href="/" className={styles.secondaryButton}>
            Back to Flavours
          </Link>
        </div>
      </div>
    </section>
  )
}

