import * as express from 'express'

const authJwtRouter = express.Router()
authJwtRouter.route('/create').post((_req, res) =>
  res.json({
    route: 'POST /auth/jwt/create',
    refresh: 'refresh-token',
    access: 'access-token',
  }),
)
authJwtRouter.route('/refresh').post((_req, res) =>
  res.json({
    route: 'POST /auth/jwt/refresh',
    refresh: 'refresh-token',
    access: 'access-token',
  }),
)

export default authJwtRouter
