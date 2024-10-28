'use client'
import { vote } from '@/api/vote'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updatePostDownvotes, updatePostUpvotes } from '@/store/slices/user'
import * as type from '@/types'
import { useEffect, useState } from 'react'

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
    // Undoing a vote?
    console.log('The post id: ', post.id)
    console.log('user.upvotedPosts: ', user.upvotedPosts)
    if (
      (user.upvotedPosts.includes(post.id) && direction === 'up') ||
      (user.downvotedPosts.includes(post.id) && direction === 'down')
    ) {
      try {
        await vote(post.type, post.id, direction, true)
        // We remove the vote from the post
        setPost({
          ...post,
          [`${direction}votes`]: post[`${direction}votes`] - 1,
        })
        // We remove the vote from the user voted posts list
        direction === 'up'
          ? dispatch(updatePostUpvotes(['remove', post.id]))
          : dispatch(updatePostDownvotes(['remove', post.id]))
      } catch (error) {
        console.error(error)
      }
      // Not undoing a vote
    } else {
      try {
        await vote(post.type, post.id, direction)
        if (direction === 'up') {
          setPost({
            ...post,
            [`upvotes`]: post[`upvotes`] + 1,
            // We remove a downvote if the user downvoted before
            [`downvotes`]:
              post[`downvotes`] - (user.downvotedPosts.includes(post.id) ? 1 : 0),
          })
          dispatch(updatePostUpvotes(['add', post.id]))
          // We remove user downvote if the user downvoted before
          user.downvotedPosts.includes(post.id) &&
            dispatch(updatePostDownvotes(['remove', post.id]))
        }
        if (direction === 'down') {
          setPost({
            ...post,
            // We remove an upvote if the user upvoted before
            [`upvotes`]:
              post[`upvotes`] - (user.upvotedPosts.includes(post.id) ? 1 : 0),
            [`downvotes`]: post[`downvotes`] + 1,
          })
          dispatch(updatePostDownvotes(['add', post.id]))
          // We remove an upvote if the user upvoted before
          user.upvotedPosts.includes(post.id) &&
            dispatch(updatePostUpvotes(['remove', post.id]))
        }
      } catch (error) {
        console.error(`❌ Vote request failed: ${error}`)
      }
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
