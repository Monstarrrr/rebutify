'use client'
import { vote } from '@/api/vote'
import { createPost, deletePost, editPost } from '@/api/posts'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateUser } from '@/store/slices/user'
import * as type from '@/types'
import React, { FormEvent, useEffect, useState } from 'react'
import { Button, Form, Icon, LoginBlocker, Comments, Follow } from '@/components'
import { useRouter } from 'next/navigation'
import {
  ActionsStyle,
  ContentStyle,
  InnerStyle,
  PostContainer,
  VoteContainer,
  VoteValue,
} from '@/components/postStyles'
import { formDataToObj, ServerErrorMessage } from '@/helpers'
import { SectionStyle } from '@/styles'
import { AxiosResponse } from 'axios'

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

  const [isCommenting, setIsCommenting] = useState(false)
  const [comments, setComments] = useState<type.Post[]>([])
  const [commentLoading, setCommentLoading] = useState(false)
  const [commentSuccess, setCommentSuccess] = useState<string | null>(null)
  const [commentErrors, setCommentErrors] = useState<AxiosResponse | null>(null)

  useEffect(() => {
    console.log('# user', user)
  }, [user])

  const handleVote = (direction: 'up' | 'down') => async () => {
    try {
      const data = await vote(user, post.type, post.id, direction)
      setPost(data.resources.post)
      dispatch(updateUser(data.resources.user))
    } catch (error: any) {
      setVoteError(true) // make toast
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
    setCommentLoading(true)
    try {
      const res = await createPost(formData, 'comment', post.id)
      setComments((prev) => [...prev, res.data])
      setCommentSuccess('Comment created')
      setCommentLoading(false)
      setTimeout(() => {
        setIsCommenting(false)
      }, 50) // Hahahahaha
      setTimeout(() => {
        setCommentSuccess(null)
      }, 2000)
    } catch (error: any) {
      setCommentLoading(false)
      setCommentErrors(
        error?.response ?? {
          data: {
            detail: ServerErrorMessage,
          },
          status: 500,
        },
      )
      console.log(`❌ Create comment failed: ${error}`)
    }
  }

  const handleCommentsVisibility = (state: boolean) => {
    setIsCommenting(state)
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
        <InnerStyle>
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
          {/* Actions */}
          <ActionsStyle>
            {user.id === post.ownerUserId && (
              <>
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
              </>
            )}
            <Follow
              postId={post.id}
              undo={user.followedPosts.includes(post.id) ? true : false}
            />
            {voteError && <LoginBlocker action={'vote'} />}
          </ActionsStyle>
          {/* Comments */}
          <SectionStyle>
            <Comments
              setComments={setComments}
              comments={comments}
              parentPostId={post.id}
            />
            {isCommenting ? (
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
                inputsErrors={commentErrors}
                onSubmit={handleComment}
                loading={commentLoading}
                success={commentSuccess}
                setSuccess={setCommentSuccess}
              >
                <Button label='Submit' success={commentSuccess} />
                <Button
                  transparent
                  label='Cancel'
                  onClick={() => handleCommentsVisibility(false)}
                />
              </Form>
            ) : user.id ? (
              <Button
                loading={commentLoading}
                success={commentSuccess}
                transparent
                label='Add a comment'
                onClick={() => handleCommentsVisibility(true)}
              />
            ) : (
              <LoginBlocker action={'comment'} />
            )}
          </SectionStyle>
        </InnerStyle>
      </PostContainer>
    </>
  )
}

export default Post
