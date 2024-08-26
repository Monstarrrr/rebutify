import { MockApiError } from './errors'
import * as express from 'express'
import logger from './logger'
import * as jwt from 'jsonwebtoken'
import { AppDataSource } from 'data-source'
import { User } from 'entity/User'

export const authenticator = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  // Check if bearer token exists
  const authorization = req.get('authorization')
  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    throw new MockApiError(401, 'Authentication required.')
  }

  const addUserToResponse = async (decoded: Object) => {
    // Make sure the decrypted token is an object
    const tokenObject =
      typeof decoded === 'string' ? JSON.parse(decoded) : decoded
    console.log(`# tokenObject :`, tokenObject)
    // Get the user id from the token
    const userId = tokenObject.id
    // Get the user repository
    const users = AppDataSource.getRepository(User)
    // Get the user
    const user = await users.findOne({ where: { id: userId } })
    // Attach user to response object
    res.locals.user = user
    console.log(`# res.locals :`, res.locals)
    next() // Move to the next middleware or route handler
  }
  // Decrypt token to get user id
  const token = authorization.split(' ')[1]

  // Try to decrypt the token with access and refresh secrets
  try {
    console.log(`# token from Authorization header:`, token)
    const decoded = jwt.verify(token, process.env.MOCK_JWT_ACCESS_SECRET)
    addUserToResponse(decoded)
  } catch (err) {
    try {
      const decoded = jwt.verify(token, process.env.MOCK_JWT_REFRESH_SECRET)
      addUserToResponse(decoded)
    } catch (err) {
      throw new MockApiError(401, 'Session expired. Please log in again.')
    }
  }
  next()
}

export const errorHandler = (
  error: unknown,
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  // Json web token error
  if (error instanceof Error && error.name === 'JsonWebTokenError')
    return res.status(401).json({ error: 'invalid token' })

  // Internal app error
  if (error instanceof MockApiError)
    return res.status(error.status).json({ error: error.message })

  return next(error)
}

export const notFoundRoute = (_req: express.Request, _res: express.Response) => {
  throw new MockApiError(404, 'Not found')
}

export const requestLogger = (req, _res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}
