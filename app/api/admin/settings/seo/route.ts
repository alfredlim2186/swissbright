import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const seoSchema = z.object({
  siteName: z.string().min(1).max(100),
  baseUrl: z.string().url(),
  defaultOgImage: z.string().min(1),
  twitterHandle: z.string().optional(),
})

export async function GET() {
  try {
    await requireAdmin()
    
    const settings = await prisma.seoSettings.findUnique({
      where: { id: 1 },
    })
    
    return NextResponse.json(settings || {})
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin()
    
    const body = await request.json()
    const validated = seoSchema.parse(body)
    
    // Remove trailing slashes from baseUrl
    const cleanedBaseUrl = validated.baseUrl.replace(/\/$/, '')
    
    const updated = await prisma.seoSettings.upsert({
      where: { id: 1 },
      update: { ...validated, baseUrl: cleanedBaseUrl },
      create: { id: 1, ...validated, baseUrl: cleanedBaseUrl },
    })
    
    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('SEO settings update error:', error)
    return NextResponse.json({ error: 'Unauthorized or invalid data' }, { status: 401 })
  }
}




