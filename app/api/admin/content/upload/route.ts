import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    await requireAdmin()
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type by MIME type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 })
    }

    // Validate file by magic bytes (file signature) to prevent MIME type spoofing
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileSignature = buffer.toString('hex', 0, 4).toUpperCase()
    
    // Magic bytes for common image formats
    const validSignatures: { [key: string]: string[] } = {
      'image/jpeg': ['FFD8FF'],
      'image/jpg': ['FFD8FF'],
      'image/png': ['89504E47'],
      'image/webp': ['52494646'], // RIFF (WebP starts with RIFF)
      'image/gif': ['47494638'], // GIF8
    }
    
    const expectedSignatures = validSignatures[file.type] || []
    const isValidSignature = expectedSignatures.some(sig => 
      fileSignature.startsWith(sig) || 
      (file.type === 'image/webp' && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP')
    )
    
    if (!isValidSignature) {
      return NextResponse.json({ error: 'Invalid file format. File signature does not match declared type.' }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${timestamp}_${sanitizedName}`
    
    // Save to public/uploads directory
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    
    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const filepath = join(uploadDir, filename)
    // bytes already read above for magic bytes validation
    await writeFile(filepath, buffer)

    // Return the public URL path
    const publicPath = `/uploads/${filename}`
    
    return NextResponse.json({ 
      success: true, 
      path: publicPath,
      filename: filename,
    })
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}




