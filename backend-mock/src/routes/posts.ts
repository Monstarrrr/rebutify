import * as express from 'express'
import { createPost, getPost, getPosts } from '../controllers/posts/posts'

const postsRouter = express.Router()

// For the route "/api/posts"
postsRouter.route('/').get(getPosts).post(createPost)
postsRouter.route('/:id').get(getPost).post(createPost)

export default postsRouter
