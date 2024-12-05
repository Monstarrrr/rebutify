'use client'
import { Post } from '@/types'
import { deleteSelfAccount } from '@/api/auth'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { getPosts } from '@/api/posts'
import { removeUser } from '@/store/slices/user'
import { Button, Form, List, PostCard } from '@/components'
import { Page } from '@/styles'
import styled from 'styled-components'
import { AxiosResponse } from 'axios'
import { formDataToObj } from '@/helpers'
import { editPassword } from '@/api/auth'

const Title = styled.h1`
  font-size: 3.51rem;
  margin: 12px auto 0;
`
const H2 = styled.h2`
  margin: 18px auto 8px;
  font-size: 2rem;
`
const H2Section = styled.div`
  background-color: #3d3d3d;
  border-radius: 14px;
  padding: 12px;
`

const H3 = styled.h3`
  margin: 0 0 12px;
`
const H3Section = styled.div`
  margin-bottom: 24px;
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
      window.location.href = '/login'
    }
  }, [user])

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
      console.log(`# currentPassword :`, currentPassword)
      console.log(`# newPassword :`, newPassword)
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
    <Page>
      <Title>Profile</Title>
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

      <H2>My posts</H2>
      <H2Section>
        {argumentsList.length === 0 ? (
          <p style={{ textAlign: 'center', fontStyle: 'italic' }}>No posts yet</p>
        ) : (
          <List items={argumentsList} Layout={PostCard} />
        )}
      </H2Section>

      <H2>Settings</H2>
      <H2Section>
        <H3>Change password</H3>
        <H3Section>
          <Form
            id='edit-password'
            inputsFields={[
              {
                id: 'currentPassword',
                type: 'password',
                placeholder: 'Old password',
                required: true,
                value: '',
              },
              {
                id: 'newPassword',
                type: 'password',
                placeholder: 'New password',
                required: true,
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
        <H3Section>
          <Form
            id='delete-account'
            inputsFields={[
              {
                id: 'password',
                type: 'password',
                placeholder: 'Password',
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
    </Page>
  )
}
