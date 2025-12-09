import { NextRequest, NextResponse } from 'next/server'
import { getContent } from '@/lib/content'
import { getCurrentLanguage } from '@/lib/content'
import type { Language } from '@/lib/i18n-constants'

export const dynamic = 'force-dynamic'

/**
 * GET /api/translations?keys=key1,key2,key3
 * Fetches translations for multiple content keys at once
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const keysParam = searchParams.get('keys')
    const langParam = searchParams.get('lang') as Language | null

    if (!keysParam) {
      return NextResponse.json({ error: 'Missing keys parameter' }, { status: 400 })
    }

    const keys = keysParam.split(',').map(k => k.trim()).filter(Boolean)
    if (keys.length === 0) {
      return NextResponse.json({ error: 'No valid keys provided' }, { status: 400 })
    }

    // Fetch all translations in parallel (English only, no language parameter needed)
    const translations: Record<string, string> = {}
    await Promise.all(
      keys.map(async (key) => {
        // Use empty string as fallback, we'll handle defaults in the frontend
        translations[key] = await getContent(key, '')
      })
    )

    return NextResponse.json({ translations, language: 'en' })
  } catch (error) {
    console.error('Error fetching translations:', error)
    return NextResponse.json({ error: 'Failed to fetch translations' }, { status: 500 })
  }
}

