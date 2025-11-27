import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import ShopAdmin from './ShopAdmin'

export default async function AdminShopPage() {
  try {
    await requireAdmin()
  } catch {
    redirect('/login')
  }

  return <ShopAdmin />
}


