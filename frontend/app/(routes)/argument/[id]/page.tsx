'use client'
import api from '@/api/api'
import React, { useEffect, useState } from 'react'
import { RebuttalSubmition, List, Post } from '@/components'
import * as type from '@/types/Post'
import { getPosts } from '@/api/posts'
import { SectionStyle, EmptySectionStyle, H2 } from '@/styles'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Record<string, string>
}

export default function Argument(props: Props) {
  const { id } = React.use(props.params)
  const argumentId = id

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

          <H2>Rebuttals</H2>
          <SectionStyle>
            {rebuttals.length === 0 ? (
              <EmptySectionStyle>There are no rebuttals yet</EmptySectionStyle>
            ) : (
              <List items={rebuttals} Layout={Post} />
            )}
          </SectionStyle>

          <RebuttalSubmition setRebuttals={setRebuttals} argument={argument} />
        </>
      ) : error ? (
        <p style={{ color: 'red' }}>Error: No argument found</p>
      ) : (
        <p>Loading...</p>
      )}
    </>
  )
}
