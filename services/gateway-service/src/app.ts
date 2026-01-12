import express, { Request, Response, Router, type Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { errorHandler } from '@/middlewares/error-handler'
import { logger } from './utils/logger'
import { Env } from './config/env'

export class App {
  private app: Application
  private server?: ReturnType<Application['listen']>
  constructor(
    private readonly env: Env,
    private readonly routes: Router
  ) {
    this.app = express()
    this.initializeMiddleware()
    this.initializeRoutes()
    this.initializeErrorHandling()
    this.initializeHealthCheck()
  }

  private initializeMiddleware(): void {
    this.app.use(
      cors({
        origin: '*',
        credentials: true
      })
    )
    this.app.use(helmet())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  private initializeRoutes(): void {
    this.app.use('/api', this.routes)
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler)
  }

  private initializeHealthCheck(): void {
    this.app.get('/health', (_req: Request, res: Response) => {
      res.status(200).json({ message: 'GATEWAY SERVICE SERVER OK' })
    })
  }

  public async startServer(): Promise<void> {
    try {
      this.server = this.app.listen(this.env.GATEWAY_PORT, () => {
        logger.info(
          `gateway service is running on port ${this.env.GATEWAY_PORT}`
        )
        logger.info(`auth service is running at ${this.env.AUTH_SERVICE_URL}`)
        logger.info(`user service is running at ${this.env.USER_SERVICE_URL}`)
      })
      this.setupGracefulShutdown()
    } catch (error) {
      logger.error({
        from: 'app.ts',
        message: 'gateway service failed to start server',
        error: (error as any).message
      })
      process.exit(1)
    }
  }

  private setupGracefulShutdown(): void {
    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT']
    const shutdown = async (signal: NodeJS.Signals) => {
      logger.warn(`recievied ${signal}, shutting down...`)
      try {
        if (this.server) {
          await new Promise<void>((resolve, reject) => {
            this.server!.close((err) => {
              if (err) reject(err)
              else resolve()
            })
          })
        }

        logger.info('gateway server shutdown gracefully')
        process.exit(0)
      } catch (error) {
        logger.error({
          from: 'app.ts',
          message: 'failed to shutdown the sgateway erver',
          error: (error as any).message
        })
        process.exit(1)
      }
    }
    signals.forEach((signal) => process.once(signal, shutdown))
    process.once('unhandledRejection', (reason) => {
      logger.error({
        from: 'app.ts',
        message: 'recieved unhandled rejection',
        reason
      })
      shutdown('SIGTERM')
    })
    process.once('uncaughtException', (reason) => {
      logger.error({
        from: 'app.ts',
        message: 'recieved uncaught exception',
        reason
      })
      shutdown('SIGTERM')
    })
  }
}
