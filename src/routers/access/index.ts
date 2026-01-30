//signUp
import AccessController from '@/controllers/access.controllers'
import { asyncHandler } from '@/utils/checkAuth'
import { authentication } from '@/auth/authUtil'
import { Router } from 'express'

const router = Router()

router.post('/shop/signup', asyncHandler(AccessController.signUp))
router.post('/shop/login', asyncHandler(AccessController.login))
router.post('/shop/logout', authentication, asyncHandler(AccessController.logout))

export default router
