import { NextRequest, NextResponse } from 'next/server'
import { mockSignIn } from '@/lib/mock-auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const result = await mockSignIn(username, password)

    if (result.error) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create HTTP-only cookie for better security
    const response = NextResponse.json({
      user: result.data.user,
      message: 'Login successful'
    })

    response.cookies.set('auth-token', result.data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}