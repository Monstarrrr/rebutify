import { AppDataSource } from 'data-source'
import { User } from 'entity/User'
import * as express from 'express'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { access } from 'fs'

export const createJwt = async (req: express.Request, res: express.Response) => {
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
   *         $ref: '#/components/responses/BadFormRequest'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */

  // 200
  const successResponse = (accessToken: string, refreshToken: string) => ({
    code: 200,
    message: 'Login successful.',
    access: accessToken,
    refresh: refreshToken,
  })
  // 400
  const credentialsError = {
    message: 'Invalid username or password.',
  }
  // 401
  const unauthorizedError = {
    message: `Your account isn't available yet. Please check your email to activate it.`,
  }
  // 500
  const internalServerError = {
    message: 'Internal server error.',
  }

  // Get the user repository
  const users = AppDataSource.getRepository(User)
  const { username, password } = req.body
  try {
    // look for user where email and verified is true
    const user = await users.findOne({ where: { username } })
    const userId = user.id.toString()
    if (user.verified === false) {
      return res.status(401).json(unauthorizedError)
    }
    console.log(`# password :`, password)
    console.log(`# user.password :`, user.password)
    console.log(`# user :`, user)
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json(credentialsError)
    }

    // Create a new access token
    const accessTokenExpiry = parseInt(process.env.MOCK_JWT_ACCESS_EXPIRES_IN)
    const accessToken = jwt.sign(
      { id: userId },
      process.env.MOCK_JWT_ACCESS_SECRET,
      {
        expiresIn: accessTokenExpiry,
      },
    )
    // Add the access token to the user
    await users.update(userId, { accessToken })

    // Create a new refresh token
    const refreshTokenExpiry = parseInt(process.env.MOCK_JWT_REFRESH_EXPIRES_IN)
    const refreshToken = jwt.sign(
      { id: userId },
      process.env.MOCK_JWT_REFRESH_SECRET,
      {
        expiresIn: refreshTokenExpiry,
      },
    )
    // Add the refresh token to the user
    await users.update(userId, { refreshToken })
    console.log('✅ User logged in.')
    // Return the tokens to client
    return res.status(201).json(successResponse(accessToken, refreshToken))
  } catch (error) {
    console.error('❌ Error from /auth/jwt/create : ', error)
    return res.status(500).json(internalServerError)
  }
}
