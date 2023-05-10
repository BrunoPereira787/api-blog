import uploadConfig from '@config/upload'
import { Post } from '@prisma/client'
import AppError from '@shared/errors/AppError'
import { prisma } from '@shared/prisma/client'
import S3StorageProvider from '@shared/providers/StorageProvider/S3StorageProvider'
import DiskStorageProvider from '@shared/providers/StorageProvider/DiskStorageProvider'

type IRequest = {
  title: string
  summary: string
  content: string
  image: string
  userId: string
}

class CreatePostService {
  public async execute({
    title,
    summary,
    content,
    image,
    userId,
  }: IRequest): Promise<Post> {
    const userExists = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!userExists) {
      throw new AppError('operação invalida')
    }

    if (uploadConfig.driver === 's3') {
      const s3StorageProvider = new S3StorageProvider()

      await s3StorageProvider.saveFile(image)
    } else {
      const storageProvider = new DiskStorageProvider()

      await storageProvider.saveFile(image)
    }

    const post = await prisma.post.create({
      data: {
        title,
        summary,
        content,
        image,
        userId,
      },
    })

    return post
  }
}

export default CreatePostService
