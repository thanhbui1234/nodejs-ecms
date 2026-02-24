//signUp
import AccessController from '@/controllers/access.controller'
import { asyncHandler } from '@/utils/checkAuth'
import { authentication, authenticationRefreshToken } from '@/auth/authUtil'
import { Router } from 'express'

const router = Router()

router.post('/shop/signup', asyncHandler(AccessController.signUp))
router.post('/shop/login', asyncHandler(AccessController.login))

// logout only needs a valid access token
router.post('/shop/logout', authentication, asyncHandler(AccessController.logout))

// refresh-token route uses its own middleware that validates the refresh token header
router.post('/shop/refresh-token', authenticationRefreshToken, asyncHandler(AccessController.handlerRefreshToken))

export default router
