'use client'

import { FormEvent, useState } from 'react'
import api from '@/app/_api/api'
import Form from '@/app/_components/form'
import { TextInputType } from '@/app/_types/inputs'

export default function Register() {
  const registerInputs: TextInputType[] = [
    {
      defaultValue: 'test',
      id: 'username',
      placeholder: 'Username',
    },
    {
      defaultValue: 'test@test.com',
      id: 'email',
      placeholder: 'Email',
      type: 'email',
    },
    {
      defaultValue: 'test',
      id: 'password',
      placeholder: 'Password',
      type: 'password',
    },
  ]
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [apiFormErrors, setApiFormErrors] = useState<ApiResponseType | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setApiFormErrors(null)

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')
    const email = formData.get('email')
    const password = formData.get('password')
    const re_password = formData.get('re_password')

    try {
      await api.post('/auth/users', {
        email,
        password,
        re_password,
        username,
      })
      setIsLoading(false)
    } catch (error: any) {
      setIsLoading(false)
      const { response } = error
      setApiFormErrors(response)
    }
  }

  return (
    <>
      <h1>Register</h1>
      <Form
        buttonLabel='Register'
        inputsFields={registerInputs}
        inputsErrors={apiFormErrors}
        onSubmit={handleSubmit}
      />
      {isLoading && <p>Loading...</p>}
    </>
  )
}
