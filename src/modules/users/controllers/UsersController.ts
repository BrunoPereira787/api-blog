import { Request, Response } from 'express'
import CreateUserService from '../services/CreateUserService'
import ListUsersService from '../services/ListUsersService'
import DeleteUserService from '../services/DeleteUserService'
import UpdateUserService from '../services/UpdateUserService'
import ShowUserService from '../services/ShowUserService'
import ProfileUserService from '../services/ProfileUserService'

export default class UsersControllers {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password, confirmpassword } = request.body

    const createUser = new CreateUserService()

    const users = await createUser.execute({
      name,
      email,
      password,
      confirmpassword,
    })

    return response.json(users)
  }

  // admin
  public async index(request: Request, response: Response): Promise<Response> {
    const listUsers = new ListUsersService()

    const users = await listUsers.execute()

    return response.json(users)
  }

  // admin
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params
    const showUser = new ShowUserService()

    const user = await showUser.execute({ id })

    return response.json(user)
  }

  public async profile(
    request: Request,
    response: Response
  ): Promise<Response> {
    const profileUser = new ProfileUserService()

    const user = await profileUser.execute({ userId: request.user.id })

    return response.json(user)
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const deleteUser = new DeleteUserService()

    await deleteUser.execute({ id, userId: request.user.id })

    return response.json([])
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, password, confirmpassword, email } = request.body
    const { id } = request.params

    const updateUser = new UpdateUserService()

    const user = await updateUser.execute({
      id,
      name,
      password,
      confirmpassword,
      email,
      userId: request.user.id,
    })

    return response.json(user)
  }
}
