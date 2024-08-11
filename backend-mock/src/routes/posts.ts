import * as express from 'express'
import { userExtractor } from '../utils/middleware'

const postsRouter = express.Router()
postsRouter
  .route('/')
  .get((_req, res) => res.send('GET /api/posts'))
  .post(userExtractor, (_req, res) => res.send('POST /api/posts'))

export default postsRouter
