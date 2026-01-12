import { RequestHandler } from 'express'
import { UserService } from '@/services/user.service'
import { asyncWrapper } from '@chatapp/common'
import { CreateUserInput } from '@/types/user'
import { SearchUsersQuery, UserIdParams } from '@/validations/user.schemas'

export class UserController {
  constructor(private readonly service: UserService) {}
  public getUserById: RequestHandler = asyncWrapper(async (req, res) => {
    const { id } = req.params as UserIdParams
    const user = await this.service.getUserById(req.params.id)
    res.status(200).json({
      success: true,
      message: 'success get user by id',
      data: user
    })
  })

  public getAllUsers: RequestHandler = asyncWrapper(async (req, res) => {
    const users = await this.service.getAllUsers()
    res.status(200).json({
      success: true,
      message: 'success get all users',
      data: users
    })
  })

  public createUser: RequestHandler = asyncWrapper(async (req, res) => {
    const payload = req.body as CreateUserInput
    const user = await this.service.createUser(payload)
    res.status(201).json({
      success: true,
      message: 'success create user',
      data: user
    })
  })

  public searchUsers: RequestHandler = asyncWrapper(async (req, res) => {
    const { query, limit, exclude } = req.query as unknown as SearchUsersQuery
    const users = await this.service.searchUsers({
      query,
      limit,
      excludeIds: exclude
    })
    res.status(200).json({
      success: true,
      message: 'success get users by query',
      data: users
    })
  })
}
