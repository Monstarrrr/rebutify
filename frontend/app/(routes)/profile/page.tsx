'use client'
import { deleteSelfAccount } from '@/api/auth'
import { useAppSelector } from '@/store/hooks'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Profile() {
  const user = useAppSelector((state) => state.user)
  const [password, setPassword] = useState('')
  const router = useRouter()

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
      router.push('/')
    } catch (error: any) {
      console.error('no')
    }
  }

  return (
    <div>
      <h1>Profile</h1>
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
      <input onChange={handlePassword} type='password' placeholder='Password' />
      <button style={{ background: 'red' }} onClick={handleDelete}>
        Delete account
      </button>
    </div>
  )
}
