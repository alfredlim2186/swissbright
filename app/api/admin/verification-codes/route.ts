import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { getCodeLast4, hashCode, hashSecurityCode } from '@/lib/crypto'

export const dynamic = 'force-dynamic'

const uploadSchema = z.object({
  entries: z.array(
    z.object({
      code: z.string().min(1),
      securityCode: z.string().min(1),
      batch: z.string().optional().nullable(),
      productId: z.string().optional().nullable(),
    }),
  ),
})

const updateSchema = z.object({
  id: z.string(),
  code: z.string().min(1).optional(),
  securityCode: z.string().min(1).optional(),
  batch: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
})

const deleteSchema = z.object({
  ids: z.array(z.string()).min(1),
})

type NormalizedValue = {
  value: string
  hash: string
  last4: string
}

function normalizeValue(raw: string): NormalizedValue {
  const normalized = raw.trim().toUpperCase()
  return {
    value: normalized,
    hash: hashCode(normalized),
    last4: getCodeLast4(normalized),
  }
}

function normalizeSecurity(raw: string): NormalizedValue {
  const normalized = raw.trim().toUpperCase()
  return {
    value: normalized,
    hash: hashSecurityCode(normalized),
    last4: getCodeLast4(normalized),
  }
}

function normalizeEntry(entry: {
  code: string
  securityCode: string
  batch?: string | null
  productId?: string | null
}) {
  const codeNormalized = normalizeValue(entry.code)
  const securityNormalized = normalizeSecurity(entry.securityCode)
  return {
    codeHash: codeNormalized.hash,
    securityHash: securityNormalized.hash,
    codeLast4: codeNormalized.last4,
    securityLast4: securityNormalized.last4,
    codeValue: codeNormalized.value,
    securityCodeValue: securityNormalized.value,
    batch: entry.batch?.trim() || null,
    productId: entry.productId?.trim() || null,
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const url = new URL(request.url)
    const search = url.searchParams.get('search')?.trim()
    const where = search
      ? {
          OR: [
            { codeValue: { contains: search } },
            { securityCodeValue: { contains: search } },
            { batch: { contains: search } },
            { productId: { contains: search } },
          ],
        }
      : undefined

    const page = Number(url.searchParams.get('page') || '1')
    const limit = Number(url.searchParams.get('limit') || '80')
    const take = Math.max(1, Math.min(limit, 200))
    const skip = (Math.max(1, page) - 1) * take

    const [totalCodes, usedCodes, codes] = await Promise.all([
      prisma.verificationCode.count({ where }),
      prisma.verificationCode.count({ where: { purchase: { isNot: null } } }),
      prisma.verificationCode.findMany({
        where,
        take,
        skip,
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

    const serialized = codes.map((code) => ({
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

    return NextResponse.json({
      stats: {
        totalCodes,
        usedCodes,
      },
      codes: serialized,
    })
  } catch (error) {
    console.error('Verification codes GET error:', error)
    return NextResponse.json(
      { error: 'Unable to load verification codes' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const payload = await request.json()
    const { entries } = uploadSchema.parse(payload)

    let added = 0
    const duplicates: string[] = []
    const errors: string[] = []

    for (const entry of entries) {
      try {
        const normalized = normalizeEntry(entry)
        await prisma.verificationCode.create({
          data: {
            ...normalized,
          },
        })
        added++
      } catch (createError: any) {
        if (createError?.code === 'P2002') {
          duplicates.push(entry.code.toUpperCase())
          continue
        }
        console.error('Failed to import verification code:', createError)
        errors.push(entry.code.toUpperCase())
      }
    }

    return NextResponse.json({ added, duplicates, errors })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid payload', details: error.errors },
        { status: 400 },
      )
    }
    console.error('Verification codes POST error:', error)
    return NextResponse.json(
      { error: 'Failed to upload verification codes' },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin()
    const payload = await request.json()
    const { id, code, securityCode, batch, productId } = updateSchema.parse(payload)

    const existing = await prisma.verificationCode.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Verification code not found' }, { status: 404 })
    }

    const updateData: Record<string, any> = {}
    if (code) {
      const normalized = normalizeValue(code)
      updateData.codeHash = normalized.hash
      updateData.codeLast4 = normalized.last4
      updateData.codeValue = normalized.value
    }
    if (securityCode) {
      const normalized = normalizeSecurity(securityCode)
      updateData.securityHash = normalized.hash
      updateData.securityLast4 = normalized.last4
      updateData.securityCodeValue = normalized.value
    }
    if (batch !== undefined) {
      updateData.batch = batch?.trim() || null
    }
    if (productId !== undefined) {
      updateData.productId = productId?.trim() || null
    }

    await prisma.verificationCode.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid payload', details: error.errors },
        { status: 400 },
      )
    }
    console.error('Verification codes PATCH error:', error)
    return NextResponse.json(
      { error: 'Failed to update verification code' },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin()
    const payload = await request.json()
    const { ids } = deleteSchema.parse(payload)

    const result = await prisma.verificationCode.deleteMany({
      where: { id: { in: ids } },
    })

    return NextResponse.json({ deleted: result.count })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid payload', details: error.errors },
        { status: 400 },
      )
    }
    console.error('Verification codes DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to delete verification codes' },
      { status: 500 },
    )
  }
}
