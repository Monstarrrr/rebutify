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

  const successResponse = (token: string) => ({
    code: 201,
    message: 'Succesfully logged in automatically.',
    token,
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
  const refreshToken = token
  try {
    const user = await users.findOne({ where: { refreshToken } })
    if (!user || user.refreshToken !== token) {
      return res.status(401).json(tokenError)
    }
    // Create a new JWT
    const expiresIn = parseInt(process.env.MOCK_JWT_REFRESH_EXPIRES_IN)
    const jwtToken = jwt.sign(
      user.id.toString(),
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn,
      },
    )
    console.log(
      '# Refresh token set to expire in ',
      Math.floor(expiresIn / 60),
      ` minutes.`,
    )
    res.json(successResponse(jwtToken))
  } catch (error) {
    res.status(500).json(internalServerError)
  }
}
