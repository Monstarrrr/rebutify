'use client'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { removeUser } from '@/store/slices/user'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { NavLink } from '@/types/NavLink'

const links: NavLink[] = [
  { href: '/', label: 'Home', requiresAuth: false },
  { href: '/profile', label: 'Profile', requiresAuth: true },
  { href: '/login', label: 'Login', requiresAuth: false, requiresNoAuth: true },
  {
    href: '/register',
    label: 'Register',
    requiresAuth: false,
    requiresNoAuth: true,
  },
]

export default function Header() {
  // get user from store
  const userStore = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  const [user, setUser] = useState(userStore)
  const pathName = usePathname()

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
      <nav>
        {links.map(({ href, label, requiresAuth, requiresNoAuth }) => {
          if (requiresAuth && !user.id) return null
          if (requiresNoAuth && user.id) return null
          return (
            <span key={`${href}-${label}`}>
              <Link
                style={{
                  opacity: pathName === href ? 0.6 : 1,
                  pointerEvents: pathName === href ? 'none' : 'auto',
                  textDecoration: pathName === href ? 'none' : 'underline',
                }}
                href={href}
              >
                {label}
              </Link>
              {` | `}
            </span>
          )
        })}
        {user.id && <button onClick={handleLogout}>Logout</button>}
        <br />
      </nav>
    </>
  )
}
