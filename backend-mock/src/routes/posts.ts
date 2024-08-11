import * as express from 'express'
import { authenticator } from '../utils/middleware'
import { createPost, getPosts } from '../controllers/posts'

const postsRouter = express.Router()
postsRouter.route('/').get(getPosts).post(authenticator, createPost)

export default postsRouter
