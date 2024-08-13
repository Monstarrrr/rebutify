'use client'
import { Post } from '@/types'
import { getPosts } from '@/api/posts'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ArgumentCards() {
  const [argumentsList, setArgumentsList] = useState<Post[]>([])

  useEffect(() => {
    let fetchApi = async () => {
      try {
        const response = await getPosts('argument')
        setArgumentsList(response)
      } catch (error: any) {
        console.error('# Error fetching posts: ', error.response.data)
      }
    }
    fetchApi()
  }, [])

  return (
    <div>
      {argumentsList.map((argument) => (
        <div key={argument.id}>
          <br />
          <Link style={{ fontSize: '24px' }} href={`/argument/${argument.id}`}>
            {argument.title}
          </Link>
          <p>{argument.body}</p>
          <br />
        </div>
      ))}
    </div>
  )
}
