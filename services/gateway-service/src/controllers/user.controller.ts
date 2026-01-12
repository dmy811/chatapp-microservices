import { RequestHandler } from 'express'
import { asyncWrapper } from '@chatapp/common'
import { UserProxyService } from '@/services/user.proxy.service'
import {
  CreateUserInput,
  SearchUsersQuery,
  UserIdParams
} from '@/validations/user.schema'

export class UserController {
  constructor(private readonly userProxyService: UserProxyService) {}

  public getAuthServiceHealthHandler: RequestHandler = asyncWrapper(
    async (req, res) => {
      const response = await this.userProxyService.userServiceHealth()
      res.status(200).json(response)
    }
  )

  public getAuthDatabaseHealthHandler: RequestHandler = asyncWrapper(
    async (req, res) => {
      const response = await this.userProxyService.userDatabaseServicehealth()
      res.status(200).json(response)
    }
  )

  public getAuthRabbitHealthHandler: RequestHandler = asyncWrapper(
    async (req, res) => {
      const response = await this.userProxyService.userRabbitServiceHealth()
      res.status(200).json(response)
    }
  )

  public getAllUsersHandler: RequestHandler = asyncWrapper(async (req, res) => {
    const response = await this.userProxyService.getAllUsers()
    res.status(200).json(response)
  })

  public getUserByIdHandler: RequestHandler = asyncWrapper(async (req, res) => {
    const { id } = req.params as UserIdParams
    const response = await this.userProxyService.getUserById(id)
    res.status(200).json(response)
  })

  public searchUsers: RequestHandler = asyncWrapper(async (req, res) => {
    const response = await this.userProxyService.searchUsers(
      req.query as unknown as SearchUsersQuery
    )
    res.status(200).json(response)
  })

  public createUserHandler: RequestHandler = asyncWrapper(async (req, res) => {
    const payload = req.body as CreateUserInput
    const response = await this.userProxyService.createUser(payload)
    res.status(201).json(response)
  })
}
