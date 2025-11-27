import { generatePageMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return await generatePageMetadata({
    title: 'Login',
    description: 'Sign in or create your SweetB account to access exclusive member benefits.',
    path: '/login',
  })
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

