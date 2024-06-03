'use client'

import api from '@/_api/api'
import { FormEvent, useState } from 'react'
import Form from '@/components/form'
import { TextInputType } from '@/types/inputs'

export default function Login() {
  const [apiErrors, setApiErrors] = useState<ApiResponseType | null>(null)
  const loginInputs: TextInputType[] = [
    {
      id: 'username',
      placeholder: 'Username',
      value: 'test',
    },
    {
      id: 'password',
      placeholder: 'Password',
      type: 'password',
      value: 'test',
    },
  ]

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')
    const password = formData.get('password')

    try {
      await api.post('/auth/jwt/create', {
        password,
        username,
      })
    } catch (error: any) {
      const { response } = error
      setApiErrors(response)
    }
  }

  return (
    <>
      <Form
        id='login-form'
        inputsFields={loginInputs}
        inputsErrors={apiErrors}
        onSubmit={handleSubmit}
        buttonLabel='Login'
      />
    </>
  )
}
