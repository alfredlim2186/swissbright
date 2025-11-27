import { generatePageMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return await generatePageMetadata({
    title: 'Verify Purchase',
    description: 'Verify your SweetB purchase code and track your journey to exclusive rewards.',
    path: '/verify',
  })
}

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

