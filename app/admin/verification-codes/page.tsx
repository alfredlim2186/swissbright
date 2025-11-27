import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import VerificationCodesManager, { RecentCode } from './VerificationCodesManager'

export default async function AdminVerificationCodesPage() {
  try {
    await requireAdmin()
  } catch {
    throw new Error('Unauthorized')
  }

  const [totalCodes, usedCodes, recent] = await Promise.all([
    prisma.verificationCode.count(),
    prisma.verificationCode.count({
      where: { purchase: { isNot: null } },
    }),
    prisma.verificationCode.findMany({
      take: 12,
      orderBy: { createdAt: 'desc' },
      include: {
        purchase: {
          select: {
            verifiedAt: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    }),
  ])

  const recentCodes: RecentCode[] = recent.map((code) => ({
    id: code.id,
    codeValue: code.codeValue,
    securityCodeValue: code.securityCodeValue,
    codeLast4: code.codeLast4,
    securityLast4: code.securityLast4,
    batch: code.batch,
    productId: code.productId,
    createdAt: code.createdAt.toISOString(),
    usedAt: code.purchase?.verifiedAt?.toISOString() ?? null,
    usedByEmail: code.purchase?.user?.email ?? null,
  }))

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem 1rem 3rem',
      backgroundColor: '#050505',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ letterSpacing: '4px', color: '#B8B8B8', textTransform: 'uppercase', fontSize: '0.8rem' }}>Admin</p>
          <h1 style={{ color: '#F8F8F8', fontFamily: "'Playfair Display', serif", fontSize: '2.75rem' }}>Verification codes</h1>
          <p style={{ color: '#B8B8B8', maxWidth: '720px' }}>
            Upload and manage verification & security codes so customers can confirm their purchases and unlock rewards.
          </p>
        </div>

        <VerificationCodesManager
          initialStats={{ totalCodes, usedCodes }}
          initialRecent={recentCodes}
        />
      </div>
    </div>
  )
}

