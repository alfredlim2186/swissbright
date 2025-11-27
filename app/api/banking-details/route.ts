import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [bankName, accountNumber] = await Promise.all([
      prisma.content.findUnique({
        where: {
          key_language: {
            key: 'banking.bankName',
            language: 'en',
          },
        },
      }),
      prisma.content.findUnique({
        where: {
          key_language: {
            key: 'banking.accountNumber',
            language: 'en',
          },
        },
      }),
    ])

    return NextResponse.json({
      bankName: bankName?.value || '',
      accountNumber: accountNumber?.value || '',
    })
  } catch (error) {
    console.error('Failed to fetch banking details:', error)
    return NextResponse.json({ bankName: '', accountNumber: '' })
  }
}

