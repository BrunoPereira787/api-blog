import { prisma } from '@shared/prisma/client'
import AppError from '@shared/errors/AppError'

type IRequest = {
  id: string
  userId: string
}

class DeleteUserService {
  public async execute({ id, userId }: IRequest): Promise<void> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      throw new AppError('Usuário invalido')
    }

    if (user.id !== userId) {
      throw new AppError('Operação invalida')
    }

    await prisma.user.delete({
      where: {
        id,
      },
    })
  }
}

export default DeleteUserService
