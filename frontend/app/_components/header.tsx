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
import { mediaQuery } from '@/styles/tokens'

const Nav = styled.nav`
  background: #1f1f1f;
  display: flex;
  padding: 12px 32px;
`

const LeftBlock = styled.div`
  align-items: start;
  flex: 1;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
`
const RightBlock = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const BrandLabel = styled.span`
  display: none;
  font-size: 34px;
  font-weight: bold;
  position: relative;
  top: 1px;
  left: -7px;
  color: #fff;
  ${mediaQuery[0]} {
    display: initial;
  }
`

const LinkWrapper = styled.div`
  margin: 0 8px;
`

export default function Header() {
  // get user from store
  const userStore = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  const [user, setUser] = useState(userStore)
  const pathName = usePathname()

  const links: NavLink[] = [
    { href: '/profile', label: user.username, withAuth: true },
    { href: '/login', label: 'Login', withAuth: false, requiresNoAuth: true },
    {
      href: '/register',
      label: 'Register',
      withAuth: false,
      requiresNoAuth: true,
    },
  ]

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
          <Link style={{ display: 'flex', textDecoration: 'none' }} href='/'>
            <Image
              width={50}
              height={50}
              src='/images/logo-white.png'
              alt='logo'
            />
            <BrandLabel>ebutify</BrandLabel>
          </Link>
        </LeftBlock>

        <RightBlock>
          {links.map(({ href, label, withAuth, requiresNoAuth }) => {
            if (withAuth && !user.id) return null
            if (requiresNoAuth && user.id) return null
            return (
              <LinkWrapper key={`${href}-${label}`}>
                <Link href={href}>
                  <Button
                    label={label}
                    styles={{
                      opacity: pathName === href ? 0.6 : 1,
                      pointerEvents: pathName === href ? 'none' : 'auto',
                    }}
                    transparent={href === '/login' || href === '/profile'}
                  />
                </Link>
              </LinkWrapper>
            )
          })}
          {user.id && (
            <Button
              styles={{ fontSize: '18px' }}
              onClick={handleLogout}
              label='Logout'
            />
          )}
          <br />
        </RightBlock>
      </Nav>
    </>
  )
}
