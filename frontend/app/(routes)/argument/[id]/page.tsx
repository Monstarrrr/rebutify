'use client'
import api from '@/api/api'
import { useEffect, useState } from 'react'
import { RebuttalSubmition, List, Post } from '@/components'
import * as type from '@/types/Post'
import { getPosts } from '@/api/posts'
import { SectionStyle, EmptySectionStyle } from '@/styles'

type Props = {
  params: {
    id: string
  }
  searchParams: Record<string, string>
}

export default function Argument(props: Props) {
  const argumentId = props.params.id

  const [argument, setArgument] = useState<null | type.Argument>(null)
  const [rebuttals, setRebuttals] = useState<type.Post[]>([])
  const [error, setError] = useState(false)

  useEffect(() => {
    let fetchApi = async () => {
      try {
        // Fetch the argument
        const { data } = await api.get(`api/posts/${argumentId}`)
        // Fetch the argument's rebuttals
        const rebuttals = await getPosts('rebuttal', argumentId)
        setArgument(data)
        setRebuttals(rebuttals)
      } catch (error) {
        setError(true)
        console.error(`api/posts/${argumentId}:`, error)
      }
    }
    fetchApi()
  }, [argumentId])

  return (
    <>
      {argument ? (
        <>
          <Post item={argument} />

          <h2>Rebuttals</h2>
          <SectionStyle>
            {rebuttals.length === 0 ? (
              <EmptySectionStyle>There are no rebuttals yet</EmptySectionStyle>
            ) : (
              <List items={rebuttals} Layout={Post} />
            )}
          </SectionStyle>

          <RebuttalSubmition argument={argument} />
        </>
      ) : error ? (
        <p style={{ color: 'red' }}>Error: No argument found</p>
      ) : (
        <p>Loading...</p>
      )}
    </>
  )
}
