import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { prisma } from './db'

const SESSION_COOKIE = 'sweetb_session'

function getSessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SESSION_SECRET environment variable is required in production')
    }
    console.warn('⚠️  WARNING: SESSION_SECRET not set, using fallback. This is insecure for production!')
    return new TextEncoder().encode('fallback-secret-change-in-production')
  }
  return new TextEncoder().encode(secret)
}

const SESSION_SECRET = getSessionSecret()

export interface SessionUser {
  id: string
  email: string
  role: string
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SESSION_SECRET)

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return token
}

export async function getSession(): Promise<SessionUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET)
    return (payload.user as SessionUser) || null
  } catch {
    return null
  }
}

export async function destroySession() {
  cookies().delete(SESSION_COOKIE)
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function requireAdmin() {
  const session = await requireAuth()
  if (session.role !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required')
  }
  return session
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null

  return await prisma.user.findUnique({
    where: { id: session.id },
  })
}

