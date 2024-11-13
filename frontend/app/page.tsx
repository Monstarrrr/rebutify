'use client'
import { useAppSelector } from '@/store/hooks'
import Link from 'next/link'
import { Form, List, PostCard, Button } from '@/components'
import type { Post, TextInput } from '@/types'
import { FormEvent, useEffect, useState } from 'react'
import { createPost, getPosts } from '@/api/posts'
import { formDataToObj } from '@/helpers'
import styled from 'styled-components'

const newArgumentInputs: TextInput[] = [
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
  },
]
const successMessage = 'New post created successfully!'

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  padding: 20px;
`

const WelcomeContainer = styled.div`
  height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const Title = styled.h2`
  text-align: left;
  font-size: 36px;
  margin-bottom: 32px;
`
const Subtitle = styled.h1`
  font-size: 54px;
`

const FormWrapper = styled.div`
  display: flex;
  height: calc(50vh - 70px);
  max-width: 640px;
  width: 100%;
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
  const [loading, setLoading] = useState<boolean>(false)
  const [apiErrors, setApiErrors] = useState(null)
  const [success, setSuccess] = useState<boolean>(false)

  const [allPosts, setAllPosts] = useState<Post[]>([])

  const fetchArguments = async () => {
    try {
      const response = await getPosts('argument')
      setAllPosts(response)
    } catch (error: any) {
      console.error('# Error fetching posts: ', error.response.data)
    }
  }

  // Fetch onLoad
  useEffect(() => {
    fetchArguments()
  }, [])

  // re-fetch on success
  useEffect(() => {
    if (success) {
      fetchArguments()
    }
  }, [success])

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
      <WelcomeContainer>
        <Title>Rebutify</Title>
        <Subtitle>
          Submit arguments,
          <br />
          Optimize their rebuttals.
        </Subtitle>
      </WelcomeContainer>
      <FormWrapper>
        {isLogged ? (
          <Form
            id='new-argument'
            inputsErrors={apiErrors}
            inputsFields={newArgumentInputs}
            onSubmit={handleSubmitArgument}
            loading={loading}
            success={success}
            setSuccess={setSuccess}
          >
            <Button
              style={{ marginTop: '10px' }}
              label={'Submit argument'}
              loading={loading}
              success={success}
              successMessage={successMessage}
            />
          </Form>
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
