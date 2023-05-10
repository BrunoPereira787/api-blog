import { prisma } from '@shared/prisma/client'
import AppError from '@shared/errors/AppError'
import DiskStorageProvider from '@shared/providers/StorageProvider/DiskStorageProvider'
import S3StorageProvider from '@shared/providers/StorageProvider/S3StorageProvider'
import uploadConfig from '@config/upload'

type IRequest = {
  id: string
  userId: string
}

class DeletePostService {
  public async execute({ id, userId }: IRequest): Promise<void> {
    const userExists = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!userExists) {
      throw new AppError('operação invalida')
    }

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    })

    if (!post) {
      throw new AppError('Post não encontrado')
    }

    if (post.userId !== userId) {
      throw new AppError('Opraçõ invalida')
    }

    if (uploadConfig.driver === 's3') {
      const s3StorageProvider = new S3StorageProvider()

      await s3StorageProvider.deleteFile(post.image)
    } else {
      const storageProvider = new DiskStorageProvider()

      await storageProvider.deleteFile(post.image)
    }

    await prisma.post.delete({
      where: {
        id,
      },
    })
  }
}

export default DeletePostService
