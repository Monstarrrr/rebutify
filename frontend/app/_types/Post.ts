export type Post = {
  id: number
  type: 'argument' | 'rebuttal' | 'comment'
  body: string
  title: string
  ownerUserId: number
  parentId: number
  created: string
  updated: string
}
