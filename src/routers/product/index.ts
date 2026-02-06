//signUp
import ProductController from '@/controllers/product.controller'
import { asyncHandler } from '@/utils/checkAuth'
import { authentication } from '@/auth/authUtil'
import { Router } from 'express'

const router = Router()
router.use(authentication)
router.post('/product/create', asyncHandler(ProductController.createProduct))
export default router
