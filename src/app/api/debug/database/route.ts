import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()

    // Check if admin user exists
    const adminUser = await prisma.user.findUnique({
      where: { username: 'admin' },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        isSuspended: true,
        createdAt: true
      }
    })

    // Get database URL (masked for security)
    const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL || 'Not set'
    const maskedUrl = databaseUrl.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')

    return NextResponse.json({
      success: true,
      database: {
        connected: true,
        url: maskedUrl,
        adminUser: adminUser || 'Not found'
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasJwtSecret: !!process.env.JWT_SECRET,
        hasPostgresUrl: !!process.env.POSTGRES_URL,
        hasDatabaseUrl: !!process.env.DATABASE_URL
      }
    })
  } catch (error) {
    console.error('Database debug error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasJwtSecret: !!process.env.JWT_SECRET,
        hasPostgresUrl: !!process.env.POSTGRES_URL,
        hasDatabaseUrl: !!process.env.DATABASE_URL
      }
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}