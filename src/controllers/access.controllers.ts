import { Created, OK } from '@/core/success.reponse'
import AccessServices from '@/services/access.services'
import {  Request, Response } from 'express'

class AccessController {
  signUp = async (req: Request, res: Response) => {
    Created.send(res, {
      message: 'Register OK',
      metaData: await AccessServices.signUp(req.body)
    })
  }
  login = async (req: Request, res: Response) => {
    OK.send(res, {
      message: 'Login thành công',
      metaData: await AccessServices.login(req.body as { email: string, password: string })
    })
  } 
  logout = async (req: Request, res: Response) => {
    OK.send(res, {
      message: 'Logout thành công',
      metaData: await AccessServices.logout({keyStore: (req as any).keyStore})
    })
  }
  handlerRefreshToken = async (req: Request, res: Response) => {
    OK.send(res, {
      message: 'Refresh token thành công',
      metaData: await AccessServices.handlerRefreshToken({refreshToken: (req.body as any).refreshToken})
    })
  }
}

export default new AccessController()
