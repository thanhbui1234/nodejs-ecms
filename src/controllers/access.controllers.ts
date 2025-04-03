import { Created } from '@/core/success.reponse'
import AccessServices from '@/services/access.services'
import { NextFunction, Request, Response } from 'express'

class AccessController {
  signUp = async (req: Request, res: Response, next: NextFunction) => {
    Created.send(res, {
      message: 'Register OK',
      metaData: await AccessServices.signUp(req.body)
    })
  }
}

export default new AccessController()
