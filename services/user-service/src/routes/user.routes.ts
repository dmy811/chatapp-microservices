// import { UserController } from '@/controllers/user.controller'
import { Users } from '@/models'
import { UserService } from '@/services/user.service'
import { validateRequest } from '@chatapp/common'
import { Router } from 'express'
import { UserSchema } from '@/validations/user.schemas'
import { UserController } from '@/controllers/user.controller'
import { UserRepository } from '@/repositores/user.repository'

export class Routes {
  private readonly userRepository: UserRepository
  private readonly userService: UserService
  private readonly userController: UserController
  constructor(public readonly routes: Router) {
    this.routes = Router()
    this.userRepository = new UserRepository(Users)
    this.userService = new UserService(this.userRepository)
    this.userController = new UserController(this.userService)
    this.initializeRoutes()
  }
  private initializeRoutes(): void {
    this.routes.post(
      '/',
      validateRequest({ body: UserSchema.createUserSchema.shape.body }),
      this.userController.createUser
    )
    this.routes.get('/', this.userController.getAllUsers)
    this.routes.get('/search', this.userController.searchUsers)
    this.routes.get(
      '/:id',
      validateRequest({ params: UserSchema.userIdParams.shape.params }),
      this.userController.getUserById
    )
  }
}
