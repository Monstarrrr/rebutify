import * as express from 'express'
import routes from './routes'
import { errorHandler, notFoundRoute, requestLogger } from './utils/middleware'

const mockApi = express()

// Middleware
mockApi.use(express.json())
mockApi.use(requestLogger)

// Routes
mockApi.use('/api/posts', routes.postsRouter)
mockApi.use('/auth/users', routes.authUsersRouter)
mockApi.use('/auth/jwt', routes.authJwtRouter)

// Not found and error handler
mockApi.use(notFoundRoute)
mockApi.use(errorHandler)

export default mockApi
