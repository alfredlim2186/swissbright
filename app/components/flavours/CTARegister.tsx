'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './CTARegister.module.css'

export default function CTARegister() {
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
        <div className={styles.content}>
          <h2 className={styles.title}>Unlock Member Perks</h2>
          <p className={styles.description}>
            Register at swissbright.com to unlock member perks — free gifts with every purchase.
          </p>
          <Link href="/login" className={styles.ctaButton}>
            Create Account
          </Link>
        </div>
      </div>
    </section>
  )
}

