import { getUserIdFromReq, allPosts } from '@/utils'
import { AppDataSource } from 'data-source'
import { User } from 'entity/User'
import * as express from 'express'

export const downvoteArgument = async (
  req: express.Request,
  res: express.Response,
) => {
  /**
   * @openapi
   * arguments/{id}/downvote:
   *   post:
   *     summary: Downvote an argument
   *     description: Downvote an argument
   *     tags: [Posts]
   *     responses:
   *       200:
   *         $ref: '#/components/responses/Ok'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  try {
    // Check URL's ID validity
    if (!req.params.id) {
      return res.status(400).json({ message: 'Bad request' })
    }
    const argumentId = req.params.id.toString()
    console.log(`✅ Argument id #${argumentId} found in request URL.`)

    // Get user from request
    const userIdFromReq = getUserIdFromReq(req)
    if (!userIdFromReq) {
      return res
        .status(401)
        .json({ message: 'User not found in request (token)' })
    }
    console.log('✅ User found in request.')

    // Get user from database
    const users = AppDataSource.getRepository(User)
    const user = await users.findOne({ where: { id: Number(userIdFromReq) } })

    // Convert user's upvotedPosts & downvotedPosts [string -> array]
    const upvotedPosts = user.upvotedPosts.split(' ')
    const downvotedPosts = user.downvotedPosts.split(' ')
    upvotedPosts.splice(upvotedPosts.indexOf(argumentId))
    downvotedPosts.splice(downvotedPosts.indexOf(argumentId))

    // Already downvoted ?
    if (downvotedPosts.includes(argumentId)) {
      return res
        .status(400)
        .json({ message: '❌ Bad request: Argument was already downvoted' })
    }
    console.log(`✅ Argument not already downvoted.`)

    // Removing upvote if exists
    if (upvotedPosts.includes(argumentId)) {
      console.log('⏳ Removing upvote...')
      upvotedPosts.splice(upvotedPosts.indexOf(argumentId))
      const updatedUpvotedPosts = upvotedPosts.join(' ')
      await users.update(userIdFromReq, { upvotedPosts: updatedUpvotedPosts })
      console.log(`✅ Upvote removed.`)
    }

    // Add post to user's downvotedPosts list
    downvotedPosts.push(argumentId)
    const updatedDownvotedPosts = downvotedPosts.join(' ')
    await users.update(userIdFromReq, { downvotedPosts: updatedDownvotedPosts })
    await users.save(user)
    console.log(`✅ Downvote added to user's downvotedPosts.`)

    // Add downvote to post
    const post = allPosts.find((post) => post.id.toString() === argumentId)
    console.log(`# post prior to downvote :`, post)
    post.downvotes += 1
    console.log(`# post after downvote :`, post)
    console.log(`✅ Downvote added to post.`)

    return res.status(200).json({ message: '✅ Downvoted post' })
  } catch (error) {
    return res.status(500).json({
      message:
        error.message || '❌ Internal server error from arguments/:id/downvote',
    })
  }
}
