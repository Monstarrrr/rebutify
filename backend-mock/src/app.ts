import * as express from 'express'
import routes from './routes'
import {
  delay,
  errorHandler,
  notFoundRoute,
  requestLogger,
} from '@/utils/middleware'
import { corsHeaders } from './utils/config'

const mockApi = express()

// Middlewares
mockApi.use(express.json())
mockApi.use(requestLogger)
mockApi.use(delay(500))

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

/* 
  Routes
*/
// OLD
mockApi.use('/api/posts', routes.postsRouter) // temporary (to match existing non-mock routes)

// POSTS
mockApi.use('/arguments', routes.postRouter)
mockApi.use('/rebuttals', routes.postRouter)
mockApi.use('/comments', routes.postRouter)

// AUTH
mockApi.use('/auth/users', routes.authUsersRouter)
mockApi.use('/auth/jwt', routes.authJwtRouter)

// ERRORS
mockApi.use(notFoundRoute)
mockApi.use(errorHandler)

export default mockApi
