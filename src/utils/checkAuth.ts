import findKeyByID from '@/services/apikey.services'
import { NextFunction, Request, Response } from 'express'

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization'
}
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
