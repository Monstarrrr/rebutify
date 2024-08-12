import * as express from 'express'
import { createJwt, refreshJwt } from '../controllers/auth-jwt'

const authJwtRouter = express.Router()

// For the route "/auth/jwt/create"
authJwtRouter.route('/create').post(createJwt)

// For the route "/auth/jwt/refresh"
authJwtRouter.route('/refresh').post(refreshJwt)

export default authJwtRouter
