import { AppDataSource } from 'data-source'
import * as express from 'express'

export const getPosts = (req: express.Request, res: express.Response) => {
  const results = [
    {
      body: 'This is my argument, plants feel pain, trust me I read it somewhere.',
      created: new Date(),
      id: 1,
      ownerUserId: 1,
      parentId: null,
      title: 'Plants feel pain.',
      type: 'ARGUMENT',
      updated: new Date(),
    },
    {
      body: `We've eaten meat for thousands of years, it's natural.`,
      created: new Date(),
      id: 2,
      ownerUserId: 2,
      parentId: null,
      title: `We've been doing it for thousands of years.`,
      type: 'ARGUMENT',
      updated: new Date(),
    },
    {
      body: `Plants do not feel pain.`,
      created: new Date(),
      id: 3,
      ownerUserId: 1,
      parentId: 1,
      title: `I'm a vegan and I'm not dead yet.`,
      type: 'REBUTTAL',
      updated: new Date(),
    },
  ]
  return res.json({ results })
}

export const createPost = (_req: express.Request, res: express.Response) => {
  return res.json({ route: 'POST /api/posts' })
}
