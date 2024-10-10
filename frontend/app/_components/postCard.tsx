// postCard.tsx displays a single clickable post preview

'use client'
import type { Post } from '@/types'
import Link from 'next/link'

const PostCard: React.FC<{ item: Post }> = ({ item }) => {
  const { title, type, id, upvotes, downvotes } = item
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ minWidth: '100px', margin: '0 10px', textAlign: 'end' }}>
        {upvotes - downvotes} votes
      </div>
      <Link href={`/${type}/${id}`}>
        <div style={{ maxWidth: 'max-content' }}>
          <h1>{title}</h1>
        </div>
      </Link>
      <br />
    </div>
  )
}

export default PostCard
