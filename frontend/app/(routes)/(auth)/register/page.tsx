'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/app/_api/api'
import Form from '@/app/_components/form'
import { InputType } from '@/app/_types/inputs'

export default function Register() {
  const router = useRouter()

  const registerInputs: InputType[] = [
    {
      id: 'username',
      label: 'Username',
      type: 'text',
    },
    {
      id: 'email',
      label: 'Email',
      type: 'email',
    },
    {
      id: 'password1',
      label: 'Password',
      type: 'password',
    },
    {
      id: 'password2',
      label: 'Confirm password',
      type: 'password',
    },
  ]

  const [apiResponse, setApiResponse] = useState<Response | null>(
    null,
  )
  const [isLoading, setLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<Object | null>(null)

  useEffect(() => {
    console.log('# apiResponse :', apiResponse)
  }, [apiResponse])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrors(null)

    const formData = new FormData(event.currentTarget)
    const username = formData.get('email')
    const email = formData.get('email')
    const password1 = formData.get('password1')
    const password2 = formData.get('password2')

    try {
      const { data } = await api.post('/auth/users', {
        username,
        email,
        password1,
        password2,
      })
      setApiResponse(data)
      console.log('# data :', data)
    } catch (error: any) {
      const { errors } = error.response.data
      setErrors(errors)
    }
  }

  return (
    <>
      <Form inputs={registerInputs} onSubmit={handleSubmit} />
      {errors && (
        <ul>
          {Object.entries(errors).map(([key, value]) => (
            <li key={key}>{value}</li>
          ))}
        </ul>
      )}
    </>
  )
}
