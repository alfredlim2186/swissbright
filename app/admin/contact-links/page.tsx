import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import ContactLinksManager from './ContactLinksManager'

export default async function ContactLinksPage() {
  try {
    await requireAdmin()
  } catch {
    redirect('/login')
  }

  return <ContactLinksManager />
}


