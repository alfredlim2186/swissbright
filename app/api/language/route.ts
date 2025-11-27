import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SUPPORTED_LANGUAGES, type Language } from '@/lib/i18n-constants'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const lang = cookieStore.get('language')?.value as Language
    return NextResponse.json({ 
      language: lang && SUPPORTED_LANGUAGES.includes(lang) ? lang : 'en' 
    })
  } catch {
    return NextResponse.json({ language: 'en' })
  }
}

export async function POST(request: Request) {
  try {
    const { language } = await request.json()
    
    if (!SUPPORTED_LANGUAGES.includes(language as Language)) {
      return NextResponse.json({ error: 'Invalid language' }, { status: 400 })
    }

    const cookieStore = await cookies()
    cookieStore.set('language', language, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    })

    return NextResponse.json({ success: true, language })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to set language' }, { status: 500 })
  }
}

