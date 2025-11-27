'use client'

import { useEffect, useRef, useState } from 'react'
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
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)
  const [shouldSkipVideo, setShouldSkipVideo] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const connection = typeof navigator === 'undefined' ? null : (navigator as any)?.connection
    const slowConnection =
      connection?.saveData || /2g/.test(connection?.effectiveType || '')

    if (slowConnection) {
      setShouldSkipVideo(true)
      return
    }

    // Lazy load video using Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoadVideo(true)
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

  useEffect(() => {
    if (shouldLoadVideo && videoRef.current) {
      videoRef.current.load()
    }
  }, [shouldLoadVideo])

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true)
  }

  return (
    <section ref={sectionRef} className={styles.hero}>
      {/* Full-screen background video */}
      <div className={styles.heroBackground}>
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted 
          playsInline
          preload="metadata"
          className={`${styles.heroVideo} ${isVideoLoaded ? styles.videoLoaded : ''}`}
          poster="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1920&q=80"
          onLoadedData={handleVideoLoaded}
        >
          {shouldLoadVideo && !shouldSkipVideo && (
            <>
              {/* WebM for better compression (loads first if supported) */}
              <source 
                src="/videos/sweetb-freedom.webm" 
                type="video/webm"
              />
              {/* MP4 fallback */}
              <source 
                src="/videos/sweetb-freedom.mp4" 
                type="video/mp4" 
              />
            </>
          )}
          Your browser does not support the video tag.
        </video>
        
        {/* Loading overlay - fades out when video is ready */}
        <div className={`${styles.loadingOverlay} ${isVideoLoaded ? styles.hidden : ''}`}>
          <div className={styles.loadingSpinner}></div>
        </div>
        
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
          <a href="/shop" className="btn btn-primary">{ctaPrimary || 'Shop SweetB'}</a>
          <a href="/benefits" className="btn btn-secondary">{ctaSecondary || 'Learn More'}</a>
        </div>
      </div>
    </section>
  )
}

