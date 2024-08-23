import { AppDataSource } from 'data-source'
import { User } from 'entity/User'
import * as express from 'express'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

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

  // 200
  const successResponse = (token: string) => ({
    code: 200,
    message: 'Login successful.',
    token,
  })
  // 400
  const credentialsError = {
    message: 'Invalid username or password.',
  }
  // 500
  const internalServerError = {
    message: 'Internal server error.',
  }

  return res.json({
    req,
  })
}
