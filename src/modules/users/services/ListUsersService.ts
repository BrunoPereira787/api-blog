import { prisma } from '@shared/prisma/client'
import { User } from '@prisma/client'

class ListUsersService {
  public async execute(): Promise<User[]> {
    const users = await prisma.user.findMany()

    return users
  }
}

export default ListUsersService
