import { AppDataSource } from 'data-source'
import { User } from 'entity/User'
import * as express from 'express'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { JWT_EXPIRES_IN, JWT_SECRET, MOCK_SERVER_PORT } from '@/utils/config'
import fs = require('fs')
import path = require('path')
import e = require('express')

export const registerUser = async (
  req: express.Request,
  res: express.Response,
) => {
  /**
   * @openapi
   * /auth/users:
   *   post:
   *     summary: Register a new user
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
   *         description: Your account has been created successfully.
   *       400:
   *         description: A user with the same username or email already exists.
   *       500:
   *         description: Internal server error, please try again later or contact support.
   */

  const successResponse =
    'Your account has been created. Please check your email to activate it.'
  const usernameError = 'This username is already taken.'
  const emailError =
    'This email is already being used. Please login or reset your password.'
  const internalServerError =
    'An error has occured on our end, please try again later or contact support.'

  console.log('Received request to create a new user')
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
      existingUsername && usernameErrors.push(usernameError)
      existingEmail && emailErrors.push(emailError)
      return res.status(400).json({
        username: usernameErrors,
        email: emailErrors,
      })
    }

    // Check if the password is strong enough (simulated by checking for the word 'password')
    if (password.toLowerCase().includes('password')) {
      return res.status(400).json({
        password: ['Password not strong enough.'],
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
    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    })
    // Create an activation link with the UID and token
    const activationLink = `http://localhost:${MOCK_SERVER_PORT}/auth/activation?uid=${user.id}&token=${token}`
    // Create a file with the activation link to simulate sending an email
    fs.writeFileSync(
      path.join(__dirname, `activation_${user.username}.txt`),
      activationLink,
    )
    return res.status(201).json(successResponse)
  } catch (error) {
    console.log(`# error from /auth/users :`, error)
    return res.status(500).json(internalServerError)
  }
}
