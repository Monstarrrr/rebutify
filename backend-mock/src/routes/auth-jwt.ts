import * as express from 'express'
import { createJwt } from '../controllers/auth/auth-jwt-create'
import { refreshJwt } from '../controllers/auth/auth-jwt-refresh'

const authJwtRouter = express.Router()

// For the route "/auth/jwt/create"
authJwtRouter.route('/create').post(createJwt)

// For the route "/auth/jwt/refresh"
authJwtRouter.route('/refresh').post(refreshJwt)

export default authJwtRouter
