import * as express from 'express'
import { authenticator } from '../utils/middleware'
import { registerUser } from '../controllers/auth/auth-users'
import { activateAccount } from '../controllers/auth/auth-users-activation'
import { deleteUserSelf } from 'controllers/auth/auth-users-me'

// /auth/users
const authUsersRouter = express.Router()

// Non-authenticated routes
authUsersRouter.route('/').post(registerUser)
authUsersRouter.route('/activation').post(activateAccount)

// Authenticated routes
// (/auth/users/me)
authUsersRouter
  .use(authenticator)
  .route('/me')
  .get((_req, res) => res.json(res.locals.user))
  .delete(deleteUserSelf)

export default authUsersRouter
