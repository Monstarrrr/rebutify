import * as express from 'express'
import { authenticator } from '../utils/middleware'
import { registerUser } from '../controllers/auth-users'

const authUsersRouter = express.Router()
authUsersRouter.route('/').post(registerUser)
authUsersRouter
  .use(authenticator)
  .route('/me')
  .get((_req, res) => res.json({ route: 'GET /auth/users/me' }))
  .delete((_req, res) => res.json({ route: 'DELETE /auth/users/me' }))

export default authUsersRouter
