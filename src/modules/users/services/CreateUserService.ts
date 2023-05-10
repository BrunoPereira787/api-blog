import AppError from '@shared/errors/AppError'
import { prisma } from '@shared/prisma/client'
import { User } from '@prisma/client'
import bcrypt from 'bcrypt'

type IRequest = {
  name: string
  email: string
  password: string
  confirmpassword: string
}

class CreateUserService {
  public async execute({
    name,
    email,
    password,
    confirmpassword,
  }: IRequest): Promise<User> {
    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userAlreadyExists) {
      throw new AppError('Email ja esta em uso')
    }

    if (password !== confirmpassword) {
      throw new AppError('Senhas precisam ser iguais')
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    })

    return user
  }
}

export default CreateUserService
