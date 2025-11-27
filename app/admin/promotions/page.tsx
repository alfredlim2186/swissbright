import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import PromotionsManager from './PromotionsManager'

export default async function PromotionsPage() {
  try {
    await requireAdmin()
  } catch {
    redirect('/login')
  }

  return <PromotionsManager />
}


