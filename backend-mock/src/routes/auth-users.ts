import * as express from 'express'
import { authenticator } from '../utils/middleware'
import { registerUser } from '../controllers/auth-users'
import { activateAccount } from '../controllers/auth-users-activation'

// /auth/users
const authUsersRouter = express.Router()

// Non-authenticated routes
authUsersRouter.route('/').post(registerUser)
authUsersRouter.route('/activation').post(activateAccount)

// Authenticated routes
authUsersRouter
  .use(authenticator)
  .route('/me')
  .get((_req, res) => res.json({ route: 'GET /auth/users/me' }))
  .delete((_req, res) => res.json({ route: 'DELETE /auth/users/me' }))

export default authUsersRouter
