'use client'
import { FormEvent, useState } from 'react'
import { Form, Button } from '@/components'
import { TextInput } from '@/types'
import { formDataToObj, ServerErrorMessage } from '@/helpers'
// eslint-disable-next-line no-restricted-imports
import styles from './page.module.scss'
import { AxiosResponse } from 'axios'
import { requestPasswordReset } from '@/api/auth'
import Link from 'next/link'

const forgotPasswordInputs: TextInput[] = [
  {
    id: 'email',
    placeholder: 'your@email.com',
    label: 'Email',
    type: 'email',
    value: '',
  },
]

const submitButtonLabel = 'Send Reset Link'

export default function Forgot() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [apiErrors, setApiErrors] = useState<AxiosResponse | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setApiErrors(null)

    const formData = formDataToObj(event)

    try {
      // Replace with your actual API call
      await requestPasswordReset({ email: formData.email })
      setLoading(false)
      setSuccess('Password reset instructions have been sent to your email')
    } catch (error: any) {
      setLoading(false)
      setApiErrors(
        error.response ?? {
          data: {
            detail: ServerErrorMessage,
          },
          status: 500,
        },
      )
    }
  }

  return (
    <>
      <h1 style={{ marginBottom: '12px' }}>Forgot Password</h1>
      <div className={styles.container}>
        <Form
          id='forgot-password-form'
          inputsFields={forgotPasswordInputs}
          inputsErrors={apiErrors}
          onSubmit={handleSubmit}
          loading={loading}
          success={success}
          setSuccess={setSuccess}
        >
          <Button
            size='max'
            success={success}
            loading={loading}
            label={submitButtonLabel}
            className={styles.button}
          />
        </Form>
      </div>
      <div style={{ marginTop: '8px' }}>
        <Link href='/login' style={{ color: 'grey' }}>
          Back to login
        </Link>
      </div>
    </>
  )
}
