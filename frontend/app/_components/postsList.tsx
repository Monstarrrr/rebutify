'use client'
import type { Post } from '@/types'
import { PostCard } from '@/components'
import { getPosts } from '@/api/posts'
import { useEffect, useState } from 'react'
import { PostType } from '@/types'

export default function PostsList(props: { type: PostType }) {
  const { type } = props
  const [allPosts, setAllPosts] = useState<Post[]>([])

  useEffect(() => {
    let fetchApi = async () => {
      try {
        const response = await getPosts(type)
        setAllPosts(response)
      } catch (error: any) {
        console.error('# Error fetching posts: ', error.response.data)
      }
    }
    fetchApi()
  }, [type])

  return (
    <div>
      {allPosts.map((post) => (
        <PostCard {...post} key={post.id} />
      ))}
    </div>
  )
}
