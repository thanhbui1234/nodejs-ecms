import { NextFunction, Request, Response } from "express"
import { NotFoundError, statusCode } from "@/core/error.response"
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new NotFoundError('Not found resource')
  next(error)
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || statusCode.INTERNAL_SERVER)
  res.json({
    error: {
      status: err.status || statusCode.INTERNAL_SERVER,
      message: err.message || 'Internal Server Error'
    }
  })
  next()
}

export default { notFound, errorHandler }