import * as bcrypt from 'bcrypt'
import 'dotenv/config'
import { AppDataSource } from './data-source'
import { User } from './entity/User'
import * as express from 'express'
import * as jwt from 'jsonwebtoken'
import * as fs from 'fs'
import path = require('path')

const mockApi = express()
mockApi.use(express.json())

const PORT = process.env.MOCK_API_PORT
const BASE_URL = `http://localhost:${PORT}`
const JWT_SECRET = process.env.MOCK_JWT_SECRET
const JWT_EXPIRES_IN = process.env.MOCK_JWT_EXPIRES_IN
const JWT_REFRESH_EXPIRES_IN = process.env.MOCK_JWT_REFRESH_EXPIRES_IN

AppDataSource.initialize()
  .then(async () => {
    console.log('Loading users from the database...')
    const users = await AppDataSource.manager.find(User)
    console.log('Loaded users: ', users)
  })
  .catch((error) => console.log(error))

// Registration endpoint
mockApi.post('/auth/users', async (req, res) => {
  console.log('Received request to create a new user')
  const { username, email, password } = req.body
  try {
    //   const existingUser = await AppDataSource.manager.findOne(User, {
    //     where: [{ username }, { email }, { password }],
    //   })
    //   console.log('Existing user: ', existingUser)
    //   if (existingUser) {
    //     return res.status(400).json({ message: 'User already exists' })
    //   }
    //   const hashedPassword = await bcrypt.hash(password, 10)

    //   const user = AppDataSource.manager.create(User, {
    //     username,
    //     email,
    //     password: hashedPassword,
    //   })

    //   await AppDataSource.manager.save(user)

    //   const token = jwt.sign({ id: user.id }, JWT_SECRET, {
    //     expiresIn: JWT_EXPIRES_IN,
    //   })
    //   const activationLink = `${BASE_URL}/auth/activation?uid=${user.id}&token=${token}`

    //   // Simulate sending an email with the activation link by writing it to a file
    //   fs.writeFileSync(
    //     path.join(__dirname, `activation_${user.username}.txt`),
    //     activationLink
    //   )

    //   res.status(201).json({ message: 'User created' })

    res.status(201).json({ message: 'Test', username, email, password })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Start the server
mockApi.listen(process.env.MOCK_API_PORT, () => {
  console.log(`Server is running on ${BASE_URL}`)
})
