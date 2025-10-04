import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'

// GET /api/marshalls - Get all marshalls for display (all authenticated users)
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    const decoded = verifyToken(token || '')

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        tagLine: true,
        description: true,
        bloodType: true,
        hobby: true,
        portraitUrl: true,
        isSuspended: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching marshalls:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}