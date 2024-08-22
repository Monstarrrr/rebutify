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
  return res.json({
    req,
  })
}

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

export const refreshJwt = async (req: express.Request, res: express.Response) => {
  const { username, password } = req.body

  // Get the user repository
  const users = AppDataSource.getRepository(User)

  try {
    // Find the user by email
    const user = await users.findOne({ where: { username } })

    // If user not found, return error
    if (!user) {
      return res.status(400).json(credentialsError)
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json(credentialsError)
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.MOCK_JWT_SECRET, {
      expiresIn: '1h',
    })
    res.json(successResponse(token))
  } catch (error) {
    res.status(500).json(internalServerError)
  }
}
