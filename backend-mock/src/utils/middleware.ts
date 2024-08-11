import { JWT_SECRET } from './config'
import { MockApiError } from './errors'
import * as express from 'express'
import * as jwt from 'jsonwebtoken'

export const userExtractor = (
  req: express.Request,
  _res: express.Response,
  next: express.NextFunction,
) => {
  // Check if bearer token exists
  const authorization = req.get('authorization')
  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    throw new MockApiError(401, 'missing token')
  }

  // Verify token
  const token = authorization.substring(7)
  jwt.verify(token, JWT_SECRET)

  // Add id of caller to the req object
  // req.userId = userId;

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
