import { Router } from 'express'
import { AuthRoutes } from './auth.routes'
import { UserRoutes } from './user.routes'

export class AllRoutes {
  private readonly routes: Router
  private readonly authRoutes: Router = new AuthRoutes().authRoutes
  private readonly userRoutes: Router = new UserRoutes().userRoutes
  constructor() {
    this.routes = Router()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.routes.use('/auth', this.authRoutes)
    this.routes.use('/users', this.userRoutes)
  }

  public getAllRoutes(): Router {
    return this.routes
  }
}
