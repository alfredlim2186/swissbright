import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { prisma } from './db'

const SESSION_COOKIE = 'sweetb_session'

// Lazy-load session secret to avoid build-time errors
// Only evaluated when actually needed at runtime
let _sessionSecret: Uint8Array | null = null

function getSessionSecret(): Uint8Array {
  if (_sessionSecret) return _sessionSecret
  
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    // Allow fallback during build phase (NEXT_PHASE is set during build)
    const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build' || 
                        process.env.NEXT_PHASE === 'phase-development-build'
    
    if (process.env.NODE_ENV === 'production' && !isBuildPhase) {
      throw new Error('SESSION_SECRET environment variable is required in production')
    }
    
    if (!isBuildPhase) {
      console.warn('⚠️  WARNING: SESSION_SECRET not set, using fallback. This is insecure for production!')
    }
    _sessionSecret = new TextEncoder().encode('fallback-secret-change-in-production')
    return _sessionSecret
  }
  
  _sessionSecret = new TextEncoder().encode(secret)
  return _sessionSecret
}

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
    .sign(getSessionSecret())

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return token
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, getSessionSecret())
    return (payload.user as SessionUser) || null
  } catch {
    return null
  }
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
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

