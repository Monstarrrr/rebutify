'use client'
import * as type from '@/types'
import { deletePost, getPosts } from '@/api/posts'
import { useEffect, useState } from 'react'
import { EmptySectionStyle } from '@/styles'
import styled from 'styled-components'
import { useAppSelector } from '@/store/hooks'
import { Button } from '@/components'
import { AxiosResponse } from 'axios'

const CommentSectionStyle = styled.div`
  background-color: #353535;
  border-radius: 14px;
  padding: 8px;
  margin-bottom: 8px;
`

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

export default function Comments({ parentPostId }: { parentPostId: string }) {
  const user = useAppSelector((state) => state.user)
  const [comments, setComments] = useState<type.Post[]>([])
  const [deleteError, setDeleteError] = useState<AxiosResponse | null>(null)
  const [loadingCommentId, setLoadingCommentId] = useState<string | null>(null)

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const comments = await getPosts('comment', parentPostId)
        setComments(comments)
      } catch (error: any) {
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
  }, [parentPostId])

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
            detail: error.message,
          },
          status: 500,
        },
      )
      console.error(`❌ Delete comment failed: ${error}`)
    }
  }

  return (
    <CommentSectionStyle>
      {comments.length === 0 ? (
        <EmptySectionStyle>No comments yet</EmptySectionStyle>
      ) : (
        comments.map((comment) => (
          <div key={comment.id}>
            <p
              style={{
                marginRight: '8px',
                display: 'inline',
              }}
            >
              <span>{comment.body}</span>
              <AuthorStyle>- Anonymous</AuthorStyle>
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
                label='Delete'
                onClick={() => {
                  handleDeleteComment(comment.id)
                }}
              />
            )}
            {deleteError && <p>{deleteError.data.detail}</p>}
            <hr />
          </div>
        ))
      )}
    </CommentSectionStyle>
  )
}
