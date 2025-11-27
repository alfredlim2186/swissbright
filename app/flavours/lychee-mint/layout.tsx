import { generatePageMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return await generatePageMetadata({
    title: 'Lychee Mint',
    description: 'A refined union of tropical lychee and clean mint for focus, clarity, and lasting poise. Vitality Reborn, with a cool precision.',
    path: '/flavours/lychee-mint',
    keywords: ['lychee mint', 'sweetb flavour', 'mens health candy', 'focus', 'clarity', 'vitality'],
  })
}

export default function LycheeMintLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

