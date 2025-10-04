import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

const JWT_SECRET: string = process.env.JWT_SECRET || 'fallback-secret-key'
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d'

export interface AuthUser {
  id: string
  username: string
  name: string
  role: string
  isSuspended: boolean
}

export interface AuthToken {
  user: AuthUser
  token: string
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  )
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string; name: string; role: string; isSuspended: boolean }
    return {
      id: decoded.id,
      username: decoded.username,
      name: decoded.name,
      role: decoded.role,
      isSuspended: false // Will be checked from database
    }
  } catch {
    return null
  }
}

export async function authenticateUser(username: string, password: string): Promise<AuthToken | null> {
  const user = await prisma.user.findUnique({
    where: { username }
  })

  if (!user) {
    return null
  }

  if (user.isSuspended) {
    return null
  }

  const isValidPassword = await verifyPassword(password, user.password)
  if (!isValidPassword) {
    return null
  }

  const authUser: AuthUser = {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    isSuspended: user.isSuspended
  }

  const token = generateToken(authUser)

  return {
    user: authUser,
    token
  }
}

export async function createUser(userData: {
  username: string
  password: string
  name: string
  role?: string
}): Promise<AuthUser | null> {
  const existingUser = await prisma.user.findUnique({
    where: { username: userData.username }
  })

  if (existingUser) {
    return null
  }

  const hashedPassword = await hashPassword(userData.password)

  const user = await prisma.user.create({
    data: {
      username: userData.username,
      password: hashedPassword,
      name: userData.name,
      role: (userData.role?.toUpperCase() as 'ADMIN' | 'MARSHALL') || 'MARSHALL'
    }
  })

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    isSuspended: user.isSuspended
  }
}