import * as express from 'express'

export const registerUser = (_req: express.Request, res: express.Response) => {
  return res.send({ route: 'POST /auth/users' })
  //     console.log('Received request to create a new user')
  //   const { username, email, password } = req.body
  //   try {
  //     const existingUser = await AppDataSource.manager.findOne(User, {
  //       where: [{ username }, { email }, { password }],
  //     })
  //     console.log('Existing user: ', existingUser)
  //     if (existingUser) {
  //       return res.status(400).json({ message: 'User already exists' })
  //     }
  //     const hashedPassword = await bcrypt.hash(password, 10)
  //     const user = AppDataSource.manager.create(User, {
  //       username,
  //       email,
  //       password: hashedPassword,
  //     })
  //     console.log(user)
  //     await AppDataSource.manager.save(user)
  //     console.log('saved user')
  //     const token = jwt.sign({ id: user.id }, JWT_SECRET, {
  //       expiresIn: JWT_EXPIRES_IN,
  //     })
  //     const activationLink = `${BASE_URL}/auth/activation?uid=${user.id}&token=${token}`
  //     // Simulate sending an email with the activation link by writing it to a file
  //     fs.writeFileSync(
  //       path.join(__dirname, `activation_${user.username}.txt`),
  //       activationLink,
  //     )
  //     console.log('file written')
  //     return res.status(201).json({ message: 'User created' })
}
