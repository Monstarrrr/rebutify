'use client'
import { FormEvent, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { AxiosResponse } from 'axios'
import { Post } from '@/types'
import { formDataToObj, ServerErrorMessage } from '@/helpers'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { getPosts } from '@/api/posts'
import { editPassword, deleteSelfAccount } from '@/api/auth'
import { editEmail } from '@/api/auth/editEmail'
import { removeUser } from '@/store/slices/user'
import { Button, Form, List, PostCard } from '@/components'
import { H2, H3 } from '@/styles'
import { mediaQuery } from '@/styles/tokens'
// eslint-disable-next-line no-restricted-imports
import styles from './page.module.scss'

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  ${mediaQuery[1]} {
    flex-wrap: initial;
  }
`

const Left = styled.div`
  flex: 1;
  flex-basis: initial;
  ${mediaQuery[1]} {
    flex-basis: 100%;
  }
`
const Right = styled.div`
  flex: 1;
  flex-basis: 100%;
`

const Title = styled.h1`
  font-size: 3.51rem;
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
  const [rebuttalsList, setRebuttalsList] = useState<Post[]>([])

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
    let fetchApi = async () => {
      try {
        let allPosts = await getPosts()
        const allOwnPosts = allPosts.filter(
          (post: Post) => post.ownerUserId === user.id,
        )
        const selfRebuttals = allOwnPosts.filter(
          (post: Post) => post.type === 'rebuttal',
        )
        const selfArguments = allOwnPosts.filter(
          (post: Post) => post.type === 'argument',
        )
        setArgumentsList(selfArguments)
        setRebuttalsList(selfRebuttals)
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
    setEditEmailSuccess(null)
    setIsEditingEmail(true)
  }
  const handleEditEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEditEmailLoading(true)
    const { email } = formDataToObj(e)
    try {
      await editEmail(email)
      setEditEmailLoading(false)
      setEditEmailSuccess('Email updated, please check your inbox.')
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
            detail: ServerErrorMessage,
          },
          status: 500,
        },
      )
    }
  }

  const handleDelete = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setDeleteAccError(null)
    setDeleteAccSuccess(null)
    setDeleteAccLoading(true)
    const { current_password } = formDataToObj(e)
    try {
      if (!current_password) {
        throw new Error('current_password field id not found')
      }
      await deleteSelfAccount(current_password)
      dispatch(removeUser())
      setDeleteAccSuccess('Account deleted')
      setDeleteAccLoading(false)
      router.push('/')
    } catch (error: any) {
      setDeleteAccLoading(false)
      setDeleteAccError(error?.response)
      console.error(error?.response ?? error)
    }
  }

  const handleLogout = () => {
    dispatch(removeUser())
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    router.push('/')
  }

  return (
    <>
      <Title>Profile</Title>
      <Container>
        <Left>
          <H2>My info</H2>
          <div className={styles.userInfoContainer}>
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
                    <b>Reputation:</b>
                  </td>
                  <td>{user.reputation}</td>
                </tr>
                <tr>
                  <td>
                    <b>Joined on:</b>
                  </td>
                  <td style={{ opacity: 0.7, fontStyle: 'italic' }}>
                    (coming soon...)
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Achievements:</b>
                  </td>
                  <td>Prototype tester (Joined during the v0.1 of Rebutify)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <H2>Settings</H2>
          <div className={styles.settingsContainer}>
            <H3>Change email</H3>
            <Hr />
            <H3Section>
              {isEditingEmail ? (
                <>
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
                      outlined
                    />
                  </Form>
                </>
              ) : (
                <>
                  {user.email}
                  <Button
                    styles={{ marginLeft: '8px' }}
                    label='Edit'
                    onClick={handleIsEditingEmail}
                    outlined
                  />
                  <p style={{ color: 'green' }}>{editEmailSuccess}</p>
                </>
              )}
            </H3Section>
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
                    id: 'current_password',
                    label: 'Password',
                    type: 'password',
                    placeholder: '****************',
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

            <H3>Sign off</H3>
            <Hr />
            <H3Section>
              <Button onClick={handleLogout} label='Logout' />
            </H3Section>
          </div>
        </Left>
        <Right>
          <H2>My posts</H2>
          <div className={styles.postsContainer}>
            {argumentsList.length === 0 ? (
              <p style={{ textAlign: 'center', fontStyle: 'italic' }}>
                No posts yet
              </p>
            ) : (
              <>
                {rebuttalsList.length !== 0 && (
                  <div className={styles.postListContainer}>
                    <h3 style={{ marginBottom: '6px', marginLeft: '12px' }}>
                      Your rebuttals ({rebuttalsList.length}) :
                    </h3>
                    <List
                      items={rebuttalsList}
                      displayCounter={false}
                      Layout={PostCard}
                      layoutClassName={styles.postCard}
                    />
                  </div>
                )}
                {argumentsList.length !== 0 && (
                  <div className={styles.postListContainer}>
                    <h3 style={{ marginBottom: '6px', marginLeft: '12px' }}>
                      Your arguments ({argumentsList.length}) :
                    </h3>
                    <List
                      items={argumentsList}
                      Layout={PostCard}
                      layoutClassName={styles.postCard}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </Right>
      </Container>
    </>
  )
}
