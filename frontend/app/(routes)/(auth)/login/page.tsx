'use client'

import { FormEvent, useState } from 'react'
import Form from '@/components/form'
import { TextInputType } from '@/types/inputs'
import { formDataToObj } from '@/helpers/formDataToObj'
import { useAppDispatch } from '@/store/hooks'
import { updateUser } from '@/store/slices/user'
import { useRouter } from 'next/navigation'
import { login, getUserInfo } from '@/api/auth'

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

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [apiErrors, setApiErrors] = useState<ApiResponseType | null>(null)
  const dispatch = useAppDispatch()
  const router = useRouter()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setApiErrors(null)
    const formData = formDataToObj(event)

    try {
      await login(formData)
      const userInfo = await getUserInfo()

      setLoading(false)
      setSuccess(true)
      dispatch(updateUser(userInfo))
      router.push('/')
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
        successMessage={success ? successMessage : null}
        buttonLabel='Login'
      />
    </>
  )
}
