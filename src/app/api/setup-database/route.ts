import { NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/prisma'

export async function POST() {
  try {
    const prisma = new PrismaClient()

    console.log('Starting database setup...')

    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')

    // Check if admin user exists
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' }
    })

    if (!existingAdmin) {
      // Create admin user with a simple password
      const bcrypt = require('bcryptjs')
      const hashedPassword = await bcrypt.hash('admin', 12)

      const admin = await prisma.user.create({
        data: {
          username: 'admin',
          password: hashedPassword,
          name: 'System Administrator',
          role: 'ADMIN',
          isSuspended: false,
        }
      })

      console.log('✅ Admin user created:', admin.username)
    } else {
      console.log('✅ Admin user already exists:', existingAdmin.username)
    }

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully',
      adminCredentials: {
        username: 'admin',
        password: 'admin'
      }
    })

  } catch (error) {
    console.error('Database setup error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Check your DATABASE_URL environment variable and ensure your database is accessible'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Database setup endpoint. Use POST to setup the database.',
    usage: 'POST /api/setup-database'
  })
}