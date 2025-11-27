'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './TastingNotes.module.css'

interface TastingNotesProps {
  notes: {
    label: string
    description: string
  }[]
  aroma: string
  mouthfeel: string
}

export default function TastingNotes({ notes, aroma, mouthfeel }: TastingNotesProps) {
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
        <div className={styles.tastingNotesBlock}>
          <h2 className={styles.sectionTitle}>Tasting Notes</h2>
          <ul className={styles.notesList}>
            {notes.map((note, index) => (
              <li key={index} className={styles.noteItem}>
                <span className={styles.noteLabel}>{note.label}:</span>
                <span className={styles.noteDescription}>{note.description}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.sensoryBlock}>
          <h2 className={styles.sectionTitle}>Aroma & Mouthfeel</h2>
          <div className={styles.sensoryGrid}>
            <div className={styles.sensoryItem}>
              <h3 className={styles.sensoryLabel}>Aroma</h3>
              <p className={styles.sensoryText}>{aroma}</p>
            </div>
            <div className={styles.sensoryItem}>
              <h3 className={styles.sensoryLabel}>Mouthfeel</h3>
              <p className={styles.sensoryText}>{mouthfeel}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

