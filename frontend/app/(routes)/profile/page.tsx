'use client'
import { Post } from '@/types'
import { deleteSelfAccount } from '@/api/auth'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getPosts } from '@/api/posts'
import { removeUser } from '@/store/slices/user'
import { List, PostCard } from '@/components'

export default function Profile() {
  const user = useAppSelector((state) => state.user)
  const [password, setPassword] = useState('')
  const router = useRouter()
  const [argumentsList, setArgumentsList] = useState<Post[]>([])
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!user.id) {
      window.location.href = '/login'
    }
  }, [user])

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }
  const handleDelete = async () => {
    try {
      password && (await deleteSelfAccount(password))
      dispatch(removeUser())
      router.push('/')
    } catch (error: any) {
      console.error(
        error.response?.data?.detail ??
          error.response?.data ??
          error.response ??
          error,
      )
    }
  }
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

  return (
    <div>
      <h1>Profile</h1>
      <hr />
      <br />
      <h2>My info</h2>
      <hr style={{ border: 'none', borderTop: '1px dotted black' }} />
      <br />
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
      <br />
      <h2>My posts</h2>
      <hr style={{ border: 'none', borderTop: '1px dotted black' }} />
      <br />
      <List items={argumentsList} Layout={PostCard} />
      <br />
      <h2>Settings</h2>
      <hr style={{ border: 'none', borderTop: '1px dotted black' }} />
      <br />
      <input onChange={handlePassword} type='password' placeholder='Password' />
      <button style={{ background: 'red' }} onClick={handleDelete}>
        Delete account
      </button>
    </div>
  )
}
