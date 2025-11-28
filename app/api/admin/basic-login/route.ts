import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Lazy-load admin credentials to avoid build-time errors
function getAdminUsername(): string {
  return process.env.ADMIN_BASIC_USERNAME || 'Admin'
}

function getAdminPassword(): string {
  return process.env.ADMIN_BASIC_PASSWORD || 'Admin8899!'
}

export async function POST(request: NextRequest) {
  try {
    const { username = '', password = '' } = await request.json()

    if (username !== getAdminUsername() || password !== getAdminPassword()) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      orderBy: { createdAt: 'asc' },
    })

    if (!adminUser) {
      return NextResponse.json({ error: 'Admin account not found' }, { status: 500 })
    }

    await createSession({
      id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Admin basic login error', error)
    return NextResponse.json({ error: 'Unable to login. Please try again.' }, { status: 500 })
  }
}


