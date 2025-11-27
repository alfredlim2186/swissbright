import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import HeaderWrapper from './components/HeaderWrapper'
import MemberBannerWrapper from './components/MemberBannerWrapper'
import PromotionalModalWrapper from './components/PromotionalModalWrapper'
import VisitorTracker from './components/VisitorTracker'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'SweetB - Vitality Reborn',
  description: 'A discreet daily candy crafted for balanced energy, focus, and confidence — without the noise.',
  keywords: 'mens health, supplement, energy, focus, confidence, vitality',
  authors: [{ name: 'SweetB' }],
  openGraph: {
    title: 'SweetB - Vitality Reborn',
    description: 'A discreet daily candy crafted for balanced energy, focus, and confidence — without the noise.',
    type: 'website',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <VisitorTracker />
        <HeaderWrapper />
        {children}
        <PromotionalModalWrapper />
        <MemberBannerWrapper />
      </body>
    </html>
  )
}

