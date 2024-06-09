'use client'

import api from '@/api'
import { FormEvent, useState } from 'react'
import Form from '@/components/form'
import { TextInputType } from '@/types/inputs'
import { formDataToObj } from '@/helpers/formDataToObj'
import { useAppSelector } from '@/store/hooks'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [apiErrors, setApiErrors] = useState<ApiResponseType | null>(null)
  const user = useAppSelector((state) => state.user)

  const loginInputs: TextInputType[] = [
    {
      id: 'username',
      placeholder: 'Username',
      value: '',
    },
    {
      id: 'password',
      placeholder: 'Password',
      type: 'password',
      value: '',
    },
  ]
  const successMessage = 'Logged in successfully.'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setApiErrors(null)
    const formData = formDataToObj(event)

    try {
      await api.post('/auth/jwt/create', {
        ...formData,
      })
      setLoading(false)
      setSuccess(true)
    } catch (error: any) {
      const { response } = error
      setLoading(false)
      setApiErrors(response)
    }
  }

  return (
    <>
      {/* 
        We show the username to demonstrate that the user logged in
        through the API and their data was updated in the Redux store
      */}
      <pre>{JSON.stringify(user.username, null, 2)}</pre>

      <Form
        id='login-form'
        inputsFields={loginInputs}
        inputsErrors={apiErrors}
        onSubmit={handleSubmit}
        loading={loading}
        successMessage={success ? successMessage : null}
        buttonLabel='Login'
      />
    </>
  )
}
