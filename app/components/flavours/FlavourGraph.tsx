'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './FlavourGraph.module.css'

interface FlavourAttribute {
  name: string
  value: number // 0-100
  color: string
}

interface FlavourGraphProps {
  attributes: FlavourAttribute[]
}

export default function FlavourGraph({ attributes }: FlavourGraphProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [animateValues, setAnimateValues] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          setTimeout(() => {
            setAnimateValues(true)
          }, 300)
        }
      },
      { threshold: 0.2 }
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
        <h2 className={styles.sectionTitle}>Flavour Intensity</h2>
        <div className={styles.divider}></div>
        <p className={styles.description}>
          A refined balance of tropical sweetness and cool clarity, crafted for discerning palates.
        </p>

        <div className={styles.graphContainer}>
          {attributes.map((attr, index) => (
            <div key={index} className={styles.attribute}>
              <div className={styles.attributeHeader}>
                <span className={styles.attributeName}>{attr.name}</span>
                <span className={styles.attributeValue}>{attr.value}%</span>
              </div>
              <div className={styles.barBackground}>
                <div 
                  className={`${styles.barFill} ${animateValues ? styles.barAnimate : ''}`}
                  style={{
                    width: animateValues ? `${attr.value}%` : '0%',
                    backgroundColor: attr.color,
                    boxShadow: `0 0 20px ${attr.color}40, 0 0 40px ${attr.color}20`,
                  }}
                >
                  <div className={styles.barGlow}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ backgroundColor: 'rgba(201, 168, 106, 1)' }}></span>
            <span className={styles.legendText}>Dominant Notes</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ backgroundColor: 'rgba(201, 168, 106, 0.6)' }}></span>
            <span className={styles.legendText}>Supporting Notes</span>
          </div>
        </div>
      </div>
    </section>
  )
}




