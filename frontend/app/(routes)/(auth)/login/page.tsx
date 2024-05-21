'use client'

import api from '@/app/_api/api'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()

  const [apiResponse, setApiResponse] = useState<Response | null>(
    null,
  )
  const [isLoading, setLoading] = useState<boolean>(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')
    const password = formData.get('password')

    try {
      const { data } = await api.post('/api/login', {
        username,
        password,
      })
      setApiResponse(data)
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        name='username'
        placeholder='Username'
        defaultValue='monstar.dev@protonmail.com'
        required
      />
      <input
        type='password'
        name='password'
        placeholder='Password'
        defaultValue='dnZQUicqz1r7sZaXPX70'
        required
      />
      <button type='submit'>Login</button>
    </form>
  )
}
