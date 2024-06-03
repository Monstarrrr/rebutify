'use client'

import api from '@/_api/api'
import { FormEvent, useState } from 'react'
import Form from '@/components/form'
import { TextInputType } from '@/types/inputs'
import { formDataToObj } from '@/_helpers/formDataToObj'

export default function Login() {
  const [loading, setLoading] = useState(false)

  const [apiErrors, setApiErrors] = useState<ApiResponseType | null>(null)
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
    } catch (error: any) {
      const { response } = error
      setLoading(false)
      setApiErrors(response)
    }
  }

  return (
    <>
      <Form
        id='login-form'
        inputsFields={loginInputs}
        inputsErrors={apiErrors}
        onSubmit={handleSubmit}
        loading={loading}
        buttonLabel='Login'
      />
    </>
  )
}
