import * as express from 'express'
import postsRouter from './routes/posts'
import authJwtRouter from './routes/auth-jwt'
import authUsersRouter from './routes/auth-users'

const mockApi = express()

// Routes
mockApi.use('/api/posts', postsRouter)
mockApi.use('/auth/users', authUsersRouter)
mockApi.use('/auth/jwt', authJwtRouter)

export default mockApi
