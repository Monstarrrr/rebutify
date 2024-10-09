import * as express from 'express'
import { allPosts } from '@/utils/allPosts'
import * as jwt from 'jsonwebtoken'

/**
 * @openapi
 * /api/posts/{id}:
 *   get:
 *     summary: Get a post by id
 *     description: Get a post by its id.
 *     tags: [Posts]
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: The post id.
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Retrieved'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 */
const postError = { message: 'Post not found.' }
export const getPost = async (req: express.Request, res: express.Response) => {
  const { id } = req.params
  const post = allPosts.find((post) => post.id.toString() === id)
  if (!post || !id) {
    return res.status(404).json(postError)
  }
  return res.json(post)
}

/**
 * @openapi
 * /api/posts?type={type}:
 *   get:
 *     summary: Get all posts
 *     description: Get all posts of any type or of specific type (arguments, rebuttals, and comments).
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [argument, rebuttal, comment]
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Retrieved'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 */
export const getPosts = async (req: express.Request, res: express.Response) => {
  try {
    if (
      req.query.type === 'argument' ||
      req.query.type === 'rebuttal' ||
      req.query.type === 'comment'
    ) {
      const posts = allPosts.filter((post) => post.type === req.query.type)
      return res.json({ results: posts })
    }
    return res.json({ results: allPosts })
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

/**
 * @openapi
 * /api/posts:
 *   post:
 *     summary: Create a post
 *     description: Create a new post (argument, rebuttal, or comment).
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *           required:
 *             - type
 *             - title
 *             - body
 *           properties:
 *             type: string
 *             enum: [argument, rebuttal, comment]
 *             title:
 *               type: string
 *             body:
 *               type: string
 *
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Retrieved'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       422:
 *         $ref: '#/components/responses/BadFormRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 */
const titleCharacterLimit = 200
const successResponse = {
  code: 201,
  message: 'Post created successfully.',
}
const titleError = `The title must be less than ${titleCharacterLimit} characters.`

export const createPost = (req: express.Request, res: express.Response) => {
  let titleErrors = []
  let bodyErrors = []

  // Set random id to post
  const id = Math.floor(Math.random() * 999999)

  // Set user id from token as ownerUserId
  const token = req.headers.authorization.split(' ')[1]
  const decodedToken = jwt.decode(token)
  const user =
    typeof decodedToken === 'string' ? JSON.parse(decodedToken) : decodedToken
  const ownerUserId = user.id

  // Validate title and body
  req.body.title.length > titleCharacterLimit && titleErrors.push(titleError)
  if (titleErrors.length > 0 || bodyErrors.length > 0) {
    return res.status(422).json({
      title: titleErrors,
      body: bodyErrors,
    })
  }

  // Add created post to allPosts
  allPosts.push({
    ...req.body,
    ownerUserId,
    id,
    created: new Date(),
    updated: new Date(),
  })
  return res.json(successResponse)
}
