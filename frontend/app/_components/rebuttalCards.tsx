'use client'

import { getPosts } from '@/api/posts'
import { useEffect, useState } from 'react'
import { Post } from '@/types'

export default function Rebuttal() {
  const [rebuttalsList, setRebuttalsList] = useState<Post[]>([])

  useEffect(() => {
    let fetchApi = async () => {
      try {
        const response = await getPosts('rebuttal')
        setRebuttalsList(response)
      } catch (error: any) {
        console.error(
          '# "Get rebuttals" request failed: ',
          error.response?.data?.detail ??
            error.response?.data ??
            error.response ??
            error,
        )
      }
    }
    fetchApi()
  }, [])
  return (
    <div>
      {rebuttalsList.map((rebuttal) => (
        <div key={rebuttal.id}>
          <br />
          <i>&quot;{rebuttal.body}&quot;</i>
          <br />
        </div>
      ))}
    </div>
  )
}
