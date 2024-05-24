'use client'

import api from '@/app/_api/api'
import { FormEvent, useState } from 'react'
import Form from '@/app/_components/form'
import { TextInputType } from '@/app/_types/inputs'

export default function Login() {
  const [apiErrors, setApiErrors] = useState<ApiResponseType | null>(null)
  const loginInputs: TextInputType[] = [
    {
      defaultValue: 'test',
      id: 'username',
      placeholder: 'Username',
    },
    {
      defaultValue: 'test',
      id: 'password',
      placeholder: 'Password',
      type: 'password',
    },
  ]

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')
    const password = formData.get('password')

    try {
      const { data } = await api.post('/auth/jwt/create', {
        password,
        username,
      })
      console.log('# data :', data)
    } catch (error: any) {
      const { response } = error
      setApiErrors(response)
      console.log('# error :', error)
    }
  }

  return (
    <>
      <Form
        inputsFields={loginInputs}
        inputsErrors={apiErrors}
        onSubmit={handleSubmit}
        buttonLabel='Login'
      />
    </>
  )
}
