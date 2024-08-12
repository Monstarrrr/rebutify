import * as express from 'express'
import { authenticator } from '../utils/middleware'
import { createPost, getPosts } from '../controllers/posts'

const postsRouter = express.Router()

// For the route "/api/posts"
postsRouter.route('/').get(getPosts).post(authenticator, createPost)

export default postsRouter
