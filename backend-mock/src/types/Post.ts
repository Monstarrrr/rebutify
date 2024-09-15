export type Post = {
  body: string
  created: Date
  id: number
  ownerUserId: number
  parentId: number | null
  title: string
  type: 'argument' | 'rebuttal' | 'comment'
  updated: Date
}
