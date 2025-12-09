'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './Ingredients.module.css'

interface Ingredient {
  icon: string
  name: string
  benefit: string
  image: string
  imageAlt: string
}

interface IngredientsProps {
  title?: string
  description?: string
}

const defaultIngredients: Ingredient[] = [
  {
    icon: '🌿',
    name: 'Korean Red Ginseng',
    benefit: 'Energy & vitality',
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=400&q=80',
    imageAlt: 'Korean red ginseng root',
  },
  {
    icon: '🌱',
    name: 'Tongkat Ali',
    benefit: 'Supports natural testosterone',
    image: 'https://images.unsplash.com/photo-1616361444779-9d8b97e1c6f0?w=400&q=80',
    imageAlt: 'Tongkat ali plant',
  },
  {
    icon: '🌾',
    name: 'Maca Root',
    benefit: 'Endurance & stamina',
    image: 'https://images.unsplash.com/photo-1599932477328-0a35f0d33b4a?w=400&q=80',
    imageAlt: 'Maca root powder',
  },
  {
    icon: '◉',
    name: 'L-Arginine',
    benefit: 'Promotes healthy blood flow',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
    imageAlt: 'Natural supplements',
  },
  {
    icon: '✧',
    name: 'Tribulus Terrestris',
    benefit: 'Performance optimization',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&q=80',
    imageAlt: 'Tribulus terrestris plant',
  },
]

export default function Ingredients({ title, description }: IngredientsProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>(defaultIngredients)
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Calculate slide width based on screen size
  const getSlideWidth = () => {
    if (typeof window === 'undefined') return 380
    const width = window.innerWidth
    if (width <= 480) return 256 // 240px tile + 16px gap
    if (width <= 768) return 304 // 280px tile + 24px gap
    if (width <= 1024) return 352 // 320px tile + 32px gap
    return 392 // 360px tile + 32px gap
  }

  const [slideWidth, setSlideWidth] = useState(380)

  // Fetch ingredients from API
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await fetch('/api/ingredients')
        if (res.ok) {
          const data = await res.json()
          if (data.ingredients && data.ingredients.length > 0) {
            // Map API data to component format
            const mapped = data.ingredients.map((ing: any) => ({
              icon: ing.icon || '🌿',
              name: ing.name,
              benefit: ing.benefit || '',
              image: ing.image,
              imageAlt: ing.imageAlt || ing.name,
            }))
            setIngredients(mapped)
          }
        }
      } catch (error) {
        console.error('Failed to fetch ingredients:', error)
        // Keep default ingredients on error
      } finally {
        setLoading(false)
      }
    }

    fetchIngredients()
  }, [])

  // Triple the ingredients array for seamless infinite loop
  const extendedIngredients = [...ingredients, ...ingredients, ...ingredients]

  useEffect(() => {
    const handleResize = () => {
      setSlideWidth(getSlideWidth())
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setIsTransitioning(true)
      setCurrentIndex((prev) => prev + 1)
    }, 3000) // Change slide every 3 seconds

    return () => clearInterval(interval)
  }, [isPaused])

  // Handle infinite loop reset
  useEffect(() => {
    if (ingredients.length > 0 && currentIndex === ingredients.length) {
      // When we reach the end of the first set, reset to beginning of second set
      setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(0)
      }, 800) // Match transition duration
    }
  }, [currentIndex, ingredients.length])

  return (
    <section id="ingredients" className={styles.ingredients}>
      <h2 className={styles.sectionTitle}>{title || 'Ingredients'}</h2>
      <div className="gold-divider"></div>
      <p className={styles.intro}>
        {description || 'Swiss Bright combines quality materials with modern technology to deliver reliable mobile accessories and gadgets that enhance your daily experience.'}
      </p>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#B8B8B8' }}>
          Loading ingredients...
        </div>
      ) : ingredients.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#B8B8B8' }}>
          No ingredients available. Please add ingredients in the admin panel.
        </div>
      ) : (
        <div 
          className={styles.carouselContainer}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
        <div 
          ref={carouselRef}
          className={styles.carousel}
          style={{
            transform: `translateX(-${(currentIndex + ingredients.length) * slideWidth}px)`,
            transition: isTransitioning ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          }}
        >
          {extendedIngredients.map((ingredient, index) => {
            // Calculate which card is in the center position
            const centerIndex = currentIndex + ingredients.length
            const isActive = index === centerIndex
            const offset = index - centerIndex
            
            let positionClass = ''
            if (!isActive) {
              if (offset < 0) {
                positionClass = styles.tileLeft
              } else {
                positionClass = styles.tileRight
              }
            }
            
            return (
              <div 
                key={index} 
                className={`${styles.tile} ${
                  isActive ? styles.tileActive : ''
                } ${positionClass}`}
              >
              <div className={styles.tileImageWrapper}>
                <img 
                  src={ingredient.image} 
                  alt={ingredient.imageAlt}
                  className={styles.tileImage}
                  loading="lazy"
                />
                <div className={styles.tileOverlay}></div>
              </div>
              <div className={styles.tileContent}>
                <span className={styles.tileIcon}>{ingredient.icon}</span>
                <h3 className={styles.tileName}>{ingredient.name}</h3>
                <p className={styles.tileBenefit}>{ingredient.benefit}</p>
              </div>
              </div>
            )
          })}
        </div>
        </div>
      )}

      {!loading && ingredients.length > 0 && (
        <div className={styles.indicators}>
          {ingredients.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${
                index === (currentIndex % ingredients.length) ? styles.indicatorActive : ''
              }`}
              onClick={() => {
                setIsTransitioning(true)
                setCurrentIndex(index)
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
