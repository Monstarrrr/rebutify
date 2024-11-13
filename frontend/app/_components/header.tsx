'use client'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { removeUser } from '@/store/slices/user'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { NavLink } from '@/types/NavLink'
import styled from 'styled-components'
import Image from 'next/image'
import { Button } from '@/components'

const links: NavLink[] = [
  { href: '/profile', label: 'Profile', requiresAuth: true },
  { href: '/login', label: 'Login', requiresAuth: false, requiresNoAuth: true },
  {
    href: '/register',
    label: 'Register',
    requiresAuth: false,
    requiresNoAuth: true,
  },
]

const Nav = styled.nav`
  border-bottom: 1px solid #f1f1f1;
  display: flex;
  padding: 4px 12px;
`

const LeftBlock = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`
const RightBlock = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const LinkWrapper = styled.div`
  margin: 0 8px;
`

const StyledLink = styled.a`
  text-decoration: none;
  color: #fff;
  margin: 0 8px;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
`

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
      <Nav>
        <LeftBlock>
          <Link href='/'>
            <Image
              width={50}
              height={50}
              src='/images/logo-white.png'
              alt='logo'
            />
          </Link>
        </LeftBlock>

        <RightBlock>
          {links.map(({ href, label, requiresAuth, requiresNoAuth }) => {
            if (requiresAuth && !user.id) return null
            if (requiresNoAuth && user.id) return null
            return (
              <LinkWrapper key={`${href}-${label}`}>
                <StyledLink
                  style={{
                    opacity: pathName === href ? 0.6 : 1,
                    pointerEvents: pathName === href ? 'none' : 'auto',
                  }}
                  href={href}
                >
                  {label}
                </StyledLink>
              </LinkWrapper>
            )
          })}
          {user.id && <Button onClick={handleLogout} label='Logout' />}
          <br />
        </RightBlock>
      </Nav>
    </>
  )
}
