import * as express from 'express'
import { authenticator } from '../utils/middleware'
import { registerUser } from '../controllers/auth-users'

const authUsersRouter = express.Router()
authUsersRouter
  .use(authenticator)
  .route('/me')
  .get((_req, res) => res.send('GET /auth/users/me'))
  .delete((_req, res) => res.send('DELETE /auth/users/me'))
authUsersRouter.route('/').post(registerUser)

export default authUsersRouter
