'use client'
import { FormEvent, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { AxiosResponse } from 'axios'
import { Post } from '@/types'
import { formDataToObj } from '@/helpers'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { getPosts } from '@/api/posts'
import { editPassword, deleteSelfAccount } from '@/api/auth'
import { removeUser } from '@/store/slices/user'
import { Button, Form, List, PostCard } from '@/components'
import { H2, H3 } from '@/styles'

const Container = styled.div`
  display: flex;
  gap: 28px;
`

const Left = styled.div`
  flex: 1;
`
const Right = styled.div`
  flex: 1;
`

const Title = styled.h1`
  font-size: 3.51rem;
`

const H2Section = styled.div`
  background-color: #3d3d3d;
  border-radius: 14px;
  padding: 24px;
`

const H3Section = styled.div`
  padding-bottom: 34px;

  &:last-child {
    padding-bottom: 0;
  }
`

const Hr = styled.hr`
  margin: 12px 0;
`

export default function Profile() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.user)
  const [argumentsList, setArgumentsList] = useState<Post[]>([])
  const [deleteAccError, setDeleteAccError] = useState<AxiosResponse | null>(null)
  const [deleteAccLoading, setDeleteAccLoading] = useState(false)
  const [deleteAccSuccess, setDeleteAccSuccess] = useState<string | null>(null)
  const [editPassSuccess, setEditPassSuccess] = useState<string | null>(null)
  const [editPassLoading, setEditPassLoading] = useState(false)

  useEffect(() => {
    console.log(`# user  :`, user)
    if (!user.id) {
      router.push('/login')
    }
  }, [user, router])

  useEffect(() => {
    let fetchApi = async () => {
      try {
        let response = await getPosts('argument')
        response = response.filter((post: Post) => post.ownerUserId === user.id)
        console.log(`# response :`, response)
        setArgumentsList(response)
      } catch (error: any) {
        console.error('# Error fetching posts: ', error.response.data)
      }
    }
    fetchApi()
  }, [user.id])

  const handleEditPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEditPassSuccess(null)
    setEditPassLoading(true)
    const { currentPassword, newPassword } = formDataToObj(e)
    try {
      await editPassword(currentPassword, newPassword)
      setEditPassSuccess('Password updated')
      setEditPassLoading(false)
    } catch (error: any) {
      setEditPassLoading(false)
      console.error(
        error.response?.data?.detail ??
          error.response?.data ??
          error.response ??
          error,
      )
    }
  }

  const handleDelete = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setDeleteAccError(null)
    setDeleteAccSuccess(null)
    setDeleteAccLoading(true)
    const { password } = formDataToObj(e)
    try {
      password && (await deleteSelfAccount(password))
      dispatch(removeUser())
      setDeleteAccSuccess('Account deleted')
      setDeleteAccLoading(false)
      router.push('/')
    } catch (error: any) {
      setDeleteAccLoading(false)
      setDeleteAccError(error?.response)
      console.error(
        error.response?.data?.detail ??
          error.response?.data ??
          error.response ??
          error,
      )
    }
  }

  return (
    <>
      <Title>Profile</Title>
      <Container>
        <Left>
          <H2>My info</H2>
          <H2Section>
            <table>
              <tbody>
                <tr>
                  <td>
                    <b>Username:</b>
                  </td>
                  <td>{user.username}</td>
                </tr>
                <tr>
                  <td>
                    <b>Email:</b>
                  </td>
                  <td>{user.email}</td>
                </tr>
              </tbody>
            </table>
          </H2Section>

          <H2>Settings</H2>
          <H2Section>
            <H3>Change password</H3>
            <Hr />

            <H3Section>
              <Form
                id='edit-password'
                inputsFields={[
                  {
                    id: 'currentPassword',
                    label: 'Current password',
                    type: 'password',
                    placeholder: '****************',
                    value: '',
                  },
                  {
                    id: 'newPassword',
                    label: 'New password',
                    type: 'password',
                    placeholder: '*********************',
                    value: '',
                  },
                ]}
                onSubmit={handleEditPassword}
                loading={editPassLoading}
                success={editPassSuccess}
                setSuccess={setEditPassSuccess}
                inputsErrors={deleteAccError}
              >
                <Button
                  label='Change password'
                  loading={editPassLoading}
                  success={editPassSuccess}
                />
              </Form>
            </H3Section>

            <H3>Delete account</H3>
            <Hr />

            <H3Section>
              <Form
                id='delete-account'
                inputsFields={[
                  {
                    id: 'password',
                    label: 'Password',
                    type: 'password',
                    placeholder: '****************',
                    required: true,
                    value: '',
                  },
                ]}
                onSubmit={handleDelete}
                loading={deleteAccLoading}
                success={deleteAccSuccess}
                setSuccess={setDeleteAccSuccess}
                inputsErrors={deleteAccError}
              >
                <Button
                  success={deleteAccSuccess}
                  loading={deleteAccLoading}
                  label='Delete account'
                  styles={
                    !deleteAccSuccess
                      ? {
                          background: 'red',
                          color: 'black',
                        }
                      : {}
                  }
                />
              </Form>
            </H3Section>
          </H2Section>
        </Left>
        <Right>
          <H2>My posts</H2>
          <H2Section>
            {argumentsList.length === 0 ? (
              <p style={{ textAlign: 'center', fontStyle: 'italic' }}>
                No posts yet
              </p>
            ) : (
              <List items={argumentsList} Layout={PostCard} />
            )}
          </H2Section>
        </Right>
      </Container>
    </>
  )
}
