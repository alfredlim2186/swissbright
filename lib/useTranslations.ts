'use client'

import { useState, useEffect } from 'react'
import type { Language } from './i18n-constants'

/**
 * Hook to fetch translations for client components
 * Usage: const t = useTranslations(['account.welcome', 'account.email'])
 */
export function useTranslations(keys: string[], language?: Language) {
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [currentLanguage, setCurrentLanguage] = useState<Language | null>(language || null)

  // Fetch current language from cookie if not provided
  useEffect(() => {
    async function fetchCurrentLanguage() {
      if (language) {
        // Language is explicitly provided, use it
        setCurrentLanguage(language)
        return
      }

      try {
        const res = await fetch('/api/language')
        if (res.ok) {
          const data = await res.json()
          setCurrentLanguage(data.language || 'en')
        } else {
          setCurrentLanguage('en')
        }
      } catch (error) {
        console.error('Failed to fetch current language:', error)
        setCurrentLanguage('en')
      }
    }

    fetchCurrentLanguage()
  }, [language])

  // Fetch translations when keys or language changes
  useEffect(() => {
    async function fetchTranslations() {
      // Wait for current language to be determined
      if (!currentLanguage || keys.length === 0) {
        if (keys.length === 0) {
          setLoading(false)
        }
        return
      }

      try {
        const keysParam = keys.join(',')
        const res = await fetch(`/api/translations?keys=${keysParam}&lang=${currentLanguage}`)
        
        if (res.ok) {
          const data = await res.json()
          setTranslations(data.translations || {})
        }
      } catch (error) {
        console.error('Failed to fetch translations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTranslations()
  }, [keys.join(','), currentLanguage])

  // Helper function to get translation with fallback
  const t = (key: string, fallback: string = '') => {
    return translations[key] || fallback
  }

  return { t, translations, loading }
}

