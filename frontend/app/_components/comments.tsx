'use client'
import * as type from '@/types'
import { deletePost, getPosts } from '@/api/posts'
import { useEffect, useState } from 'react'
import { EmptySectionStyle } from '@/styles'
import styled from 'styled-components'
import { useAppSelector } from '@/store/hooks'
import { Button } from '@/components'
import { AxiosResponse } from 'axios'
import { ServerErrorMessage } from '@/helpers'
// eslint-disable-next-line no-restricted-imports
import styles from './comments.module.scss'
import { tokens } from '@/styles/tokens'

const AuthorStyle = styled.span`
  opacity: 0.7;
  pointer-events: none;
  margin-left: 6px;
`

const DateStyle = styled.span`
  font-style: italic;
  opacity: 0.7;
  pointer-events: none;
  margin-left: 6px;
`

export default function Comments({
  parentPostId,
  setComments,
  comments,
}: {
  parentPostId: string
  setComments: React.Dispatch<React.SetStateAction<type.Post[]>>
  comments: type.Post[]
}) {
  const user = useAppSelector((state) => state.user)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<AxiosResponse | null>(null)
  const [loadingCommentId, setLoadingCommentId] = useState<string | null>(null)

  useEffect(() => {
    const fetchApi = async () => {
      setCommentsLoading(true)
      try {
        const comments = await getPosts('comment', parentPostId)
        setComments(comments)
        setCommentsLoading(false)
      } catch (error: any) {
        setCommentsLoading(false)
        console.error(
          '# "Get comments" request failed: ',
          error.response?.data?.detail ??
            error.response?.data ??
            error.response ??
            error,
        )
      }
    }
    fetchApi()
  }, [parentPostId, setComments])

  const handleDeleteComment = async (commentId: string) => {
    setLoadingCommentId(commentId)
    try {
      await deletePost(commentId)
      setComments(comments.filter((comment) => comment.id !== commentId))
      setLoadingCommentId(null)
    } catch (error: any) {
      setLoadingCommentId(null)
      setDeleteError(
        error?.response ?? {
          data: {
            detail: ServerErrorMessage,
          },
          status: 500,
        },
      )
      console.error(`❌ Delete comment failed: ${error}`)
    }
  }

  return (
    <div className={styles.commentsContainer}>
      {comments.length === 0 ? (
        commentsLoading ? (
          <p>Loading comments...</p>
        ) : (
          <EmptySectionStyle>No comments yet</EmptySectionStyle>
        )
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className={styles.commentContainer}>
            <p
              style={{
                marginRight: '8px',
                display: 'inline',
              }}
            >
              <span>{`\"${comment?.body ?? 'Empty comment'}\"`}</span>
              <AuthorStyle>
                - {comment?.ownerUser?.username ?? 'Anonymous'}
              </AuthorStyle>
              <DateStyle>
                {`(${new Date(comment.created).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })})`}
              </DateStyle>
            </p>
            {user.id === comment.ownerUserId && (
              <Button
                key={comment.id}
                loading={loadingCommentId === comment.id}
                transparent
                color={tokens.color.secondary}
                label='Delete'
                onClick={() => {
                  handleDeleteComment(comment.id)
                }}
              />
            )}
            {deleteError && <p>{deleteError.data.detail}</p>}
          </div>
        ))
      )}
    </div>
  )
}
