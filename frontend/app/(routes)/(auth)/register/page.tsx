'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Form } from '@/components'
import { TextInput } from '@/types'
import { formDataToObj, ServerErrorMessage } from '@/helpers'
import { register } from '@/api/auth/register'
import { useAppSelector } from '@/store/hooks'
import { useRouter } from 'next/navigation'
import Button from '@/components/button'
import { SectionStyle } from '@/styles'
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
      console.log(`# data FROM REGISTER :`, data)
      setFormSuccess("Account created, check your email.")
    } catch (error: any) {
      setIsLoading(false)
      setApiFormErrors(
        error ?? {
          status: 500,
          data: {
            message: ServerErrorMessage,
          },
        },
      )
    }
  }

  return (
    <>
      <h1 style={{ marginBottom: '12px' }}>Register</h1>
      <SectionStyle>
        <Form
          id='register-form'
          loading={isLoading}
          inputsFields={registerInputs}
          inputsErrors={apiFormErrors}
          onSubmit={handleSubmit}
          success={formSuccess}
          setSuccess={setFormSuccess}
        >
          <Button
            size='max'
            label={'Register'}
            success={formSuccess}
            loading={isLoading}
          />
        </Form>
      </SectionStyle>
    </>
  )
}
