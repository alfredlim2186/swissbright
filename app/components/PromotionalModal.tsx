'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './PromotionalModal.module.css'

interface PromotionalModalProps {
  message: string
  ctaText: string
}

export default function PromotionalModal({ message, ctaText }: PromotionalModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Check if modal was previously dismissed
    // In development, you can add ?showModal=true to URL to force show
    const urlParams = new URLSearchParams(window.location.search)
    const forceShow = urlParams.get('showModal') === 'true'
    
    // For testing: if URL has ?clearModal=true, clear the localStorage
    if (urlParams.get('clearModal') === 'true') {
      localStorage.removeItem('promotionalModalDismissed')
    }
    
    const isDismissed = localStorage.getItem('promotionalModalDismissed')
    
    if (!isDismissed || forceShow) {
      // Show modal after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true)
        // Trigger animation after state update
        setTimeout(() => {
          setIsAnimating(true)
        }, 10)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      setIsVisible(false)
      localStorage.setItem('promotionalModalDismissed', 'true')
    }, 300)
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  if (!isVisible) return null

  return (
    <div 
      className={`${styles.overlay} ${isAnimating ? styles.overlayVisible : ''}`}
      onClick={handleOverlayClick}
    >
      <div className={`${styles.modal} ${isAnimating ? styles.modalVisible : ''}`}>
        <button 
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close modal"
        >
          ✕
        </button>
        
        <div className={styles.content}>
          <div className={styles.iconWrapper}>
            <span className={styles.icon}>🎁</span>
          </div>
          
          <h2 className={styles.title}>Unlock Member Perks</h2>
          
          <p className={styles.message}>
            {message}
          </p>
          
          <Link 
            href="/login" 
            className={styles.ctaButton}
            onClick={handleClose}
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </div>
  )
}

