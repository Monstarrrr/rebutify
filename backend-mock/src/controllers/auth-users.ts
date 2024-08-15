import * as express from 'express'

export const registerUser = (_req: express.Request, res: express.Response) => {
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
   *         description: User created successfully.
   *       400:
   *         description: User already exists.
   *       500:
   *         description: Internal server error.
   */
  return res.send({ route: 'POST /auth/users' })

  // Uncomment and complete the logic as needed
  // console.log('Received request to create a new user');
  // const { username, email, password } = req.body;
  // try {
  //   const existingUser = await AppDataSource.manager.findOne(User, {
  //     where: [{ username }, { email }, { password }],
  //   });
  //   if (existingUser) {
  //     return res.status(400).json({ message: 'User already exists' });
  //   }
  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   const user = AppDataSource.manager.create(User, {
  //     username,
  //     email,
  //     password: hashedPassword,
  //   });
  //   await AppDataSource.manager.save(user);
  //   const token = jwt.sign({ id: user.id }, JWT_SECRET, {
  //     expiresIn: JWT_EXPIRES_IN,
  //   });
  //   const activationLink = `${BASE_URL}/auth/activation?uid=${user.id}&token=${token}`;
  //   fs.writeFileSync(
  //     path.join(__dirname, `activation_${user.username}.txt`),
  //     activationLink,
  //   );
  //   return res.status(201).json({ message: 'User created' });
  // } catch (error) {
  //   return res.status(500).json({ message: 'Internal server error' });
  // }
}
