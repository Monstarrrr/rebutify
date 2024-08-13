import * as express from 'express'

export const getPosts = (_req: express.Request, res: express.Response) => {
  return res.json({ route: 'GET /api/posts' })
}

export const createPost = (_req: express.Request, res: express.Response) => {
  return res.json({ route: 'POST /api/posts' })
}
