import findKeyByID from '@/services/apikey.services'
import { NextFunction, Request, Response } from 'express'
import { HEADER } from '@/const/header'

// Option 1: Using RequestHandler type
export const apiKey: any = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = req.headers[HEADER.API_KEY] as string
    if (!key) {
      return res.status(403).json({
        message: 'Forbidden'
      })
    }
    const objKey = await findKeyByID(key)
    if (!objKey) {
      return res.status(403).json({
        message: 'Forbidden'
      })
    }
    ;(req as any).objKey = objKey
    return next()
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    })
  }
}

export const permission: any = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!(req as any).objKey?.permissions) {
      return res.status(403).json({
        message: 'permission denied'
      })
    }
    // check permission invalid
    const validPermission = (req as any).objKey.permissions.includes(permission)
    if (!validPermission) {
      return res.status(403).json({
        message: 'permission denied'
      })
    }
    return next()
  }
}

export const checkPermission: any = (req: Request, res: Response, next: NextFunction) => {
  if (!(req as any).objKey?.permissions || (req as any).objKey.permissions.length === 0) {
    return res.status(403).json({
      message: 'permission denied'
    })
  }
  return next()
}

export const asyncHandler = (fn: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}