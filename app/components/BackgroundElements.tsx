'use client'

import { useEffect, useState } from 'react'
import styles from './BackgroundElements.module.css'

export default function BackgroundElements() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={styles.backgroundElements}>
      {/* Floating geometric shapes */}
      <div 
        className={`${styles.shape} ${styles.shape1}`}
        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
      />
      <div 
        className={`${styles.shape} ${styles.shape2}`}
        style={{ transform: `translateY(${scrollY * -0.1}px)` }}
      />
      <div 
        className={`${styles.shape} ${styles.shape3}`}
        style={{ transform: `translateY(${scrollY * 0.2}px) rotate(${scrollY * 0.05}deg)` }}
      />
      <div 
        className={`${styles.shape} ${styles.shape4}`}
        style={{ transform: `translateY(${scrollY * -0.15}px)` }}
      />
      <div 
        className={`${styles.shape} ${styles.shape5}`}
        style={{ transform: `translateY(${scrollY * 0.08}px)` }}
      />
      
      {/* Decorative lines */}
      <div 
        className={`${styles.line} ${styles.line1}`}
        style={{ transform: `translateY(${scrollY * 0.12}px)` }}
      />
      <div 
        className={`${styles.line} ${styles.line2}`}
        style={{ transform: `translateY(${scrollY * -0.08}px)` }}
      />
      
      {/* Subtle dots pattern */}
      <div className={styles.dotsPattern} />
    </div>
  )
}

