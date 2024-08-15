import * as express from 'express'
import { authenticator } from '../utils/middleware'
import { deleteUser, getUser, registerUser } from '../controllers/auth-users'

const authUsersRouter = express.Router()

// For the route "/auth/users"
authUsersRouter.route('/').post(registerUser)

// For the route "/auth/users/me"
authUsersRouter.use(authenticator).route('/me').get(getUser).delete(deleteUser)

export default authUsersRouter
