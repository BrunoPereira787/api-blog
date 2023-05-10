import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import 'express-async-errors'
import cors from 'cors'
import routes from './routes'
import AppError from '@shared/errors/AppError'
import { errors } from 'celebrate'
import uploadConfig from '@config/upload'

const app = express()

const port = process.env.PORT

app.use(cors())
app.use(express.json())

app.use('/files', express.static(uploadConfig.directory)) // /files/nome da imagem
app.use(routes)

app.use(errors())

app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      })
    }
    return response.status(500).json({
      status: 'error',
      message: 'server not found',
    })
  }
)

app.listen(port, () => {
  console.log('Servidor rodando na porta', port)
})
