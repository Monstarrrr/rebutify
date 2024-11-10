'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Form } from '@/components'
import { ApiResponse, TextInput } from '@/types'
import { formDataToObj } from '@/helpers'
import { register } from '@/api/auth/register'
import { useAppSelector } from '@/store/hooks'
import { useRouter } from 'next/navigation'
import Button from '@/components/button'

export default function Register() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [apiFormErrors, setApiFormErrors] = useState<ApiResponse | null>(null)
  const [formSuccess, setFormSuccess] = useState(false)
  const user = useAppSelector((state) => state.user.id)
  const router = useRouter()

  const registerInputs: TextInput[] = [
    {
      id: 'username',
      placeholder: 'Username',
      value: '',
    },
    {
      id: 'email',
      placeholder: 'Email',
      type: 'email',
      value: '',
    },
    {
      id: 'password',
      placeholder: 'Password',
      type: 'password',
      value: '',
    },
  ]
  const successMessage = 'Check your email to verify your account.'

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setApiFormErrors(null)
    setFormSuccess(false)

    const formData = formDataToObj(event)

    try {
      await register(formData)
      setIsLoading(false)
      setFormSuccess(true)
    } catch (error: any) {
      setIsLoading(false)
      setApiFormErrors(
        error.response ?? {
          formData: {
            detail:
              'An unknown error occurred. Please try again later. If the error persists, please contact the support.',
          },
          code: 401,
        },
      )
    }
  }

  return (
    <>
      <h1>Register</h1>
      <Form
        id='register-form'
        loading={isLoading}
        inputsFields={registerInputs}
        inputsErrors={apiFormErrors}
        onSubmit={handleSubmit}
        successMessage={formSuccess ? successMessage : undefined}
      >
        <Button label={'Register'} loading={isLoading} />
      </Form>
      {isLoading && <p>Loading...</p>}
    </>
  )
}
