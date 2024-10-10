'use client'
import { useAppSelector } from '@/store/hooks'
import Link from 'next/link'
import { Form, List, PostCard } from '@/components'
import type { Post, TextInput } from '@/types'
import { FormEvent, useEffect, useState } from 'react'
import { createPost, getPosts } from '@/api/posts'
import { formDataToObj } from '@/helpers'

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
    <>
      <h2>Welcome to Rebutify!</h2>
      <br />
      <h1>
        Rebutify is a platform for sharing rebuttals to common arguments against
        veganism.
      </h1>
      <br />
      <h3>
        Have you heard a common argument against veganism to which you want to
        provide a rebuttal?
      </h3>
      <br />
      <br />
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
        <p>
          <Link href='/register'>Register</Link> or{' '}
          <Link href='/login'>login</Link> to start sharing your rebuttals!
        </p>
      )}
      <br />
      <br />
      <hr />
      <h2>All arguments</h2>
      <hr />
      <List items={allPosts} Layout={PostCard} />
    </>
  )
}
