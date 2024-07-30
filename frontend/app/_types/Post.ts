type Post = {
  id: string
  type: 'argument' | 'rebuttal' | 'comment'
  body: string
  title: string
  ownerUserId: number
  parentId: number
  created: string
  updated: string
}

export type Argument = Post & { type: 'argument' }
export type Rebuttal = Post & { type: 'rebuttal' }
export type Comment = Post & { type: 'comment' }
