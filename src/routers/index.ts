import routeAuth from '@/routers/access/index'
import { apiKey, permission } from '@/utils/checkAuth'
import { Router } from 'express'
const router = Router()

//check api key
router.use(apiKey)
// check permission
router.use(permission('0000'))
router.use('/v1/api', routeAuth)
export default router
