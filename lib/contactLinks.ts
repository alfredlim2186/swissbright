import { prisma } from './db'
import { cache } from 'react'

export type ContactLinkPayload = {
  id?: string
  label: string
  url: string
  logoUrl?: string | null
  description?: string | null
  accentColor?: string | null
  sortOrder?: number
  isActive?: boolean
}

export const getContactLinks = cache(async () => {
  // Hardcoded contact links - no database required
  const hardcodedLinks: ContactLinkPayload[] = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      url: 'https://wa.me/60123456789',
      isActive: true,
      sortOrder: 0,
    },
    {
      id: 'email',
      label: 'Email',
      url: 'mailto:contact@swissbright.com',
      isActive: true,
      sortOrder: 1,
    },
  ]

  try {
    const links = await prisma.contactLink.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    })
    return links.length > 0 ? links : hardcodedLinks
  } catch (error) {
    console.warn('Database not available, using hardcoded contact links:', error)
    return hardcodedLinks
  }
})


