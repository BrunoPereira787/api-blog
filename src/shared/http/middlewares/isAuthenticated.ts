import auth from '@config/auth'
import AppError from '@shared/errors/AppError'
import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

type ITokenPayload = {
  id: string
  isAdmin: boolean
  iat: number
  exp: number
}

export default function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError('usuário não autorizado')
  }

  const [, token] = authHeader.split(' ')

  try {
    const decodedToken = verify(token, auth.jwt.secret)
    const { id, isAdmin } = decodedToken as ITokenPayload

    request.user = {
      id,
      isAdmin,
    }

    return next()
  } catch {
    throw new AppError('usuário não autorizado')
  }
}
