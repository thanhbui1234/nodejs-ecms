//signUp
import ProductController from '@/controllers/product.controller'
import { asyncHandler } from '@/utils/checkAuth'
import { authentication } from '@/auth/authUtil'
import { Router } from 'express'

const router = Router()

router.get('/product/search/:keySearch', asyncHandler(ProductController.getListSearchProduct))

router.use(authentication)
router.post('/product/create', asyncHandler(ProductController.createProduct))
router.get('/product/drafts/all', asyncHandler(ProductController.findAllDraftsForShop))
router.get('/product/published/all', asyncHandler(ProductController.findAllPublishedForShop))
router.post('/product/publish/:id', asyncHandler(ProductController.publishProductByShop))
router.post('/product/unpublish/:id', asyncHandler(ProductController.unPublishProductByShop))
export default router
