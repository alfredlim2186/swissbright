import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { readdir, stat, unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await requireAdmin()
    
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    
    if (!existsSync(uploadDir)) {
      return NextResponse.json({ media: [] })
    }

    const files = await readdir(uploadDir)
    const mediaFiles = []

    for (const file of files) {
      const filePath = join(uploadDir, file)
      const stats = await stat(filePath)
      
      // Only include image files
      if (stats.isFile() && /\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
        mediaFiles.push({
          filename: file,
          url: `/uploads/${file}`,
          size: stats.size,
          createdAt: stats.birthtime.toISOString(),
          modifiedAt: stats.mtime.toISOString(),
        })
      }
    }

    // Sort by most recent first
    mediaFiles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ media: mediaFiles })
  } catch (error) {
    console.error('Media GET error:', error)
    if ((error as Error).message === 'Unauthorized' || (error as Error).message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to load media' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin()
    
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')
    
    if (!filename) {
      return NextResponse.json({ error: 'Filename required' }, { status: 400 })
    }

    // Security: prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads')
    const filePath = join(uploadDir, filename)

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    await unlink(filePath)

    return NextResponse.json({ success: true, message: 'File deleted successfully' })
  } catch (error) {
    console.error('Media DELETE error:', error)
    if ((error as Error).message === 'Unauthorized' || (error as Error).message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}

