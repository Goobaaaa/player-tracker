import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'

// GET /api/chat-messages - Get all chat messages
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    const decoded = verifyToken(token || '')

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const messages = await prisma.chatMessage.findMany({
      orderBy: {
        timestamp: 'asc'
      }
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Error fetching chat messages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/chat-messages - Create a new chat message
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    const decoded = verifyToken(token || '')

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const newMessage = await prisma.chatMessage.create({
      data: {
        userId: decoded.id,
        content: data.content,
        imageUrl: data.imageUrl,
        reactions: data.reactions
      }
    })

    return NextResponse.json({ message: newMessage }, { status: 201 })
  } catch (error) {
    console.error('Error creating chat message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/chat-messages - Update a chat message
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    const decoded = verifyToken(token || '')

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { id, content, reactions } = data

    const updatedMessage = await prisma.chatMessage.update({
      where: { id },
      data: {
        content: content !== undefined ? content : undefined,
        reactions: reactions !== undefined ? reactions : undefined
      }
    })

    return NextResponse.json({ message: updatedMessage })
  } catch (error) {
    console.error('Error updating chat message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/chat-messages - Delete a chat message
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    const decoded = verifyToken(token || '')

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Message ID required' }, { status: 400 })
    }

    await prisma.chatMessage.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting chat message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}