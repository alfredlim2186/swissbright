import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Parser as Json2csvParser } from 'json2csv'
import ExcelJS from 'exceljs'

const BASE_FIELDS = [
  'ID',
  'Email',
  'Name',
  'Role',
  'Total Purchases',
  'Total Gifts',
  'Registered At',
  'Profile Updated',
  'Phone Number',
  'Address Line 1',
  'Address Line 2',
  'City',
  'State',
  'Postal Code',
  'Country',
]

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()
    const { searchParams } = request.nextUrl
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const format = (searchParams.get('format') || 'csv').toLowerCase()

    const where: any = {}
    if (from || to) {
      where.createdAt = {}
      if (from) where.createdAt.gte = new Date(from)
      if (to) where.createdAt.lte = new Date(`${to}T23:59:59.999Z`)
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        totalPurchases: true,
        totalGifts: true,
        createdAt: true,
        phoneNumber: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        profileUpdatedAt: true,
      },
    })

    const data = users.map((user) => ({
      ID: user.id,
      Email: user.email,
      Name: user.name || '',
      Role: user.role,
      'Total Purchases': user.totalPurchases,
      'Total Gifts': user.totalGifts,
      'Registered At': new Date(user.createdAt).toISOString(),
      'Profile Updated': user.profileUpdatedAt ? new Date(user.profileUpdatedAt).toISOString() : '',
      'Phone Number': user.phoneNumber || '',
      'Address Line 1': user.addressLine1 || '',
      'Address Line 2': user.addressLine2 || '',
      City: user.city || '',
      State: user.state || '',
      'Postal Code': user.postalCode || '',
      Country: user.country || '',
    }))

    const headers = data.length > 0 ? Object.keys(data[0]) : BASE_FIELDS

    if (format === 'xlsx' || format === 'excel') {
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Users')
      worksheet.columns = headers.map((key) => ({ header: key, key }))
      data.forEach((row) => worksheet.addRow(row))
      const buffer = await workbook.xlsx.writeBuffer()
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="sweetb-users-${Date.now()}.xlsx"`,
        },
      })
    }

    const parser = new Json2csvParser({ fields: headers })
    const csv = parser.parse(data)
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="sweetb-users-${Date.now()}.csv"`,
      },
    })
  } catch (error) {
    console.error('Export users error:', error)
    if ((error as Error).message?.includes('Forbidden') || (error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to export users' }, { status: 500 })
  }
}

