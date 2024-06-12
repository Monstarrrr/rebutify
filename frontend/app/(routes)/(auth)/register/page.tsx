'use client'

import { FormEvent, useState } from 'react'
import api from '@/api'
import Form from '@/components/form'
import { TextInputType } from '@/types/inputs'
import { formDataToObj } from '@/helpers/formDataToObj'
import { useAppSelector } from '@/store/hooks'

export default function Register() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [apiFormErrors, setApiFormErrors] = useState<ApiResponseType | null>(null)
  const [formSuccess, setFormSuccess] = useState(false)
  const user = useAppSelector((state) => state.user)

  const registerInputs: TextInputType[] = [
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

    const data = formDataToObj(event)

    try {
      await api.post('/auth/users', {
        ...data,
      })
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

      {/* 
        We show the username to demonstrate that the user registered
        through the API and their data was updated in the Redux store
      */}
      <p>user.username:</p>
      <pre>{JSON.stringify(user.username, null, 2)}</pre>

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
