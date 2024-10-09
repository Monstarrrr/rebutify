import * as express from 'express'
import { createPost } from '../controllers/posts/posts'
import { upvotePost } from 'controllers/posts/arguments-id-upvote'
import { downvotePost } from 'controllers/posts/arguments-id-downvote'

const postsRouter = express.Router()

// "arguments/"
postsRouter.route('/:id/upvote').post(upvotePost)
postsRouter.route('/:id/downvote').post(downvotePost)

export default postsRouter
