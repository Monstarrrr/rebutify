import { AppDataSource } from 'data-source'
import { User } from 'entity/User'
import * as express from 'express'

export const activateAccount = async (
  req: express.Request,
  res: express.Response,
) => {
  /**
   * @openapi
   * /auth/users:
   *   post:
   *     summary: Activate an account
   *     description: Activate a user account in the system to allow the user to login once they have shown ownership of the email address.
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - uid
   *               - token
   *             properties:
   *               uid:
   *                 type: string
   *                 description: The user's id.
   *                 example: 123456
   *               token:
   *                 type: string
   *                 description: The user's token.
   *                 example: 1a2b3c4d5e6f7g8h9i0j
   *     responses:
   *       201:
   *
   */

  const successResponse = {
    code: 201,
    message: 'Your account has been activated.',
  }
  const linkError = 'The link is invalid.'
  const expiryError = 'The link is invalid, it has likely expired.'
  const internalServerError =
    'An error has occured on our end, please try again later or contact support.'

  console.log('📩 Received request to activate an account...')
  const { uid, token } = req.body
  const id = parseInt(uid)
  try {
    // Get the user repository
    const users = AppDataSource.getRepository(User)
    // Find the user by id
    const user = await users.findOne({ where: { id } })
    console.log(`# user :`, user)
    if (!user) {
      console.log('✖️ User not found.')
      return res.status(400).json(linkError)
    }
    // Check the token
    if (user.token !== token) {
      console.log('✖️ Token mismatch.')
      return res.status(400).json(expiryError)
    }
    console.log('✅ Account activated.')
    return res.status(201).json(successResponse)
  } catch (error) {
    console.log(`# error from /auth/users :`, error)
    return res.status(500).json(internalServerError)
  }
}
