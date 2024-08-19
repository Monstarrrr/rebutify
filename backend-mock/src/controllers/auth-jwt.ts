import * as express from 'express'

export const createJwt = (req: express.Request, res: express.Response) => {
  /**
   * @openapi
   * /auth/jwt/create:
   *   post:
   *     summary: Login a user by creating a JWT
   *     description: Create a new JWT for a user.
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *            $ref: '#/components/schemas/User'
   *     responses:
   *       201:
   *         $ref: '#/components/responses/Created'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  return res.json({
    req,
  })
}

export const refreshJwt = (_req: express.Request, res: express.Response) => {
  return res.json({
    route: 'POST /auth/jwt/refresh',
    refresh: 'refresh-token',
    access: 'access-token',
  })
}
