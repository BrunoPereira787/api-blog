import AppError from '@shared/errors/AppError'
import { prisma } from '@shared/prisma/client'

type IRequest = {
  id: string
}

type IUser = {
  email: string
  id: string
  name: string
  admin: boolean
  created_at: Date
}

class ShowUserService {
  public async execute({ id }: IRequest): Promise<IUser> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        email: true,
        id: true,
        name: true,
        admin: true,
        created_at: true,
      },
    })

    if (!user) {
      throw new AppError('usuário não encontrado')
    }

    return user
  }
}

export default ShowUserService
