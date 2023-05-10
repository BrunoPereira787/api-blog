import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

async function main() {
  const prisma = new PrismaClient()
  const passwordHash = await hash('admin', 10)

  const user = {
    name: 'admin',
    email: 'admin@gmail.com',
    admin: true,
    password: passwordHash,
  }

  await prisma.user.create({
    data: {
      ...user,
    },
  })
}

main()
