'use client'
// eslint-disable-next-line no-restricted-imports
import styles from './post.module.scss'
import * as type from '@/types'
import React, { FormEvent, useState } from 'react'
import { vote } from '@/api/vote'
import { createPost, deletePost, editPost } from '@/api/posts'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateUser } from '@/store/slices/user'
import {
  Button,
  Form,
  Icon,
  LoginBlocker,
  Comments,
  Follow,
  ReputationBlocker,
  Tag,
} from '@/components'
import { useRouter } from 'next/navigation'
import { formDataToObj, ServerErrorMessage } from '@/helpers'
import { AxiosResponse } from 'axios'
import { tokens } from '@/styles/tokens'

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
    isPending: item?.isPending,
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
    user.reputation > 0 && setIsCommenting(state)
  }
  return (
    <>
      <div className={styles.postContainer}>
        {post.type !== 'argument' && (
          <div className={styles.leftContainer}>
            <Button
              label=''
              onClick={handleVote('up')}
              styles={{ background: 'transparent' }}
              icon={<Icon name='arrow' />}
            />
            <div className={styles.voteValue}>
              {post.upvotes - post.downvotes}
            </div>
            <Button
              label=''
              onClick={handleVote('down')}
              styles={{ background: 'transparent' }}
              icon={<Icon name='arrow' direction='down' />}
            />
          </div>
        )}
        <div className={styles.rightContainer}>
          <div className={styles.contentStyle}>
            {post.isPending && (
              <div className={styles.pendingContainer}>
                <Tag />
              </div>
            )}
            {post.type == 'argument' && post.title && (
              <div>
                <h1>{post.title}</h1>
              </div>
            )}
            {isEditingBody ? (
              <div className={styles.editPost}>
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
              </div>
            ) : (
              <p className={styles.postBody}>{post.body}</p>
            )}
          </div>
          {/* Actions */}
          {user.id && !isEditingBody && (
            <div className={styles.actionsContainer}>
              {user.id === post.ownerUserId && (
                <>
                  <div>
                    <Button
                      label='Edit'
                      outlined
                      onClick={() => setIsEditingBody(!isEditingBody)}
                      color={tokens.color.secondary}
                    />
                  </div>
                  {post.type !== 'argument' && (
                    <div>
                      <Button
                        label='Delete'
                        transparent
                        onClick={() => handleDelete(post.id)}
                        color={tokens.color.secondary}
                      />
                    </div>
                  )}
                </>
              )}
              <Follow
                postId={post.id}
                postType={post.type}
                undo={user.followedPosts.includes(post.id) ? true : false}
              />
              <br />
              {voteError && post.ownerUserId !== user.id && (
                <LoginBlocker action={'vote'} />
              )}
              {voteError && post.ownerUserId === user.id && (
                <span style={{ color: 'red', flexBasis: '100%' }}>
                  You cannot vote on your own {post.type}{' '}
                </span>
              )}
            </div>
          )}
          {/* Comments */}
          <h4 className={styles.commentsLabel}>Comments</h4>
          <div className={styles.commentsContainer}>
            <Comments
              setComments={setComments}
              comments={comments}
              parentPostId={post.id}
            />
            {(isCommenting && (
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
            )) ||
              (user.id && (
                <>
                  <Button
                    loading={commentLoading}
                    success={commentSuccess}
                    outlined
                    disabled={user.reputation < 1}
                    label={`Add a comment${user.reputation < 1 ? '*' : ''}`}
                    onClick={() => handleCommentsVisibility(true)}
                  />
                  {user.reputation < 1 && (
                    <div className={styles.reputationBlockerContainer}>
                      <ReputationBlocker action={'comment'} />
                    </div>
                  )}
                </>
              )) || <LoginBlocker action={'comment'} />}
          </div>
        </div>
      </div>
    </>
  )
}

export default Post
