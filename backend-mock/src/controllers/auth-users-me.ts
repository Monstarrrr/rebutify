import { AppDataSource } from 'data-source'
import { User } from 'entity/User'
import * as express from 'express'
import * as bcrypt from 'bcrypt'

const successResponse = 'User deleted.'
const passwordError = 'Invalid password.'

export const deleteUserSelf = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    // get user from database
    const users = AppDataSource.getRepository(User)
    const user = await users.findOne({ where: { id: res.locals.user.id } })
    // check if the user password from req.body.password matches the password in the database
    if (bcrypt.compareSync(req.body.current_password, user.password)) {
      // delete user from database
      await users.delete({ id: res.locals.user.id })
      return res.json({ message: successResponse })
    } else {
      return res.status(400).json({
        password: passwordError,
      })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
