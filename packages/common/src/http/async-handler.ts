import { Request, Response, NextFunction, RequestHandler } from 'express'

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown> | unknown

export const asyncWrapper = (handler: AsyncHandler): RequestHandler => {
  return (req, res, next) => {
    try {
      const result = handler(req, res, next)
      Promise.resolve(result).catch(next)
    } catch (e) {
      next(e)
    }
  }
}
