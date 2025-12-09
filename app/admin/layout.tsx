import type { Metadata } from 'next'
import AdminShell from './AdminShell'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin Dashboard - Swiss Bright',
  description: 'Swiss Bright CRM administration',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminShell>{children}</AdminShell>
}

