import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { HttpError } from '@chatapp/common'
import { logger } from '@/utils/logger'

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof HttpError) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json(error.serialize())
  }
  logger.error(
    {
      message: error?.message ?? String(error),
      name: error?.name,
      stack: error?.stack,
      method: req.method,
      url: req.originalUrl || req.url,
      body: req.body,
      params: req.params,
      query: req.query,
      statusCode: 500
    },
    'Unhandled_Error'
  )
  const isProduction = process.env.NODE_ENV === 'production'
  res.status(500).json({
    success: false,
    statusCode: 500,
    errorCode: 'Unhandled_Error',
    message: isProduction ? 'SOMETHING WENT WRONG' : error.message,
    timeStamp: new Date().toISOString(),
    ...(!isProduction && { stack: error.stack })
  })
}
