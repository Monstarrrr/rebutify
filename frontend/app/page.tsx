'use client'
import { useAppSelector } from '@/store/hooks'
import Link from 'next/link'
import { Form, List, PostCard } from '@/components'
import type { Post, TextInput } from '@/types'
import { FormEvent, useEffect, useState } from 'react'
import { createPost, getPosts } from '@/api/posts'
import { formDataToObj } from '@/helpers'
import styled from 'styled-components'

const newArgumentInputs: TextInput[] = [
  {
    id: 'title',
    label: 'Argument title',
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
  },
]
const submitButtonLabel = 'Create post'
const successMessage = 'New post created successfully!'

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100%;
  padding: 20px;
`

const WelcomeTitle = styled.h1`
  margin: 12vh auto;
  font-size: 3rem;
  text-align: center;
`

const FormWrapper = styled.div`
  display: flex;
  margin: 0 auto calc(10vh + 24px);
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

const ListWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`

const ListTitle = styled.h2`
  margin: 0 auto 24px;
`

export default function Home() {
  const isLogged = useAppSelector((state) => !!state.user.username)
  const [loading, setLoading] = useState(false)
  const [apiErrors, setApiErrors] = useState(null)
  const [success, setSuccess] = useState(false)

  const [allPosts, setAllPosts] = useState<Post[]>([])

  // Fetch all 'arguments' posts
  useEffect(() => {
    let fetchApi = async () => {
      try {
        const response = await getPosts('argument')
        setAllPosts(response)
      } catch (error: any) {
        console.error('# Error fetching posts: ', error.response.data)
      }
    }
    fetchApi()
  }, [])

  async function handleSubmitArgument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setApiErrors(null)
    const formData = formDataToObj(event)

    try {
      await createPost({ ...formData }, 'argument')
      setLoading(false)
      setSuccess(true)
    } catch (error: any) {
      const { response } = error
      setLoading(false)
      setApiErrors(response)
    }
  }

  return (
    <Body>
      <WelcomeTitle>
        Answer,
        <br />
        Optimize,
        <br />
        Spread.
        <br />
      </WelcomeTitle>
      <FormWrapper>
        {isLogged ? (
          <Form
            submitButtonLabel={submitButtonLabel}
            id='new-argument'
            inputsErrors={apiErrors}
            inputsFields={newArgumentInputs}
            onSubmit={handleSubmitArgument}
            loading={loading}
            successMessage={success ? successMessage : null}
          />
        ) : (
          <div>
            <BtnLink href='/register'>Get started</BtnLink>
          </div>
        )}
      </FormWrapper>

      <ListWrapper>
        <ListTitle>All arguments</ListTitle>
        <List items={allPosts} Layout={PostCard} />
      </ListWrapper>
    </Body>
  )
}
