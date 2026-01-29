import { NextFunction, Request, Response } from "express"

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error: any = new Error('Not found resource')
  error.status = 404
  next(error)
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500)
  res.json({
    error: {
      status: err.status || 500,
      message: err.message || 'Internal Server Error'
    }
  })
  next()
}

export default { notFound, errorHandler }