import { Application, Router } from 'express'

export class Routes {
  constructor(public readonly routes: Router) {
    this.routes = Router()
    this.initializeRoutes()
  }
  private initializeRoutes(): void {
    this.routes.get('/', (req, res) => {
      res.send('hihihi')
    })
  }
}
