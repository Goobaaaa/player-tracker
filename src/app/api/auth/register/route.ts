import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
  try {
    const { username, password, name, role } = await request.json()

    if (!username || !password || !name) {
      return NextResponse.json(
        { error: 'Username, password, and name are required' },
        { status: 400 }
      )
    }

    if (password.length < 4) {
      return NextResponse.json(
        { error: 'Password must be at least 4 characters long' },
        { status: 400 }
      )
    }

    const user = await createUser({
      username,
      password,
      name,
      role
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json({
      user,
      message: 'User created successfully'
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}