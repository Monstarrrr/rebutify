import { PostType } from '@/types'

export type Post = {
  id: string
  type: PostType
  body: string
  title: string
  upvotes: number
  downvotes: number
  ownerUserId: string
  parentId: string
  created: string
  updated: string
}

export type Argument = Post & { type: 'argument' }
export type Rebuttal = Post & { type: 'rebuttal' }
export type Comment = Post & { type: 'comment' }
