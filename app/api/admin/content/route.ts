import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const contentSchema = z.object({
  key: z.string().min(1),
  type: z.enum(['TEXT', 'IMAGE', 'ICON']),
  value: z.string().min(1),
  language: z.enum(['en', 'ms', 'zh-CN']).default('en'),
  page: z.string().optional(),
  section: z.string().optional(),
  label: z.string().optional(),
  description: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    await requireAdmin()
    
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')
    const section = searchParams.get('section')
    const language = searchParams.get('language')

    const where: any = {}
    if (page) where.page = page
    if (section) where.section = section
    if (language) where.language = language

    const content = await prisma.content.findMany({
      where,
      orderBy: [{ page: 'asc' }, { section: 'asc' }, { key: 'asc' }],
    })
    
    return NextResponse.json(content)
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()
    
    const body = await request.json()
    const validated = contentSchema.parse(body)
    
    const content = await prisma.content.upsert({
      where: { 
        key_language: {
          key: validated.key,
          language: validated.language,
        }
      },
      update: validated,
      create: validated,
    })
    
    return NextResponse.json(content)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Content creation error:', error)
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin()
    
    const body = await request.json()
    const { key, language, value, type, page, section, label, description, updateAllLanguages } = body
    
    if (!key || !language) {
      return NextResponse.json({ error: 'Key and language are required' }, { status: 400 })
    }

    // If updating an IMAGE and updateAllLanguages is true, update for all languages
    if (type === 'IMAGE' && updateAllLanguages && value !== undefined) {
      const languages = ['en', 'ms', 'zh-CN']
      const results = await Promise.all(
        languages.map(async (lang) => {
          return await prisma.content.upsert({
            where: { 
              key_language: {
                key,
                language: lang,
              }
            },
            update: {
              value,
              type: 'IMAGE',
              ...(page !== undefined && { page }),
              ...(section !== undefined && { section }),
              ...(label !== undefined && { label }),
              ...(description !== undefined && { description }),
            },
            create: {
              key,
              language: lang,
              type: 'IMAGE',
              value,
              page: page || null,
              section: section || null,
              label: label || null,
              description: description || null,
            },
          })
        })
      )
      return NextResponse.json({ updated: results, message: 'Image updated for all languages' })
    }

    // Use upsert to create if it doesn't exist, update if it does
    const content = await prisma.content.upsert({
      where: { 
        key_language: {
          key,
          language,
        }
      },
      update: {
        ...(value !== undefined && { value }),
        ...(type !== undefined && { type }),
        ...(page !== undefined && { page }),
        ...(section !== undefined && { section }),
        ...(label !== undefined && { label }),
        ...(description !== undefined && { description }),
      },
      create: {
        key,
        language,
        type: type || 'TEXT',
        value: value || '',
        page: page || null,
        section: section || null,
        label: label || null,
        description: description || null,
      },
    })
    
    return NextResponse.json(content)
  } catch (error) {
    console.error('Content update error:', error)
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin()
    
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    const language = searchParams.get('language')
    
    if (!key || !language) {
      return NextResponse.json({ error: 'Key and language are required' }, { status: 400 })
    }

    await prisma.content.delete({
      where: { 
        key_language: {
          key,
          language,
        }
      },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Content deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 })
  }
}

