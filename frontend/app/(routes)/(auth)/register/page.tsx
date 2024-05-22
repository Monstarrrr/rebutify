'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/app/_api/api'
import Form from '@/app/_components/form'
import { TextInputType } from '@/app/_types/inputs'

export default function Register() {
  const router = useRouter()

  const registerInputs: TextInputType[] = [
    {
      id: 'username',
      placeholder: 'Username',
      defaultValue: 'test',
    },
    {
      id: 'email',
      placeholder: 'Email',
      type: 'email',
      defaultValue: 'test@test.com',
    },
    {
      id: 'password',
      placeholder: 'Password',
      type: 'password',
      defaultValue: 'test',
    },
    {
      id: 're_password',
      placeholder: 'Confirm password',
      type: 'password',
      defaultValue: 'test',
    },
  ]
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [inputs, setInputs] = useState(registerInputs)
  const [formErrors, setFormErrors] = useState<Record<
    string,
    string
  > | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setFormErrors(null)

    const formData = new FormData(event.currentTarget)
    const username = formData.get('email')
    const email = formData.get('email')
    const password = formData.get('password')
    const re_password = formData.get('re_password')

    try {
      const { data } = await api.post('/auth/users', {
        username,
        email,
        password,
        re_password,
      })
      setIsLoading(false)
      setInputs(data)
    } catch (error: any) {
      setIsLoading(false)
      const { data } = error.response
      setFormErrors(data)
    }
  }

  return (
    <>
      <h1>Register</h1>
      <Form inputs={inputs} errors={formErrors} onSubmit={handleSubmit} />
      {isLoading && <p>Loading...</p>}
    </>
  )
}
