import { HEADER } from '@/const/header'
import { asyncHandler } from '@/utils/checkAuth'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import KeyTokenService from '@/services/keyToken.services'
import { UnauthorizedError } from '@/core/error.response'
import { NotFoundError } from '@/core/error.response'

export const JWT_SECRET = process.env.JWT_SECRET || '1223'

export const createTokenPair = async (payload: any) => {
  try {
    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '2 days'
    })

    const refreshToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '7 days'
    })

    return { accessToken, refreshToken }
  } catch (error) {
    console.log(error, 'error')
    throw new Error('Failed to create token pair')
  }
}


export const authentication = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // check usseris
  // 2 get access token
  // 3 verify token
  // 4 check user in dbs
  // 5 check permission keystore 
  // 6 go to next middleware
  const userId = req.headers[HEADER.CLIENT_ID] as string
  if (!userId) { throw new UnauthorizedError('Unauthorized') }
  const keyStore = await KeyTokenService.getTokenService({ userId: userId })
  if (!keyStore) { throw new NotFoundError('Unauthorized') }

  const accessToken = req.headers[HEADER.AUTHORIZATION] as string
  if (!accessToken) { throw new UnauthorizedError('Unauthorized') }

  try {
    const decodeUser = jwt.verify(accessToken, JWT_SECRET)
    if (userId !== (decodeUser as any).userId) { throw new UnauthorizedError('Unauthorized') }
    (req as any).keyStore = keyStore
    next()
  } catch (error) {
    throw new UnauthorizedError('Unauthorized')
  }

})

export const verifyJWT = async (token: string) => {
  return jwt.verify(token, JWT_SECRET) as any
}