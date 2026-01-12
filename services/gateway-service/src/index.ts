import { App } from '@/app'
import { env } from './config/env'
import { logger } from './utils/logger'
import { AllRoutes } from './routes'

const main = async () => {
  try {
    const routes = new AllRoutes().getAllRoutes()
    const app = new App(env, routes)
    await app.startServer()
  } catch (error) {
    logger.error({
      from: 'index.ts',
      message: 'from index.ts failed to start gateway services',
      error: (error as any).message
    })
    console.error(error)
    process.exit(1)
  }
}

void main()
