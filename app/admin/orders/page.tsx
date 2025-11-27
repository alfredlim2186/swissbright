import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import OrdersManager from './OrdersManager'

export default async function AdminOrdersPage() {
  try {
    await requireAdmin()
  } catch {
    redirect('/login')
  }

  return <OrdersManager />
}


