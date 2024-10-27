import * as express from 'express'
import { votePost } from 'controllers/posts/post-id-vote'

const postRouter = express.Router()

// "/arguments | /rebuttals | /comments"
// Voting
postRouter.route('/:postId/:voteDirection/:undo?').post(votePost)

export default postRouter
