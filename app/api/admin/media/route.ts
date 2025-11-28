import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await requireAdmin()
    
    // Fetch resources from Cloudinary in the sweetb-uploads folder
    const result = await cloudinary.search
      .expression('folder:sweetb-uploads')
      .sort_by([{ created_at: 'desc' }])
      .max_results(500)
      .execute()

    const mediaFiles = result.resources.map((resource: any) => ({
      filename: resource.public_id.split('/').pop() || resource.public_id,
      url: resource.secure_url,
      size: resource.bytes || 0,
      createdAt: resource.created_at,
      modifiedAt: resource.updated_at || resource.created_at,
      publicId: resource.public_id,
    }))

    return NextResponse.json({ media: mediaFiles })
  } catch (error) {
    console.error('Media GET error:', error)
    if ((error as Error).message === 'Unauthorized' || (error as Error).message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ 
      error: 'Failed to load media',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin()
    
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId') || searchParams.get('filename')
    
    if (!publicId) {
      return NextResponse.json({ error: 'Public ID or filename required' }, { status: 400 })
    }

    // If filename is provided (for backward compatibility), construct public_id
    let cloudinaryPublicId = publicId
    if (!publicId.includes('/')) {
      // It's just a filename, construct the full public_id
      cloudinaryPublicId = `sweetb-uploads/${publicId.replace(/\.[^/.]+$/, '')}`
    }

    // Security: prevent directory traversal
    if (cloudinaryPublicId.includes('..')) {
      return NextResponse.json({ error: 'Invalid public ID' }, { status: 400 })
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(cloudinaryPublicId)

    if (result.result === 'not found') {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'File deleted successfully' })
  } catch (error) {
    console.error('Media DELETE error:', error)
    if ((error as Error).message === 'Unauthorized' || (error as Error).message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ 
      error: 'Failed to delete file',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 })
  }
}

