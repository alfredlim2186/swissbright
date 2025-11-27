import { generatePageMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return await generatePageMetadata({
    title: 'Contact Us',
    description: 'Get in touch with SweetB. Connect with us via email, WhatsApp, Telegram, or social media for any inquiries or support.',
    path: '/contact',
  })
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

