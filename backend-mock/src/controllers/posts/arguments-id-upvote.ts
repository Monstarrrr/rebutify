import { getUserIdFromReq, allPosts } from '@/utils'
import { AppDataSource } from 'data-source'
import { User } from 'entity/User'
import * as express from 'express'

export const upvoteArgument = async (
  req: express.Request,
  res: express.Response,
) => {
  /**
   * @openapi
   * arguments/{id}/upvote:
   *   post:
   *     summary: Upvote an argument
   *     description: Upvote an argument
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
    console.log(`# userIdFromReq :`, userIdFromReq)
    const user = await users.findOne({ where: { id: parseInt(userIdFromReq) } })

    console.log(`# user :`, user)
    console.log(`# user.upvotedPosts :`, user.upvotedPosts)
    console.log(`# typeof user.upvotedPosts :`, typeof user.upvotedPosts)
    // Convert user's upvotedPosts & downvotedPosts [string -> array]
    let upvotedPosts = user.upvotedPosts.split(' ')
    upvotedPosts = upvotedPosts.filter((post) => post !== '')
    let downvotedPosts = user.downvotedPosts.split(' ')
    downvotedPosts = downvotedPosts.filter((post) => post !== '')

    // Already upvoted ?
    if (upvotedPosts.includes(argumentId)) {
      console.log(`# User upvoted posts :`, user.upvotedPosts)
      return res
        .status(400)
        .json({ message: '❌ Bad request: Argument was already upvoted' })
    }
    console.log(`✅ Argument not already upvoted.`)

    // Removing downvote if exists
    if (downvotedPosts.includes(argumentId)) {
      console.log('⏳ Removing downvote...')
      downvotedPosts.splice(downvotedPosts.indexOf(argumentId, 1))
      const updatedDownvotedPosts = downvotedPosts.join(' ')
      await users.update(userIdFromReq, {
        downvotedPosts: updatedDownvotedPosts,
      })
      console.log(`✅ Downvote removed.`)
    }

    // Add post to user's upvotedPosts list
    upvotedPosts.push(argumentId)
    const updatedUpvotedPosts = upvotedPosts.join(' ')
    await users.update(userIdFromReq, {
      upvotedPosts: updatedUpvotedPosts,
    })
    console.log(`# user :`, user)
    console.log(`✅ Upvote added to user's upvotedPosts.`)

    // Add upvote to post
    const post = allPosts.find((post) => post.id == Number(argumentId))
    console.log(`# post prior to upvote :`, post)
    post.upvotes += 1
    console.log(`# post after upvote :`, post)
    console.log(`✅ Upvote added to post.`)

    return res.status(200).json({ message: '✅ Upvoted post' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message:
        error.message || '❌ Internal server error from arguments/:id/upvote',
    })
  }
}
