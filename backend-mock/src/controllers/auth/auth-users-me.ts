import { AppDataSource } from 'data-source'
import { User } from 'entity/User'
import * as express from 'express'
import * as bcrypt from 'bcrypt'

const successResponse = 'User deleted.'
const passwordError = 'Invalid password.'

/**
 * @openapi
 * /auth/users/me:
 *   delete:
 *     summary: Delete self account
 *     description: Delete the account of the user who is making the request.
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - current_password
 *             properties:
 *               current_password:
 *                 type: string
 *                 example: Passw0rd!
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Created'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       422:
 *         $ref: '#/components/responses/BadFormRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 */
export const deleteUserSelf = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    // get user from database
    const users = AppDataSource.getRepository(User)
    const user = await users.findOne({ where: { id: res.locals.user.id } })
    if (!user) {
      return res.status(400).json({
        message:
          'User not found, please log in again. The account may have already been deleted.',
      })
    }
    // check if the user password from req.body.password matches the password in the database
    if (bcrypt.compareSync(req.body.current_password, user.password)) {
      // delete user from database
      await users.delete({ id: res.locals.user.id })
      return res.json({ message: successResponse })
    } else {
      return res.status(422).json({
        password: passwordError,
      })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
