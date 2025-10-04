import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth-utils'
import { getLiveStaffMembers, addAdminCreatedUser } from '@/lib/mock-data'
import bcrypt from 'bcryptjs'

// GET /api/users - Get all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    const decoded = verifyToken(token || '')

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const users = getLiveStaffMembers()

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/users - Create a new user (admin only)
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    const decoded = verifyToken(token || '')

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const userData = await request.json()

    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 12)

    const newUser = addAdminCreatedUser({
      username: userData.username,
      password: hashedPassword,
      name: userData.name,
      role: (userData.role?.toLowerCase() as 'admin' | 'marshall') || 'marshall',
      tagLine: '',
      description: '',
      bloodType: '',
      favouriteHobby: '',
      isSuspended: false,
      createdAt: new Date().toISOString(),
      createdBy: decoded.id
    })

    return NextResponse.json({ user: newUser }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}