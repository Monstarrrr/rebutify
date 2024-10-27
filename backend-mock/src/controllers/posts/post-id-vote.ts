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

  type Direction = 'up' | 'down'

  // Processing req values
  const postId = req.params.postId.toString()
  const postType = req.baseUrl === '/arguments' ? 'argument' : 'rebuttal'
  const voteDirection = req.params.voteDirection === 'upvote' ? 'up' : 'down'
  const undo = req.params?.undo === 'undo' ? true : false
  const userIdFromReq = getUserIdFromReq(req)

  // Check URL's ID validity
  if (!req.params.postId || !req.baseUrl || !req.params.voteDirection) {
    return res.status(400).json({
      message: `❌ Bad request, parameter(s) missing: postId = ${req.params.postId}, postType = ${req.params.postType}, voteDirection = ${req.params.voteDirection}`,
    })
  }
  if (!userIdFromReq) {
    return res
      .status(401)
      .json({ message: '❌ User not found in request (token)' })
  }

  const updateUserVotes = async (
    updatedPosts: string,
    voteDirection: Direction,
  ) => {
    const users = AppDataSource.getRepository(User)
    await users.update(userIdFromReq, {
      [`${voteDirection}votedPosts`]: updatedPosts,
    })
    // return the user to check if it was updated
    const user = await users.findOne({ where: { id: Number(userIdFromReq) } })
    console.log(`{voteDirection}votedPosts = ${voteDirection}votedPosts`)
    console.log(
      `upvotedPosts from user: ${user.upvotedPosts} ; downvotedPosts: ${user.downvotedPosts}`,
    )
  }

  try {
    console.log(`⏳ ${voteDirection}voting ${postType} #${postId}.`)

    // Get user from database
    const users = AppDataSource.getRepository(User)
    const user = await users.findOne({ where: { id: Number(userIdFromReq) } })

    // upvotedPosts & downvotedPosts [string -> array]
    let upvotedPosts = user.upvotedPosts.split(' ')
    upvotedPosts = upvotedPosts.filter((post) => post !== '')
    let downvotedPosts = user.downvotedPosts.split(' ')
    downvotedPosts = downvotedPosts.filter((post) => post !== '')

    if (undo) {
      if (!upvotedPosts.includes(postId) && !downvotedPosts.includes(postId)) {
        const message = `❌ Can't undo vote: ${postType} was not already ${voteDirection}voted`
        console.log(message)
        return res.status(400).json({ message })
      }
      console.log(`⏳ Removing ${postType} ${voteDirection}vote...`)

      if (voteDirection === 'up') {
        // Remove the upvote from the post
        allPosts.find((post) => post.id === Number(postId)).upvotes -= 1
        // Remove the upvote from the user
        upvotedPosts.splice(upvotedPosts.indexOf(postId))
        const updatedUpvotedPosts = upvotedPosts.join(' ')
        await updateUserVotes(updatedUpvotedPosts, 'up')
        console.log(`✅ ${postType} ${voteDirection}vote removed.`)
      } else {
        // Remove the downvote from the post
        allPosts.find((post) => post.id === Number(postId)).downvotes -= 1
        // Remove the downvote from the user
        console.log(
          `# downvotedPosts (should be 1 before undo) :`,
          downvotedPosts,
        )
        downvotedPosts.splice(downvotedPosts.indexOf(postId))
        const updatedDownvotedPosts = downvotedPosts.join(' ')
        await updateUserVotes(updatedDownvotedPosts, 'down')
        console.log(`✅ ${postType} ${voteDirection}vote removed.`)
      }
      console.log(
        `# Post upvotes :`,
        allPosts.find((post) => post.id === Number(postId)).upvotes,
      )
      console.log(
        `# Post downvotes :`,
        allPosts.find((post) => post.id === Number(postId)).downvotes,
      )
      return res
        .status(200)
        .json({ message: `✅ ${postType} ${voteDirection}vote removed.` })
    }

    if (!undo) {
      if (voteDirection === 'up') {
        // Already upvoted ?
        if (upvotedPosts.includes(postId)) {
          return res.status(400).json({
            message: `❌ Can't upvote: ${postType} was already upvoted`,
          })
        }
        console.log(`⏳ Upvoting ${postType}...`)

        // Removing downvote if exists
        if (downvotedPosts.includes(postId)) {
          console.log('ℹ️ A downvote exists.')
          console.log("⏳ [1/2] Removing downvote (from user's upvotedPosts)...")
          downvotedPosts.splice(downvotedPosts.indexOf(postId))
          const updatedDownvotedPosts = downvotedPosts.join(' ')
          await updateUserVotes(updatedDownvotedPosts, 'down')
          console.log('⏳ [2/2] Removing downvote (from post)...')
          allPosts.find((post) => post.id === Number(postId)).downvotes -= 1
          console.log(`✅ Downvote removed.`)
        }

        // Add post to user's upvotedPosts list
        upvotedPosts.push(postId)
        const updatedUpvotedPosts = upvotedPosts.join(' ')
        await updateUserVotes(updatedUpvotedPosts, 'up')
        console.log(`✅ Upvote added to user's upvotedPosts.`)

        // Add upvote to post
        allPosts.find((post) => post.id == Number(postId)).upvotes += 1

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
          await updateUserVotes(updatedUpvotedPosts, 'up')
          console.log('⏳ Removing upvote (from post)...')
          allPosts.find((post) => post.id === Number(postId)).upvotes -= 1

          console.log(`✅ Upvote removed.`)
        }

        // Add post to user's downvotedPosts list
        downvotedPosts.push(postId)
        const updatedDownvotedPosts = downvotedPosts.join(' ')
        await updateUserVotes(updatedDownvotedPosts, 'down')
        console.log(`✅ Downvote added to user's downvotedPosts.`)

        // Add downvote to post
        allPosts.find((post) => post.id === Number(postId)).downvotes += 1
        console.log(`✅ Downvote added to post.`)
      }

      console.log(
        `# Post upvotes :`,
        allPosts.find((post) => post.id === Number(postId)).upvotes,
      )
      console.log(
        `# Post downvotes :`,
        allPosts.find((post) => post.id === Number(postId)).downvotes,
      )
      return res.status(200).json({ message: `✅ ${voteDirection}voted post` })
    }
  } catch (error) {
    return res.status(500).json({
      message:
        error.message ||
        `❌ Internal server error from ${req.baseUrl}/:id/downvote`,
    })
  }
}
