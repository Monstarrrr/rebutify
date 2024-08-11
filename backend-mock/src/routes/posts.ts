import * as express from 'express'
import { authenticator } from '../utils/middleware'

const postsRouter = express.Router()
postsRouter
  .route('/')
  .get((_req, res) => res.send('GET /api/posts'))
  .post(authenticator, (_req, res) => res.send('POST /api/posts'))

export default postsRouter
