'use client'
import { vote } from '@/api/vote'
import { deletePost, editPost } from '@/api/posts'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateUser } from '@/store/slices/user'
import * as type from '@/types'
import { useState } from 'react'
import { Button, Icon } from '@/components'
import { useRouter } from 'next/navigation'
import {
  ActionsStyle,
  ContentStyle,
  EditInput,
  PostBody,
  PostContainer,
  VoteContainer,
  VoteValue,
} from '@/components/postStyles'
import Link from 'next/link'

const Post: React.FC<{ item: type.Post }> = ({ item }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const user = useAppSelector((state) => state.user)
  const [voteError, setVoteError] = useState<boolean | null>(null)
  const [isEditing, setIsEditing] = useState(false)
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
  const [prevBody, setPrevBody] = useState(post.body)

  const handleVote = (direction: 'up' | 'down') => async () => {
    try {
      const data = await vote(user, post.type, post.id, direction)
      setPost(data.resources.post)
      dispatch(updateUser(data.resources.user))
    } catch (error: any) {
      setVoteError(true)
      console.error(`❌ Vote request failed: ${error}`)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const wasArgument = post.type === 'argument'
      const res = await deletePost(id)
      console.log(`# Delete rebuttal - response :`, res)
      if (wasArgument) {
        router.push('/')
      }
    } catch (error: any) {
      console.log(`❌ Delete rebuttal failed: ${error}`)
    }
  }

  const handleSave = async (title: string, body: string) => {
    try {
      const res = await editPost(post.type, post.id, { title: title, body: body })
      console.log(`# Edit post - response :`, res)
      setPrevBody(body)
      setIsEditing(false)
    } catch (error: any) {
      console.log(`❌ Edit post failed: ${error}`)
    }
  }

  const handleCancel = () => {
    setPost({ ...post, body: prevBody })
    setIsEditing(false)
  }

  return (
    <>
      <PostContainer>
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
        </VoteContainer>
        <PostBody>
          <ContentStyle>
            {post.type == 'argument' && post.title && (
              <div>
                <h1>{post.title}</h1>
              </div>
            )}
            <p>{!isEditing && post.body}</p>
          </ContentStyle>
          {isEditing && (
            <>
              <EditInput
                value={post.body}
                onChange={(e) => setPost({ ...post, body: e.target.value })}
              />
              <Button
                label='Save'
                onClick={() => handleSave(post.title, post.body)}
              />
              <Button label='Cancel' onClick={() => handleCancel()} />
            </>
          )}
          {user.id === post.ownerUserId && (
            <ActionsStyle>
              <div>
                {!isEditing && (
                  <Button label='Edit' onClick={() => setIsEditing(!isEditing)} />
                )}
              </div>
              <div>
                <Button label='Delete' onClick={() => handleDelete(post.id)} />
              </div>
            </ActionsStyle>
          )}
        </PostBody>
      </PostContainer>
      {voteError && (
        <>
          <Link href='/login'>
            <Button label='Login' />
          </Link>
          <span> to interact with this post</span>
        </>
      )}
    </>
  )
}

export default Post
