'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/app/_api/api'

type Error = {
  [index: string]: string
}

export default function Register() {
  const router = useRouter()

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
    <form onSubmit={handleSubmit}>
      <label>Username</label>
      <input
        type='text'
        name='Username'
        placeholder='Username'
        defaultValue='Monstar'
        required
      />
      <label>Email</label>
      <input
        type='text'
        name='email'
        placeholder='Email'
        defaultValue='monstar.dev@protonmail.com'
        required
      />
      <label>Password</label>
      <input
        type='password'
        name='password1'
        placeholder='Password'
        defaultValue='dnZQUicqz1r7sZaXPX70'
        required
      />
      <label>Confirm password</label>
      <input
        type='password'
        name='password2'
        placeholder='Confirm password'
        defaultValue='dnZQUicqz1r7sZaXPX70'
        required
      />
      <button type='submit'>Register</button>
      {errors && (
        <ul>
          {Object.entries(errors).map(([key, value]) => (
            <li key={key}>{value}</li>
          ))}
        </ul>
      )}
    </form>
  )
}
