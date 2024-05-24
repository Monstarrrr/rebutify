'use client'

import api from '@/app/_api/api'
import { FormEvent } from 'react'
import Form from '@/app/_components/form'
import { TextInputType } from '@/app/_types/inputs'

export default function Login() {
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
      const { data } = await api.post('auth/token/login', {
        password,
        username,
      })
      console.log('# data :', data)
    } catch (error) {
      console.log('# error :', error)
    }
  }

  return (
    <Form
      inputs={loginInputs}
      apiErrors={null}
      onSubmit={handleSubmit}
      buttonLabel='Login'
    />
  )
}
