import * as express from 'express'
import mw from '../utils/middleware'

const postsRouter = express.Router()
postsRouter
  .route('/')
  .get((_req, res) => res.send('GET /api/posts'))
  .post(mw.userExtractor, (_req, res) => res.send('POST /api/posts'))

export default postsRouter
