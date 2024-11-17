import AccessServices from '@/services/access.services'
import { Request, Response, NextFunction } from 'express'

class AccessController {
  signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('[P]::SignUp', req.body)
      /*
        200 ok
        201 created
        */
      return res.status(201).json(await AccessServices.signUp(req.body))
    } catch (error) {
      next(error)
    }
  }
}

export default new AccessController()
