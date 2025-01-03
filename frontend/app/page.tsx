'use client'
import { useAppSelector } from '@/store/hooks'
import Link from 'next/link'
import { Form, List, PostCard, Button, Icon } from '@/components'
import type { Post } from '@/types'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { createPost, getPosts } from '@/api/posts'
import { formDataToObj, useMediaQuery } from '@/helpers'
import styled from 'styled-components'
import { breakpoints, mediaQuery } from '@/styles/tokens'
// eslint-disable-next-line no-restricted-imports
import styles from './page.module.css'
import { SectionStyle } from '@/styles'

const FirstSection = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 28px;
  height: initial;
  justify-content: center;
  padding: 38px;
  ${mediaQuery[1]} {
    flex-direction: row;
    height: calc(100dvh - 54px - 24px);
    padding: 128px;
  }
`

const WelcomeContainer = styled.div`
  height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 3;
  margin-bottom: 52px;
`

const Subtitle = styled.h1`
  font-size: 54px;
`

const BtnLink = styled(Link)`
  background-color: #3d6aff;
  border: none;
  color: #fff;
  font-size: 1.1rem;
  padding: 12px 20px;
  border-radius: 99px;
  cursor: pointer;
  text-decoration: none;
`

const MidSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`

const ListWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 38px;
`

export default function Home() {
  const isLogged = useAppSelector((state) => !!state.user.username)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [apiErrors, setApiErrors] = useState(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [allPosts, setAllPosts] = useState<Post[]>([])
  const isDesktop = useMediaQuery(breakpoints[1])

  // Fetch onLoad
  useEffect(() => {
    const fetchArguments = async () => {
      try {
        console.log(`getting all posts`)
        const response = await getPosts('argument')
        setAllPosts(response)
      } catch (error: any) {
        console.error('# Error fetching posts: ', error)
      }
    }
    fetchArguments()
  }, [])

  const handleSubmitArgument = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setApiErrors(null)
    const formData = formDataToObj(event)

    try {
      const res = await createPost({ ...formData }, 'argument')
      setLoading(false)
      setSuccess('Post created successfully!')
      setAllPosts((prev) => [res.data, ...prev])
    } catch (error: any) {
      const { response } = error
      setLoading(false)
      setApiErrors(response)
    }
  }

  const handleScroll: () => void = () => {
    scrollRef.current &&
      scrollRef.current.scrollIntoView({
        behavior: 'smooth',
      })
  }

  return (
    <>
      <FirstSection>
        <WelcomeContainer>
          <Subtitle>
            Submit arguments,
            <br />
            Optimize their rebuttals.
          </Subtitle>
        </WelcomeContainer>

        <div className={styles.formContainer}>
          {isLogged ? (
            <Form
              id='new-argument'
              inputsErrors={apiErrors}
              inputsFields={[
                {
                  id: 'title',
                  label: 'Title',
                  placeholder: 'Plants are alive too!',
                  value: '',
                },
                {
                  id: 'body',
                  label: 'Argument',
                  placeholder:
                    "If vegans don't eat meat, why do they eat plants? They are living beings too!",
                  type: 'textarea',
                  value: '',
                  className: styles.argumentTextArea,
                },
              ]}
              onSubmit={handleSubmitArgument}
              loading={loading}
              success={success}
              setSuccess={setSuccess}
              floating
            >
              <Button
                label={'Submit argument'}
                loading={loading}
                success={success}
                size={isDesktop ? 'min' : 'max'}
              />
            </Form>
          ) : (
            <div>
              <BtnLink href='/register'>Get started</BtnLink>
            </div>
          )}
        </div>
      </FirstSection>
      <MidSection>
        <Button
          className={styles.btnScroll}
          styles={{
            position: 'absolute',
            top: '-100px',
            border: 'none',
          }}
          onClick={handleScroll}
          transparent
          icon={
            <Icon
              size={{ width: '32px', height: '32px' }}
              label='arrow'
              direction='down'
            />
          }
        />
      </MidSection>
      <ListWrapper ref={scrollRef}>
        <SectionStyle className={styles.sectionStyleOverride}>
          <h2 className={styles.h2}>All arguments</h2>
          <List items={allPosts} Layout={PostCard} className={styles.list} />
        </SectionStyle>
      </ListWrapper>
      <Link
        href='https://testingTheDeadLinkGithubHook.com'
        style={{ visibility: 'hidden' }}
      />
    </>
  )
}
