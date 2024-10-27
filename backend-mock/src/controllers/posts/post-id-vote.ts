import { getUserIdFromReq, allPosts } from '@/utils'
import { AppDataSource } from 'data-source'
import { User } from 'entity/User'
import * as express from 'express'

export const votePost = async (req: express.Request, res: express.Response) => {
  /**
   * @openapi
   * /{postType}/{postId}/{voteDirection}:
   *   post:
   *     summary: Vote on a post
   *     description: Vote on a post
   *     tags: [Posts]
   *     parameters:
   *     - $ref: '#/components/parameters/PostType'
   *     - $ref: '#/components/parameters/PostId'
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
    if (!req.params.postId || !req.baseUrl || !req.params.voteDirection) {
      return res.status(400).json({
        message: `❌ Bad request, parameter(s) missing: postId = ${req.params.postId}, postType = ${req.params.postType}, voteDirection = ${req.params.voteDirection}`,
      })
    }
    // Processing values
    const postId = req.params.postId.toString()
    const postType = req.baseUrl === '/arguments' ? 'argument' : 'rebuttal'
    const voteDirection = req.params.voteDirection === 'upvote' ? 'up' : 'down'

    console.log(`⏳ ${voteDirection}voting ${postType} #${postId}.`)

    // Get user from request
    const userIdFromReq = getUserIdFromReq(req)
    if (!userIdFromReq) {
      return res
        .status(401)
        .json({ message: '❌ User not found in request (token)' })
    }
    console.log('✅ User found in request.')

    // Get user from database
    const users = AppDataSource.getRepository(User)
    const user = await users.findOne({ where: { id: Number(userIdFromReq) } })

    // upvotedPosts & downvotedPosts [string -> array]
    let upvotedPosts = user.upvotedPosts.split(' ')
    upvotedPosts = upvotedPosts.filter((post) => post !== '')
    let downvotedPosts = user.downvotedPosts.split(' ')
    downvotedPosts = downvotedPosts.filter((post) => post !== '')

    if (voteDirection === 'up') {
      // Already upvoted ?
      if (upvotedPosts.includes(postId)) {
        return res.status(400).json({
          message: `❌ Bad request: ${postType} was already upvoted`,
        })
      }
      console.log(`✅ ${postType} not already upvoted.`)

      // Removing downvote if exists
      if (downvotedPosts.includes(postId)) {
        console.log("⏳ Removing downvote (from user's upvotedPosts)...")
        downvotedPosts.splice(downvotedPosts.indexOf(postId, 1))
        const updatedDownvotedPosts = downvotedPosts.join(' ')
        await users.update(userIdFromReq, {
          downvotedPosts: updatedDownvotedPosts,
        })
        console.log('⏳ Removing downvote (from post)...')
        const post = allPosts.find((post) => post.id === Number(postId))
        post.downvotes -= 1
        console.log(`✅ Downvote removed.`)
      }

      // Add post to user's upvotedPosts list
      upvotedPosts.push(postId)
      const updatedUpvotedPosts = upvotedPosts.join(' ')
      await users.update(userIdFromReq, {
        upvotedPosts: updatedUpvotedPosts,
      })
      console.log(`✅ Upvote added to user's upvotedPosts.`)

      // Add upvote to post
      const post = allPosts.find((post) => post.id == Number(postId))
      post.upvotes += 1
      console.log(`✅ Upvote added to post.`)
    }

    if (voteDirection === 'down') {
      // Already downvoted ?
      if (downvotedPosts.includes(postId)) {
        return res.status(400).json({
          message: `❌ Bad request: ${postType} was already downvoted`,
        })
      }
      console.log(`✅ ${postType} not already downvoted.`)

      // Removing upvote if exists
      if (upvotedPosts.includes(postId)) {
        console.log("⏳ Removing upvote (from user's upvotedPosts)...")
        upvotedPosts.splice(upvotedPosts.indexOf(postId))
        const updatedUpvotedPosts = upvotedPosts.join(' ')
        await users.update(userIdFromReq, {
          upvotedPosts: updatedUpvotedPosts,
        })
        console.log('⏳ Removing upvote (from post)...')
        const post = allPosts.find((post) => post.id === Number(postId))
        post.upvotes -= 1

        console.log(`✅ Upvote removed.`)
      }

      // Add post to user's downvotedPosts list
      downvotedPosts.push(postId)
      const updatedDownvotedPosts = downvotedPosts.join(' ')
      await users.update(userIdFromReq, {
        downvotedPosts: updatedDownvotedPosts,
      })
      console.log(`✅ Downvote added to user's downvotedPosts.`)

      // Add downvote to post
      const post = allPosts.find((post) => post.id === Number(postId))
      post.downvotes += 1
      console.log(`✅ Downvote added to post.`)
    }

    return res.status(200).json({ message: `✅ ${voteDirection}voted post` })
  } catch (error) {
    return res.status(500).json({
      message:
        error.message ||
        `❌ Internal server error from ${req.baseUrl}/:id/downvote`,
    })
  }
}
