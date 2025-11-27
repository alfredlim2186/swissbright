import { generatePageMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return await generatePageMetadata({
    title: 'About Us - The Legend of SweetB',
    description: 'Discover the story of SweetB, from ancient Peruvian traditions to modern wellness. A 50-year heritage of natural vitality.',
    path: '/about',
    keywords: ['about sweetb', 'peruvian heritage', 'natural tradition', 'botanical history', 'mens health story'],
  })
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

