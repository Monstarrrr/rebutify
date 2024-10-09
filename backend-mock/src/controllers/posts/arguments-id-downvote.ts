import * as express from 'express'

export const downvotePost = async (
  req: express.Request,
  res: express.Response,
) => {
  return res.status(200).json({ message: 'Downvoted post' })
}
