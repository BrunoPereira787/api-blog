import AppError from '@shared/errors/AppError'
import { prisma } from '@shared/prisma/client'

type IRequest = {
  userId: string
}

type IUser = {
  email: string
  id: string
  name: string
  admin: boolean
  created_at: Date
}

class ProfileUserService {
  public async execute({ userId }: IRequest): Promise<IUser> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        _count: true,
        email: true,
        id: true,
        name: true,
        admin: true,
        created_at: true,
      },
    })

    if (!user) {
      throw new AppError('Usuario não encontrado')
    }

    return user
  }
}

export default ProfileUserService
