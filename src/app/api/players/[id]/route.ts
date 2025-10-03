import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth-utils'

// GET /api/players/[id] - Get a specific player
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('auth-token')?.value
    const decoded = verifyToken(token || '')
    const { id } = await context.params

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const player = await prisma.player.findUnique({
      where: { id },
      include: {
        assets: true,
        weapons: true,
        mugshots: true,
        documents: true,
        transactions: true,
        incidents: true,
        creator: {
          select: {
            id: true,
            username: true,
            name: true
          }
        }
      }
    })

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 })
    }

    return NextResponse.json({ player })
  } catch (error) {
    console.error('Error fetching player:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/players/[id] - Update a player
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('auth-token')?.value
    const decoded = verifyToken(token || '')
    const { id } = await context.params

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const playerData = await request.json()

    const player = await prisma.player.update({
      where: { id },
      data: playerData,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({ player })
  } catch (error) {
    console.error('Error updating player:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/players/[id] - Delete a player
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('auth-token')?.value
    const decoded = verifyToken(token || '')
    const { id } = await context.params

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.player.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Player deleted successfully' })
  } catch (error) {
    console.error('Error deleting player:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}