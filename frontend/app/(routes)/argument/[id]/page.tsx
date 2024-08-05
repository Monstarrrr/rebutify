'use client'

import api from '@/api/api'
import { useEffect, useState } from 'react'
import { RebuttalSubmition, RebuttalCards } from '@/components'
import type { Argument } from '@/types/Post'

type Props = {
  params: {
    id: string
  }
  searchParams: Record<string, string>
}

export default function Argument(props: Props) {
  const argumentId = props.params.id

  const [argument, setArgument] = useState<null | Argument>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let fetchApi = async () => {
      try {
        const { data } = await api.get(`api/posts/${argumentId}`)
        setArgument(data)
      } catch (error) {
        setError(true)
        console.error(`api/posts/${argumentId}:`, error)
      }
    }
    fetchApi()
  }, [argumentId])

  return (
    <div>
      {argument ? (
        <>
          <div>
            <h1>{argument.title}</h1>
            <p>{argument.body}</p>
          </div>

          <br />
          <h2>Rebuttals</h2>
          <RebuttalCards />
          <br />
          <br />
          <hr />
          <RebuttalSubmition argument={argument} />
        </>
      ) : error ? (
        <p style={{ color: 'red' }}>Error: No argument found</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}
