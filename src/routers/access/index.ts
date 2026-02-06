//signUp
import AccessController from '@/controllers/access.controller'
import { asyncHandler } from '@/utils/checkAuth'
import { authentication } from '@/auth/authUtil'
import { Router } from 'express'

const router = Router()

router.post('/shop/signup', asyncHandler(AccessController.signUp))
router.post('/shop/login', asyncHandler(AccessController.login))

router.use(authentication)
router.post('/shop/logout', asyncHandler(AccessController.logout))
router.post('/shop/refresh-token', asyncHandler(AccessController.handlerRefreshToken))
export default router
