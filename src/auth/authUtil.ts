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


/**
 * Middleware for normal protected routes — validates access token only.
 */
export const authentication = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers[HEADER.CLIENT_ID] as string
  if (!userId) throw new UnauthorizedError('Unauthorized')

  const keyStore = await KeyTokenService.getTokenService({ userId })
  if (!keyStore) throw new NotFoundError('Unauthorized')

  const accessToken = req.headers[HEADER.AUTHORIZATION] as string
  if (!accessToken) throw new UnauthorizedError('Unauthorized')

  try {
    const decodeUser = await verifyJWT(accessToken)
    if (userId !== (decodeUser as any).userId) throw new UnauthorizedError('Unauthorized')
      ; (req as any).keyStore = keyStore
      ; (req as any).user = decodeUser
    return next()
  } catch (error) {
    throw new UnauthorizedError('Unauthorized')
  }
})

/**
 * Middleware for the refresh-token route.
 * - Access token: decoded only (no expiry check) — allows refresh even when access token has expired.
 * - Refresh token: fully verified (signature + expiry must be valid).
 */
export const authenticationRefreshToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers[HEADER.CLIENT_ID] as string
  if (!userId) throw new UnauthorizedError('Unauthorized')

  const keyStore = await KeyTokenService.getTokenService({ userId })
  if (!keyStore) throw new NotFoundError('Unauthorized')

  const accessToken = req.headers[HEADER.AUTHORIZATION] as string
  if (!accessToken) throw new UnauthorizedError('Unauthorized - missing access token')

  const refreshToken = req.headers[HEADER.REFRESH_TOKEN] as string
  if (!refreshToken) throw new UnauthorizedError('Unauthorized - missing refresh token')

  try {
    // Decode only — no expiry/signature check, so expired access tokens are still accepted
    const decodeAccess = jwt.decode(accessToken) as any
    if (!decodeAccess || userId !== decodeAccess.userId) throw new UnauthorizedError('Unauthorized')

    // Fully verify refresh token — must be valid and not expired
    const decodeRefresh = await verifyJWT(refreshToken)
    if (userId !== (decodeRefresh as any).userId) throw new UnauthorizedError('Unauthorized')

      ; (req as any).keyStore = keyStore
      ; (req as any).user = decodeAccess
      ; (req as any).refreshToken = refreshToken
    return next()
  } catch (error) {
    throw new UnauthorizedError((error as any).message)
  }
})

export const verifyJWT = async (token: string) => {
  return jwt.verify(token, JWT_SECRET) as any
}