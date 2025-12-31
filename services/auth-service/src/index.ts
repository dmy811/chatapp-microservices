import express from 'express'
import { App } from '@/app'
import { env } from './config/env'
import { logger } from './utils/logger'
import { Routes } from './routes/auth.routes'

const main = async () => {
  try {
    const router = express.Router()
    const userRoutes = new Routes(router)
    const app = new App(env, userRoutes.routes)
    await app.startServer()
  } catch (error) {
    logger.error({ error }, 'from index.ts failed to start auth services')
    process.exit(1)
  }
}

void main()
