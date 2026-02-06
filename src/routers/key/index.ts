//signUp
import { asyncHandler } from '@/utils/checkAuth'
import { Router } from 'express'
import keyController from '@/controllers/key.controller'
const router = Router()

router.post('/create-key-token', asyncHandler(keyController.createKeyToken))
export default router
