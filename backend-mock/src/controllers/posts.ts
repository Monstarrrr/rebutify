import { AppDataSource } from 'data-source'
import * as express from 'express'
import { defaultPosts } from '@/utils/defaultPosts'

export const getPosts = async (_req: express.Request, res: express.Response) => {
  const results = await defaultPosts()
  console.log(`# results :`, results)
  return res.json({ results })
}

export const createPost = (_req: express.Request, res: express.Response) => {
  return res.json({ route: 'POST /api/posts' })
}
