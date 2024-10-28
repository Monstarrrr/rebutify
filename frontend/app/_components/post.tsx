'use client'
import { vote } from '@/api/vote'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateUser } from '@/store/slices/user'
import * as type from '@/types'
import { useState } from 'react'

const Post: React.FC<{ item: type.Post }> = ({ item }) => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.user)

  // We use state to keep the post values reactive
  const [post, setPost] = useState({
    title: item.title,
    body: item.body,
    upvotes: item.upvotes,
    downvotes: item.downvotes,
    id: item.id,
    type: item.type,
  })

  const handleVote = (direction: 'up' | 'down') => async () => {
    try {
      const data = await vote(user, post.type, post.id, direction)
      setPost(data.post)
      dispatch(updateUser(data.user))
    } catch (error) {
      console.error(`❌ Vote request failed: ${error}`)
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
        </div>
        <div>
          <p>{post.body}</p>
        </div>
      </div>
    </div>
  )
}

export default Post
