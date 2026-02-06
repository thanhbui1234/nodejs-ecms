import routeAuth from '@/routers/access/index'
import { apiKey, checkPermission } from '@/utils/checkAuth'
import { Router } from 'express'
import routeKeyToken from '@/routers/key/index'
import routeProduct from '@/routers/product/index'
const router = Router()

//check api key
router.use('/v1/api/key', routeKeyToken)

router.use(apiKey)
router.use(checkPermission)
// Routes with API key validation - permission checked per endpoint
router.use('/v1/api', routeAuth)
router.use('/v1/api', routeProduct)
export default router
