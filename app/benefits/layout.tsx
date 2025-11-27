import { generatePageMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return await generatePageMetadata({
    title: 'Benefits',
    description: 'Explore the comprehensive benefits of SweetB: sustained energy, balanced confidence, lasting performance, and discreet convenience. Natural support for modern life.',
    path: '/benefits',
    keywords: ['energy boost', 'confidence', 'performance', 'natural benefits', 'mens wellness'],
  })
}

export default function BenefitsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

