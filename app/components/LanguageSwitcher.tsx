'use client'

import { useEffect, useState } from 'react'
import { SUPPORTED_LANGUAGES, LANGUAGE_NAMES, type Language } from '@/lib/i18n-constants'
import styles from './LanguageSwitcher.module.css'

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState<Language>('en')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Get current language from cookie
    fetch('/api/language')
      .then(res => res.json())
      .then(data => setCurrentLang(data.language || 'en'))
      .catch(() => setCurrentLang('en'))
  }, [])

  const handleLanguageChange = async (lang: Language) => {
    try {
      await fetch('/api/language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang }),
      })
      setCurrentLang(lang)
      setIsOpen(false)
      // Reload page to apply translations
      window.location.reload()
    } catch (error) {
      console.error('Failed to change language:', error)
    }
  }

  return (
    <div className={styles.languageSwitcher}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change language"
      >
        <span className={styles.currentLang}>
          {currentLang === 'en' ? 'EN' : currentLang === 'ms' ? 'MS' : '中文'}
        </span>
        <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className={styles.overlay}
            onClick={() => setIsOpen(false)}
          />
          <div className={styles.dropdown}>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang}
                className={`${styles.option} ${currentLang === lang ? styles.active : ''}`}
                onClick={() => handleLanguageChange(lang)}
              >
                <span className={styles.flag}>
                  {lang === 'en' ? '🇬🇧' : lang === 'ms' ? '🇲🇾' : '🇨🇳'}
                </span>
                <span className={styles.label}>{LANGUAGE_NAMES[lang]}</span>
                {currentLang === lang && (
                  <span className={styles.check}>✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

