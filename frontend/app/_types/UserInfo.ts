export type UserInfo = {
  email: string
  id: string | null
  access?: string
  refresh?: string
  username: string
  reputation: number
  upvotedPosts: string[] // SQLite doesn't support arrays & objects
  downvotedPosts: string[] // SQLite doesn't support arrays & objects
  followedPosts: string[] // SQLite doesn't support arrays & objects
}
