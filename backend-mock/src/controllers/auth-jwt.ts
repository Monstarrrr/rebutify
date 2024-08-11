import * as express from 'express'

export const createJwt = (_req: express.Request, res: express.Response) => {
  return res.json({
    route: 'POST /auth/jwt/create',
    refresh: 'refresh-token',
    access: 'access-token',
  })
}
export const refreshJwt = (_req: express.Request, res: express.Response) => {
  return res.json({
    route: 'POST /auth/jwt/refresh',
    refresh: 'refresh-token',
    access: 'access-token',
  })
}
