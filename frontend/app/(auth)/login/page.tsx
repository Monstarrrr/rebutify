'use client'

import { FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')
    const password = formData.get('password')

    const response = await fetch(
      'https://dummyjson.com/auth/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      },
    )

    if (response.ok) {
      alert('Login successful')
      router.push('/')
    } else {
      throw new Error('Failed to login')
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
