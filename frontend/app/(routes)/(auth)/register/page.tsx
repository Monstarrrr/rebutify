'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Form } from '@/components'
import { TextInput } from '@/types'
import { formDataToObj, ServerErrorMessage } from '@/helpers'
import { register } from '@/api/auth/register'
import { useAppSelector } from '@/store/hooks'
import { useRouter } from 'next/navigation'
import Button from '@/components/button'
// eslint-disable-next-line no-restricted-imports
import styles from './page.module.scss'
import { AxiosResponse } from 'axios'
import Link from 'next/link'

export default function Register() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [apiFormErrors, setApiFormErrors] = useState<AxiosResponse | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)
  const user = useAppSelector((state) => state.user.id)
  const router = useRouter()

  const registerInputs: TextInput[] = [
    {
      id: 'username',
      label: 'Username',
      placeholder: 'JohnDoe',
      value: '',
    },
    {
      id: 'email',
      label: 'Email',
      placeholder: 'your@email.com',
      type: 'email',
      value: '',
    },
    {
      id: 'password',
      label: 'Password',
      placeholder: '**************',
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
      setFormSuccess('Account created, check your email.')
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
      <div className={styles.container}>
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
            className={styles.button}
          />
        </Form>
      </div>
      <div style={{ marginTop: '8px' }}>
        <Link href='/login' style={{ color: 'grey' }}>
          Already have an account?
        </Link>
      </div>
    </>
  )
}
