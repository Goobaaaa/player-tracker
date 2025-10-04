import { NextRequest, NextResponse } from 'next/server'
import { mockGetSession } from '@/lib/mock-auth'

export async function GET(request: NextRequest) {
  try {
    const sessionData = await mockGetSession()

    if (sessionData.error) {
      return NextResponse.json(
        { error: sessionData.error.message },
        { status: 401 }
      )
    }

    return NextResponse.json(sessionData.data)
  } catch (error) {
    console.error('Session verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}