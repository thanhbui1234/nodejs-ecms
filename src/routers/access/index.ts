//signUp
import AccessController from '@/controllers/access.controllers'
import { Router } from 'express'

const router = Router()

router.post('/shop/signup', AccessController.signUp as any)

export default router
