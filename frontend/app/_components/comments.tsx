'use client'
import * as type from '@/types'
import { getPosts } from '@/api/posts'
import { useEffect, useState } from 'react'

export default function Comments({ parentPostId }: { parentPostId: string }) {
  const [comments, setComments] = useState<type.Post[]>([])

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const comments = await getPosts('comment', parentPostId)
        setComments(comments)
      } catch (error: any) {
        console.error(
          '# "Get comments" request failed: ',
          error.response?.data?.detail ??
            error.response?.data ??
            error.response ??
            error,
        )
      }
    }
    fetchApi()
  }, [parentPostId])

  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id}>
          <i>&quot;{comment.body}&quot;</i>
          <br />
        </div>
      ))}
    </div>
  )
}
