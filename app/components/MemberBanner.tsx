'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './MemberBanner.module.css'

interface MemberBannerProps {
  message: string
  buttonText: string
}

export default function MemberBanner({ message, buttonText }: MemberBannerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Check if banner was previously dismissed
    const isDismissed = localStorage.getItem('memberBannerDismissed')
    
    if (!isDismissed) {
      // Show banner after a short delay
      setTimeout(() => {
        setIsVisible(true)
        setIsAnimating(true)
      }, 2000)
    }
  }, [])

  const handleDismiss = () => {
    setIsAnimating(false)
    setTimeout(() => {
      setIsVisible(false)
      localStorage.setItem('memberBannerDismissed', 'true')
    }, 300)
  }

  if (!isVisible) return null

  return (
    <div className={`${styles.banner} ${isAnimating ? styles.bannerVisible : ''}`}>
      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          <span className={styles.icon}>🎁</span>
        </div>
        <div className={styles.content}>
          <p className={styles.message}>
            <strong>{message}</strong>
          </p>
        </div>
        <Link href="/login" className={styles.ctaButton}>
          {buttonText}
        </Link>
        <button 
          className={styles.closeButton}
          onClick={handleDismiss}
          aria-label="Close banner"
        >
          ✕
        </button>
      </div>
    </div>
  )
}



