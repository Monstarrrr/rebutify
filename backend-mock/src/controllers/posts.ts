import * as express from 'express'
import { defaultPosts } from '@/utils/defaultPosts'

// For the route "/api/posts/:id"
const postError = { message: 'Post not found.' }
export const getPost = async (req: express.Request, res: express.Response) => {
  const { id } = req.params
  const allPosts = await defaultPosts()
  const post = allPosts.find((post) => post.id.toString() === id)
  if (!post || !id) {
    return res.status(404).json(postError)
  }
  return res.json(post)
}

// For the route "/api/posts"
export const getPosts = async (_req: express.Request, res: express.Response) => {
  const results = await defaultPosts()
  return res.json({ results })
}

// For the route "/api/posts"
const titleCharacterLimit = 200
const successResponse = {
  code: 201,
  message: 'Post created successfully.',
}
const titleError = `The title must be less than ${titleCharacterLimit} characters.`
export const createPost = (req: express.Request, res: express.Response) => {
  let titleErrors = []
  let bodyErrors = []
  req.body.title.length > titleCharacterLimit && titleErrors.push(titleError)

  if (titleErrors.length > 0 || bodyErrors.length > 0) {
    return res.status(400).json({
      title: titleErrors,
      body: bodyErrors,
    })
  } else {
    return res.json(successResponse)
  }
}
