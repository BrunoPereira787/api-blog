import { Post } from '@prisma/client'
import AppError from '@shared/errors/AppError'
import { prisma } from '@shared/prisma/client'

type IRequest = {
  id: string
}

class ShowPostService {
  public async execute({ id }: IRequest): Promise<Post | undefined> {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!post) {
      throw new AppError('Post não encontrado')
    }

    return post
  }
}

export default ShowPostService
