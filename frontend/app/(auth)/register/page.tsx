'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Register() {
  const router = useRouter()

  const [apiResponse, setApiResponse] = useState<Response | null>(
    null,
  )
  const [isLoading, setLoading] = useState<boolean>(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')

    try {
      const data = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
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
        type='email'
        name='email'
        placeholder='Email'
        defaultValue='monstar.dev@protonmail.com'
        required
      />
      <input
        type='password'
        name='password'
        placeholder='Password'
        defaultValue='123'
        required
      />
      <button type='submit'>Register</button>
      <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
    </form>
  )
}
