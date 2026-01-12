import { AuthController } from '@/controllers/auth.controller'
import { AuthProxyService } from '@/services/auth.proxy.service'
import { validateRequest } from '@chatapp/common'
import { Router } from 'express'
import { AuthSchema } from '@/validations/auth.schemas'
import axios, { AxiosInstance } from 'axios'
import { env } from '@/config/env'

const authClient: AxiosInstance = axios.create({
  baseURL: env.AUTH_SERVICE_URL,
  timeout: 5000
})

export class AuthRoutes {
  private readonly authProxyService: AuthProxyService
  private readonly authController: AuthController
  public readonly authRoutes: Router
  constructor() {
    this.authRoutes = Router()
    this.authProxyService = new AuthProxyService(authClient)
    this.authController = new AuthController(this.authProxyService)
    this.initializeRoutes()
  }
  private initializeRoutes(): void {
    this.authRoutes.get(
      '/health',
      this.authController.getAuthServiceHealthHandler
    )
    this.authRoutes.get(
      '/health/db',
      this.authController.getAuthDatabaseHealthHandler
    )
    this.authRoutes.get(
      '/health/rabbit',
      this.authController.getAuthRabbitHealthHandler
    )
    this.authRoutes.post(
      '/register',
      validateRequest({ body: AuthSchema.registerSchema }),
      this.authController.registerHandler
    )

    this.authRoutes.post(
      '/login',
      validateRequest({ body: AuthSchema.loginSchema }),
      this.authController.loginHandler
    )

    this.authRoutes.post(
      '/refresh',
      validateRequest({ body: AuthSchema.refreshSchema }),
      this.authController.refreshTokenHandler
    )
  }
}
