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
import { editEmail } from '@/api/auth/editEmail'
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
  background-color: #353535;
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
  const [editPassErrors, setEditPassErrors] = useState<AxiosResponse | null>(null)
  const [editPassLoading, setEditPassLoading] = useState(false)

  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [editEmailSuccess, setEditEmailSuccess] = useState<string | null>(null)
  const [editEmailLoading, setEditEmailLoading] = useState(false)
  const [editEmailErrors, setEditEmailErrors] = useState<AxiosResponse | null>(
    null,
  )

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
        console.error(
          '# Error fetching posts: ',
          error?.response?.data ?? error?.response ?? error,
        )
      }
    }
    fetchApi()
  }, [user.id])

  useEffect(() => {
    // We remove errors when we stop/start editing the email
    setEditEmailErrors(null)
  }, [isEditingEmail])

  const handleIsEditingEmail = () => {
    setIsEditingEmail(true)
  }
  const handleEditEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEditEmailLoading(true)
    const { email } = formDataToObj(e)
    try {
      await editEmail(email)
      setEditEmailLoading(false)
      setEditEmailSuccess('Email updated')
      setIsEditingEmail(false)
    } catch (error: any) {
      setEditEmailLoading(false)
      setEditEmailErrors(error?.response)
      console.error(error.response ?? error)
    }
  }

  const handleEditPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEditPassSuccess(null)
    setEditPassLoading(true)
    const { current_password, new_password } = formDataToObj(e)
    try {
      await editPassword(current_password, new_password)
      setEditPassSuccess('Password updated')
      setEditPassLoading(false)
    } catch (error: any) {
      setEditPassLoading(false)
      setEditPassErrors(
        error.response ?? {
          data: {
            detail:
              'An unknown error occurred. Please try again later. If the error persists, please contact the support.',
          },
          code: 401,
        },
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
      console.error(error?.response)
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
                  {isEditingEmail ? (
                    <td>
                      <Form
                        id='edit-email'
                        inputsFields={[
                          {
                            id: 'email',
                            label: 'Editing email',
                            type: 'email',
                            placeholder: 'user@email.com',
                            value: user.email,
                          },
                        ]}
                        onSubmit={handleEditEmail}
                        success={editEmailSuccess}
                        setSuccess={setEditEmailSuccess}
                        loading={editEmailLoading}
                        inputsErrors={editEmailErrors}
                      >
                        <Button
                          label='Save'
                          success={editEmailSuccess}
                          loading={editEmailLoading}
                        />
                        <Button
                          label='Cancel'
                          onClick={(_) => setIsEditingEmail(false)}
                          transparent
                        />
                      </Form>
                    </td>
                  ) : (
                    <td>
                      {user.email}
                      <Button
                        styles={{ marginLeft: '8px' }}
                        label='Edit'
                        onClick={handleIsEditingEmail}
                        transparent
                      />
                    </td>
                  )}
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
                    id: 'current_password',
                    label: 'Current password',
                    type: 'password',
                    placeholder: '****************',
                    value: '',
                  },
                  {
                    id: 'new_password',
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
                inputsErrors={editPassErrors}
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
