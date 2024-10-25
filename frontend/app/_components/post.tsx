'use client'
import { vote } from '@/api/vote'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addDownvote, addUpvote } from '@/store/slices/user'
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
  })

  const handleVote = (direction: 'up' | 'down') => async () => {
    try {
      // We update the actual post
      await vote('argument', post.id, direction)
      // We update the post state
      if (direction === 'up') {
        setPost({
          ...post,
          [`upvotes`]: post[`upvotes`] + 1,
          // We remove a downvote if the user downvoted
          [`downvotes`]:
            post[`downvotes`] - (user.downvotedPosts.includes(post.id) ? 1 : 0),
        })
      } else {
        setPost({
          ...post,
          // We remove an upvote if the user upvoted
          [`upvotes`]:
            post[`upvotes`] - (user.upvotedPosts.includes(post.id) ? 1 : 0),
          [`downvotes`]: post[`downvotes`] + 1,
        })
      }
      // We update the user state
      if (direction === 'up') {
        dispatch(addUpvote(post.id))
        // We remove a downvote if the user downvoted
        user.upvotedPosts.includes(post.id) && dispatch(addDownvote(post.id))
      } else {
        dispatch(addDownvote(post.id))
        // We remove an upvote if the user upvoted
        user.downvotedPosts.includes(post.id) && dispatch(addUpvote(post.id))
      }
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
