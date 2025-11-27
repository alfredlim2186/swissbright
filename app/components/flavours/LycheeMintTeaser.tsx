'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './LycheeMintTeaser.module.css'

interface LycheeMintTeaserProps {
  eyebrow: string
  title: string
  subhead: string
  highlight1Title: string
  highlight1Desc: string
  highlight2Title: string
  highlight2Desc: string
  highlight3Title: string
  highlight3Desc: string
  cta1: string
  cta2: string
}

export default function LycheeMintTeaser({
  eyebrow,
  title,
  subhead,
  highlight1Title,
  highlight1Desc,
  highlight2Title,
  highlight2Desc,
  highlight3Title,
  highlight3Desc,
  cta1,
  cta2,
}: LycheeMintTeaserProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section 
      ref={sectionRef} 
      className={`${styles.teaser} ${isVisible ? styles.visible : ''}`}
    >
      <div className={styles.container}>
        <div className={styles.introSection}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.divider}></div>
          <p className={styles.subhead} dangerouslySetInnerHTML={{ __html: subhead.replace(/\n/g, '<br />') }} />

          <div className={styles.highlights}>
            <div className={styles.highlight}>
              <span className={styles.highlightIcon}>🌺</span>
              <div className={styles.highlightText}>
                <h3 className={styles.highlightTitle}>{highlight1Title}</h3>
                <p className={styles.highlightDesc}>{highlight1Desc}</p>
              </div>
            </div>
            <div className={styles.highlight}>
              <span className={styles.highlightIcon}>🌿</span>
              <div className={styles.highlightText}>
                <h3 className={styles.highlightTitle}>{highlight2Title}</h3>
                <p className={styles.highlightDesc}>{highlight2Desc}</p>
              </div>
            </div>
            <div className={styles.highlight}>
              <span className={styles.highlightIcon}>⚖</span>
              <div className={styles.highlightText}>
                <h3 className={styles.highlightTitle}>{highlight3Title}</h3>
                <p className={styles.highlightDesc}>{highlight3Desc}</p>
              </div>
            </div>
          </div>

          <div className={styles.buttons}>
            <Link href="/flavours/lychee-mint" className={styles.primaryButton}>
              {cta1}
            </Link>
            <Link href="/shop" className={styles.secondaryButton}>
              {cta2}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

