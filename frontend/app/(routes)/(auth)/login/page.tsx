'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Form } from '@/components'
import { ApiResponse, TextInput } from '@/types'
import { formDataToObj } from '@/helpers'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateUser } from '@/store/slices/user'
import { useRouter } from 'next/navigation'
import { login, fetchUserInfo } from '@/api/auth'

const loginInputs: TextInput[] = [
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
const submitButtonLabel = 'Login'
const successMessage = 'Logged in successfully.'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [apiErrors, setApiErrors] = useState<ApiResponse | null>(null)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const user = useAppSelector((state) => state.user.username)

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setApiErrors(null)
    const formData = formDataToObj(event)

    try {
      await login(formData)
      const userInfo = await fetchUserInfo()

      setLoading(false)
      setSuccess(true)
      dispatch(updateUser(userInfo))
      router.push('/')
    } catch (error: any) {
      setLoading(false)
      setApiErrors(
        error.response ?? {
          data: {
            detail:
              'An unknown error occurred. Please try again later. If the error persists, please contact the support.',
          },
          status: 401,
        },
      )
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
        successMessage={success ? successMessage : null}
        submitButtonLabel={submitButtonLabel}
      />
    </>
  )
}
