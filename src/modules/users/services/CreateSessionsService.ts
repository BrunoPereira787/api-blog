import auth from '@config/auth'
import { User } from '@prisma/client'
import AppError from '@shared/errors/AppError'
import { prisma } from '@shared/prisma/client'
import bcrypt from 'bcrypt'
import { sign } from 'jsonwebtoken'

type IRequest = {
  email: string
  password: string
}

type IResponse = {
  user: User
  token: string
}

class CreateSessionsService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new AppError('usuário invalido')
    }

    const passwordConfirmed = await bcrypt.compare(password, user.password)

    if (!passwordConfirmed) {
      throw new AppError('Senha invalida')
    }

    const token = sign({ id: user.id, isAdmin: user.admin }, auth.jwt.secret, {
      expiresIn: auth.jwt.expiresIn,
    })

    return {
      user,
      token,
    }
  }
}

export default CreateSessionsService
