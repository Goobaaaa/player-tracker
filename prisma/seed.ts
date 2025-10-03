import { PrismaClient } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      name: 'System Administrator',
      role: 'ADMIN',
      isSuspended: false,
    },
  })

  console.log('Created admin user:', admin)

  // Create a sample marshall user
  const marshallPassword = await bcrypt.hash('marshall123', 12)
  const marshall = await prisma.user.upsert({
    where: { username: 'marshall' },
    update: {},
    create: {
      username: 'marshall',
      password: marshallPassword,
      name: 'Sample Marshall',
      role: 'MARSHALL',
      isSuspended: false,
    },
  })

  console.log('Created sample marshall user:', marshall)

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })