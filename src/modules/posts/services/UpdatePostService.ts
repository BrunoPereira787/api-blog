import uploadConfig from '@config/upload'
import { Post } from '@prisma/client'
import AppError from '@shared/errors/AppError'
import { prisma } from '@shared/prisma/client'
import DiskStorageProvider from '@shared/providers/StorageProvider/DiskStorageProvider'
import S3torageProvider from '@shared/providers/StorageProvider/S3StorageProvider'

type IRequest = {
  id: string
  title: string
  summary: string
  content: string
  image: string
  userId: string
}

class UpdatePostService {
  public async execute({
    id,
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

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    })

    if (!post) {
      throw new AppError('Post não encontrado')
    }

    if (uploadConfig.driver === 's3') {
      const s3StorageProvider = new S3torageProvider()
      await s3StorageProvider.deleteFile(post.image)

      const filename = await s3StorageProvider.saveFile(image)
      post.image = filename
    } else {
      const storageProvider = new DiskStorageProvider()
      await storageProvider.deleteFile(post.image)

      const filename = await storageProvider.saveFile(image)
      post.image = filename
    }

    post.title = title
    post.summary = summary
    post.content = content

    const updatePost = await prisma.post.update({
      data: {
        ...post,
      },
      where: {
        id,
      },
    })

    return updatePost
  }
}

export default UpdatePostService
