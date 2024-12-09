export type Post = {
  body: string
  created: Date
  downvotes: number
  id: number
  ownerUserId: number
  parentId: number | null
  title?: string
  type: 'argument' | 'rebuttal' | 'comment'
  updated: Date
  upvotes: number
}
