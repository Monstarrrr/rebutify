import * as express from 'express'
import { allPosts } from '@/utils/allPosts'
import * as jwt from 'jsonwebtoken'

// GET "/api/posts/:id"
const postError = { message: 'Post not found.' }
export const getPost = async (req: express.Request, res: express.Response) => {
  const { id } = req.params
  const post = allPosts.find((post) => post.id.toString() === id)
  if (!post || !id) {
    return res.status(404).json(postError)
  }
  return res.json(post)
}

// GET "/api/posts"
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

// POST "/api/posts"
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
    return res.status(400).json({
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
