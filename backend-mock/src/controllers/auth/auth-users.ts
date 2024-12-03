import { AppDataSource } from 'data-source'
import { User } from 'entity/User'
import * as express from 'express'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import fs = require('fs')
import path = require('path')

export const registerUser = async (
  req: express.Request,
  res: express.Response,
) => {
  /**
   * @openapi
   * /auth/users:
   *   post:
   *     summary: Register
   *     description: Create a new user in the system. This includes hashing the password and saving the user information.
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - email
   *               - password
   *             properties:
   *               username:
   *                 type: string
   *                 description: The user's username.
   *                 example: johndoe
   *               email:
   *                 type: string
   *                 description: The user's email address.
   *                 example: johndoe@example.com
   *               password:
   *                 type: string
   *                 description: The user's password.
   *                 example: Passw0rd!
   *     responses:
   *       201:
   *         $ref: '#/components/responses/Created'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       422:
   *         $ref: '#/components/responses/BadFormRequest'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */

  const successResponse = {
    code: 201,
    message:
      'Your account has been created. Please check your email to activate it.',
  }
  const formErrors = {
    username: [],
    email: [],
    password: [],
  }
  const usernameErrorResponse = 'This username is already taken.'
  const emailErrorResponse =
    'This email is already being used. Please login or reset your password.'
  const internalServerErrorResponse = {
    code: 500,
    message:
      'An error has occured on our end, please try again later or contact support.',
  }

  console.log('📩 Received request to create a new user')
  const { username, email, password } = req.body
  try {
    // Check if the username or email already exists
    let usernameErrors = []
    let emailErrors = []
    const existingUsername = await AppDataSource.manager.findOne(User, {
      where: [{ username }],
    })
    const existingEmail = await AppDataSource.manager.findOne(User, {
      where: [{ email }],
    })
    if (existingUsername || existingEmail) {
      existingUsername && usernameErrors.push(usernameErrorResponse)
      existingEmail && emailErrors.push(emailErrorResponse)
      return res.status(422).json({
        code: 422,
        formErrors: {
          ...formErrors,
          username: usernameErrors,
          email: emailErrors,
        },
      })
    }

    // Check if the password is strong enough (simulated by checking for the word 'password')
    if (password.toLowerCase().includes('password')) {
      console.log('✖️ Password not strong enough.')
      return res.status(422).json({
        code: 422,
        formErrors: {
          ...formErrors,
          password: ['Password not strong enough.'],
        },
      })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)
    // Create the user
    const user = AppDataSource.manager.create(User, {
      username,
      email,
      password: hashedPassword,
    })
    // Save the user
    await AppDataSource.manager.save(user)
    // Create a JWT token for account activation
    const expiresIn = parseInt(process.env.MOCK_JWT_ACCESS_EXPIRES_IN)
    const accessToken = jwt.sign(
      { id: user.id },
      process.env.MOCK_JWT_ACCESS_SECRET,
      {
        expiresIn,
      },
    )
    // Save the token to the user
    await AppDataSource.manager.update(User, user.id, { accessToken })
    // Create an activation link with the UID and token
    const activationLink = `http://localhost:${process.env.CLIENT_PORT}/activate?uid=${user.id}&token=${accessToken}`
    // Delete any previous activation links
    fs.readdirSync('./emails').forEach((file) => {
      if (file.includes('activation-email_')) {
        fs.unlinkSync(path.join('./emails', file))
      }
    })
    // Current date and time for the file name
    const date = new Date().toLocaleString().replace(/[/:, ]/g, '-')
    // Create a file with the activation link to simulate sending an email
    fs.writeFileSync(
      path.join('./emails', `activation-email_${user.username}_${date}.txt`),
      activationLink,
    )
    console.log('✅ Account created.')
    return res.status(201).json(successResponse)
  } catch (error) {
    console.log(`❌ InternalServerError from /auth/users :`, error)
    return res.status(500).json(internalServerErrorResponse)
  }
}
