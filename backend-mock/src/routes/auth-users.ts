import * as express from 'express'
import { authenticator } from '../utils/middleware'
import { registerUser } from '../controllers/auth-users'

const authUsersRouter = express.Router()

// For the route "/auth/users"
authUsersRouter.route('/').post(registerUser)

// For the route "/auth/users/me"
authUsersRouter
  .use(authenticator)
  .route('/me')
  .get((_req, res) => res.json({ route: 'GET /auth/users/me' }))
  .delete((_req, res) => res.json({ route: 'DELETE /auth/users/me' }))

export default authUsersRouter
