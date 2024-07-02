'use client'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { removeUser } from '@/store/slices/user'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Header() {
  // get user from store
  const userStore = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  const [user, setUser] = useState(userStore)

  useEffect(() => {
    setUser(userStore)
  }, [userStore])

  const handleLogout = () => {
    dispatch(removeUser())
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }
  return (
    <>
      {user.id ? (
        <div>
          <span>{user.username}</span>
          {' | '}
          <Link href='/profile'>Profile</Link>
          {' | '}
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <Link href='/login'>Login</Link> <Link href='/register'>Register</Link>
        </div>
      )}
      <br />
    </>
  )
}
