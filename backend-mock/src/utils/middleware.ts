import config from './config'
import errors from './errors'
import * as express from 'express'
import * as jwt from 'jsonwebtoken'

const userExtractor = (
  req: express.Request,
  _res: express.Response,
  next: express.NextFunction,
) => {
  // Check if bearer token exists
  const authorization = req.get('authorization')
  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    throw new errors.MockApiError(401, 'missing token')
  }

  // Verify token
  const token = authorization.substring(7)
  jwt.verify(token, config.JWT_SECRET)

  // Add id of caller to the req object
  // req.userId = userId;

  next()
}

const errorHandler = (
  error: unknown,
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  // Json web token error
  if (error instanceof Error && error.name === 'JsonWebTokenError')
    return res.status(401).json({ error: 'invalid token' })

  // Internal app error
  if (error instanceof errors.MockApiError)
    return res.status(error.status).json({ error: error.message })

  return next(error)
}

export default { userExtractor, errorHandler }
