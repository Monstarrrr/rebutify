import * as jwt from 'jsonwebtoken'
import * as express from 'express'

export const getUserIdFromReq = (req: express.Request): string => {
  try {
    const token = req.headers?.authorization?.split(' ')[1]
    if (!token)
      console.error(
        `Could not get user from ${req.path} request, bearer token not found in authorization request header`,
      )
    const decodedToken = jwt.decode(token)
    const user =
      typeof decodedToken === 'string' ? JSON.parse(decodedToken) : decodedToken
    return user.id.toString()
  } catch (error) {
    throw new Error(`❌ Could not perform operation, user not logged in.`)
  }
}
