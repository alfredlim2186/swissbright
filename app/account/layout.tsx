import { generatePageMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return await generatePageMetadata({
    title: 'My Account',
    description: 'View your purchase history, redeem gifts, and manage your Swiss Bright account.',
    path: '/account',
  })
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

