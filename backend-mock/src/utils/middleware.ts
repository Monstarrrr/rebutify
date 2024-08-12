import { MockApiError } from './errors'
import * as express from 'express'
import logger from './logger'

export const authenticator = (
	req: express.Request,
	_res: express.Response,
	next: express.NextFunction,
) => {
	// Check if bearer token exists
	const authorization = req.get('authorization')
	if (!authorization || !authorization.toLowerCase().startsWith('Bearer ')) {
		throw new MockApiError(401, 'not authenticated')
	}

	// Verify token
	//   const token = authorization.substring(7)
	//   jwt.verify(token, JWT_SECRET)

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
