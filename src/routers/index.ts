import { Router } from 'express'
import routeAuth from '@/routers/access/index'
const router = Router()

router.use('/v1/api', routeAuth)
export default router
