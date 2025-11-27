import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { hashCode, hashSecurityCode, getCodeLast4 } from '@/lib/crypto'
import { requireAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const verifySchema = z.object({
  code: z.string().min(1),
  securityCode: z.string().min(1).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await request.json()
    const { code, securityCode } = verifySchema.parse(body)
    const normalizedCode = code.trim().toUpperCase()
    const normalizedSecurity = securityCode?.trim().toUpperCase()

    const codeHash = hashCode(normalizedCode)
    const codeLast4 = getCodeLast4(normalizedCode)
    const securityHash = normalizedSecurity ? hashSecurityCode(normalizedSecurity) : null
    const securityLast4 = normalizedSecurity ? getCodeLast4(normalizedSecurity) : null

    // Check if already validated
    const existing = await prisma.purchase.findUnique({
      where: { codeHash },
    })

    if (existing) {
      return NextResponse.json({
        valid: false,
        message: 'This code has already been validated',
        alreadyValidated: true,
      })
    }

    const verificationCode = await prisma.verificationCode.findUnique({
      where: { codeHash },
      include: {
        purchase: {
          select: {
            verifiedAt: true,
          },
        },
      },
    })

    if (verificationCode) {
      if (!normalizedSecurity) {
        return NextResponse.json({
          valid: false,
          message: 'Security code required for this verification entry.',
        })
      }

      if (verificationCode.securityHash !== securityHash) {
        return NextResponse.json({
          valid: false,
          message: 'Security code does not match',
        })
      }

      const purchase = await prisma.purchase.create({
        data: {
          userId: session.id,
          codeHash,
          codeLast4: verificationCode.codeLast4,
          batch: verificationCode.batch,
          productId: verificationCode.productId,
          verifierName: 'admin-import',
          rawPayload: JSON.stringify({ source: 'admin-import', securityLast4 }),
          verificationCodeId: verificationCode.id,
        },
      })

      await prisma.user.update({
        where: { id: session.id },
        data: { totalPurchases: { increment: 1 } },
      })

      return NextResponse.json({
        valid: true,
        firstTime: true,
        batch: verificationCode.batch,
        productId: verificationCode.productId,
        message: 'Code validated successfully',
      })
    }

    // Call third-party verifier
    const verifierUrl = process.env.VERIFIER_URL
    const verifierKey = process.env.VERIFIER_API_KEY

    if (!verifierUrl || !verifierKey) {
      console.error('Verifier not configured')
      // For development, accept any code
      if (process.env.NODE_ENV === 'development') {
        const purchase = await prisma.purchase.create({
          data: {
            userId: session.id,
            codeHash,
            codeLast4,
            batch: 'DEV-BATCH',
            productId: 'sweetb-001',
            verifierName: 'development',
            rawPayload: JSON.stringify({ dev: true }),
          },
        })

        await prisma.user.update({
          where: { id: session.id },
          data: { totalPurchases: { increment: 1 } },
        })

        return NextResponse.json({
          valid: true,
          firstTime: true,
          batch: 'DEV-BATCH',
          productId: 'sweetb-001',
          message: 'Code validated successfully (development mode)',
        })
      }

      return NextResponse.json(
        { error: 'Verification service not configured' },
        { status: 500 }
      )
    }

    try {
      const response = await fetch(verifierUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${verifierKey}`,
        },
        body: JSON.stringify({ code: normalizedCode }),
      })

      const data = await response.json()

      if (!response.ok || !data.valid) {
        return NextResponse.json({
          valid: false,
          message: data.message || 'Invalid code',
        })
      }

      // Store purchase
      const purchase = await prisma.purchase.create({
        data: {
          userId: session.id,
          codeHash,
          codeLast4,
          batch: data.batch || null,
          productId: data.productId || null,
          verifierName: data.verifierName || 'third-party',
          rawPayload: JSON.stringify(data),
        },
      })

      // Increment user purchase count
      await prisma.user.update({
        where: { id: session.id },
        data: { totalPurchases: { increment: 1 } },
      })

      return NextResponse.json({
        valid: true,
        firstTime: true,
        batch: data.batch,
        productId: data.productId,
        message: 'Code validated successfully',
      })
    } catch (verifierError) {
      console.error('Verifier API error:', verifierError)
      return NextResponse.json(
        { error: 'Verification service unavailable' },
        { status: 503 }
      )
    }
  } catch (error) {
    console.error('Verify forward error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Please log in first' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}

