export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import ExportManager from './ExportManager'

export default async function AdminExportsPage() {
  try {
    await requireAdmin()
  } catch {
    redirect('/login')
  }

  return <ExportManager />
}


