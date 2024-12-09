export type User = {
  accessToken: string | null
  email: string
  id: number
  password: string
  refreshToken: string | null
  username: string
  verified: boolean
  upvotedPosts: string // SQLite doesn't support arrays & objects
  downvotedPosts: string // SQLite doesn't support arrays & objects
}
