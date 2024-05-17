'use client'

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
      const data = await fetch('localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
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
        value='kminchelle'
        required
      />
      <input
        type='password'
        name='password'
        placeholder='Password'
        value='0lelplR'
        required
      />
      <button type='submit'>Login</button>
    </form>
  )
}
