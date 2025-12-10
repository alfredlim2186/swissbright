'use client'

import Image from 'next/image'
import styles from './Hero.module.css'

interface HeroProps {
  headline?: string
  subheadline?: string
  ctaPrimary?: string
  ctaSecondary?: string
}

export default function Hero({ 
  headline, 
  subheadline, 
  ctaPrimary, 
  ctaSecondary 
}: HeroProps) {
  return (
    <section className={styles.hero}>
      {/* Full-screen background image */}
      <div className={styles.heroBackground}>
        <Image 
          src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1920&q=80"
          alt="Premium mobile gadgets"
          fill
          priority
          quality={85}
          className={styles.heroImage}
          sizes="100vw"
        />
        <div className={styles.heroOverlay}></div>
      </div>

      {/* Simple centered content */}
      <div className={styles.content}>
        <h1 className={styles.headline}>
          <span className={styles.handwriting}>{headline || 'Vitality Reborn'}</span>
        </h1>
        
        <div className={styles.divider}></div>
        
        <p className={styles.subheadline}>
          {subheadline || 'A discreet daily candy crafted for balanced energy, focus, and confidence.'}
        </p>
        
        <div className={styles.buttons}>
          <a href="/shop" className="btn btn-primary">{ctaPrimary || 'Shop Now'}</a>
          <a href="/benefits" className="btn btn-secondary">{ctaSecondary || 'Why Buy From Us'}</a>
        </div>
      </div>
    </section>
  )
}

