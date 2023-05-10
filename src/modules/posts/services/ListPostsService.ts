import { Post } from '@prisma/client'
import { prisma } from '@shared/prisma/client'

class ListPostsService {
  public async execute(): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    })

    return posts
  }
}

export default ListPostsService
