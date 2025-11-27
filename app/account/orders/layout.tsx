import { generatePageMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'My Orders',
    description: 'Review your SweetB orders, statuses, and tracking information.',
    path: '/account/orders',
  })
}

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

