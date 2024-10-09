'use client'
import type { Post } from '@/types'
import Link from 'next/link'

export default function PostCard(post: Post) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ maxWidth: 'max-content', margin: '0 10px' }}>
        {post.upvotes - post.downvotes} votes
      </div>
      <Link href={`/${post.type}/${post.id}`}>
        <div style={{ maxWidth: 'max-content' }}>
          <h1>{post.title}</h1>
          <p>{post.body}</p>
        </div>
      </Link>
      <br />
    </div>
  )
}
