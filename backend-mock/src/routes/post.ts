import * as express from 'express'
import { votePost } from 'controllers/posts/post-id-vote'

const postRouter = express.Router()

// ":postType/"
postRouter.route('/:postId/:voteDirection').post(votePost)

export default postRouter
