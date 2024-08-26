import * as express from 'express'
import routes from './routes'
import { errorHandler, notFoundRoute, requestLogger } from './utils/middleware'
import { corsHeaders } from './utils/config'

const mockApi = express()

// Middlewares
mockApi.use(express.json())
mockApi.use(requestLogger)

// Enable CORS based on the corsOptions configuration
mockApi.use('*', (req, res, next) => {
  corsHeaders.forEach((option) => {
    const key = Object.keys(option)[0]
    res.setHeader(key, option[key])
  })
  // Handle preflight requests so that the browser doesn't block the request
  if (req.method == 'OPTIONS') res.sendStatus(200)
  next()
})

// Swagger documentation
mockApi.use('/docs', routes.swaggerDocs)

// Routes
mockApi.use('/api/posts', routes.postsRouter)
mockApi.use('/auth/users', routes.authUsersRouter)
mockApi.use('/auth/jwt', routes.authJwtRouter)

// Not found and error handler
mockApi.use(notFoundRoute)
mockApi.use(errorHandler)

export default mockApi
