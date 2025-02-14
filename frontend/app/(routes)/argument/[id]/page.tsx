'use client'
import api from '@/api/api'
import { useEffect, useState } from 'react'
import { RebuttalSubmition, List, Post } from '@/components'
import * as type from '@/types/Post'
import { getPosts } from '@/api/posts'
import { EmptySectionStyle, H2 } from '@/styles'
// eslint-disable-next-line no-restricted-imports
import styles from './page.module.scss'

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

          <div className={styles.rebuttalsContainer}>
            <H2>Rebuttals ({rebuttals.length})</H2>
            <div className={styles.rebuttalsWrapper}>
              {rebuttals.length === 0 ? (
                <EmptySectionStyle>There are no rebuttals yet</EmptySectionStyle>
              ) : (
                <List items={rebuttals} Layout={Post} />
              )}
            </div>
          </div>

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
