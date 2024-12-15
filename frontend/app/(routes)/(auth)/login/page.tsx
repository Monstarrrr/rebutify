'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Form, Button } from '@/components'
import { TextInput } from '@/types'
import { formDataToObj } from '@/helpers'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateUser } from '@/store/slices/user'
import { useRouter } from 'next/navigation'
import { login, fetchUserInfo } from '@/api/auth'
import { SectionStyle } from '@/styles'
import { AxiosResponse } from 'axios'

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

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [apiErrors, setApiErrors] = useState<AxiosResponse | null>(null)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const user = useAppSelector((state) => state.user.id)

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
      setSuccess(null)
      dispatch(updateUser(userInfo))
      router.push('/')
    } catch (error: any) {
      setLoading(false)
      console.log(`# login error :`, error)
      setApiErrors(
        error.response ?? {
          data: {
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
      <h1 style={{ marginBottom: '12px' }}>Login</h1>
      <SectionStyle>
        <Form
          id='login-form'
          inputsFields={loginInputs}
          inputsErrors={apiErrors}
          onSubmit={handleSubmit}
          loading={loading}
          success={success}
          setSuccess={setSuccess}
        >
          <Button size='max' loading={loading} label={submitButtonLabel} />
        </Form>
      </SectionStyle>
    </>
  )
}
