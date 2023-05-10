import AppError from '@shared/errors/AppError'
import { NextFunction, Request, Response } from 'express'

export default function isAdmin(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  if (!request.user.isAdmin) {
    throw new AppError('operação invalida')
  }

  return next()
}
