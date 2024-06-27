'use client'
import { Post } from '@/types'
import { getPosts } from '@/api/posts'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ArgumentCard() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    let fetchApi = async () => {
      try {
        const response = await getPosts()
        setPosts(response)
      } catch (error: any) {
        console.error('# Error fetching posts: ', error.response.data)
      }
    }
    fetchApi()
  }, [])

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <br />
          <Link style={{ fontSize: '24px' }} href={`/argument/${post.id}`}>
            {post.title}
          </Link>
          <p>{post.body}</p>
          <br />
        </div>
      ))}
    </div>
  )
}
