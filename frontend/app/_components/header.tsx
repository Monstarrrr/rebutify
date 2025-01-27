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
import { mediaQuery, tokens } from '@/styles/tokens'
// eslint-disable-next-line no-restricted-imports
import styles from './header.module.scss'

const Nav = styled.nav`
  background: ${tokens.color.primaryWeak};
  display: flex;
  padding: 12px 16px;

  ${(mediaQuery[0], mediaQuery[1])} {
    padding: 12px 32px;
  }
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
              <div className={styles.linksWrapper} key={`${href}-${label}`}>
                <Link href={href}>
                  <Button
                    label={label}
                    disabled={pathName === href}
                    outlined={href === '/login' || href === '/profile'}
                  />
                </Link>
              </div>
            )
          })}
          {user.id && (
            <Button
              styles={{ fontSize: '18px', marginLeft: '12px' }}
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
