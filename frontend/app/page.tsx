'use client'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import Link from 'next/link'
import { Form } from '@/components'
import type { TextInput } from '@/types'
import { FormEvent, useState } from 'react'
import { newPost } from '@/api/posts'
import { formDataToObj } from '@/helpers'

// postTypeId: 1,
// acceptedAnswerId: null,
// parentId: null,
// creationDate: null,
// deletionDate: null,
// score: 0,
// viewCount: 0,
// body: '',

const newArgumentInputs: TextInput[] = [
  {
    id: 'title',
    label: 'Argument title',
    placeholder: 'Short title for the argument',
    value: '',
  },
  {
    id: 'body',
    label: 'Argument',
    placeholder: 'Enter the entire argument here',
    type: 'textarea',
    value: '',
  },
  {
    id: 'rebuttal',
    label: 'Rebuttal',
    placeholder: 'Enter your rebuttal here (leave blank to add it later)',
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setApiErrors(null)
    const formData = formDataToObj(event)

    try {
      await newPost(formData)
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
      {isLogged ? (
        <Form
          submitButtonLabel={submitButtonLabel}
          id='new-argument'
          inputsErrors={apiErrors}
          inputsFields={newArgumentInputs}
          onSubmit={handleSubmit}
          loading={loading}
          successMessage={success ? successMessage : null}
        />
      ) : (
        <p>
          <Link href='/register'>Register</Link> to start sharing your rebuttals!
        </p>
      )}
    </>
  )
}
