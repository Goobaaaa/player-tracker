import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'

// GET /api/commendations - Get all commendations
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    const decoded = verifyToken(token || '')

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const commendations = await prisma.commendation.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ commendations })
  } catch (error) {
    console.error('Error fetching commendations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/commendations - Create a new commendation
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    const decoded = verifyToken(token || '')

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const newCommendation = await prisma.commendation.create({
      data: {
        recipientName: data.recipientName,
        shortReason: data.shortReason,
        fullExplanation: data.fullExplanation,
        imageUrl: data.imageUrl,
        issuedBy: decoded.id
      }
    })

    return NextResponse.json({ commendation: newCommendation }, { status: 201 })
  } catch (error) {
    console.error('Error creating commendation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}