'use client'
import { vote } from '@/api/vote'
import { createPost, deletePost, editPost } from '@/api/posts'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateUser } from '@/store/slices/user'
import * as type from '@/types'
import React, { FormEvent, useState } from 'react'
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

  const [isEditingBody, setIsEditingBody] = useState(false)
  const [editBodyLoading, setEditBodyLoading] = useState(false)
  const [editBodySuccess, setEditBodySuccess] = useState<string | null>(null)
  const [editBodyError, setEditBodyError] = useState(null)

  const [isCommenting, setIsCommenting] = useState(false)
  const [comments, setComments] = useState<type.Post[]>([])
  const [commentLoading, setCommentLoading] = useState(false)
  const [commentSuccess, setCommentSuccess] = useState<string | null>(null)
  const [commentErrors, setCommentErrors] = useState<AxiosResponse | null>(null)

  const handleVote = (direction: 'up' | 'down') => async () => {
    if (post.ownerUserId === user.id) {
      console.error(`❌ User tried voting on own post`)
      setVoteError(true)
      return
    }
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

  const handleEditPostBody = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEditBodyLoading(true)
    const { title, body } = formDataToObj(e)
    try {
      await editPost(post.type, post.id, { title: title, body: body })
      setPrevBody(body)
      setPost({ ...post, body })
      setEditBodyLoading(false)
      setEditBodySuccess('Post edited successfully')
      setTimeout(() => {
        setIsEditingBody(false)
      }, 50) // Hahahahaha
      setTimeout(() => {
        setEditBodySuccess(null)
      }, 1000)
    } catch (error: any) {
      setEditBodyLoading(false)
      setEditBodyError(error?.response)
      console.log(`❌ Edit post failed: ${error}`)
    }
  }

  const handleCancel = () => {
    setPost({ ...post, body: prevBody })
    setIsEditingBody(false)
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
        </VoteContainer>
        <InnerStyle>
          <ContentStyle>
            {post.type == 'argument' && post.title && (
              <div>
                <h1>{post.title}</h1>
              </div>
            )}
            {isEditingBody ? (
              <SectionStyle>
                <Form
                  id={`editPost-${post.id}`}
                  inputsFields={[
                    {
                      type: 'textarea',
                      label: `Editing ${post.type}`,
                      id: 'body',
                      value: post.body,
                      placeholder: 'Plants feel pain',
                    },
                  ]}
                  inputsErrors={editBodyError}
                  onSubmit={handleEditPostBody}
                  loading={editBodyLoading}
                  success={editBodySuccess}
                  setSuccess={setEditBodySuccess}
                >
                  <Button
                    label='Save'
                    success={editBodySuccess}
                    loading={editBodyLoading}
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
                {!isEditingBody && (
                  <div>
                    <Button
                      label='Edit'
                      transparent
                      onClick={() => setIsEditingBody(!isEditingBody)}
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
            {user.id && (
              <Follow
                postId={post.id}
                undo={user.followedPosts.includes(post.id) ? true : false}
              />
            )}
            <br />
            {voteError && post.ownerUserId !== user.id && (
              <LoginBlocker action={'vote'} />
            )}
            {voteError && post.ownerUserId === user.id && (
              <span style={{ color: 'red', flexBasis: '100%' }}>
                You cannot vote on your own {post.type}{' '}
              </span>
            )}
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
