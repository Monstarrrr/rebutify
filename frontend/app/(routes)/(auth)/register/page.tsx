'use client'

import { FormEvent, useState } from 'react'
import { Form } from '@/components'
import { ApiResponse, TextInput } from '@/types'
import { formDataToObj } from '@/helpers'
import { register } from '@/api/auth/register'

export default function Register() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [apiFormErrors, setApiFormErrors] = useState<ApiResponse | null>(null)
  const [formSuccess, setFormSuccess] = useState(false)

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setApiFormErrors(null)
    setFormSuccess(false)

    const formData = formDataToObj(event)

    try {
      register(formData)
      setIsLoading(false)
      setFormSuccess(true)
    } catch (error: any) {
      setIsLoading(false)
      const { response } = error
      setApiFormErrors(response)
    }
  }

  return (
    <>
      <h1>Register</h1>
      <Form
        id='register-form'
        buttonLabel='Register'
        inputsFields={registerInputs}
        inputsErrors={apiFormErrors}
        onSubmit={handleSubmit}
        successMessage={formSuccess ? successMessage : undefined}
      />
      {isLoading && <p>Loading...</p>}
    </>
  )
}
