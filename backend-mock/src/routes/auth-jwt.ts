import * as express from 'express'
import { createJwt, refreshJwt } from '../controllers/auth-jwt'

const authJwtRouter = express.Router()
authJwtRouter.route('/create').post(createJwt)
authJwtRouter.route('/refresh').post(refreshJwt)

export default authJwtRouter
