'use client'
import { followPost } from '@/api/posts/followPost'
import { Button } from '@/components'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateUser } from '@/store/slices/user'
import { useState } from 'react'

export default function Follow({
  postId,
  undo,
}: {
  postId: string
  undo?: boolean
}) {
  const user = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFollow = async () => {
    setError(null)
    setLoading(true)
    try {
      await followPost(postId, 'argument', undo)
      setLoading(false)
      setSuccess(undo ? 'Unfollowed' : 'Followed')
      if (undo) {
        dispatch(
          updateUser({
            ...user,
            followedPosts: user.followedPosts.filter((id) => id !== postId),
          }),
        )
      }
      if (!undo) {
        dispatch(
          updateUser({
            ...user,
            followedPosts: [postId, ...user.followedPosts],
          }),
        )
      }
      setTimeout(() => {
        setSuccess(null)
      }, 2000)
    } catch (error: any) {
      setLoading(false)
      setError(error?.response?.data?.message ?? 'Unknown error')
      setSuccess(null)
      setTimeout(() => {
        setError(null)
      }, 20000)
      console.error(error?.response?.data ?? error?.response ?? error)
    }
  }

  return (
    <>
      <Button
        label={undo ? 'Unfollow' : 'Follow'}
        loading={loading}
        success={success}
        onClick={handleFollow}
        transparent
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </>
  )
}
