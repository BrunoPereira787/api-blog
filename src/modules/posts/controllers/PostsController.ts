import { Request, Response } from 'express'
import CreatePostService from '../services/CreatePostService'
import ListPostsService from '../services/ListPostsService'
import ShowPostService from '../services/ShowPostService'
import DeletePostService from '../services/DeletePostService'
import UpdatePostService from '../services/UpdatePostService'

export default class PostsController {
  public async create(
    request: Request & { file: any },
    response: Response
  ): Promise<Response> {
    const { title, summary, content } = request.body

    const createPost = new CreatePostService()

    const post = await createPost.execute({
      title,
      summary,
      content,
      image: request.file.filename,
      userId: request.user.id,
    })

    return response.json(post)
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const listPosts = new ListPostsService()

    const posts = await listPosts.execute()

    return response.json(posts)
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params
    const showPost = new ShowPostService()

    const post = await showPost.execute({ id })

    return response.json(post)
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params
    const deletePost = new DeletePostService()

    await deletePost.execute({ id, userId: request.user.id })

    return response.json([])
  }

  public async update(
    request: Request & { file: any },
    response: Response
  ): Promise<Response> {
    const { id } = request.params

    const { title, summary, content } = request.body

    const updatePost = new UpdatePostService()

    const post = await updatePost.execute({
      id,
      title,
      summary,
      content,
      image: request.file.filename,
      userId: request.user.id,
    })

    return response.json(post)
  }
}
