'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './SafetyBadges.module.css'

const badges = [
  { code: 'ISO 22000', title: 'Food Safety' },
  { code: 'GMP', title: 'Manufacturing Integrity' },
  { code: 'ISO 9001', title: 'Quality Management' },
  { code: 'HACCP', title: 'Preventive Controls' },
]

export default function SafetyBadges() {
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
      className={`${styles.section} ${isVisible ? styles.visible : ''}`}
    >
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Safety & Standards</h2>
        
        <div className={styles.badgeGrid}>
          {badges.map((badge, index) => (
            <div key={index} className={styles.badge}>
              <div className={styles.badgeCode}>{badge.code}</div>
              <div className={styles.badgeTitle}>{badge.title}</div>
            </div>
          ))}
        </div>

        <p className={styles.pledge}>
          Every batch is crafted under global safety standards for a result that's pure, consistent, and precise.
        </p>
      </div>
    </section>
  )
}

