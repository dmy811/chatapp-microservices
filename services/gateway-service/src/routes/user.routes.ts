import { Router } from 'express'
import axios, { AxiosInstance } from 'axios'
import { env } from '@/config/env'
import { UserProxyService } from '@/services/user.proxy.service'
import { UserController } from '@/controllers/user.controller'
import { validateRequest } from '@chatapp/common'
import { UserSchema } from '@/validations/user.schema'
import { requireAuth } from '@/middlewares/require-auth'

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

    this.userRoutes.get(
      '/',
      requireAuth,
      this.userController.getAllUsersHandler
    )
    this.userRoutes.get('/search', requireAuth, this.userController.searchUsers)
    this.userRoutes.post(
      '/',
      validateRequest({ body: UserSchema.createUserSchema }),
      this.userController.createUserHandler
    )
    this.userRoutes.get(
      '/:id',
      requireAuth,
      validateRequest({ params: UserSchema.userIdParams }),
      this.userController.getUserByIdHandler
    )
  }
}
