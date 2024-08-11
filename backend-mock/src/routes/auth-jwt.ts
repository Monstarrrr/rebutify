import * as express from 'express'

const authJwtRouter = express.Router()
authJwtRouter
  .route('/create')
  .post((_req, res) => res.send('POST /auth/jwt/create'))
authJwtRouter
  .route('/refresh')
  .post((_req, res) => res.send('POST /auth/jwt/refresh'))

export default authJwtRouter
