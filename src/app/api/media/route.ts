import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'

// GET /api/media - Get all media items
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    const decoded = verifyToken(token || '')

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const mediaItems = await prisma.mediaItem.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ mediaItems })
  } catch (error) {
    console.error('Error fetching media items:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/media - Create a new media item
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    const decoded = verifyToken(token || '')

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const newMediaItem = await prisma.mediaItem.create({
      data: {
        userId: decoded.id,
        url: data.url,
        type: data.type || 'image',
        caption: data.caption
      }
    })

    return NextResponse.json({ mediaItem: newMediaItem }, { status: 201 })
  } catch (error) {
    console.error('Error creating media item:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}