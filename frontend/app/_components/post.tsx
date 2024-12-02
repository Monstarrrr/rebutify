'use client'
import { vote } from '@/api/vote'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateUser } from '@/store/slices/user'
import * as type from '@/types'
import { useState } from 'react'
import { deletePost } from '@/api/posts'

const Post: React.FC<{ item: type.Post }> = ({ item }) => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.user)
  const [voteError, setVoteError] = useState(null)
  // We use state to keep the post values reactive
  const [post, setPost] = useState({
    title: item.title,
    body: item.body,
    upvotes: item.upvotes,
    downvotes: item.downvotes,
    id: item.id,
    ownerUserId: item.ownerUserId,
    type: item.type,
  })

  const handleVote = (direction: 'up' | 'down') => async () => {
    try {
      const data = await vote(user, post.type, post.id, direction)
      setPost(data.resources.post)
      dispatch(updateUser(data.resources.user))
    } catch (error: any) {
      setVoteError(error && 'Vote request failed')
      console.error(`❌ Vote request failed: ${error}`)
    }
  }

  const [loading, setLoading] = useState(false)
  const [apiErrors, setApiErrors] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleDelete = async (id: string) => {
    try {
      const res = await deletePost(id)
      setSuccess(true)
      setLoading(false)
      console.log(`# Delete rebuttal - response :`, res)
    } catch (error: any) {
      setSuccess(false)
      setLoading(false)
      setApiErrors(
        error?.response?.data?.detail ??
          error?.response?.data ??
          error?.response ??
          error,
      )
    }
  }

  return (
    <div>
      {post.title && (
        <div>
          <h1>{post.title}</h1>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div>
          <button onClick={handleVote('up')}>+</button>
          {post.upvotes - post.downvotes}
          <button onClick={handleVote('down')}>-</button>
          {voteError && <p>{voteError}</p>}
        </div>
        <div>
          <p>{post.body}</p>
        </div>
        {user.id === post.ownerUserId && (
          <div>
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </div>
        )}
        <br />
      </div>
    </div>
  )
}

export default Post
