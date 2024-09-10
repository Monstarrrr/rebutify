import { AppDataSource } from 'data-source'
import * as express from 'express'
import { defaultPosts } from '@/utils/defaultPosts'

// For the route "/api/posts"
export const getPosts = async (_req: express.Request, res: express.Response) => {
  const results = await defaultPosts()
  console.log(`# results :`, results)
  return res.json({ results })
}

const titleCharacterLimit = 200

const successResponse = {
  code: 201,
  message: 'Post created successfully.',
}
const titleError = `The title must be less than ${titleCharacterLimit} characters.`

// For the route "/api/posts"
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
