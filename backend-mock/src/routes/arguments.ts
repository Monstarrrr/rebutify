import * as express from 'express'
import { upvoteArgument } from 'controllers/posts/arguments-id-upvote'
import { downvoteArgument } from 'controllers/posts/arguments-id-downvote'

const argumentsRouter = express.Router()

// "arguments/"
argumentsRouter.route('/:id/upvote').post(upvoteArgument)
argumentsRouter.route('/:id/downvote').post(downvoteArgument)

export default argumentsRouter
