import routeAuth from '@/routers/access/index'
import { apiKey, checkPermission } from '@/utils/checkAuth'
import { Router } from 'express'
const router = Router()

//check api key
router.use(apiKey)
router.use(checkPermission)
// Routes with API key validation - permission checked per endpoint
router.use('/v1/api', routeAuth)
export default router
