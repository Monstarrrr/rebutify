import * as express from 'express'

export const upvotePost = async (req: express.Request, res: express.Response) => {
  return res.status(200).json({ message: 'Upvoted post' })
}
