import * as express from 'express'

/**
 * @openapi
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     description: Get the list of posts in the System.
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Retrieved posts successfully.
 *       500:
 *         description: Internal server error.
 */
export const getPosts = (_req: express.Request, res: express.Response) => {
  return res.json({ route: 'GET /api/posts' })
}

export const createPost = (_req: express.Request, res: express.Response) => {
  return res.json({ route: 'POST /api/posts' })
}
