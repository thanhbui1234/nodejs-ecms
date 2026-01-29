//signUp
import AccessController from '@/controllers/access.controllers'
import { asyncHandler, checkPermission } from '@/utils/checkAuth'
import { Router } from 'express'

const router = Router()

router.post('/shop/signup', asyncHandler(AccessController.signUp))

export default router
