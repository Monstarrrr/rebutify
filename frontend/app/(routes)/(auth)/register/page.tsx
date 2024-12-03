'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Form } from '@/components'
import { TextInput } from '@/types'
import { formDataToObj } from '@/helpers'
import { register } from '@/api/auth/register'
import { useAppSelector } from '@/store/hooks'
import { useRouter } from 'next/navigation'
import Button from '@/components/button'
import { Page } from '@/styles'
import { AxiosResponse } from 'axios'

export default function Register() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [apiFormErrors, setApiFormErrors] = useState<AxiosResponse | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)
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

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setApiFormErrors(null)
    setFormSuccess(null)

    const formData = formDataToObj(event)

    try {
      const { data } = await register(formData)
      setIsLoading(false)
      setFormSuccess(data.message)
    } catch (error: any) {
      setIsLoading(false)
      setApiFormErrors(
        error ?? {
          data: {
            code: 500,
            message:
              'An unknown error occurred. Please try again later. If the error persists, please contact the support.',
          },
        },
      )
    }
  }

  return (
    <Page>
      <h1>Register</h1>
      <Form
        id='register-form'
        loading={isLoading}
        inputsFields={registerInputs}
        inputsErrors={apiFormErrors}
        onSubmit={handleSubmit}
        success={formSuccess}
        setSuccess={setFormSuccess}
      >
        <Button label={'Register'} success={formSuccess} loading={isLoading} />
      </Form>
    </Page>
  )
}
