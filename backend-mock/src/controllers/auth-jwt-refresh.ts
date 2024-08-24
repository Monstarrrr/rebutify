import { AppDataSource } from 'data-source'
import { User } from 'entity/User'
import * as express from 'express'
import * as jwt from 'jsonwebtoken'

export const refreshJwt = async (req: express.Request, res: express.Response) => {
  /**
   * @openapi
   * /auth/jwt/refresh:
   *   post:
   *     description: Refresh a JWT token by providing a valid refresh token
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *            type: object
   *            required:
   *              - token
   *            properties:
   *             token: string
   *     responses:
   *       200:
   *         $ref: '#/components/responses/Created'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */

  const { token } = req.body

  const successResponse = (accessToken: string, refreshToken: string) => ({
    code: 201,
    message: 'Succesfully logged in automatically.',
    access: accessToken,
    refresh: refreshToken,
  })
  const tokenError = {
    code: 400,
    message: 'Your session has expired. Please log in again.',
  }
  const internalServerError = {
    code: 500,
    message: 'Internal server error.',
  }

  // Get the user repository
  const users = AppDataSource.getRepository(User)
  try {
    const user = await users.findOne({ where: { refreshToken: token } })
    if (!user || user.refreshToken !== token) {
      return res.status(401).json(tokenError)
    }
    // Create a new JWT
    // Create a new refresh and access JWT
    const accessTokenExpiry = parseInt(process.env.MOCK_JWT_ACCESS_EXPIRES_IN)
    const accessToken = jwt.sign(
      { id: user.id.toString() },
      process.env.MOCK_JWT_ACCESS_SECRET,
      {
        expiresIn: accessTokenExpiry,
      },
    )
    const refreshTokenExpiry = parseInt(process.env.MOCK_JWT_REFRESH_EXPIRES_IN)
    const refreshToken = jwt.sign(
      { id: user.id.toString() },
      process.env.MOCK_JWT_REFRESH_SECRET,
      {
        expiresIn: refreshTokenExpiry,
      },
    )
    res.json(successResponse(accessToken, refreshToken))
  } catch (error) {
    res.status(500).json(internalServerError)
  }
}
