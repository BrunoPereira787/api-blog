import { User } from '@prisma/client'
import AppError from '@shared/errors/AppError'
import { prisma } from '@shared/prisma/client'
import bcrypt from 'bcrypt'

type IRequest = {
  id: string
  email: string
  name: string
  password?: string
  confirmpassword?: string
  userId: string
}

class UpdateUserService {
  public async execute({
    id,
    email,
    name,
    password,
    confirmpassword,
    userId,
  }: IRequest): Promise<User> {
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

    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (email !== user.email && userAlreadyExists) {
      throw new AppError('Email ja esta em uso')
    }

    if (password && !confirmpassword) {
      throw new AppError('confirmação de senha é obrigatoria')
    }

    if (password && confirmpassword) {
      if (password !== confirmpassword) {
        throw new AppError('As senhas não conferem')
      }

      user.password = await bcrypt.hash(password, 12)
    }

    user.name = name
    user.email = email

    const updteUser = await prisma.user.update({
      data: {
        ...user,
      },
      where: {
        id,
      },
    })

    return updteUser
  }
}

export default UpdateUserService
