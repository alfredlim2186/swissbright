import { prisma } from './db'
import { cache } from 'react'

export type ContactLinkPayload = {
  label: string
  url: string
  logoUrl?: string | null
  description?: string | null
  accentColor?: string | null
  sortOrder?: number
  isActive?: boolean
}

export const getContactLinks = cache(async () => {
  try {
    return await prisma.contactLink.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    })
  } catch (error) {
    console.error('Failed to load contact links', error)
    return []
  }
})


