export type UserInfo = {
  email: string
  id: number | null
  access?: string
  refresh?: string
  username: string
  upvotedPosts: string // SQLite doesn't support arrays & objects
  downvotedPosts: string // SQLite doesn't support arrays & objects
}
