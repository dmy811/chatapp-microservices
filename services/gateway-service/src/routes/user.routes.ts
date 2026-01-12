import { Router } from 'express'
import axios, { AxiosInstance } from 'axios'
import { env } from '@/config/env'
import { UserProxyService } from '@/services/user.proxy.service'
import { UserController } from '@/controllers/user.controller'
import { validateRequest } from '@chatapp/common'
import { UserSchema } from '@/validations/user.schema'

const userClient: AxiosInstance = axios.create({
  baseURL: env.USER_SERVICE_URL,
  timeout: 5000
})

export class UserRoutes {
  private readonly userProxyService: UserProxyService
  private readonly userController: UserController
  public readonly userRoutes: Router
  constructor() {
    this.userRoutes = Router()
    this.userProxyService = new UserProxyService(userClient)
    this.userController = new UserController(this.userProxyService)
    this.initializeRoutes()
  }
  private initializeRoutes(): void {
    this.userRoutes.get(
      '/health',
      this.userController.getAuthServiceHealthHandler
    )
    this.userRoutes.get(
      '/health/db',
      this.userController.getAuthDatabaseHealthHandler
    )
    this.userRoutes.get(
      '/health/rabbit',
      this.userController.getAuthRabbitHealthHandler
    )

    this.userRoutes.get('/', this.userController.getAllUsersHandler)
    this.userRoutes.get('/search', this.userController.searchUsers)
    this.userRoutes.post(
      '/',
      validateRequest({ body: UserSchema.createUserSchema }),
      this.userController.createUserHandler
    )
    this.userRoutes.get(
      '/:id',
      validateRequest({ params: UserSchema.userIdParams }),
      this.userController.getUserByIdHandler
    )
  }
}
