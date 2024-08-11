import * as express from 'express'
import routes from './routes'

const mockApi = express()

// Routes
mockApi.use('/api/posts', routes.postsRouter)
mockApi.use('/auth/users', routes.authUsersRouter)
mockApi.use('/auth/jwt', routes.authJwtRouter)

export default mockApi
