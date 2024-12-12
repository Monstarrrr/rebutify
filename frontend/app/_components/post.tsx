'use client'
import { vote } from '@/api/vote'
import { createPost, deletePost, editPost } from '@/api/posts'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateUser } from '@/store/slices/user'
import * as type from '@/types'
import { FormEvent, useState } from 'react'
import { Button, Form, Icon, Comments } from '@/components'
import { useRouter } from 'next/navigation'
import {
  ActionsStyle,
  ContentStyle,
  PostInner,
  PostContainer,
  VoteContainer,
  VoteValue,
} from '@/components/postStyles'
import Link from 'next/link'
import { formDataToObj } from '@/helpers'
import { SectionStyle } from '@/styles'

const Post: React.FC<{ item: type.Post }> = ({ item }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const user = useAppSelector((state) => state.user)
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
  const [voteError, setVoteError] = useState<boolean | null>(null)
  const [prevBody, setPrevBody] = useState(post.body)
  const [isEditing, setIsEditing] = useState(false)
  const [editPostLoading, setEditPostLoading] = useState(false)
  const [editPostSuccess, setEditPostSuccess] = useState<string | null>(null)
  const [editPostError, setEditPostError] = useState(null)

  const [commentSuccess, setCommentSuccess] = useState<string | null>(null)

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

  const handleEditPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEditPostLoading(true)
    const { title, body } = formDataToObj(e)
    try {
      const res = await editPost(post.type, post.id, { title: title, body: body })
      console.log(`# Edit post - response :`, res)
      setPrevBody(body)
      setEditPostLoading(false)
      setIsEditing(false)
    } catch (error: any) {
      setEditPostLoading(false)
      setEditPostError(error?.response)
      console.log(`❌ Edit post failed: ${error}`)
    }
  }

  const handleCancel = () => {
    setPost({ ...post, body: prevBody })
    setIsEditing(false)
  }

  const handleComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = formDataToObj(e)
    try {
      const res = await createPost(formData, 'comment', post.id)
      console.log(`# Create comment - response :`, res)
      setCommentSuccess('Comment created')
    } catch (error: any) {
      console.log(`❌ Create comment failed: ${error}`)
    }
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
        <PostInner>
          <ContentStyle>
            {post.type == 'argument' && post.title && (
              <div>
                <h1>{post.title}</h1>
              </div>
            )}
            {isEditing ? (
              <SectionStyle>
                <Form
                  id='editPost'
                  inputsFields={[
                    {
                      type: 'textarea',
                      label: `Editing ${post.type}`,
                      id: 'editPostBody',
                      value: post.body,
                      placeholder: 'Plants feel pain',
                    },
                  ]}
                  inputsErrors={editPostError}
                  onSubmit={handleEditPost}
                  loading={editPostLoading}
                  success={editPostSuccess}
                  setSuccess={setEditPostSuccess}
                >
                  <Button
                    label='Save'
                    success={editPostSuccess}
                    loading={editPostLoading}
                  />
                  <Button
                    label='Cancel'
                    onClick={() => handleCancel()}
                    transparent
                  />
                </Form>
              </SectionStyle>
            ) : (
              <p>{post.body}</p>
            )}
          </ContentStyle>
          {user.id === post.ownerUserId && (
            <ActionsStyle>
              {!isEditing && (
                <div>
                  <Button
                    label='Edit'
                    transparent
                    onClick={() => setIsEditing(!isEditing)}
                  />
                </div>
              )}
              <div>
                <Button
                  label='Delete'
                  transparent
                  onClick={() => handleDelete(post.id)}
                />
              </div>
            </ActionsStyle>
          )}
          {/* Comments */}
          <SectionStyle>
            <Comments parentPostId={post.id} />
            <Form
              id='comment'
              inputsFields={[
                {
                  id: 'body',
                  placeholder: 'I think it could be better if ...',
                  type: 'textarea',
                  label: 'Comment',
                },
              ]}
              inputsErrors={null}
              onSubmit={handleComment}
              loading={false}
              success={null}
              setSuccess={setCommentSuccess}
            >
              <Button label='Comment' success={commentSuccess} />
            </Form>
          </SectionStyle>
        </PostInner>
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
