'use client'
import { vote } from '@/api/vote'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateUser } from '@/store/slices/user'
import * as type from '@/types'
import { useState } from 'react'
import Button from '@/components/button'
import styled from 'styled-components'
import Icon from '@/components/icon'

const PostContainer = styled.div`
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
`

const PostBody = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const VoteContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const VoteValue = styled.div`
  margin: 0 8px;
`

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
    type: item.type,
  })

  const handleVote = (direction: 'up' | 'down') => async () => {
    try {
      const { data } = await vote(user, post.type, post.id, direction)
      setPost(data.resources.post)
      dispatch(updateUser(data.resources.user))
    } catch (error: any) {
      setVoteError(error && 'Vote request failed')
      console.error(`❌ Vote request failed: ${error}`)
    }
  }

  return (
    <PostContainer>
      {post.title && (
        <div>
          <h1>{post.title}</h1>
        </div>
      )}
      <PostBody>
        <VoteContainer>
          <Button
            onClick={handleVote('up')}
            styles={{ background: 'transparent' }}
            icon={<Icon label='arrow' />}
          />
          <VoteValue>{post.upvotes - post.downvotes}</VoteValue>
          <Button
            onClick={handleVote('down')}
            styles={{ background: 'transparent' }}
            icon={<Icon label='arrow' direction='down' />}
          />
          {voteError && <p>{voteError}</p>}
        </VoteContainer>
        <div>
          <p>{post.body}</p>
        </div>
      </PostBody>
    </PostContainer>
  )
}

export default Post
