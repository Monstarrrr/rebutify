'use client'

import api from '@/api/api'
import { Post } from '@/types'
import { useEffect, useState } from 'react'

type Props = {
  params: {
    id: string
  }
  searchParams: Record<string, string>
}

export default function Argument(props: Props) {
  const {
    params: { id },
  } = props

  const [argument, setArgument] = useState<null | Post>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let fetchApi = async () => {
      try {
        const { data } = await api.get(`api/posts/${id}`)
        setArgument(data)
      } catch (error) {
        setError(true)
        console.error(`api/posts/${id}:`, error)
      }
    }
    fetchApi()
  }, [id])

  return (
    <div>
      {argument ? (
        <div>
          <h1>{argument.title}</h1>
          <p>{argument.body}</p>
        </div>
      ) : error ? (
        <p style={{ color: 'red' }}>Error: No argument found</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}
